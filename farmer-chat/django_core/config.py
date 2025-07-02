import os

from dotenv import dotenv_values, load_dotenv

# load_dotenv()
ENV_CONFIG = dotenv_values(encoding="utf-8")
if os.path.isfile(".config.env"):
    ENV_CONFIG.update(dotenv_values(".config.env", encoding="utf-8"))


def handle_boolean(value=False) -> bool:
    if (
        isinstance(value, str)
        and (
            value.lower() == "true"
            or value.lower() == "t"
            or value.lower() == "yes"
            or value.lower() == "y"
        )
    ) or (isinstance(value, bool) and value == True):
        return True

    return False


class Config:
    # DB config
    WITH_DB_CONFIG = handle_boolean(ENV_CONFIG.get("WITH_DB_CONFIG", False))
    DB_NAME = ENV_CONFIG.get("DB_NAME")
    DB_USER = ENV_CONFIG.get("DB_USER")
    DB_PASSWORD = ENV_CONFIG.get("DB_PASSWORD")
    DB_HOST = ENV_CONFIG.get("DB_HOST")
    DB_PORT = ENV_CONFIG.get("DB_PORT")
    MAX_CONNECTIONS = ENV_CONFIG.get("DB_MAX_CONNECTIONS")
    STALE_TIMEOUT = ENV_CONFIG.get("DB_STALE_TIMEOUT")

    # prompts
    REPHRASE_QUESTION_PROMPT = ENV_CONFIG.get("REPHRASE_QUESTION_PROMPT")
    RERANKING_PROMPT_SINGLE_TEMPLATE = ENV_CONFIG.get(
        "RERANKING_PROMPT_SINGLE_TEMPLATE"
    )
    RERANK_SINGLE_JSON_EXAMPLE = ENV_CONFIG.get("RERANK_SINGLE_JSON_EXAMPLE")
    INTENT_CLASSIFICATION_PROMPT_TEMPLATE = ENV_CONFIG.get(
        "INTENT_CLASSIFICATION_PROMPT_TEMPLATE"
    )
    CONVERSATION_PROMPT = ENV_CONFIG.get("CONVERSATION_PROMPT")
    UNCLEAR_QN_PROMPT = ENV_CONFIG.get("UNCLEAR_QN_PROMPT")
    EXIT_PROMPT = ENV_CONFIG.get("EXIT_PROMPT")
    OUT_OF_CONTEXT_PROMPT = ENV_CONFIG.get("OUT_OF_CONTEXT_PROMPT")
    RESPONSE_GEN_PROMPT = ENV_CONFIG.get("RESPONSE_GEN_PROMPT")

    # openAI config
    OPEN_AI_KEY = ENV_CONFIG.get("OPENAI_API_KEY")
    GPT_3_MODEL = ENV_CONFIG.get("GPT_3_MODEL", "gpt-3.5-turbo")
    GPT_4_MODEL = ENV_CONFIG.get("GPT_4_MODEL", "gpt-4-0125-preview")
    TEMPERATURE = ENV_CONFIG.get("TEMPERATURE", 0)
    MAX_TOKENS = ENV_CONFIG.get("MAX_TOKENS", 500)
    CHAT_HISTORY_WINDOW = ENV_CONFIG.get("CHAT_HISTORY_WINDOW", 4)

    # Content Retrieval APIs
    CONTENT_DOMAIN_URL = ENV_CONFIG.get("CONTENT_DOMAIN_URL")
    CONTENT_AUTHENTICATE_ENDPOINT = ENV_CONFIG.get("CONTENT_AUTHENTICATE_ENDPOINT")
    CONTENT_RETRIEVAL_ENDPOINT = ENV_CONFIG.get("CONTENT_RETRIEVAL_ENDPOINT")

    # Language
    LANGUAGE_BCP_CODE_NATIVE = ENV_CONFIG.get("LANGUAGE_BCP_CODE_NATIVE", "en-US")
    LANGUAGE_SHORT_CODE_NATIVE = os.environ.get("LANGUAGE_SHORT_CODE_NATIVE", "en")

    # Translation
    GOOGLE_APPLICATION_CREDENTIALS = ENV_CONFIG.get("GOOGLE_APPLICATION_CREDENTIALS")
