import asyncio
from google.cloud import translate_v2 as translate
from google.cloud import texttospeech
from google.oauth2 import service_account

from common.constants import Constants
from django_core.config import Config

credentials = service_account.Credentials.from_service_account_file(Config.GOOGLE_APPLICATION_CREDENTIALS)


async def a_translate_to_english(text: str) -> str:
    """
    Translate a given text to english.
    """
    translate_client = translate.Client(credentials=credentials)
    translation = await asyncio.to_thread(
        translate_client.translate,
        text,
        target_language=Constants.LANGUAGE_SHORT_CODE_ENG,
        format_="text",
    )
    return translation["translatedText"]


async def a_translate_to(text: str, lang_code: str) -> str:
    """
    Translate a given text to specified language.
    """
    translate_client = translate.Client(credentials=credentials)
    lang_code = lang_code.split("-")[0] if "-" in lang_code else lang_code
    translation = await asyncio.to_thread(
        translate_client.translate,
        text,
        target_language=lang_code,
        format_="text",
    )
    return translation["translatedText"]


async def detect_language_and_translate_to_english(input_msg):
    """
    Detect the language of specified text and translate it to english.
    """
    translate_client = translate.Client(credentials=credentials)
    language_detection = await asyncio.to_thread(translate_client.detect_language, input_msg)
    input_language_detected = language_detection["language"]
    print("Detected input language: ", input_language_detected)

    translated_input_message = (
        await a_translate_to_english(input_msg)
        if input_language_detected != Constants.LANGUAGE_SHORT_CODE_ENG
        else input_msg
    )

    return translated_input_message, input_language_detected
