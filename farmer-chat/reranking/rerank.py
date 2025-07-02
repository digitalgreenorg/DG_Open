import asyncio
import datetime
import json
import logging
import random
import uuid

from django_core.config import Config
from rag_service.openai_service import make_openai_request

logger = logging.getLogger(__name__)


def parse_single_rerank_json(json_string: str):
    """
    Parse single entry of reranked result.
    """
    start_index = json_string.find("{")
    end_index = json_string.rfind("}") + 1

    json_content = json_string[start_index:end_index].strip()
    return json.loads(json_content)


async def rerank_query(original_query, rephrased_query, email_id, retrieval_results=[]):
    """
    Rerank the retrieved content chunks with the rephrased query from OpenAI.
    """
    response_map = {}
    doc_map = None
    reranked_chunk_map = {}
    rerank_start_time = None
    rerank_end_time = None
    rerank_request_start_time = None
    rerank_request_end_time = None
    rephrase_completion_tokens = 0
    rephrase_prompt_tokens = 0
    rephrase_total_tokens = 0
    rerank_completion_tokens = 0
    rerank_prompt_tokens = 0
    rerank_total_tokens = 0
    is_rerank_response_parsed = False

    rerank_exception = ""
    rerank_retries = 0

    response_map.update(
        {
            "original_query": original_query,
            "retrieved_chunks": doc_map,
            "reranked_chunks": reranked_chunk_map,
            "rerank_start_time": rerank_start_time,
            "rerank_end_time": rerank_end_time,
            "rerank_request_start_time": rerank_request_start_time,
            "rerank_request_end_time": rerank_request_end_time,
            "completion_tokens": rerank_completion_tokens,
            "prompt_tokens": rerank_prompt_tokens,
            "total_tokens": rerank_total_tokens,
            "is_rerank_response_parsed": False,
            "rerank_exception": rerank_exception,
            "rerank_retries": rerank_retries,
        }
    )

    rerank_start_time = datetime.datetime.now()

    docs_for_reranking = []
    doc_map = {}
    if retrieval_results == []:
        return response_map

    for data in retrieval_results:
        # chunk_id = random.randint(1, 1000)
        chunk_id = data.get("id")
        doc_map.update(
            {
                chunk_id: {
                    # "document": data.get("document", ""),
                    "document": data.get("text", ""),
                    "cmetadata": data.get("cmetadata", {}),
                    # "score": data.get("similarity", 0.0),
                    "score": data.get("score", 0.0),
                }
            }
        )
        docs_for_reranking.append(
            {
                "id": chunk_id,
                "text_chunk": data.get("text", ""),
            }
        )

    sorted_reranked_list = []
    rerank_prompt_list = [
        Config.RERANKING_PROMPT_SINGLE_TEMPLATE.format(
            json_example=Config.RERANK_SINGLE_JSON_EXAMPLE,
            text=rerank_doc,
            question=rephrased_query,
        )
        for rerank_doc in docs_for_reranking
    ]

    rerank_request_start_time = datetime.datetime.now()
    reranking_results = await asyncio.gather(
        *(
            make_openai_request(prompt, model=Config.GPT_4_MODEL)
            for prompt in rerank_prompt_list
        )
    )
    rerank_request_end_time = datetime.datetime.now()

    is_rerank_response_parsed = True
    reranked_list = []
    for response, exception, retries in reranking_results:
        if response:
            rerank_completion_tokens += response.usage.completion_tokens
            rerank_prompt_tokens += response.usage.prompt_tokens
            rerank_total_tokens += response.usage.total_tokens
            try:
                response_obj = parse_single_rerank_json(
                    response.choices[0].message.content
                )
            except Exception as error:
                logger.error(error, exc_info=True)
                is_rerank_response_parsed = False
                continue
            if response_obj.get("classification") == "YES":
                reranked_list.append(response_obj)
        else:
            is_rerank_response_parsed = False
        rerank_retries += retries
        rerank_exception += exception + "\n"

    sorted_reranked_list = sorted(reranked_list, key=lambda x: x["relevance_score"])

    rerank_end_time = datetime.datetime.now()

    reranked_chunk_map = {}
    context_chunks = []
    for item in sorted_reranked_list:
        if len(context_chunks) < 6:
            context_chunks.append(doc_map.get(item.get("id")).get("document"))
            reranked_chunk_map.update(
                {
                    item.get("id"): {
                        "chunk": doc_map.get(item.get("id")),
                        "rank": item.get("relevance_score"),
                    }
                }
            )

    response_map.update(
        {
            "original_query": original_query,
            "retrieved_chunks": doc_map,
            "reranked_chunks": reranked_chunk_map,
            "rerank_start_time": rerank_start_time,
            "rerank_end_time": rerank_end_time,
            "rerank_request_start_time": rerank_request_start_time,
            "rerank_request_end_time": rerank_request_end_time,
            "completion_tokens": rerank_completion_tokens,
            "prompt_tokens": rerank_prompt_tokens,
            "total_tokens": rerank_total_tokens,
            "is_rerank_response_parsed": False,
            "rerank_exception": rerank_exception,
            "rerank_retries": rerank_retries,
            "context_chunks": context_chunks,
        }
    )

    return response_map
