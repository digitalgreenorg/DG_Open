
import logging
import mimetypes
import os
from tokenize import TokenError

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.http import (
    FileResponse,
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseNotFound,
)
from django.shortcuts import get_object_or_404
from jsonschema import ValidationError
LOGGER = logging.getLogger(__name__)

# from requests import Response
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from core.constants import Constants
from datahub.models import DatasetV2File, UsagePolicy, UserOrganizationMap
from utils.jwt_services import http_request_mutation

# @http_request_mutation
def protected_media_view(request):
    file = get_object_or_404(DatasetV2File, id=request.GET.get("id"))
    file_path = ''
    user_id = extract_jwt(request)
    try:
        if file.accessibility == Constants.PUBLIC:
            file_path = str(file.standardised_file)
        elif not user_id or isinstance(user_id, Response):
            return HttpResponse("Login to download this file.", status=401)
        elif file.accessibility == Constants.REGISTERED:
            file_path = str(file.standardised_file)
        elif file.accessibility == Constants.PRIVATE:
            usage_policy = UsagePolicy.objects.select_related("user_organization_map").filter(
                        user_organization_map__user_id=user_id, dataset_file_id=file.id).order_by("-updated_at").first()
            if usage_policy and usage_policy.approval_status == Constants.APPROVED:
                LOGGER.info("User has the acces to download file")
                file_path = str(file.standardised_file)
            elif DatasetV2File.objects.select_related("dataset").filter(id=request.GET.get("id")).filter(dataset__user_map__user_id=user_id).first():
                LOGGER.info("Owner of the dataset requested the file")
                file_path = str(file.standardised_file)
            else:
                return HttpResponse(f"You don't have access to download this private file, Your request status is"\
                                    f" {usage_policy.approval_status if usage_policy else 'Not Available, Send request for approval'}.", status=403)
        
        file_path = os.path.join(settings.DATASET_FILES_URL, file_path)
        if not os.path.exists(file_path):
            return HttpResponseNotFound('File not found', 404)
        # Get the MIME type based on the file extension
        mime_type, _ = mimetypes.guess_type(file_path)

        response = FileResponse(open(file_path, 'rb'))
        if mime_type is not None:
        # Set the Content-Type header
            response['Content-Type'] = mime_type
        return response
    except Exception as e:
        LOGGER.error("Error while downloading the file in protected_media_view", exc_info=True)
        return Response("Error while downloading the file", 500)


def extract_jwt(request):
    refresh_token = request.headers.get(Constants.AUTHORIZATION)
    if refresh_token:
        try:
            refresh = AccessToken(refresh_token.replace("Bearer ", ""))
            user_map = refresh.payload
            return user_map.get(Constants.USER_ID, False) # type: ignore
        except TokenError as e:
            return Response(e, 401)
    else:
        return False
   