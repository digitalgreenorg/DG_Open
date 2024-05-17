from database.models import RerankMetrics
from database.db_operations import create_record


def insert_rerank_data(rerank_data_logs: dict, message_id: str = None):
    """
    Save the rerank metric logs associated with a specific message.
    """
    rerank_data_logs.update({"message_id": message_id})
    inserted_rerank_data = create_record(RerankMetrics, rerank_data_logs)
    return inserted_rerank_data
