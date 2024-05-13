import logging
from functools import wraps

from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

LOGGER = logging.getLogger(__name__)

class JWTServices:
    @classmethod
    def extract_information_from_token(cls, request: Request):
        mapping = {}

        current_user, payload = JWTAuthentication().authenticate(request)
        mapping.update({
            "user_id": str(payload.get("user_id")),
            "org_id": str(payload.get("org_id")),
            "map_id": str(payload.get("map_id")),
            "role_id" : str(payload.get("role")),
            "onboarded_by" : str(payload.get("onboarded_by"))
        })
        return mapping


# def http_request_mutation(view_func):
#     @wraps(view_func)
#     def wrapper(self, request, *args, **kwargs):
#         try:
#             authorization_header = request.META.get('HTTP_AUTHORIZATION')
#             if not authorization_header:
#                 raise Exception

#             payload = JWTServices.extract_information_from_token(request=request)
#             request.META["user_id"] = payload.get("user_id")
#             request.META["org_id"] = payload.get("org_id")
#             request.META["map_id"] = payload.get("map_id")
#             request.META["onboarded_by"] = payload.get("onboarded_by")
#             request.META["role_id"] = payload.get("role_id")

#             return view_func(self, request, *args, **kwargs)
#         except Exception as e:
#             LOGGER.error(f"Error during http http_request_mutation ERROR: {e}")
#             return Response(
#                 {
#                     "message" : "Invalid auth credentials provided."
#                 },
#                 status=status.HTTP_401_UNAUTHORIZED
#             )
#     return wrapper


def http_request_mutation(view_func):
    @wraps(view_func)
    def wrapper(self, request, *args, **kwargs):
        try:
            authorization_header = request.META.get('HTTP_AUTHORIZATION')
            if not authorization_header:
                raise ValueError("Missing Authorization header.")

            payload = JWTServices.extract_information_from_token(request=request)
            if not payload:
                raise ValueError("Token extraction failed.")

            # Assuming payload extraction is successful
            request.META["user_id"] = payload.get("user_id")
            request.META["org_id"] = payload.get("org_id")
            request.META["map_id"] = payload.get("map_id")
            request.META["onboarded_by"] = payload.get("onboarded_by")
            request.META["role_id"] = payload.get("role_id")
            # And so on for the other fields...

            return view_func(self, request, *args, **kwargs)
        except ValueError as ve:
            LOGGER.error(f"Authentication error: {ve}")
            return Response(
                {"message": str(ve)},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except ParseError as e:
            LOGGER.error(f"Unexpected error during JWT authentication: {e}")
            return Response(
                {"message": "Invalid input data"},
                status=400
            )
        except Exception as e:
 
            LOGGER.error(f"Unexpected error during JWT authentication: {e}")
            return Response(
                {"message": "Error During excution"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return wrapper
