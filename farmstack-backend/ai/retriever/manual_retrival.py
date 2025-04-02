
import logging
from ai.open_ai_utils import find_similar_chunks, generate_response, genrate_embeddings_from_text, qdrant_collection_scroll, query_qdrant_collection,qdrant_collection_get_by_file_id,query_qdrant_collection_v2
import openai
from ai.utils import chat_history_formated, condensed_question_prompt, format_prompt
from utils import validators

LOGGING = logging.getLogger(__name__)

class Retrival:

    def get_input_embeddings(text, user_name=None, resource_id=None, chat_history=None):
        text=text.replace("\n", " ") # type: ignore
        documents, chunks = "", []
        retrival = Retrival()
        complete_history, history_question = chat_history_formated(chat_history)
        try:
            text, status = condensed_question_prompt(history_question, text)
            if status:
                text, tokens_uasage = generate_response(text)
            embedding = genrate_embeddings_from_text(text)
            chunks = find_similar_chunks(embedding, resource_id)
            documents =  " ".join([row.document for row in chunks])
            LOGGING.info(f"Similarity score for the query: {text}. Score: {' '.join([str(row.similarity) for row in chunks])} ")
            formatted_message = format_prompt(user_name, documents, text, complete_history)
            print(formatted_message)
            response, tokens_uasage =generate_response(formatted_message, 500)
            return response, chunks, text, tokens_uasage
        except openai.error.InvalidRequestError as e:
            try:
                LOGGING.error(f"Error while generating response for query: {text}: Error {e}", exc_info=True)
                LOGGING.info(f"Retrying without chat history")
                formatted_message = format_prompt(user_name, documents, text, "")
                response, tokens_uasage = generate_response(formatted_message, 500)
                return response, chunks, text, tokens_uasage
            except openai.error.InvalidRequestError as e:
                for attempt in range(3, 1, -1):  # Try with 3, then 2 chunks if errors continue
                    try:
                        documents = " ".join([row.document for row in chunks[:attempt]])
                        formatted_message = format_prompt(user_name, documents, text, "")
                        response,tokens_uasage = generate_response(formatted_message, 500)
                        return response, chunks, text, tokens_uasage
                    except openai.error.InvalidRequestError as e:
                        LOGGING.info(f"Retrying with {attempt-1} chunks due to error: {e}")
                        continue  # Continue to the next attempt with fewer chunks
        except Exception as e:
            LOGGING.error(f"Error while generating response for query: {text}: Error {e}", exc_info=True)
            return str(e)
    

    def get_chunks(text, user_name=None, resource_id=None, chat_history=None):
        pass
    
class QuadrantRetrival:

    def retrieve_chunks(self, resource_file_ids, query, country, state,district, category, sub_category, source_type, k, thresold):
        try:
            if query:
                chunks = query_qdrant_collection(resource_file_ids, query, country, state,district, category, sub_category, source_type, k, thresold)
            else:
                chunks = qdrant_collection_scroll(resource_file_ids, country, state, category, 4)

            return chunks
        except Exception as e:
            LOGGING.error(f"Error while generating response for query: {query}: Error {e}", exc_info=True)
            return str(e)
        
    def retrieve_chunks_v2(self, org_names, organization_ids, query, countries, state,district, category, sub_category, source_type, k, thresold):
        try:
            output = []
            if query:
                for orgs, org_id in zip(org_names, organization_ids):
                    chunks = query_qdrant_collection_v2(validators.format_category_name(orgs),org_id, query, countries, state,district, category, sub_category, source_type, k, thresold)
                    output.append(chunks)
            else:
                chunks = qdrant_collection_scroll(org_names, countries, state, category, 4)
                output.append(chunks)
            return output
        except Exception as e:
            LOGGING.error(f"Error while generating response for query: {query}: Error {e}", exc_info=True)
            return str(e)
        
    def embeddings_and_chunks(self, resource_file_id):
        try:
            chunks = qdrant_collection_get_by_file_id(resource_file_id)
            return chunks
        except Exception as e:
            LOGGING.error(f"Error while retriving chunks for file_id: {resource_file_id}: Error {e}", exc_info=True)
            return str(e)
    