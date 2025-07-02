from database.models import RerankMetrics, RerankedChunk
from database.db_operations import create_record, create_multiple_records


def prepare_reranked_chunks_to_insert(reranked_chunks_doc_map, message_id):
    """
    Prepare retrieved chunks data to insert to DB.
    """
    reranked_chunk_data_to_insert = []
    if reranked_chunks_doc_map:
        for chunk_id in reranked_chunks_doc_map.keys():
            data = {
                "chunk_id": chunk_id,
                "message": message_id,
                "chunk_text": reranked_chunks_doc_map.get(chunk_id).get("chunk").get("document", None),
                "source": reranked_chunks_doc_map.get(chunk_id).get("chunk").get("cmetadata").get("source", None),
                "rank": reranked_chunks_doc_map.get(chunk_id).get("rank", None),
            }
            reranked_chunk_data_to_insert.append(data)

    return reranked_chunk_data_to_insert


def insert_reranked_chunk_data(reranked_chunk_data: dict):
    """
    Save the reranked chunk data associated with a specific message.
    """
    inserted_reranked_chunk_data = create_multiple_records(RerankedChunk, reranked_chunk_data)
    return inserted_reranked_chunk_data


def insert_rerank_metrics_data(rerank_metric_logs: dict, message_id: str = None):
    """
    Save the rerank metric logs associated with a specific message.
    """
    rerank_metric_logs.update({"message_id": message_id})
    inserted_rerank_metrics_data = create_record(RerankMetrics, rerank_metric_logs)
    return inserted_rerank_metrics_data
