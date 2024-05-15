import os, re
import asyncio
import datetime
import random
import openai
import time
from openai import (
    RateLimitError,
    APITimeoutError,
    InternalServerError,
)

from django_core.config import Config
from openai import OpenAI, AsyncOpenAI
from qdrant_client import QdrantClient
from qdrant_client.http.models import Filter, FieldCondition, MatchValue
from common.constants import Constants


async def make_openai_request(
    prompt_message,
    model=Config.GPT_3_MODEL,
    temperature=0,
    initial_delay: float = 1,
    exponential_base: float = 2,
    jitter: bool = True,
    max_retries: int = 10,
):
    async_client = AsyncOpenAI(api_key=Config.OPEN_AI_KEY)
    openai.api_key = Config.OPEN_AI_KEY

    exception_string = ""
    retries = 0
    # base_delay = 5
    # max_retries = 5
    delay = initial_delay
    while retries < max_retries:
        try:
            # response = await openai.ChatCompletion.acreate(
            attempt_time = datetime.datetime.now()
            response = await async_client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt_message}],
                temperature=temperature,
            )
            return response, exception_string, retries
        except (RateLimitError, APITimeoutError, InternalServerError) as e:
            e_time = datetime.datetime.now()
            exception_string += str(e) + f"\t{str((e_time-attempt_time).total_seconds())} seconds\n"

            print(f"Request failed (Retry {retries + 1}/{max_retries}): {e}")

            # delay = base_delay * (2**retries)
            delay *= exponential_base * (1 + jitter * random.random())

            print(f"Retrying in {delay} seconds...")
            await asyncio.sleep(delay)
            # time.sleep(delay)
            retries += 1
        except Exception as e:
            e_time = datetime.datetime.now()
            exception_string += str(e) + f" \t{str((e_time-attempt_time).total_seconds())} seconds\n"
            return None, exception_string, retries

    print(f"Max retries reached ({max_retries}). Request failed.")
    return (
        None,
        exception_string + f"\nMax retries reached ({max_retries}). Request failed.",
        retries,
    )


####### TEMP FUNC ###############
def query_qdrant_collection(query, crop, k, search_type):
    client = QdrantClient(
        url=os.environ.get("QDRANT_HOST", "http://172.17.0.1"),
        port=5438,
        grpc_port=os.environ.get("QDRANT_PORT", "5439"),
        prefer_grpc=True,
    )
    openai_client = openai.Client(api_key=Config.OPEN_AI_KEY)
    vector = (
        openai_client.embeddings.create(
            input=[query],
            model=Constants.EMBEDDING_MODEL,
        )
        .data[0]
        .embedding
    )
    qdrant_collection_name = "kenya_v2"
    if search_type == "text":
        crop_category = crop + "_pdf"
    group_name = re.sub(r"[^a-zA-Z0-9_]", "-", crop_category)
    group_name = "kenya_v2" + "_" + group_name
    print(f"Collection and group name for qdrant is {qdrant_collection_name},  {group_name}")
    search_data = client.search(
        collection_name=qdrant_collection_name,
        query_vector=vector,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="group_id",
                    match=MatchValue(
                        value=group_name,
                    ),
                )
            ]
        ),
        limit=k,
    )
    print(f"Searched output lenth for qdrant is {len(search_data)}")
    return search_data


###### REMOVE IT LATER ###############
