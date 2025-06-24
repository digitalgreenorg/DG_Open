import base64
import binascii
import json
import logging
import re
import uuid

import certifi
import regex
from common.constants import Constants
from database.database_config import db_conn
from database.db_operations import create_record, get_record_by_field, update_record
from database.models import (
    Conversation,
    FollowUpQuestion,
    Language,
    Messages,
    MultilingualText,
    User,
)
from django_core import celery
from django_core.config import Config
from language_service.translation import *
from language_service.utils import get_language_by_code
from peewee import DoesNotExist
from requests import Request, Session
from requests.adapters import HTTPAdapter
from urllib3.util import Retry

logger = logging.getLogger(__name__)


def send_request(
    url,
    headers={},
    data=None,
    content_type="form-data",
    request_type="GET",
    total_retry=10,
    params=None,
):
    """
    Generic helper function to send requests to a specified URL with the relevant HTTP method,
    query params, request body, content negotiation and number of retries.
    """
    response = None
    try:
        if content_type == "JSON":
            headers["Content-Type"] = "application/json"
            data = json.dumps(data)

        request_obj = Request(
            request_type, url, data=data, headers=headers, params=params
        )
        session = Session()
        request_prepped = session.prepare_request(request_obj)
        retries = Retry(
            total=total_retry,
            backoff_factor=0.1,
            status_forcelist=[403, 502, 503, 504],
            allowed_methods={"GET", "POST", "PUT"},
        )
        session.mount(url, HTTPAdapter(max_retries=retries))
        response = session.send(
            request_prepped,
            stream=True,
            verify=certifi.where(),
            # verify=False,
        )
        logger.info(f"URL: {url} | Response Status Code: {response.status_code}")
        # json_response = json.loads(response.text) if response and response.status_code == 200 else {}
        # json_response.update({"status_code": response.status_code})
        # logger.info(f"Response: {json_response}")

    except Exception as error:
        logger.error(error, exc_info=True)

    return response


def get_or_create_latest_conversation(conversation_data: dict) -> Conversation:
    """
    Fetch the latest conversation instance if available or create a new conversation.
    """
    conversation = None
    user_id = conversation_data.get("user_id", None)
    try:
        with db_conn:
            conversation_qs = (
                Conversation.select()
                .where(Conversation.user_id == user_id)
                .order_by(Conversation.created_on.desc())
                # .get()
            )

        conversation = conversation_qs.get() if len(conversation_qs) >= 1 else None
        if not conversation:
            conversation = create_record(Conversation, conversation_data)
            logger.info(f"New conversation created for user_id:{user_id}")

    except Exception as error:
        logger.error(error, exec_info=True)

    return conversation


def get_user_chat_history(user_id, window=Config.CHAT_HISTORY_WINDOW):
    """
    Fetch user chat history by querying the previous messages associated with the user.
    """
    chat_history = None
    with db_conn:
        conversation = get_or_create_latest_conversation({"user_id": user_id})
        messages = (
            Messages.select()
            .where(
                Messages.conversation_id == conversation.id,
                Messages.is_deleted == False,
                Messages.translated_message != None,
                Messages.message_response != None,
            )
            .order_by(Messages.created_on.desc())
            .limit(window)
        )
        chat_history = ""
        for message in reversed(messages):
            chat_history = (
                chat_history
                + f"\n\nUser : {message.translated_message}\nAI Assistant : {message.message_response}"
            )
        # history.append((message.translated_message, message.message_response))

    # print(f"\n ######## USER CHAT HISTORY BEGINS ########\n{chat_history} ######## USER CHAT HISTORY END ########\n")
    # logger.info(f"User chat history :\n {chat_history}")
    return chat_history


def insert_message_record(
    message_data: dict,
) -> Messages:
    """
    create or insert new message record.
    """
    message_inserted, message_id, conversation_id = None, None, None
    try:
        conversation_id = message_data.get("conversation_id")
        message_inserted = create_record(Messages, message_data)
        message_id = message_inserted.id
    except Exception as error:
        logger.error(error, exc_info=True)

    logger.info(
        f"Message inserted, message_id:{message_id} for conversation_id:{conversation_id}"
    )
    return message_inserted


def get_message_object_by_id(
    message_id,
) -> Messages:
    """
    Fetch Messages instance by message ID
    """
    message = get_record_by_field(Messages, "id", message_id)
    return message


def get_or_create_user_by_email(user_data: dict) -> User:
    """
    Fetch an User instance by email ID if available or create one.
    """
    user_obj = None
    email_id = user_data.get("email", None)
    try:
        with db_conn:
            user_obj = (
                User.get(User.email == email_id)
                # .where(User.email == email_id)
                # .get()
            )
    except DoesNotExist:
        user_obj = create_record(User, user_data)

        logger.info(f"New User created for the email_id:{email_id}")

    return user_obj


def create_or_update_user_by_email(user_data: dict) -> User:
    """
    Save the user profile data if it does not exist or update it with latest profile data.
    """
    user_obj = None
    email_id = user_data.get("email", None)
    try:
        user_obj = get_record_by_field(User, "email", email_id)
        if not user_obj:
            user_obj = create_record(User, user_data)
            logger.info(f"New User created for the email_id:{email_id}")
        else:
            user_obj = update_record(User, user_obj.id, user_data)

    except Exception as e:
        logger.error(e, exc_info=True)

    return user_obj


def create_follow_up_questions(data) -> FollowUpQuestion:
    """
    Save multiple instances of Follow-up question data.
    """
    # def insert_many_objects(data, ModelName):
    # with database_config.db:
    inserted_objs = None

    with db_conn:
        inserted_objs = FollowUpQuestion.insert_many(data).execute()

    return inserted_objs


async def postprocess_and_translate_query_response(
    original_response, input_language, message_id, with_db_config=Config.WITH_DB_CONFIG
):
    """
    Post-process the generated response with translation to relevant language and split the follow-up questions.
    """
    final_response = ""
    questions = ""
    resource_message_text = ""
    resource_translation = ""
    translated_response = ""
    follow_up_question_options = []
    follow_up_question_data_to_insert = []

    try:
        output_language = (
            input_language.split("-")[0] if "-" in input_language else input_language
        )
        split_string_list = Constants.SPLIT_STRING_LIST_FOR_FOLLOW_UP_QUESTIONS

        index = -1
        if original_response:
            for substring in split_string_list:
                index = original_response.find(substring)
                if index != -1:
                    string_index = split_string_list.index(substring)
                    (final_response, questions) = original_response.split(
                        split_string_list[string_index]
                    )
                    final_response = final_response.strip()
                    questions = questions.strip()
                    break

        if index != -1:
            translated_response = (
                await a_translate_to(final_response, output_language)
                if input_language != Constants.LANGUAGE_SHORT_CODE_ENG
                else final_response
            )

            # translated_response += (
            #     await a_translate_to(Constants.HERE_ARE_FOLLOW_UP_QUESTIONS_TO_ASK_TEXT, output_language)
            #     if input_language != Constants.LANGUAGE_SHORT_CODE_ENG
            #     else Constants.HERE_ARE_FOLLOW_UP_QUESTIONS_TO_ASK_TEXT
            # )

            sequence = 0
            for question in questions.split("\n")[:3]:
                # final_response += f"{question}\n"
                translated_question = (
                    await a_translate_to(f"{question}\n", output_language)
                    if input_language != Constants.LANGUAGE_SHORT_CODE_ENG
                    else f"{question}\n"
                )

                # translated_response += translated_question

                sequence += 1
                follow_up_question_id = uuid.uuid4()
                follow_up_question_text = re.sub(
                    "[1-3]\.\s*", "", str(translated_question).strip(), count=1
                )
                follow_up_question_options.append(
                    {
                        "follow_up_question_id": str(follow_up_question_id),
                        "sequence": sequence,
                        "question": follow_up_question_text,
                    }
                )

                # append insertion data or saving of questions in FollowUpQuestion table
                follow_up_question_data_to_insert.append(
                    {
                        "id": follow_up_question_id,
                        "message": follow_up_question_text,
                        "ref_id": message_id,
                        "follow_up_question_type": "message",
                        "sequence": sequence,
                    }
                )

            # insert data in FollowUpQuestion table
            if len(follow_up_question_data_to_insert) > 1 and with_db_config:
                create_follow_up_questions(follow_up_question_data_to_insert)

        else:
            # if original_response does not have "Example Questions:\n" translate original_response as it is
            final_response = original_response
            translated_response = (
                await a_translate_to(final_response, output_language)
                if input_language != Constants.LANGUAGE_SHORT_CODE_ENG
                else final_response
            )

    except Exception as error:
        logger.error(error, exc_info=True)

    return (
        translated_response,
        final_response,
        follow_up_question_options,
        follow_up_question_data_to_insert,
    )


def save_message_obj(message_id, message_data_to_insert_or_update):
    """
    Update a Message instance.
    """
    update_record(Messages, message_id, message_data_to_insert_or_update)


def clean_text(text):
    """
    Remove markup tags, hyperlinks, images and other irrelevant special characters from a given text,
    which will be further sent for audio synthesis.
    """
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", "", text)

    # Remove Markdown links and images
    text = re.sub(r"!\[[^\]]*\]\([^\)]*\)", "", text)  # Images
    text = re.sub(r"\[[^\]]*\]\([^\)]*\)", "", text)  # Links
    text = text.replace("*", "").replace("_", "")

    # Remove any remaining special characters except new lines
    # This regex keeps letters (including non-English), digits, and new lines
    # text = re.sub(r'[^\p{L}\p{M}\p{N}\p{Z}\s\n]', '', text, flags=re.UNICODE)
    text = regex.sub(r"[^\p{L}\p{M}\p{N}\p{Z}\s\n]", "", text, flags=regex.UNICODE)

    return text


def encode_binary_to_base64(audio_file):
    """
    Encode binary audio file to base64 string.
    """
    base64_string = None
    try:
        with open(audio_file, "rb") as audio_file_buffer:
            audio_binary_data = audio_file_buffer.read()
            base64_string = base64.b64encode(audio_binary_data).decode()

        base64_string = base64_string if len(base64_string) >= 1 else None
    except Exception as error:
        logger.error(error, exc_info=True)

    return base64_string


def decode_base64_to_binary(base64_string):
    """
    Decode base64 string to binary file.
    """
    binary_file = None
    try:
        binary_file = base64.b64decode(base64_string)
    except binascii.Error:
        logger.warning("Error in decoding the base64 string")

    return binary_file


def get_user_by_email(email_id):
    """
    Query the user with email ID
    """
    user = None
    try:
        with db_conn:
            user_query = User.select(
                (User.id).alias("user_id"),
                User.first_name,
                User.last_name,
                User.phone,
                (User.preferred_language_id).alias("preferred_language_id"),
            ).where(User.is_deleted == False, User.email == email_id)

            if user_query.count() >= 1:
                user = list(user_query.dicts().execute())[0]

    except Exception as error:
        logger.error(error, exc_info=True)

    return user


def set_user_preferred_language(user_id, language_id):
    """
    Save the user preferred language for the specified user
    """
    saved_user_preferred_language = update_record(
        User, user_id, {"preferred_language_id": language_id}
    )
    return saved_user_preferred_language


def format_multilingual_text_code(string):
    """
    Format a text by removing whitespaces, using "_" as a delimiter and return in lower case.
    ex: phrase_in_english_en
    """
    replace_spaces = re.sub("\s", "_", str(string).lower())
    final_string = re.sub("[^a-zA-Z0-9 \n\.]", "_", replace_spaces)
    return final_string


def fetch_multilingual_texts_for_static_text_messages(
    text_code_without_lang_code_list,
    language_code=Constants.LANGUAGE_SHORT_CODE_NATIVE,
    with_db_config=Config.WITH_DB_CONFIG,
):
    """
    Return a list MultilingualTexts for a given list of static texts in specified language.
    """
    multilingual_text_list, multilingual_text_query_list = [], []

    try:
        text_code_list = [
            format_multilingual_text_code(
                text_code_without_lang_code + "_" + language_code
            )
            for text_code_without_lang_code in text_code_without_lang_code_list
        ]

        if with_db_config:
            with db_conn:
                multilingual_text_query = MultilingualText.select(
                    MultilingualText.text_code, MultilingualText.text
                ).where(
                    MultilingualText.is_deleted == False,
                    MultilingualText.text_code.in_(text_code_list),
                )

                if len(multilingual_text_query) >= 1:
                    multilingual_text_query_list = list(
                        multilingual_text_query.dicts().execute()
                    )

                if len(multilingual_text_query_list) >= 1:
                    multilingual_text_list = [
                        {
                            text_code.get("text_code").strip(
                                f"_{language_code}"
                            ): text_code.get("text")
                        }
                        for text_code in multilingual_text_query_list
                    ]

        else:
            multilingual_text_list = [
                {text_code: f"{Constants.MULTILINGUAL_ENG_TEXTS[text_code]}"}
                for text_code in text_code_without_lang_code_list
            ]

    except Exception as error:
        logger.error(error, exc_info=True)

    return multilingual_text_list


def fetch_corresponding_multilingual_text(
    corresponding_text,
    text_codes_list_with_multilingual_texts,
    language_code=Constants.LANGUAGE_SHORT_CODE_NATIVE,
):
    """
    Return corresponding static text from a list of MultilingualTexts in specified language.
    """
    matched_text = None
    for item in text_codes_list_with_multilingual_texts:
        if corresponding_text in item:
            matched_text = item[corresponding_text]
            break

    return matched_text
