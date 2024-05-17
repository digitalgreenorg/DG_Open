import asyncio, logging
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import translate_v2 as translate
from google.oauth2 import service_account

from django_core.config import Config

logger = logging.getLogger(__name__)

credentials = service_account.Credentials.from_service_account_file(Config.GOOGLE_APPLICATION_CREDENTIALS)


async def transcribe_and_translate(
    file_name, language_code, encoding_format=speech.RecognitionConfig.AudioEncoding.MP3, sample_rate_hertz=16000
):
    """
    Generate transcriptions (text) and confidence score for a given audio or voice file
    in a specified language using an ASR model.
    """
    speech_client = speech.SpeechClient(credentials=credentials)
    translate_client = translate.Client(credentials=credentials)

    audio = None
    with open(file_name, "rb") as audio_data:
        audio_content = audio_data.read()
        audio = speech.RecognitionAudio(content=audio_content)

    config = speech.RecognitionConfig(
        encoding=encoding_format,
        sample_rate_hertz=sample_rate_hertz,
        language_code=language_code,
        alternative_language_codes=["en-US", "en-IN"],
        enable_automatic_punctuation=True,  # Enable automatic punctuation
        use_enhanced=True,  # Enable enhanced models
    )

    # print(f"Trying to transcribe in the language: {language_code}")
    logger.info(f"Trying to transcribe in the language: {language_code}")
    response = await asyncio.to_thread(speech_client.recognize, config=config, audio=audio)

    # Retrieve the transcriptions
    transcriptions = [result.alternatives[0].transcript for result in response.results]

    # Send the transcriptions as a reply
    transcriptions = "\n".join(transcriptions)

    detection_response = await asyncio.to_thread(translate_client.detect_language, transcriptions)
    confidence = detection_response["confidence"]
    detected_language = detection_response["language"]
    # print(f"Detected language {detected_language} & Confidence: {confidence}")
    logger.info(f"Detected language: {detected_language} | Confidence: {confidence}")

    return transcriptions, detected_language, confidence
