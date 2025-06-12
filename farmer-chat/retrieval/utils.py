from database.db_operations import create_multiple_records
from database.models import RetrievedChunk


def prepare_retrieved_chunks_to_insert(retrieved_chunks_doc_map, message_id):
    """
    Prepare retrieved chunks data to insert to DB.
    """
    retrieved_chunk_data_to_insert = []
    if retrieved_chunks_doc_map:
        for item in retrieved_chunks_doc_map:
            data = {
                # "chunk_id": item.get("uuid"),
                "chunk_id": item.get("id"),
                "message": str(message_id),
                # "chunk_text": item.get("document", None),
                "chunk_text": item.get("text", None),
                "source": item.get("cmetadata", {}).get("source", None),
                "repo_link": None,
                # "cosine_score": item.get("similarity", None),
                "cosine_score": item.get("score", None),
                "page_no": item.get("cmetadata", {}).get("page"),
                "rank": None,
            }
            retrieved_chunk_data_to_insert.append(data)

    return retrieved_chunk_data_to_insert


def insert_retrieved_chunk_data(retrieved_chunk_data: dict):
    """
    Save the retrieved chunk data associated with a specific message.
    """

    inserted_retrieved_chunk_data = create_multiple_records(
        RetrievedChunk, retrieved_chunk_data
    )
    return inserted_retrieved_chunk_data
