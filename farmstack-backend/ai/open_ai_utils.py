# from langchain.document_loaders import PdfLoader
import logging
import uuid
from urllib.parse import quote_plus

import openai
from django.db import models
from django.db.models import Subquery
from django.db.models.functions import Cast
from dotenv import load_dotenv
from langchain.embeddings.openai import OpenAIEmbeddings
from pgvector.django import CosineDistance
from qdrant_client import QdrantClient
from qdrant_client.http.models import (
    Distance,
    FieldCondition,
    Filter,
    HnswConfigDiff,
    MatchAny,
    MatchValue,
    PayloadSchemaType,
    PointStruct,
    VectorParams,
)

from core import settings
from core.constants import Constants
from datahub.models import (
    LangchainPgCollection,
    LangchainPgEmbedding,
    ResourceFile,
    SubCategory,
)
from utils.pgvector import PGVector

LOGGING = logging.getLogger(__name__)
load_dotenv()

db_settings = settings.DATABASES["default"]
qdrant_settings = settings.DATABASES["vector_db"]
encoded_user = quote_plus(db_settings[Constants.USER.upper()])
encoded_password = quote_plus(db_settings[Constants.PASSWORD])

openai_client = openai.Client(api_key=settings.OPENAI_API_KEY)
openai.api_key=settings.OPENAI_API_KEY

def get_embeddings(docs, resource, file_id, chunking_strategy=None):
    embedded_data = {}
    if chunking_strategy:
        document_text_list = [document.get('text') for document in docs]
    else:
        document_text_list = [document.page_content for document in docs]
    openai_client = openai.Client(api_key=settings.OPENAI_API_KEY)
    embedding_model = Constants.TEXT_EMBEDDING_ADA_002
    try:
        result = []
        if len(document_text_list) > 100:
            loop_number = len(document_text_list)//100
            start_point = 0
            for num in range(loop_number+1):
                response = openai_client.embeddings.create(
                    input=document_text_list[start_point:(100*(num+1))], model=embedding_model)
                start_point = (100*(num+1))
                result.append(response)
        else:
            response = openai_client.embeddings.create(
                input=document_text_list, model=embedding_model)
            result.append(response)
    except Exception as e:
        LOGGING.error(f"Exception occurred in creating embedding {str(e)}")
        return False
    if result != []:
        LOGGING.info(
            f"Creating the embedding dictonary, length is  {len(result)}")
        start = 0
        for embedd_data in result:
            for idx, data in enumerate(embedd_data.data):
                embedded_data[idx+start] = {}
                embedded_data[idx+start]['text'] = document_text_list[idx+start]
                embedded_data[idx+start]['vector'] = data.embedding
                embedded_data[idx+start]["url"] =  resource.get("url") if resource.get("url") else resource.get("file")
                embedded_data[idx+start]["country"] = resource.get("country",'').lower().strip()
                embedded_data[idx+start]["state"] = resource.get("state", '').lower().strip()
                embedded_data[idx+start]["distict"] = resource.get("district", '').lower().strip()
                embedded_data[idx+start]["category"] = resource.get("category", '').lower().strip()
                embedded_data[idx+start]["sub_category"] = resource.get("sub_category",'').lower().strip()
                embedded_data[idx+start]["resource_file"] = file_id
                embedded_data[idx+start]["countries"] = resource.get("countries",'')
                if resource.get("type") =="youtube":
                    embedded_data[idx+start]["context-type"] = "video/pdf"
                elif resource.get("type") =="table":
                    embedded_data[idx+start]["context-type"] = "table/pdf"
                else:
                    embedded_data[idx+start]["context-type"] = "text/pdf"
                if chunking_strategy:
                    embedded_data[idx+start]["topic"] = docs[idx+start].get('topic')
                embedded_data[idx+start]["states"] = resource.get("states",'')
                embedded_data[idx+start]["districts"] = resource.get("districts",'')
                embedded_data[idx+start]["sub_categories"] = resource.get("sub_categories",'')

            start += idx+1
    # One more step is added to parse insertation error
    if embedded_data != {}:
        LOGGING.info(f"Embeddings creation completed for Resource ID: {file_id}")
        # inserting embedding in vector db
        chunk_insertation = insert_chunking_in_db(embedded_data)
        if chunk_insertation:
            return True
        else:
            return False
    else:
        return False

def get_embedding_auto_cat(docs):
    embedded_data = {}
    document_text_list = [document.get('text') for document in docs]
    openai_client = openai.Client(api_key=settings.OPENAI_API_KEY)
    embedding_model = Constants.TEXT_EMBEDDING_ADA_002
    try:
        result = []
        if len(document_text_list) > 100:
            loop_number = len(document_text_list)//100
            start_point = 0
            for num in range(loop_number+1):
                response = openai_client.embeddings.create(
                    input=document_text_list[start_point:(100*(num+1))], model=embedding_model)
                start_point = (100*(num+1))
                result.append(response)
        else:
            response = openai_client.embeddings.create(
                input=document_text_list, model=embedding_model)
            result.append(response)
    except Exception as e:
        LOGGING.error(f"Exception occurred in creating embedding {str(e)}")
        return False
    if result != []:
        LOGGING.info(
            f"Creating the embedding dictonary, length is  {len(result)}")
        start = 0
        for embedd_data in result:
            for idx, data in enumerate(embedd_data.data):
                embedded_data[idx+start] = {}
                embedded_data[idx+start]['text'] = document_text_list[idx+start]
                embedded_data[idx+start]['vector'] = data.embedding
                embedded_data[idx+start]["country"] = docs[idx+start].get("region",'').lower().strip()
                embedded_data[idx+start]["state"] = docs[idx+start].get("state", '').lower().strip()
                embedded_data[idx+start]["distict"] = docs[idx+start].get("district", '').lower().strip()
                embedded_data[idx+start]["category"] = docs[idx+start].get("category", '')
                embedded_data[idx+start]["sub_category"] = docs[idx+start].get("sub_category",'')
                embedded_data[idx+start]["resource_file"] = docs[idx+start].get("resource_file",'')
                embedded_data[idx+start]["topic"] = docs[idx+start].get("topic",'').lower().strip()
                embedded_data[idx+start]["context-type"] = docs[idx+start].get("content-type",'').lower().strip()
            start += idx+1
    return embedded_data

def create_embedding(embedding_model: str, document_text_list: list, data_type = 'text') ->list:
    openai_client = openai.Client(api_key=settings.OPENAI_API_KEY)
    try:
        result = []
        LOGGING.info(f"document_text_list for open ai is : {len(document_text_list)}")
        if len(document_text_list) > 100:
            loop_number = len(document_text_list)//100
            start_point = 0
            for num in range(loop_number+1):
                response = openai_client.embeddings.create(
                    input=document_text_list[start_point:(100*(num+1))], model=embedding_model)
                start_point = (100*(num+1))
                result.append(response)
        else:
            response = openai_client.embeddings.create(
                input=document_text_list, model=embedding_model)
            result.append(response)
        return result
    except Exception as e:
        LOGGING.error(f"Exception occurred in creating embedding {str(e)}")
        return []



def create_qdrant_client(collection_name: str):
    client = QdrantClient(url=qdrant_settings.get('HOST'), port=qdrant_settings.get(
        'QDRANT_PORT_HTTP'), grpc_port=qdrant_settings.get('PORT_GRPC'), prefer_grpc=qdrant_settings.get('GRPC_CONNECT'))
    try:
        client.get_collection(collection_name=collection_name)
        LOGGING.info(f"Qdrant client get successfully: {collection_name}")
    except:
        client.create_collection(
            collection_name,
            vectors_config=VectorParams(
                size=1536,
                distance=Distance.COSINE,
            ),
            hnsw_config=HnswConfigDiff(
                ef_construct=200,
                payload_m=16,
                m=0,
            ),
            # optimizers_config= OptimizersConfigDiff(indexing_threshold=0)
        )
        LOGGING.info(
            f"===========Created a new collection with metadata {collection_name}")
        client.create_payload_index(
            collection_name=collection_name,
            field_name="category",
            field_schema=PayloadSchemaType.KEYWORD,
        )
        client.create_payload_index(
            collection_name=collection_name,
            field_name="sub_category",
            field_schema=PayloadSchemaType.KEYWORD,
        )
        client.create_payload_index(
            collection_name=collection_name,
            field_name="resource_file",
            field_schema=PayloadSchemaType.KEYWORD,
        )
        client.create_payload_index(
            collection_name=collection_name,
            field_name="country",
            field_schema=PayloadSchemaType.KEYWORD,
        )
    return client

def get_topic(chunk):
    prompts = '''Create a topic from the paragraph content 
                        ####  user input
                        {input}
                        '''
    prompt_message = prompts.format(input=chunk)
    openai_client = openai.Client(api_key=settings.OPENAI_API_KEY)
    response = openai_client.chat.completions.create(
                    model="gpt-4-0125-preview",
                    messages=[{"role": "user", "content": prompt_message}],
                    temperature=0,
                )
    topic = response.choices[0].message.content
    try:
        new_topic = topic.split("Topic: ")[-1]
    except:
        new_topic = topic
        pass
    return new_topic



def insert_chunking_in_db(documents: dict, collection_name:str = None):
    if not collection_name:
        collection_name = qdrant_settings.get('COLLECTION_NAME')
    qdrant_client = create_qdrant_client(collection_name)
    try:
        points_list = []
        for idx, data in enumerate(documents.values()):
            points_list.append(PointStruct(
                id=str(uuid.uuid4()),
                vector=data['vector'],
                payload={"text": data['text'], 
                        "category": data.get('category', ''), 
                        "sub_category": data.get('sub_category'), 
                        "state": data.get('state', ''),
                        "resource_file":data.get('resource_file',''),
                        "district":data.get('district',''),
                        "country":data.get('country',''),
                        "resource_file":data.get('resource_file',''),
                        "context-type": data.get('context-type',''),
                        "source": data.get('url',''),
                        "topic":data.get('topic',''),
                        "states": data.get('states',''),
                        "districts": data.get('districts',''),
                        "countries": [x.strip() for x in data.get('country','').split(',')],
                        "sub_categories": data.get('sub_categories','')
                        },
            ))
        qdrant_client.upsert(collection_name, points_list)
        return True
    except Exception as e:
        LOGGING.error(f"Exception occured in inserting in collection {str(e)}")
        return False


def transcribe_audio(audio_bytes, language="en-US"):
    try:
        transcription = openai_client.audio.translations.create(
                         model=Constants.WISHPER_1, file=audio_bytes)
        return transcription
        
    except Exception as e:
        print("Transcription error:", str(e))
        return str(e)


def generate_response(prompt, tokens=2000):

    response = openai_client.completions.create(
        model=Constants.GPT_TURBO_INSTRUCT,  # Use an appropriate engine
        prompt=prompt,
        temperature=0.1,
    )
    return response.choices[0].text.strip(), {}


# Commentend out Not required

def load_vector_db(resource_id):
    embeddings = OpenAIEmbeddings(model=embedding_model)

    LOGGING.info("Looking into resource: {resource_id} embeddings")
    collection_ids = LangchainPgCollection.objects.filter(
        name__in=Subquery(
            ResourceFile.objects.filter(resource=resource_id)
            .annotate(string_id=Cast('id', output_field=models.CharField()))
            .values('string_id')
        )
    ).values_list('uuid', flat=True)
    retrievals = []
    vector_db = PGVector(
            collection_name=str("e7d810ae-3fee-4412-b9a8-04f0935e7acf"),
            connection_string=connectionString,
            embedding_function=embeddings,
        )
    print(LangchainPgEmbedding.objects.filter(collection_id='e7d810ae-3fee-4412-b9a8-04f0935e7acf').values('document'))
    retriever = vector_db.as_retriever(search_type="similarity", search_kwargs={"k": 5, "score_threshold":0.5})
    return retriever



# def setup_retriever(collection_id):
#     vector_db = PGVector(
#         collection_name=str(collection_id),
#         connection_string=connectionString,
#         embedding_function=embeddings,
#     )
#     retriever = vector_db.as_retriever(search_type="similarity_score_threshold", search_kwargs={"score_threshold": 0.5, "k": 5})
#     return retriever

# # Use ThreadPoolExecutor to run setup_retriever concurrently
# with ThreadPoolExecutor(max_workers=10) as executor:
#     # Create a future for each setup_retriever call
#     future_to_collection_id = {executor.submit(setup_retriever, collection_id): collection_id for collection_id in collection_ids}

#     for future in as_completed(future_to_collection_id):
#         collection_id = future_to_collection_id[future]
#         try:
#             retriever = future.result()  # Retrieve the result from the future
#             retrievals.append(retriever)  # Add the successfully created retriever to the list
#         except Exception as exc:
#             print(f'{collection_id} generated an exception: {exc}')
# # import pdb; pdb.set_trace()
# # lotr = MergerRetriever(retrievers=retrievals)
# # lotr = CustomRetriever(retrievals)
# custom_retriever = MergerRetriever(retrievers = retrievals)

# return retrievals

# Older OpenAI version
def genrate_embeddings_from_text(text):
    response = openai.Embedding.create(input=text, model=embedding_model)
    embedding = response['data'][0]['embedding']
    return embedding


# Need To confirm why it is required

def find_similar_chunks(input_embedding, resource_id,  top_n=5):
    # Assuming you have a similarity function or custom SQL to handle vector comparison
    if resource_id:
        LOGGING.info("Looking into resource: {resource_id} embeddings")
        collection_ids = LangchainPgCollection.objects.filter(
            name__in=Subquery(
                ResourceFile.objects.filter(resource=resource_id)
                .annotate(string_id=Cast('id', output_field=models.CharField()))
                .values('string_id')
            )
        ).values_list('uuid', flat=True)
        # Use these IDs to filter LangchainPgEmbedding objects
        similar_chunks = LangchainPgEmbedding.objects.annotate(
            similarity=CosineDistance("embedding", input_embedding)
        ).order_by("similarity").filter(similarity__lt=0.17, collection_id__in=collection_ids).defer("cmetadata").all()[:top_n]
        return similar_chunks
    else:
        LOGGING.info("Looking into all embeddings")
        similar_chunks = LangchainPgEmbedding.objects.annotate(
            similarity=CosineSimilarity("embedding", input_embedding)
        ).order_by("similarity").filter(similarity__lt=0.17).defer('cmetadata').all()[:top_n]
        return similar_chunks


def query_qdrant_collection(resource_file_ids, query, country, state, district, category, sub_category, source_type, k, threshold):
    collection_name = qdrant_settings.get('COLLECTION_NAME')
    qdrant_client = create_qdrant_client(collection_name)
    if query:
        vector = openai_client.embeddings.create(
            input=[query],
            model=Constants.TEXT_EMBEDDING_ADA_002,
        ).data[0].embedding
    else:
        vector = [0.0]*1536

    # sub_category = re.sub(r'[^a-zA-Z0-9_]', '-', sub_category)
    filter_conditions = []
    limit_k = 10
    default_threshold = 0.0
    if resource_file_ids:
        file_ids = [str(row) for row in resource_file_ids]
        filter_conditions.append(FieldCondition(key="resource_file", match=MatchAny(any=file_ids)))
    if category:
        filter_conditions.append(FieldCondition(key="category", match=MatchValue(value=category)))
    if state:
        filter_conditions.append(FieldCondition(key="state", match=MatchValue(value=state)))
    if district:
        filter_conditions.append(FieldCondition(key="district", match=MatchValue(value=district)))
    # if context_type:
    #     filter_conditions.append(FieldCondition(key="context-type", match=MatchValue(value=context_type)))
    if country:
        filter_conditions.append(FieldCondition(key="country", match=MatchValue(value=country)))
    
    if source_type == 'table':
        default_threshold = 0.4
        filter_conditions.append(FieldCondition(key="context-type", match=MatchValue(value='table/pdf')))

    qdrant_filter = Filter(must=filter_conditions)

    youtube_filter_conditions = filter_conditions.copy()
    youtube_filter_conditions.append(FieldCondition(key="context-type", match=MatchValue(value="video/pdf")))
    youtube_filter = Filter(must=youtube_filter_conditions)
    if k !=0:
        try:
            limit_k = int(k)
        except:
            pass

    LOGGING.info(f"Collection and filter details: state={state}, k={limit_k}, threshold={default_threshold}, condition {filter_conditions}")

    try:
        search_data = qdrant_client.search(
            collection_name=collection_name,
            query_vector=vector,
            query_filter=qdrant_filter,
            score_threshold=default_threshold,
            limit=limit_k
        )
        search_youtube_data = qdrant_client.search(
            collection_name=collection_name,
            query_vector=vector,
            query_filter=youtube_filter,
            score_threshold=0.08,
            limit=2
        )
        yotube_url=[item[1]["source"] for result in search_youtube_data for item in result if item[0] == "payload"]
    except Exception as e:
        LOGGING.error(f"Exception occured in qdrant db connection {str(e)}")
        return []
    results = extract_text_id_score_without_org_id(search_data)
    results["yotube_url"]=yotube_url
    return results



def query_qdrant_collection_v2(org_name, org_id, query, countries, state, district, category, sub_category, source_type, k, threshold):
    qdrant_client = create_qdrant_client(org_name)
    if query:
        vector = openai_client.embeddings.create(
            input=[query],
            model=Constants.TEXT_EMBEDDING_ADA_002,
        ).data[0].embedding
    else:
        vector = [0.0]*1536

    # sub_category = re.sub(r'[^a-zA-Z0-9_]', '-', sub_category)
    filter_conditions = []
    limit_k = 10
    default_threshold = 0.0
    if category:
        filter_conditions.append(FieldCondition(key="category", match=MatchValue(value=category)))
    if sub_category:
        filter_conditions.append(FieldCondition(key="sub_category", match=MatchValue(value=sub_category)))
    if state:
        filter_conditions.append(FieldCondition(key="state", match=MatchValue(value=state)))
    if district:
        filter_conditions.append(FieldCondition(key="district", match=MatchValue(value=district)))
    # if context_type:
    #     filter_conditions.append(FieldCondition(key="context-type", match=MatchValue(value=context_type)))
    if countries !=[]:
        filter_conditions.append(FieldCondition(key="countries", match=MatchAny(any=countries)))
    
    if source_type == 'table':
        default_threshold = 0.4
        filter_conditions.append(FieldCondition(key="context-type", match=MatchValue(value='table/pdf')))

    qdrant_filter = Filter(must=filter_conditions)

    youtube_filter_conditions = filter_conditions.copy()
    youtube_filter_conditions.append(FieldCondition(key="context-type", match=MatchValue(value="video/pdf")))
    youtube_filter = Filter(must=youtube_filter_conditions)
    if k !=0:
        try:
            limit_k = int(k)
        except:
            pass

    LOGGING.info(f"Collection and filter details: state={state}, k={limit_k}, threshold={default_threshold}, condition {filter_conditions}")

    try:
        search_data = qdrant_client.search(
            collection_name=org_name,
            query_vector=vector,
            query_filter=qdrant_filter,
            score_threshold=default_threshold,
            limit=limit_k
        )
        search_youtube_data = qdrant_client.search(
            collection_name=org_name,
            query_vector=vector,
            query_filter=youtube_filter,
            score_threshold=0.8,
            limit=2
        )
        yotube_url=[item[1]["source"] for result in search_youtube_data for item in result if item[0] == "payload"]
    except Exception as e:
        LOGGING.error(f"Exception occured in qdrant db connection {str(e)}")
        return []
    results = extract_text_id_score(search_data, org_id)
    results["yotube_url"]=yotube_url
    return results

def extract_text_id_score(search_data, org_id):
    results, reference = [], []
    
    for result in search_data:
        data = {}
        for item in result:
            if item[0] == "id":
                data["id"] = item[1]
            elif item[0] == "score":
                data["score"] = item[1]
            elif item[0] == "payload" and "text" in item[1]:
                data["text"] = item[1]["text"]
                reference.append(item[1]["source"])
            if item[0] == "payload" and "countries" in item[1]:
                data["countries"] = item[1]["countries"]
            if item[0] == "payload" and "resource_file" in item[1]:
                data["resource_file"] = item[1]["resource_file"]
            if item[0] == "payload" and "sub_category" in item[1]:
                data["sub_category"] = item[1]["sub_category"]
            if item[0] == "payload" and "category" in item[1]:
                data["category"] = item[1]["category"]
        results.append(data)
    return {org_id: results, "reference": set(reference)}


def extract_text_id_score_without_org_id(search_data):
    results, reference = [], []
    for result in search_data:
        data = {}
        for item in result:
            if item[0] == "id":
                data["id"] = item[1]
            elif item[0] == "score":
                data["score"] = item[1]
            elif item[0] == "payload" and "text" in item[1]:
                data["text"] = item[1]["text"]
                reference.append(item[1]["source"])
        results.append(data)
    return {"chunks": results, "reference": set(reference)}

def qdrant_collection_scroll(resource_file_id, country='', state='' , category='',limit=20):
    collection_name = qdrant_settings.get('COLLECTION_NAME')
    qdrant_client = create_qdrant_client(collection_name)
    filter_conditions = []

    try:
        if resource_file_id:
            file_ids = [str(row) for row in resource_file_id]
            filter_conditions.append(FieldCondition(key="resource_file", match=MatchAny(any=file_ids)))
        if category:
            filter_conditions.append(FieldCondition(key="category", match=MatchValue(value=category)))
        if state:
            filter_conditions.append(FieldCondition(key="state", match=MatchValue(value=state)))
        if country:
            filter_conditions.append(FieldCondition(key="country", match=MatchValue(value=country)))

        search_data = qdrant_client.scroll(
                collection_name=collection_name,
                scroll_filter=Filter(
                    must=filter_conditions
                ),
                limit=limit,
                with_payload=True,
                # with_vectors=True,
            )
    except Exception as e:
        LOGGING.error(f"Exception occured in qdrant db connection {str(e)}")
        return []
    if search_data:
        return extract_text_id_score(search_data[0])
    else:
        return search_data

def qdrant_embeddings_delete_file_id(resource_file_ids):
    collection_name = qdrant_settings.get('COLLECTION_NAME')
    client = QdrantClient(url=qdrant_settings.get('HOST'), port=qdrant_settings.get(
        'QDRANT_PORT_HTTP'), grpc_port=qdrant_settings.get('PORT_GRPC'), prefer_grpc=qdrant_settings.get('GRPC_CONNECT'))
    qdrant_client = create_qdrant_client(collection_name)
    resource_file_ids = [str(row) for row in resource_file_ids]
    filter_conditions = []
    filter_conditions.append(FieldCondition(key="resource_file", match=MatchAny(any=resource_file_ids)))
    
    qdrant_filter = Filter(must=filter_conditions)
    
    # Construct the points_selector based on your requirements
    points_selector = qdrant_filter  # This assumes Filter is used as points_selector
    
    response = qdrant_client.delete(
        collection_name=collection_name,
        points_selector=points_selector  # Pass points_selector here
    )
    return True

def qdrant_collection_get_by_file_id(resource_file_id, page=1):
    collection_name = qdrant_settings.get('COLLECTION_NAME')
    qdrant_client = create_qdrant_client(collection_name)
    try:
        search_data = qdrant_client.scroll(
                collection_name=collection_name,
                scroll_filter=Filter(
                    must=[
                        FieldCondition(key="resource_file", match=MatchValue(value=resource_file_id)),
                    ]
                ),
                limit=20,
                with_payload=True,
                with_vectors=True,
            )
    except Exception as e:
        LOGGING.error(f"Exception occured in qdrant db connection {str(e)}")
        return []
    return search_data



# Function to generate description using OpenAI
def generate_description(prompt):
    openai.api_key = settings.OPENAI_API_KEY  # Replace with your OpenAI API key
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=80,
        n=1,
        stop=None,
        temperature=0.7
    )
    return response.choices[0].text.strip()

# Function to update SubCategory instances with descriptions
def update_subcategories_with_descriptions():
    subcategories = SubCategory.objects.all()

    for subcategory in subcategories:
        if not subcategory.description:  # Ensure description is not already set
            prompt = f"Generate a short description of 2 sentences for the '{subcategory.name}' subcategory in terms of indian agriculture."
            description, token = generate_response(prompt)
            print(description)
            subcategory.description = description
            subcategory.save()
            print(f"Description generated and saved for '{subcategory.name}': {description}")



# update_subcategories_with_descriptions()
