import asyncio, aiohttp, logging, uuid
from google.cloud import texttospeech
from google.oauth2 import service_account

from common.constants import Constants
from common.utils import clean_text
from language_service.utils import get_language_by_code
from django_core.config import Config

logger = logging.getLogger(__name__)


credentials = service_account.Credentials.from_service_account_file(Config.GOOGLE_APPLICATION_CREDENTIALS)


async def synthesize_speech_azure(text_to_synthesize, language_code, aiohttp_session):
    """
    Synthesise speech using Azure TTS model.
    `Azure TTS Docs <https://learn.microsoft.com/en-us/azure/ai-services/speech-service/>`_
    """
    audio_content = None

    # use Azure for Speech synthesis
    url = f"https://{Config.AZURE_SERVICE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1"
    headers = {
        "Ocp-Apim-Subscription-Key": Config.AZURE_SUBSCRIPTION_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "ogg-48khz-16bit-mono-opus",
    }

    AZURE_VOICE = "en-GB-SoniaNeural"
    if language_code == "en-KE":
        AZURE_VOICE = "en-KE-AsiliaNeural"

    elif language_code == "sw-KE":
        AZURE_VOICE = "sw-KE-ZuriNeural"

    elif language_code == "en-NG":
        AZURE_VOICE = "en-NG-EzinneNeural"

    # The body of the request. Replace the text you want to synthesize
    body = f"""
    <speak version='1.0' xml:lang='{language_code}'>
        <voice xml:lang='{language_code}' xml:gender='Female' name='{AZURE_VOICE}'>
            {text_to_synthesize}
        </voice>
    </speak>
    """
    # Making the POST request to the Azure service
    # response = requests.post(url, headers=headers, data=body)

    async with aiohttp_session.post(url, data=body, headers=headers) as response:
        audio_content = await response.read() if response.status == 200 else None

    return audio_content


async def synthesize_speech(
    input_text: str,
    input_language: str,
    id_string: str = None,
    aiohttp_session=None,
    audio_encoding_format=texttospeech.AudioEncoding.OGG_OPUS,
    sample_rate_hertz=48000,
) -> str:
    """
    Synthesise speech using Google TTS. Please refer the below docs.
    `Google TTS Docs <https://cloud.google.com/text-to-speech/docs/>`_
    """
    id_string = uuid.uuid4() if not id_string else id_string
    file_name = f"response_{id_string}.{Constants.OGG}"
    input_text = clean_text(input_text)
    synthesis_input = texttospeech.SynthesisInput(text=input_text)
    language_code = "en-IN"
    input_language = input_language.split("-")[0] if "-" in input_language else input_language

    if audio_encoding_format and str(audio_encoding_format).lower() == Constants.MP3:
        audio_encoding_format = texttospeech.AudioEncoding.MP3
        file_name = f"response_{id_string}.{Constants.MP3}"
    else:
        audio_encoding_format = texttospeech.AudioEncoding.OGG_OPUS

    sample_rate_hertz = sample_rate_hertz if sample_rate_hertz else 48000

    try:
        language = get_language_by_code(input_language)
        if language:
            language_code = language.get("bcp_code")

        # user Google ASR for speech synthesis
        voice = texttospeech.VoiceSelectionParams(
            language_code=language_code,
            # name="hi-IN-Neural2-A" if input_language == "hi" else "en-IN-Standard-D",
            ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=audio_encoding_format, sample_rate_hertz=sample_rate_hertz
        )
        text_to_speech_client = texttospeech.TextToSpeechClient(credentials=credentials)

        try:
            response = await asyncio.to_thread(
                text_to_speech_client.synthesize_speech,
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config,
            )
            audio_content = response.audio_content

        except Exception as e:
            logger.error("Error while synthesizing speech: %s", str(e))
            return None

        with open(file_name, "wb") as out:
            out.write(audio_content)
            logger.info("Successfully wrote voice response to file")

    except Exception as e:
        logger.error(e, exc_info=True)
        return None

    return file_name
