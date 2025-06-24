import asyncio
import base64
import logging

from api.utils import (
    authenticate_user_based_on_email,
    handle_input_query,
    process_input_audio_to_base64,
    process_output_audio,
    process_query,
    process_transcriptions,
)
from common.constants import Constants
from common.utils import get_user_by_email, set_user_preferred_language
from django.core.files.uploadedfile import InMemoryUploadedFile
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from language_service.utils import get_all_languages, get_language_by_id
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

logger = logging.getLogger(__name__)


class ChatAPIViewSet(GenericViewSet):
    """
    Custom ViewSet chat services

    Actions (operations)
    --------------------
        Get Answer for Text Query :
            generate answer for a given user text query in text
        Synthesise Audio :
            generate audio in base64 format for a given text using Text-to-Speech
        Transcribe Audio :
            generate transcriptions or text for given voice query using Speech-to-Text
        Get Answer by Voice Query :
            generate answer for a given user voice query in voice

    """

    authentication_classes = []

    @action(detail=False, methods=["post"])
    def get_answer_for_text_query(self, request):
        """
        Generate answer for a given user query
        """
        email_id = request.data.get("email_id")
        original_query = request.data.get("query")
        response_data = Response(
            {"message": None, "query": original_query, "error": False}
        )
        response_map = {}
        authenticated_user = None

        try:
            # check for authenticated user using email
            authenticated_user = authenticate_user_based_on_email(email_id)

            # if is_authenticated == False:
            if not authenticated_user:
                response_data.data["message"] = "Invalid Email ID"
                response_data.status_code = status.HTTP_401_UNAUTHORIZED
                return response_data
                # return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)

            if not original_query:
                response_data.data["message"] = "Please submit a query."
                response_data.status_code = status.HTTP_400_BAD_REQUEST
                return response_data

            response_map = process_query(original_query, email_id, authenticated_user)

            # update actual response body
            response_data.data["message"] = (
                "Successful retrieval of response for above query"
            )
            response_data.data["message_id"] = response_map.get("message_id")
            response_data.data["response"] = response_map.get("translated_response")
            response_data.data["source"] = response_map.get("source", None)
            response_data.data["follow_up_questions"] = response_map.get(
                "follow_up_questions"
            )

        except Exception as error:
            logger.error(error, exc_info=True)
            response_data.data.update(
                {"message": "Something went wrong", "error": True}
            )
            response_data.status_code = status_code = (
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return response_data

    @action(detail=False, methods=["post"])
    def synthesise_audio(self, request):
        """
        Generate audio in base64 format using Text-to-speech for a given text
        """
        email_id = request.data.get("email_id")
        original_text = request.data.get("text")
        message_id = request.data.get("message_id")
        response_data = Response({"message": None, "error": False, "audio": None})

        try:
            # check for authenticated user using email
            authenticated_user = authenticate_user_based_on_email(email_id)

            # if is_authenticated == False:
            if not authenticated_user:
                response_data.data["message"] = "Invalid Email ID"
                response_data.status_code = status.HTTP_401_UNAUTHORIZED
                return response_data
                # return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)

            if not original_text:
                response_data.data["message"] = (
                    "Please submit text for audio synthesis."
                )
                response_data.status_code = status.HTTP_400_BAD_REQUEST
                return response_data

            response_audio = process_output_audio(original_text, message_id)

            if not response_audio:
                response_data.data.update(
                    {
                        "message": "Invalid base64 string or unable to generate transcriptions currently.",
                        "audio": input_audio_base64,
                    }
                )
                response_data.status_code = status.HTTP_401_UNAUTHORIZED
                return response_data
                # return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            response_data.data.update(
                {
                    "text": original_text,
                    "audio": response_audio,
                    "message": "Audio synthesis successful",
                }
            )

        except Exception as error:
            logger.error(error, exc_info=True)
            response_data.data.update(
                {"message": "Something went wrong", "error": True}
            )
            response_data.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

        return response_data

    @action(detail=False, methods=["post"])
    def transcribe_audio(self, request):
        """
        Generate transcriptions or text for given voice query using Speech-to-Text
        """
        email_id = request.data.get("email_id", None)
        original_query = request.data.get("query", None)
        query_language_bcp_code = request.data.get(
            "query_language_bcp_code", Constants.LANGUAGE_BCP_CODE_NATIVE
        )
        response_data = Response(
            {
                "message": None,
                "heard_input_query": None,
                "heard_input_audio": original_query,
                "confidence_score": 0,
                "error": False,
            }
        )
        response_map = {}
        authenticated_user, input_query_file = None, None

        try:
            # check for authenticated user using email
            authenticated_user = authenticate_user_based_on_email(email_id)

            # if is_authenticated == False:
            if not authenticated_user:
                response_data.data["message"] = "Invalid Email ID"
                response_data.status_code = status.HTTP_401_UNAUTHORIZED
                return response_data
                # return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)

            if not original_query:
                response_data.data["message"] = (
                    "Please share a valid base64 string as a query."
                )
                response_data.status_code = status.HTTP_400_BAD_REQUEST
                return response_data

            input_query = (
                request.FILES.get("query")
                if len(request.FILES) >= 1
                else original_query
            )
            if isinstance(input_query, InMemoryUploadedFile):
                input_query.seek(0)
                file_content = input_query.read()
                input_query = base64.b64encode(bytes(file_content))

            input_query_file = handle_input_query(input_query)

            if not input_query_file:
                response_data.data["message"] = "Invalid file or base64 string."
                response_data.status_code = status.HTTP_400_BAD_REQUEST
                return response_data
                # return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            response_map = process_transcriptions(
                input_query_file,
                email_id,
                authenticated_user,
                language_bcp_code=query_language_bcp_code,
            )
            message_id = response_map.get("message_id")
            confidence_score = response_map.get("confidence_score")
            heard_input_query = response_map.get("transcriptions")
            response_data.data.update(
                {
                    "message": "Unfortunately unable to transcribe the above voice input query.",
                    "message_id": message_id,
                    "confidence_score": confidence_score,
                    "heard_input_query": heard_input_query,
                }
            )

            if (
                confidence_score
                and confidence_score > Constants.ASR_DEFAULT_CONFIDENCE_SCORE
            ):
                input_audio_base64 = process_input_audio_to_base64(
                    heard_input_query, response_map.get("message_id")
                )
                response_data.data.update(
                    {
                        "message": "Successful transcription for above input voice query.",
                        "heard_input_audio": input_audio_base64,
                    }
                )

        except Exception as error:
            logger.error(error, exc_info=True)
            response_data.data.update(
                {"message": "Something went wrong", "error": True}
            )
            response_data.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            # return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return response_data

    @action(detail=False, methods=["post"])
    def get_answer_by_voice_query(self, request):
        """
        Generate answer for a given user voice query in voice
        """
        email_id = request.data.get("email_id", None)
        query = request.data.get("query", None)
        query_language_bcp_code = request.data.get(
            "query_language_bcp_code", Constants.LANGUAGE_BCP_CODE_NATIVE
        )
        response_data = Response(
            {
                "message": None,
                "heard_input_query": None,
                "heard_input_audio": None,
                "confidence_score": 0,
                "error": False,
            }
        )

        try:
            transcribe_response = self.transcribe_audio(request)
            transcribe_response_data = (
                transcribe_response.data
                if transcribe_response.status_code in [200, 400, 401, 500]
                else response_data.data
            )
            confidence_score = transcribe_response_data.get("confidence_score", None)
            response_data.data = transcribe_response_data

            # if is_authenticated == False:
            if transcribe_response.status_code == 401:
                response_data.status_code = status.HTTP_401_UNAUTHORIZED
                return response_data
                # return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)

            if transcribe_response.status_code == 400:
                response_data.status_code = status.HTTP_400_BAD_REQUEST
                return response_data
                # return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            if transcribe_response.status_code == 500:
                response_data.data.update(
                    {"message": "Something went wrong", "error": True}
                )
                response_data.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                return response_data
                # return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            if (
                confidence_score
                and confidence_score > Constants.ASR_DEFAULT_CONFIDENCE_SCORE
            ):
                updated_request_obj = request
                updated_request_obj.data.update(
                    {"query": transcribe_response_data.get("heard_input_query", None)}
                )
                get_answer_for_text_query_response = self.get_answer_for_text_query(
                    updated_request_obj
                )
                get_answer_for_text_query_response_data = (
                    get_answer_for_text_query_response.data
                    if get_answer_for_text_query_response.status_code == 200
                    else {}
                )
                response_data.data.update(
                    {
                        "message": get_answer_for_text_query_response_data.get(
                            "message", None
                        ),
                        "message_id": transcribe_response_data.get("message_id", None),
                        "heard_input_query": transcribe_response_data.get(
                            "heard_input_query", None
                        ),
                        "heard_input_audio": transcribe_response_data.get(
                            "heard_input_audio", None
                        ),
                        "confidence_score": transcribe_response_data.get(
                            "confidence_score", None
                        ),
                        "response": get_answer_for_text_query_response_data.get(
                            "response", None
                        ),
                        "follow_up_questions": get_answer_for_text_query_response_data.get(
                            "follow_up_questions", None
                        ),
                    }
                )

        except Exception as error:
            logger.error(error, exc_info=True)
            response_data.data.update(
                {"message": "Something went wrong", "error": True}
            )
            response_data.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            # response_data.update({"message": "Something went wrong", "error": True}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return response_data


class LanguageViewSet(GenericViewSet):
    """
    ViewSet for Language model (`database.models.Language`)

    Actions (operations)
    --------------------
        Languages :
            list the supported languages
        Set Language :
            save the user preferred language

    """

    authentication_classes = []

    @action(detail=False, methods=["get"])
    def languages(self, request):
        """
        Fetches the list of supported languages
        """
        email_id = request.GET.get("email_id", None)
        response_data = Response({"message": None, "error": False, "language_data": []})

        try:
            # check for authenticated user using email
            authenticated_user = authenticate_user_based_on_email(email_id)

            # if is_authenticated == False:
            if not authenticated_user:
                response_data.data["message"] = "Invalid Email ID"
                response_data.status_code = status.HTTP_401_UNAUTHORIZED
                return response_data
                # return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)

            language_list = get_all_languages()
            if len(language_list) >= 1:
                response_data.data.update(
                    {
                        "message": "Successful retrieval of supported language list.",
                        "language_data": language_list,
                    }
                )

        except Exception as error:
            logger.error(error, exc_info=True)
            response_data.data.update(
                {"message": "Something went wrong", "error": True}
            )
            response_data.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

        return response_data

    @action(detail=False, methods=["post"])
    def set_language(self, request):
        """
        Save the user preferred language
        """
        email_id = request.data.get("email_id", None)
        language_id = request.data.get("language_id", None)
        response_data = Response({"message": None, "error": False})
        saved_user_preferred_language = None

        try:
            # check for authenticated user using email
            authenticated_user = authenticate_user_based_on_email(email_id)

            # if is_authenticated == False:
            if not authenticated_user:
                response_data.data["message"] = "Invalid Email ID"
                response_data.status_code = status.HTTP_401_UNAUTHORIZED
                return response_data
                # return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)

            if not language_id:
                response_data.data["message"] = "Language ID not submitted"
                response_data.status_code = status.HTTP_400_BAD_REQUEST
                return response_data
                # return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            user = get_user_by_email(email_id)
            user_id = user.get("user_id")
            language_id = int(language_id)

            # verify language with language_id exists
            language_dict = get_language_by_id(language_id)

            if len(language_dict) >= 1 and language_dict["language_id"] == language_id:
                saved_user_preferred_language = set_user_preferred_language(
                    user_id, language_id
                )
            else:
                response_data.data["message"] = (
                    f"Language with ID {language_id} does not exist."
                )
                response_data.status_code = status.HTTP_400_BAD_REQUEST
                return response_data
                # return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            if saved_user_preferred_language:
                response_data.data.update(
                    {
                        "message": f"Saved the user's ({email_id}) preferred language with {language_dict.get('display_name')}"
                    }
                )
                response_data.status_code = status.HTTP_200_OK
                return response_data

            else:
                response_data.data.update(
                    {
                        "message": f"Unable to save user's ({email_id}) preferred language with {language_dict.get('display_name')}"
                    }
                )
                response_data.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

        except Exception as error:
            logger.error(error, exc_info=True)
            response_data.data.update(
                {"message": "Something went wrong", "error": True}
            )
            response_data.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

        return response_data
