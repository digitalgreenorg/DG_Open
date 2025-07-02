import asyncio
import datetime
import logging

from generation.generate_response import generate_query_response
from rag_service.utils import (
    fetch_source_from_reranked_chunks,
    post_process_rag_pipeline,
)
from rephrasing.rephrase import rephrase_query
from reranking.rerank import rerank_query
from reranking.utils import prepare_reranked_chunks_to_insert
from retrieval.content_retrieval import content_retrieval
from retrieval.utils import prepare_retrieved_chunks_to_insert

logger = logging.getLogger(__name__)


def execute_rag_pipeline(
    original_query,
    input_language_detected,
    email_id,
    user_name=None,
    message_id=None,
    chat_history=None,
):
    """
    Execute RAG pipeline to process rephrasing, reranking and generating response
    for the given query based on the available content.
    """
    generated_final_response = None
    retrieved_chunks = []
    response_map = {"message_id": message_id}
    message_data_to_insert_or_update = {"message_id": message_id}
    try:
        message_data_to_insert_or_update["main_bot_logic_start_time"] = (
            datetime.datetime.now()
        )

        # execute rephrasing
        rephrased_query_response = asyncio.run(
            rephrase_query(original_query, chat_history)
        )
        rephrased_query = rephrased_query_response.get("rephrased_query")

        # content retrieval
        retrieval_results = content_retrieval(rephrased_query, email_id)
        print(f"RETRIEVAL RESULTS: \n{retrieval_results}")
        retrieved_chunks = (
            retrieval_results.get("retrieved_chunks").get("chunks", [])
            if isinstance(retrieval_results, dict)
            and isinstance(
                retrieval_results.get("retrieved_chunks").get("chunks"), list
            )
            else []
        )

        retrieved_chunk_data_to_insert = prepare_retrieved_chunks_to_insert(
            retrieved_chunks, message_id
        )

        # execute reranking
        reranked_query_response = asyncio.run(
            rerank_query(
                original_query,
                rephrased_query,
                email_id,
                retrieved_chunks,
            )
        )
        reranked_chunk_data_to_insert = prepare_reranked_chunks_to_insert(
            reranked_query_response.get("reranked_chunks", []), message_id
        )
        context_chunks = reranked_query_response.get("context_chunks")
        content_source = fetch_source_from_reranked_chunks(
            reranked_query_response.get("reranked_chunks")
        )

        # generate final response / answer for the query
        generated_response = asyncio.run(
            generate_query_response(
                original_query, user_name, context_chunks, rephrased_query
            )
        )
        generated_final_response = generated_response.get("response")

        message_data_to_insert_or_update["main_bot_logic_end_time"] = (
            datetime.datetime.now()
        )
        message_data_to_insert_or_update["message_response_time"] = (
            datetime.datetime.now()
        )
        message_data_to_insert_or_update["retrieved_chunks"] = str(context_chunks)
        message_data_to_insert_or_update["condensed_question"] = rephrased_query

        # post process RAG pipeline (insert data into db for RAG pipeline data logging)
        post_process_rag_pipeline(
            message_id,
            rephrased_query_response,
            retrieved_chunk_data_to_insert,
            reranked_chunk_data_to_insert,
            reranked_query_response,
            generated_response,
        )

        response_map.update(
            {
                "message_id": message_id,
                "generated_final_response": generated_final_response,
                "source": content_source,
            }
        )

    except Exception as error:
        logger.error(error, exc_info=True)

    return response_map, message_data_to_insert_or_update
