from database.models import RephraseMetrics
from database.db_operations import create_record


def insert_rephrase_data(rephrase_data_logs: dict, message_id: str = None):
    """
    Save the rephrase metric logs associated with a specific message.
    """
    rephrase_data_logs.update({"message_id": message_id})
    inserted_rephrase_data = create_record(RephraseMetrics, rephrase_data_logs)
    return inserted_rephrase_data
