import logging
import os
import re
import tempfile
from contextlib import contextmanager

import numpy as np
import requests
from bs4 import BeautifulSoup
from django.db import transaction
from langchain.document_loaders import JSONLoader, PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sklearn.metrics.pairwise import cosine_similarity
from unstructured.partition.pdf import partition_pdf
from unstructured.staging.base import elements_to_dicts

from ai.open_ai_utils import (
    create_embedding,
    get_embedding_auto_cat,
    get_embeddings,
    get_topic,
    insert_chunking_in_db,
)
from ai.utils import build_pdf, download_file, resolve_file_path
from ai.vector_db_builder.load_audio_and_video import LoadAudioAndVideo
from ai.vector_db_builder.load_documents import LoadDocuments
from ai.vector_db_builder.load_website import WebsiteLoader
from celery import shared_task
from core import settings
from core.constants import Constants
from datahub.models import (
    Category,
    Resource,
    ResourceFile,
    ResourceSubCategoryMap,
    SubCategory,
)
from utils import validators

LOGGING = logging.getLogger(__name__)
semantic_chunking = False

@shared_task
def create_vector_db(resource_file, chunk_size=1000, chunk_overlap=200):
    status = "failed"
    resource_id = resource_file.get('id')
    try:
        documents, status = load_documents(
            resource_file.get("url"), resource_file.get("file"), resource_file.get("type"),
            resource_file, resource_file.get("transcription"))
        LOGGING.info(f"Documents loaded for Resource ID: {resource_id}")
        if status == "completed":
            if semantic_chunking:
                embedded_chunk = document_extraction(resource_file.get("file"), False, './media/users/resources/')
                text_array = cleaned_text_without_reference(embedded_chunk)
                table_array = group_table_by_parent_node(embedded_chunk)
                if text_array != []:
                    embedded_chunk_status = get_embeddings(text_array,resource_file, str(resource_id), True)
                    LOGGING.info(f"Text array status is {embedded_chunk_status}")
                if table_array != []:
                    resource_file["type"] = 'table'
                    embedded_chunk_status = get_embeddings(table_array,resource_file, str(resource_id), True)
                    LOGGING.info(f"Table array status is {embedded_chunk_status}")
            else:
                texts = split_documents(documents, chunk_size, chunk_overlap)
                LOGGING.info(f"Documents split completed for Resource ID: {resource_id}")
                embedded_chunk_status = get_embeddings(texts, resource_file, str(resource_id), False)
        if not embedded_chunk_status:
            status = "failed"
        data = ResourceFile.objects.filter(id=resource_id).update(
        embeddings_status=status,
        embeddings_status_reason=''
        )
        LOGGING.info(f"Resource file ID: {resource_id}")
    except Exception as e:
        LOGGING.error(f"Failed lo create embeddings for Resource ID: {resource_id} and ERROR: {str(e)}")
        documents = str(e)
        data = ResourceFile.objects.filter(id=resource_id).update(
            embeddings_status="failed",
            embeddings_status_reason=documents
        )
        LOGGING.info(f"Resource file ID: {resource_id}")
    return data

def insert_auto_cat_data(resource_data, json_data, category_id_map, sub_category_id_map):
    resource_id = resource_data.get("resources")[0].get("id")
    orgnisation_name = validators.format_category_name(resource_data.get("organization").get("name", ""))
    LOGGING.info(f"updating json data with metdata information, collection name {orgnisation_name}")
    for data in json_data:
        data["category"] = str(category_id_map.get(validators.format_category_name(data.get("value_chain")), ""))
        data["sub_category"] = str(sub_category_id_map.get(validators.format_category_name(data.get('crop_category')), ""))
        data["resource_file"] = resource_id
    embedded_data = get_embedding_auto_cat(json_data)
    if embedded_data != {}:
        LOGGING.info(f"Embeddings creation completed for Resource ID: {resource_id}")
        # inserting embedding in vector db
        chunk_insertation = insert_chunking_in_db(embedded_data, orgnisation_name.lower())
        if chunk_insertation:
            data = ResourceFile.objects.filter(id=resource_id).update(
            embeddings_status="success", embeddings_status_reason='')
        else:
            data = ResourceFile.objects.filter(id=resource_id).update(
            embeddings_status="failed", embeddings_status_reason='')
    else:
        data = ResourceFile.objects.filter(id=resource_id).update(
            embeddings_status="failed", embeddings_status_reason='')
    return data

def load_documents(url, file, doc_type, resource_file, transcription=""):
    try:
        
        if doc_type == 'api':
            with temporary_file(suffix=".json") as temp_pdf_path:
                response = requests.get(file)
                if response.status_code != 200:
                    return response.txt, "failed"
                with open(temp_pdf_path, 'wb') as f:
                    f.write(response.content)
                LOGGING.info("absolute_path of the api file {file}")
                loader = JSONLoader(file_path=temp_pdf_path,  jq_schema='.', text_content=False)
                return loader.load(), "completed"
        
        elif doc_type in ['youtube', 'pdf', 'website', 'file', 'dropbox', 's3', 'google_drive', 'dropbox']:
            with temporary_file(suffix=".pdf") as temp_pdf_path:
                if doc_type == 'youtube':
                    if not transcription:
                        summary = LoadAudioAndVideo().generate_transcriptions_summary(url)
                        # import pdb; pdb.set_trace()
                        build_pdf(summary, temp_pdf_path)
                        load_categories(temp_pdf_path, resource_file)
                        ResourceFile.objects.filter(id=resource_file.get("id")).update(transcription=summary)
                        loader = PyMuPDFLoader(temp_pdf_path)  # Assuming PyMuPDFLoader is defined elsewhere
                    else:
                        build_pdf(transcription, temp_pdf_path)
                        loader = PyMuPDFLoader(temp_pdf_path)  # Assuming PyMuPDFLoader is defined elsewhere
                        load_categories(temp_pdf_path, resource_file)
                elif doc_type == "website":
                    doc_text = ""
                    web_site_loader = WebsiteLoader()
                    main_content, web_links = web_site_loader.process_website_content(url)
                    # doc_text = web_site_loader.aggregate_links_content(web_links, doc_text)
                    doc_text = web_site_loader.aggregate_links_content(web_links, doc_text)
                    all_content = main_content + "\n" + doc_text
                    build_pdf(all_content.replace("\n", " "), temp_pdf_path)
                    loader = PyMuPDFLoader(temp_pdf_path)  # Assuming PyMuPDFLoader is defined elsewhere
                    load_categories(temp_pdf_path, resource_file)
                elif doc_type == 'file':
                    file_path = resolve_file_path(file)
                    download_file(file_path, temp_pdf_path)
                    loader, format = LoadDocuments().load_by_file_extension(file_path)
                    load_categories(temp_pdf_path, resource_file)
                    return loader,  "completed"
                else:
                    download_file(url, temp_pdf_path)
                    loader = PyMuPDFLoader(temp_pdf_path)  # Assuming PyMuPDFLoader is defined elsewhere
                    load_categories(temp_pdf_path, resource_file)
                return loader.load(), "completed"
        else:
            LOGGING.error(f"Unsupported input type: {doc_type}")
            return f"Unsupported input type: {doc_type}", "failed"
    except Exception as e:
        LOGGING.error(f"Faild lo load the documents: {str(e)}", exc_info=True)
        return str(e), "failed"

def split_documents(documents, chunk_size, chunk_overlap):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators="\n",
    )
    return text_splitter.split_documents(documents)

def calculate_cosine_distances(sentences):
    distances = []
    for i in range(len(sentences) - 1):
        embedding_current = sentences[i]['combined_sentence_embedding']
        embedding_next = sentences[i + 1]['combined_sentence_embedding']
        
        # Calculate cosine similarity
        similarity = cosine_similarity([embedding_current], [embedding_next])[0][0]
        
        # Convert to cosine distance
        distance = 1 - similarity

        # Append cosine distance to the list
        distances.append(distance)

        # Store distance in the dictionary
        sentences[i]['distance_to_next'] = distance

    # Optionally handle the last sentence
    # sentences[-1]['distance_to_next'] = None  # or a default value

    return distances, sentences

def document_extraction(pdf_path : str, extract_image : bool, extract_image_folder : str):
    # Extracts the elements from the PDF
    file_path = pdf_path.split('http://localhost:8000/')[-1]
    LOGGING.info(f"Extracting pdf with unstructured....: {'.'+file_path}")
    try:
        elements = partition_pdf(
            filename='.'+file_path,
            # Using pdf format to find embedded image blocks
            extract_images_in_pdf=extract_image,
            # Unstructured Helpers
            strategy="hi_res", 
            infer_table_structure=True,
            model_name="yolox",
            extract_image_block_to_payload=False,
            extract_image_block_output_dir=extract_image_folder
        )
        element_json = elements_to_dicts(elements=elements)
        return element_json
    except Exception as e:
        LOGGING.error(f"Failed lo extract the documents: {str(e)}")
        return None

def cleaned_text_without_reference(original_json_array: list) -> list:
    cleaned_elemnts =[]
    for element in original_json_array:
        if element['type'] != "Header" and element['type'] != "Footer" and element['type'] != "UncategorizedText" and element['type'] != "Table" and element['type'] != "Image":
            cleaned_elemnts.append({"element_id":element['element_id'],"page_number":element["metadata"].get('page_number'),
                                    "filename":element["metadata"].get('filename'),"text":element["text"],"type":element["type"]
                                    })
    return semantic_grouping(cleaned_elemnts)

def combine_sentences(sentences, buffer_size=1):
    # Go through each sentence dict
    # buffer size is the sliding window length
    for i in range(len(sentences)):

        # Create a string that will hold the sentences which are joined
        combined_sentence = ''

        # Add sentences before the current one, based on the buffer size.
        for j in range(i - buffer_size, i):
            # Check if the index j is not negative (to avoid index out of range like on the first one)
            if j >= 0:
                # Add the sentence at index j to the combined_sentence string
                combined_sentence += sentences[j]['sentence'] + ' '

        # Add the current sentence
        combined_sentence += sentences[i]['sentence']

        # Add sentences after the current one, based on the buffer size
        for j in range(i + 1, i + 1 + buffer_size):
            # Check if the index j is within the range of the sentences list
            if j < len(sentences):
                # Add the sentence at index j to the combined_sentence string
                combined_sentence += ' ' + sentences[j]['sentence']

        # Then add the whole thing to your dict
        # Store the combined sentence in the current sentence dict
        sentences[i]['combined_sentence'] = combined_sentence

    return sentences

def semantic_grouping(text_elements: list) -> list:
    # It creates the semanticaly grouped chunks 
    if text_elements == []:
        return []
    # need to join the unstructured text elements
    output_text = ' '.join(element.get('text','') for element in text_elements)
    # Splitting the text document on '.', '?', and '!'
    single_sentences_list = re.split(r'(?<=[.?!])\s+', output_text)
    sentences = [{'sentence': x, 'index' : i} for i, x in enumerate(single_sentences_list)]
    sentences = combine_sentences(sentences)
    embeddings = create_embedding(embedding_model=Constants.TEXT_EMBEDDING_ADA_002, document_text_list=[x['combined_sentence'] for x in sentences])
    if len(embeddings) == 0:
        return []
    i =0
    for embeddes in embeddings:
        for embedded_data in embeddes.data:
            sentences[i]['combined_sentence_embedding'] = embedded_data.embedding
            i +=1
    distances, sentences = calculate_cosine_distances(sentences)
    # Getting max length sentence
    word_length = [len(x.get('sentence')) for x in sentences]
    # grouping the sentences based on the distance value and word length
    indices_above_thresh = chunking_dp(distances, word_length, max(2000, max(word_length)))
    indices_above_thresh.pop(0)
    indices_above_thresh.pop(-1)
    # Initialize the start index
    start_index = 0
    # Create a list to hold the grouped sentences
    chunks = []
    # Iterate through the breakpoints to slice the sentences
    for index in indices_above_thresh:
        # The end index is the current breakpoint
        end_index = index
        # Slice the sentence_dicts from the current start index to the end index
        group = sentences[start_index:end_index + 1]
        combined_text = ' '.join([d['sentence'] for d in group])
        chunks.append({"text":combined_text})
        # Update the start index for the next group
        start_index = index + 1

    # The last group, if any sentences remain
    if start_index < len(sentences):
        combined_text = ' '.join([d['sentence'] for d in sentences[start_index:]])
        chunks.append({"text":combined_text})

    for chunk in chunks:
        chunk["topic"] = get_topic(chunk["text"])

    return chunks

def extract_cols_and_rows(tables) -> tuple[list, list]:
    """
    Grab column headers and rows from table elements.

    :param tables: extract table elements from HTML text.
    :return: tuple containing extracted column headers and row data.
    """
    headers = []
    rows = []
    # Iterate over each table
    for table in tables:
        # Extract headers
        th = [th.text for th in table.find_all('th')]
        headers.append(th)
        # Extract rows
        tr_td = []
        for tr in table.find_all('tr'):
            row = [td.text for td in tr.find_all('td')]
            if row:  # Skip empty rows
                tr_td.append(row)
            rows.append(row)
    return headers, rows

def chunking_dp(distances, word_length=None, limit_per_chunk=10):
    """ Compute splits of sentences into chunks based on similarity scores for splitting at each index.

    ## Input

    - `distances` : list of length `n - 1` where `n` is the number of sentences.  The distance at index i is the distance or cost of dividing between sentence `i` and sentence `i + 1`.
    - `word_length` : list of length `n` where `n` is the number of sentences.  The length of each sentence in words or tokens.  If not provided, all sentences are length 1. 

    - `limit_per_chunk` : `int` (default: 10) The maximum number of sentences or tokens (if `word_lens` is provided) in a chunk.
    """

    if limit_per_chunk <= 0:
        raise ValueError("sentence_limit_per_chunk must be positive")
    if word_length is None:
        word_length = np.ones(len(distances) + 1)
    assert len(word_length) == len(distances) + 1, "word_length must be of length n + 1"
    #assert all(w <= limit_per_chunk for w in word_length), "All word lengths must be less than limit_per_chunk"
    
    # number of sentences
    n = len(distances) + 1
    split_idx = np.full(n, n, dtype=np.int32)
    split_cost = np.full(n, np.inf)

    # set initial condition
    split_idx[n - 1] = n
    split_cost[n - 1] = 0

    curr_idx = n - 2
    while curr_idx >= 0:
        # print(curr_idx)
        # find the best split
        min_cost = np.inf
        min_split = -1

        curr_word_count = 0
        for i in range(curr_idx + 1, n):
            curr_word_count += word_length[i]
            if curr_word_count > limit_per_chunk:
                if min_cost >= np.inf:
                    min_cost = split_cost[i] + distances[i - 1]
                break
            cost = split_cost[i] + distances[i - 1]
            if cost < min_cost:
                min_cost = cost
                min_split = i
        split_idx[curr_idx] = min_split
        split_cost[curr_idx] = min_cost
        curr_idx -= 1
    final_splits = []

    curr_idx = 0
    while curr_idx < n:
        final_splits.append(curr_idx)
        curr_idx = split_idx[curr_idx]
    final_splits.append(n)
    return final_splits

def group_table_by_parent_node(crop_data: list) -> list:
    # Grouping the table
    if crop_data == []:
        return []
    cleaned_table_elements =[]
    new_table_element ={}
    i =0
    j = 0
    while i<len(crop_data):
        if crop_data[i]['type'] == "Table":
            parent_id = crop_data[i]["metadata"].get('parent_id')
            page_num = crop_data[i]["metadata"].get('page_number')
            table_text = ''
            if i>0 and crop_data[i-1]['type'] == 'Title':
                table_text = crop_data[i-1]["text"]
            new_table_element = {   "element_id":parent_id,
                                    "page_number":crop_data[i]["metadata"].get('page_number'),
                                    "topic":table_text,"type":crop_data[i]["type"], 
                                    "table":crop_data[i]["metadata"].get('text_as_html')
                                    }
            j = i+1
            while j <len(crop_data) and crop_data[j]["metadata"].get('parent_id') == parent_id:
                if crop_data[j]['type'] == "Table" and crop_data[j]["metadata"].get('page_number') == page_num:
                    cleaned_table_elements.append(new_table_element)
                    new_table_element = {}
                    new_table_element = {"element_id":parent_id,
                                    "page_number":crop_data[i]["metadata"].get('page_number'),
                                    "topic":table_text,"type":crop_data[i]["type"], 
                                    "table":crop_data[i]["metadata"].get('text_as_html')
                                    }
                elif crop_data[j]['type'] == "Table" and crop_data[j]["metadata"].get('page_number') > page_num:
                    new_table_element["table"] += crop_data[j]["metadata"].get('text_as_html')
                j+=1
        if new_table_element and new_table_element !={}:
            if not new_table_element["element_id"]:
                new_table_element["element_id"] = crop_data[i]["element_id"]
            cleaned_table_elements.append(new_table_element)
            new_table_element = {}
        if j != 0:
            i=j
            j = 0
        else:
            i +=1
    # concatonate table text
    # element_to_remove = []
    table_list = []
    for tables in cleaned_table_elements:
        soup = BeautifulSoup(tables.get("table"), "lxml")
        header, row = extract_cols_and_rows(soup)
        table_list.extend(concatenate_tables(header[0], row))
    return table_list

def concatenate_tables(headers, rows):
    """
    For each row, for each value, concatenate it with its column header.
    """
    concatenated_table = []
    for row_num in range(len(rows)):
        if len(headers)>0:
            concatenated_table_str=''
            for i in range(len(headers)):
                if headers[i] != "":
                    try:
                        concatenated_table_str += f"{headers[i]}:{rows[row_num][i]}, "
                    except:
                        pass
        else:
            concatenated_table_str=''
            for i in range(len(rows[row_num])):
                if rows[row_num][i] !="":
                    concatenated_table_str += f"column {i}:{rows[row_num][i]}, "
        if concatenated_table_str != '':
            concatenated_table.append({"text":concatenated_table_str})
    return concatenated_table


@contextmanager
def temporary_file(suffix=""):
    """Context manager for creating and automatically deleting a temporary file."""
    """Context manager for creating and automatically deleting a temporary file."""
    fd, path = tempfile.mkstemp(suffix=suffix)
    try:
        os.close(fd)  # Close file descriptor
        LOGGING.info(f"Temporary file created at {path}")
        yield path
    finally:
        # Check if the file still exists before attempting to delete
        if os.path.exists(path):
            os.remove(path)
            LOGGING.info(f"Temporary file {path} deleted.")

# @shared_task
def load_categories(resource_file, resource_file_object):
    # Define the URL of the API
    url = 'https://dev.platform.farmer.chat/auto_categarization/categorize_file'
    categories=[]
    # Specify the file path
    # Open the file in binary mode and send it to the API
    with open(resource_file, 'rb') as file:
        files = {'file': (file.name, file, 'application/pdf')}  # Adjust MIME type as necessary
        response = requests.post(url, files=files)
        if response.status_code == 200:
            categories = response.json()
    # response = requests.post(url, files=files)
    
    categories = [categories] if isinstance(categories, dict) else categories
    logging.info(f"Categories fetched for resource file Id: {resource_file_object.get('id')} and categories:{categories}")
    try:
        with transaction.atomic():
        # Iterate over the categories in the API response
            for category_data in categories:
                # Get or create the category
                category, created = Category.objects.get_or_create(name=category_data['category'])
                
                # Iterate over the subcategories in the category
                sub_category_instances = []
                for subcategory_name in category_data['subcategories']:
                    # Get or create the subcategory under the category
                    sub_category, created = SubCategory.objects.get_or_create(
                        name=subcategory_name,
                        category=category
                    )
                    if not ResourceSubCategoryMap.objects.filter(
                        resource_id=resource_file_object.get("resource"),
                        sub_category=sub_category
                    ).exists():
                        # Create the mapping of Resource and SubCategory
                        sub_category_instances.append(ResourceSubCategoryMap(
                            resource_id=resource_file_object.get("resource"),
                            sub_category=sub_category
                        ))
                # Bulk create the subcategory mappings
                ResourceSubCategoryMap.objects.bulk_create(sub_category_instances)
    except Exception as e:
        logging.error(f"Failed to load the categories {e}")
        return categories