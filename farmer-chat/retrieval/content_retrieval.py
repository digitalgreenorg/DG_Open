import json, datetime, logging
from django_core.config import Config
from common.utils import send_request

logger = logging.getLogger(__name__)


def content_retrieval(
    original_query, email, domain_url=Config.CONTENT_DOMAIN_URL, api_endpoint=Config.CONTENT_RETRIEVAL_ENDPOINT
):
    """
    Retrieve content chunks relevant to the user query from content retrieval site.
    """
    response_map = {}
    retrieval_start = None
    retrieval_end = None

    response_map.update(
        {
            "retrieval_start": retrieval_start,
            "retrieval_end": retrieval_end,
        }
    )

    retrieval_start = datetime.datetime.now()
    content_retrieval_url = f"{domain_url}{api_endpoint}"
    retrieved_content = None
    try:
        response = send_request(
            content_retrieval_url,
            data={"email": email, "query": original_query},
            content_type="JSON",
            request_type="POST",
            total_retry=3,
        )
        # retrieved_content = response if len(response) >= 1 else None
        retrieved_content = json.loads(response.text) if response and response.status_code == 200 else None

    except Exception as error:
        logger.error(error, exc_info=True)

    retrieval_end = datetime.datetime.now()

    response_map.update(
        {
            "retrieved_chunks": retrieved_content,
            "retrieval_start": retrieval_start,
            "retrieval_end": retrieval_end,
        }
    )

    return response_map
