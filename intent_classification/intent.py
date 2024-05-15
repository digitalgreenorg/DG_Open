from django_core.config import Config
from rag_service.openai_service import make_openai_request
from intent_classification.constants import IntentConstants


async def classify_intent(qn):
    prompt = Config.INTENT_CLASSIFICATION_PROMPT_TEMPLATE.format(input=qn)
    intent_response, ex, retries = await make_openai_request(prompt, model=Config.GPT_4_MODEL)
    return intent_response.choices[0].message.content if intent_response else IntentConstants.USER_INTENT_FARMING


async def generate_convo_response(qn, name):
    prompt = Config.CONVERSATION_PROMPT.format(name=name, input=qn)
    convo_response, convo_ex, convo_retries = await make_openai_request(prompt)
    return convo_response.choices[0].message.content


async def generate_unclear_qn_response(qn, name):
    prompt = Config.UNCLEAR_QN_PROMPT.format(name=name, input=qn)
    unclear_qn_response, unclear_qn_ex, unclear_qn_etries = await make_openai_request(prompt)
    return unclear_qn_response.choices[0].message.content


async def generate_exit_response(qn, name):
    prompt = Config.EXIT_PROMPT.format(name=name, input=qn)
    exit_response, exit_ex, exit_retries = await make_openai_request(prompt)
    return exit_response.choices[0].message.content


async def generate_out_of_context_response(qn, name):
    prompt = Config.OUT_OF_CONTEXT_PROMPT.format(name=name, input=qn)
    out_of_context_response, out_of_context_ex, out_of_context_retries = await make_openai_request(prompt)
    return out_of_context_response.choices[0].message.content


async def process_user_intent(input_msg, user_name):
    response = None
    intent = None
    proceed_to_rag = True
    intent = await classify_intent(input_msg)
    if intent == IntentConstants.USER_INTENT_GREETING or intent == IntentConstants.USER_INTENT_DISAPPOINTMENT:
        response = await generate_convo_response(input_msg, user_name)

    if intent == IntentConstants.USER_INTENT_UNCLEAR:
        response = await generate_unclear_qn_response(input_msg, user_name)

    if intent == IntentConstants.USER_INTENT_EXIT:
        response = await generate_exit_response(input_msg, user_name)

    if intent == IntentConstants.USER_INTENT_OUT_CONTEXT:
        response = await generate_out_of_context_response(input_msg, user_name)

    if intent != IntentConstants.USER_INTENT_FARMING and intent != IntentConstants.USER_INTENT_REFERRING_BACK:
        proceed_to_rag = False

    return response, intent, proceed_to_rag
