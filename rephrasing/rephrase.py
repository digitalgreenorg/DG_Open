import datetime
import asyncio

from django_core.config import Config
from rag_service.openai_service import make_openai_request


async def condense_query_prompt(original_query, chat_history):
    """
    Condense the prompt / query with the chat history & input message / query of the client.

    Parameters
    ----------
    original_query: str
        original query from the client

    chat_history: str
        previous chat history of the client

    Returns
    -------
    condense_prompt: str
        return a condensed prompt

    """

    condense_prompt = Config.REPHRASE_QUESTION_PROMPT.format(
        chat_history=chat_history,
        question=original_query,
    )
    return condense_prompt


async def rephrase_query(original_query, chat_history=None):
    """
    Rephrase and return the input query with chat history (if available) from openAI.

    Parameters
    ----------
    original_query: str
        original query from the client

    chat_history: str
        previous chat history of the client (default: None)

    Returns
    -------
    rephrased_response: dict
        return a dictionary containing rephrased query token and other relevant metrics

        Ex:

    """
    rephrased_response = {}
    rephrased_query = None
    rephrase_start_time = None
    rephrase_end_time = None
    rephrase_completion_tokens = 0
    rephrase_prompt_tokens = 0
    rephrase_total_tokens = 0
    rephrase_exception = None
    rephrase_retries = 0

    rephrased_response.update(
        {
            "original_query": original_query,
            "rephrased_query": rephrased_query,
            "rephrase_start_time": rephrase_start_time,
            "rephrase_end_time": rephrase_end_time,
            "completion_tokens": rephrase_completion_tokens,
            "prompt_tokens": rephrase_prompt_tokens,
            "total_tokens": rephrase_total_tokens,
            "rephrase_exception": rephrase_exception,
            "rephrase_retries": rephrase_retries,
        }
    )

    rephrase_start_time = datetime.datetime.now()

    # if len(chat_history) >= 1:
    if chat_history:
        condense_prompt = await condense_query_prompt(original_query, chat_history)
        rephrased_question_response, rephrase_exception, rephrase_retries = await make_openai_request(condense_prompt)
        if rephrased_question_response:
            rephrased_query = rephrased_question_response.choices[0].message.content
            rephrase_completion_tokens = rephrased_question_response.usage.completion_tokens
            rephrase_prompt_tokens = rephrased_question_response.usage.prompt_tokens
            rephrase_total_tokens = rephrased_question_response.usage.total_tokens
        else:
            rephrased_query = original_query
    else:
        rephrased_query = original_query

    rephrase_end_time = datetime.datetime.now()

    # print("Original Question : ", original_query)
    # print("Rephrased Question : ", rephrased_query)

    rephrased_response.update(
        {
            "original_query": original_query,
            "rephrased_query": rephrased_query,
            "rephrase_start_time": rephrase_start_time,
            "rephrase_end_time": rephrase_end_time,
            "completion_tokens": rephrase_completion_tokens,
            "prompt_tokens": rephrase_prompt_tokens,
            "total_tokens": rephrase_total_tokens,
            "rephrase_exception": rephrase_exception,
            "rephrase_retries": rephrase_retries,
        }
    )

    return rephrased_response
