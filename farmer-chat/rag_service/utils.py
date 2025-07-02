from django_core.config import Config
from generation.utils import insert_generation_data
from rephrasing.utils import insert_rephrase_data
from reranking.utils import insert_rerank_metrics_data, insert_reranked_chunk_data
from retrieval.utils import insert_retrieved_chunk_data


def post_process_rag_pipeline(
    message_id,
    rephrased_query_response,
    retrieved_chunks,
    reranked_chunk_data,
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
        insert_retrieved_chunk_data(retrieved_chunks)
        insert_reranked_chunk_data(reranked_chunk_data)
        insert_rerank_metrics_data(reranked_query_response, message_id)
        insert_generation_data(generated_response, message_id)
        data_saved = True

    return data_saved


def fetch_source_from_reranked_chunks(reranked_chunks):
    content_source = None
    highest_rank = -1
    if reranked_chunks and len(reranked_chunks) >= 1:
        for key, value in reranked_chunks.items():
            if value["rank"] > highest_rank:
                highest_rank = value["rank"]
                content_source = value.get("chunk", {}).get("cmetadata", {}).get("source")

    return content_source
