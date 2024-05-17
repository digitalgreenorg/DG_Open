from django_core.config import Config
from generation.utils import insert_generation_data
from rephrasing.utils import insert_rephrase_data
from reranking.utils import insert_rerank_data


def post_process_rag_pipeline(
    message_id,
    rephrased_query_response,
    reranked_query_response,
    generated_response,
    with_db_config=Config.WITH_DB_CONFIG,
):
    """
    Save or log the RAG pipeline metrics to DB.
    """
    data_saved = False
    if with_db_config:
        # insert data logs to db
        insert_rephrase_data(rephrased_query_response, message_id)
        insert_rerank_data(reranked_query_response, message_id)
        insert_generation_data(generated_response, message_id)
        data_saved = True

    return data_saved
