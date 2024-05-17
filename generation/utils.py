from database.models import GenerationMetrics
from database.db_operations import create_record


def insert_generation_data(generation_data_logs: dict, message_id: str = None):
    """
    Save the generation metric logs associated with a specific message.
    """
    generation_data_logs.update({"message_id": message_id})
    generated_data = create_record(GenerationMetrics, generation_data_logs)
    return generated_data
