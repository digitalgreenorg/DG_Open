import ast
import csv
import gzip
import json
import logging
import operator
import os
import pickle
import random
import re
import shutil
import string
import sys
import threading
import uuid
from calendar import c
from concurrent.futures import ThreadPoolExecutor, as_completed
from functools import reduce
from pickle import TRUE
from urllib.parse import parse_qs, unquote, urlparse

import boto3
import django
import dropbox
import numpy as np
import pandas as pd
import requests
from azure.storage.blob import BlobServiceClient
from django.conf import settings
from django.contrib.admin.utils import get_model_from_relation
from django.contrib.auth.hashers import check_password, make_password
from django.core.cache import cache
from django.core.files.base import ContentFile
from django.db import transaction

# from django.http import HttpResponse
from django.db.models import (
    DEFERRED,
    CharField,
    Count,
    F,
    Func,
    OuterRef,
    Q,
    Subquery,
    Sum,
    Value,
)
from django.db.models.functions import Concat

# from django.db.models.functions import Index, Substr
from django.http import JsonResponse
from django.shortcuts import render
from drf_braces.mixins import MultipleSerializersViewMixin
from google.oauth2.credentials import Credentials
from google.oauth2.service_account import Credentials as ServiceAccountCredentials
from googleapiclient.discovery import build
from jsonschema import ValidationError
from psycopg2 import connect
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from python_http_client import exceptions
from pytube import Channel, Playlist, YouTube
from rest_framework import generics, pagination, status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ViewSet
from uritemplate import partial

from accounts.models import User, UserRole
from accounts.serializers import (
    UserCreateSerializer,
    UserSerializer,
    UserUpdateSerializer,
)
from ai.open_ai_utils import qdrant_embeddings_delete_file_id
from ai.retriever.conversation_retrival import ConversationRetrival
from ai.retriever.manual_retrival import Retrival
from ai.vector_db_builder.vector_build import create_vector_db, insert_auto_cat_data
from connectors.models import Connectors
from connectors.serializers import ConnectorsListSerializer
from core.constants import Constants, NumericalConstants
from core.serializer_validation import (
    OrganizationSerializerValidator,
    UserCreateSerializerValidator,
)
from core.settings import BASE_DIR
from core.utils import (
    CustomPagination,
    Utils,
    csv_and_xlsx_file_validatation,
    date_formater,
    generate_api_key,
    generate_hash_key_for_dashboard,
    read_contents_from_csv_or_xlsx_file,
)
from datahub.models import (
    DatahubDocuments,
    Datasets,
    DatasetV2,
    DatasetV2File,
    Organization,
    Resource,
    StandardisationTemplate,
    UserOrganizationMap,
)
from datahub.serializers import (
    ResourceAutoCatSerializer,  # Added for Auto Categorizaion
)
from datahub.serializers import (
    DatahubDatasetFileDashboardFilterSerializer,
    DatahubDatasetsSerializer,
    DatahubDatasetsV2Serializer,
    DatahubThemeSerializer,
    DatasetFileV2NewSerializer,
    DatasetSerializer,
    DatasetUpdateSerializer,
    DatasetV2DetailNewSerializer,
    DatasetV2ListNewSerializer,
    DatasetV2NewListSerializer,
    DatasetV2Serializer,
    DatasetV2TempFileSerializer,
    DatasetV2Validation,
    DropDocumentSerializer,
    OrganizationSerializer,
    ParticipantSerializer,
    PolicyDocumentSerializer,
    RecentDatasetListSerializer,
    RecentSupportTicketSerializer,
    ResourceAPIBuilderSerializer,
    ResourceFileSerializer,
    ResourceSerializer,
    ResourceUsagePolicySerializer,
    StandardisationTemplateUpdateSerializer,
    StandardisationTemplateViewSerializer,
    TeamMemberCreateSerializer,
    TeamMemberDetailsSerializer,
    TeamMemberListSerializer,
    TeamMemberUpdateSerializer,
    UsageUpdatePolicySerializer,
    UserOrganizationCreateSerializer,
    UserOrganizationMapSerializer,
)
from participant.models import SupportTicket
from participant.serializers import (
    ParticipantSupportTicketSerializer,
    TicketSupportSerializer,
)
from utils import custom_exceptions, file_operations, string_functions, validators
from utils.authentication_services import authenticate_user
from utils.embeddings_creation import VectorDBBuilder
from utils.file_operations import (
    check_file_name_length,
    filter_dataframe_for_dashboard_counties,
    generate_fsp_dashboard,
    generate_knfd_dashboard,
    generate_omfp_dashboard,
)
from utils.jwt_services import http_request_mutation
from utils.youtube_helper import get_youtube_url

from .models import (
    Category,
    DatasetSubCategoryMap,
    LangchainPgCollection,
    LangchainPgEmbedding,
    Messages,
    Policy,
    ResourceFile,
    ResourceSubCategoryMap,
    ResourceUsagePolicy,
    SubCategory,
    UsagePolicy,
)
from .serializers import (
    APIBuilderSerializer,
    CategorySerializer,
    CategorySubcategoryInputSerializer,
    FileItemSerializer,
    FileResponseSerializer,
    LangChainEmbeddingsSerializer,
    MessagesChunksRetriveSerializer,
    MessagesRetriveSerializer,
    MessagesSerializer,
    ParticipantCostewardSerializer,
    PolicySerializer,
    ResourceFileSerializer,
    ResourceListSerializer,
    ResourceUsagePolicyDetailSerializer,
    SourceDetailsSerializer,
    SubCategorySerializer,
    UsagePolicyDetailSerializer,
    UsagePolicySerializer,
)

# Replace 'YOUR_API_KEY' with your actual API key
LOGGER = logging.getLogger(__name__)
con = None


class DefaultPagination(pagination.PageNumberPagination):
    """
    Configure Pagination
    """

    page_size = 5


class TeamMemberViewSet(GenericViewSet):
    """Viewset for Product model"""

    serializer_class = TeamMemberListSerializer
    queryset = User.objects.all()
    pagination_class = CustomPagination

    def create(self, request, *args, **kwargs):
        """POST method: create action to save an object by sending a POST request"""
        try:
            serializer = TeamMemberCreateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request, *args, **kwargs):
        """GET method: query all the list of objects from the Product model"""
        # queryset = self.filter_queryset(self.get_queryset())
        queryset = User.objects.filter(Q(status=True) & (Q(role__id=2) | Q(role__id=5)))
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk):
        """GET method: retrieve an object or instance of the Product model"""
        team_member = self.get_object()
        serializer = TeamMemberDetailsSerializer(team_member)
        # serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        """PUT method: update or send a PUT request on an object of the Product model"""
        try:
            instance = self.get_object()
            # request.data["role"] = UserRole.objects.get(role_name=request.data["role"]).id
            serializer = TeamMemberUpdateSerializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, pk):
        """DELETE method: delete an object"""
        team_member = self.get_object()
        team_member.status = False
        # team_member.delete()
        team_member.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrganizationViewSet(GenericViewSet):
    """
    Organisation Viewset.
    """

    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()
    pagination_class = CustomPagination
    parser_class = MultiPartParser

    def perform_create(self, serializer):
        """
        This function performs the create operation of requested serializer.
        Args:
            serializer (_type_): serializer class object.

        Returns:
            _type_: Returns the saved details.
        """
        return serializer.save()

    def create(self, request, *args, **kwargs):
        """POST method: create action to save an organization object using User ID (IMPORTANT: Using USER ID instead of Organization ID)"""
        try:
            user_obj = User.objects.get(id=request.data.get(Constants.USER_ID))
            user_org_queryset = UserOrganizationMap.objects.filter(user_id=request.data.get(Constants.USER_ID)).first()
            if user_org_queryset:
                return Response(
                    {"message": ["User is already associated with an organization"]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                with transaction.atomic():
                    # create organization and userorganizationmap object
                    print("Creating org & user_org_map")
                    OrganizationSerializerValidator.validate_website(request.data)
                    org_serializer = OrganizationSerializer(data=request.data, partial=True)
                    org_serializer.is_valid(raise_exception=True)
                    org_queryset = self.perform_create(org_serializer)

                    user_org_serializer = UserOrganizationMapSerializer(
                        data={
                            Constants.USER: user_obj.id,
                            Constants.ORGANIZATION: org_queryset.id,
                        }  # type: ignore
                    )
                    user_org_serializer.is_valid(raise_exception=True)
                    self.perform_create(user_org_serializer)
                    data = {
                        "user_map": user_org_serializer.data.get("id"),
                        "org_id": org_queryset.id,
                        "organization": org_serializer.data,
                    }
                    return Response(data, status=status.HTTP_201_CREATED)
                
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request, *args, **kwargs):
        """GET method: query the list of Organization objects"""
        try:
            user_org_queryset = (
                UserOrganizationMap.objects.select_related(Constants.USER, Constants.ORGANIZATION)
                .filter(organization__status=True)
                .all()
            )
            page = self.paginate_queryset(user_org_queryset)
            user_organization_serializer = ParticipantSerializer(page, many=True)
            return self.get_paginated_response(user_organization_serializer.data)
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response(str(error), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk):
        """GET method: retrieve an object of Organization using User ID of the User (IMPORTANT: Using USER ID instead of Organization ID)"""
        try:
            user_obj = User.objects.get(id=pk, status=True)
            user_org_queryset = UserOrganizationMap.objects.prefetch_related(
                Constants.USER, Constants.ORGANIZATION
            ).filter(user=pk)

            if not user_org_queryset:
                data = {Constants.USER: {"id": user_obj.id}, Constants.ORGANIZATION: "null"}
                return Response(data, status=status.HTTP_200_OK)

            org_obj = Organization.objects.get(id=user_org_queryset.first().organization_id)
            user_org_serializer = OrganizationSerializer(org_obj)
            data = {
                Constants.USER: {"id": user_obj.id},
                Constants.ORGANIZATION: user_org_serializer.data,
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response(str(error), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk):
        """PUT method: update or PUT request for Organization using User ID of the User (IMPORTANT: Using USER ID instead of Organization ID)"""
        user_obj = User.objects.get(id=pk, status=True)
        user_org_queryset = (
            UserOrganizationMap.objects.prefetch_related(Constants.USER, Constants.ORGANIZATION).filter(user=pk).all()
        )

        if not user_org_queryset:
            return Response({}, status=status.HTTP_404_NOT_FOUND)  # 310-360 not covered 4
        OrganizationSerializerValidator.validate_website(request.data)
        organization_serializer = OrganizationSerializer(
            Organization.objects.get(id=user_org_queryset.first().organization_id),
            data=request.data,
            partial=True,
        )
        try:
            organization_serializer.is_valid(raise_exception=True)
            self.perform_create(organization_serializer)
            data = {
                Constants.USER: {"id": pk},
                Constants.ORGANIZATION: organization_serializer.data,
                "user_map": user_org_queryset.first().id,
                "org_id": user_org_queryset.first().organization_id,
            }
            return Response(
                data,
                status=status.HTTP_201_CREATED,
            )
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, pk):
        """DELETE method: delete an object"""
        try:
            user_obj = User.objects.get(id=pk, status=True)
            user_org_queryset = UserOrganizationMap.objects.select_related(Constants.ORGANIZATION).get(user_id=pk)
            org_queryset = Organization.objects.get(id=user_org_queryset.organization_id)
            org_queryset.status = False
            self.perform_create(org_queryset)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response(str(error), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ParticipantViewSet(GenericViewSet):
    """
    This class handles the participant CRUD operations.
    """

    parser_class = JSONParser
    serializer_class = UserCreateSerializer
    queryset = User.objects.all()
    pagination_class = CustomPagination

    def perform_create(self, serializer):
        """
        This function performs the create operation of requested serializer.
        Args:
            serializer (_type_): serializer class object.

        Returns:
            _type_: Returns the saved details.
        """
        return serializer.save()
    def generate_random_password(self, length=12):
        """Generates a random password with the given length."""
        characters = string.ascii_letters + string.digits + string.punctuation
        return ''.join(random.choice(characters) for _ in range(length))
    
    @authenticate_user(model=Organization)
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """POST method: create action to save an object by sending a POST request"""
        OrganizationSerializerValidator.validate_website(request.data)
        org_serializer = OrganizationSerializer(data=request.data, partial=True)
        org_serializer.is_valid(raise_exception=True)
        org_queryset = self.perform_create(org_serializer)
        org_id = org_queryset.id
        data=request.data.copy()
        UserCreateSerializerValidator.validate_phone_number_format(request.data)
        generated_password = self.generate_random_password()
        hashed_password = make_password(generated_password)

        # Add the hashed password to the request data
        data.update({'password': hashed_password})

        user_serializer = UserCreateSerializer(data=data)
        user_serializer.is_valid(raise_exception=True)
        user_saved = self.perform_create(user_serializer)
        user_org_serializer = UserOrganizationMapSerializer(
            data={
                Constants.USER: user_saved.id,
                Constants.ORGANIZATION: org_id,
            }  # type: ignore
        )
        user_org_serializer.is_valid(raise_exception=True)
        self.perform_create(user_org_serializer)
        try:
            if user_saved.on_boarded_by:
                # datahub_admin = User.objects.filter(id=user_saved.on_boarded_by).first()
                admin_full_name = string_functions.get_full_name(
                    user_saved.on_boarded_by.first_name,
                    user_saved.on_boarded_by.last_name,
                )
            else:
                datahub_admin = User.objects.filter(role_id=1).first()
                admin_full_name = string_functions.get_full_name(datahub_admin.first_name, datahub_admin.last_name)
            participant_full_name = string_functions.get_full_name(
                request.data.get("first_name"), request.data.get("last_name")
            )
            data = {
                Constants.datahub_name: os.environ.get(Constants.DATAHUB_NAME, Constants.datahub_name),
                "as_user": "Co-Steward" if user_saved.role == 6 else "Participant",
                "participant_admin_name": participant_full_name,
                "participant_organization_name": request.data.get("name"),
                "datahub_admin": admin_full_name,
                "password": generated_password,
                Constants.datahub_site: os.environ.get(Constants.DATAHUB_SITE, Constants.datahub_site),
            }

            email_render = render(request, Constants.WHEN_DATAHUB_ADMIN_ADDS_PARTICIPANT, data)
            mail_body = email_render.content.decode("utf-8")
            Utils().send_email(
                to_email=request.data.get("email"),
                content=mail_body,
                subject=Constants.PARTICIPANT_ORG_ADDITION_SUBJECT
                        + os.environ.get(Constants.DATAHUB_NAME, Constants.datahub_name),
            )
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(user_org_serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        """GET method: query all the list of objects from the Product model"""
        on_boarded_by = request.GET.get("on_boarded_by", None)
        co_steward = request.GET.get("co_steward", False)
        approval_status = request.GET.get(Constants.APPROVAL_STATUS, True)
        name = request.GET.get(Constants.NAME, "")
        filter = {Constants.ORGANIZATION_NAME_ICONTAINS: name} if name else {}
        if on_boarded_by:
            roles = (
                UserOrganizationMap.objects.select_related(Constants.USER, Constants.ORGANIZATION)
                .filter(
                    user__status=True,
                    user__on_boarded_by=on_boarded_by,
                    user__role=3,
                    user__approval_status=approval_status,
                    **filter,
                )
                .order_by("-user__updated_at")
                .all()
            )
        elif co_steward:
            roles = (
                UserOrganizationMap.objects.select_related(Constants.USER, Constants.ORGANIZATION)
                .filter(user__status=True, user__role=6, **filter)
                .order_by("-user__updated_at")
                .all()
            )
            page = self.paginate_queryset(roles)
            participant_serializer = ParticipantCostewardSerializer(page, many=True)
            return self.get_paginated_response(participant_serializer.data)
        else:
            roles = (
                UserOrganizationMap.objects.select_related(Constants.USER, Constants.ORGANIZATION)
                .filter(
                    user__status=True,
                    user__role=3,
                    user__on_boarded_by=None,
                    user__approval_status=approval_status,
                    **filter,
                )
                .order_by("-user__updated_at")
                .all()
            )

        page = self.paginate_queryset(roles)
        participant_serializer = ParticipantSerializer(page, many=True)
        return self.get_paginated_response(participant_serializer.data)

    def retrieve(self, request, pk):
        """GET method: retrieve an object or instance of the Product model"""
        roles = (
            UserOrganizationMap.objects.prefetch_related(Constants.USER, Constants.ORGANIZATION)
            .filter(user__status=True, user=pk)
            .first()
        )

        participant_serializer = ParticipantSerializer(roles, many=False)
        if participant_serializer.data:
            return Response(participant_serializer.data, status=status.HTTP_200_OK)
        return Response([], status=status.HTTP_200_OK)

    @authenticate_user(model=Organization)
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """PUT method: update or send a PUT request on an object of the Product model"""
        try:
            participant = self.get_object()
            user_serializer = self.get_serializer(participant, data=request.data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            organization = Organization.objects.get(id=request.data.get(Constants.ID))
            OrganizationSerializerValidator.validate_website(request.data)
            organization_serializer = OrganizationSerializer(organization, data=request.data, partial=True)
            organization_serializer.is_valid(raise_exception=True)
            user_data = self.perform_create(user_serializer)
            self.perform_create(organization_serializer)

            if user_data.on_boarded_by:
                admin_full_name = string_functions.get_full_name(user_data.first_name, user_data.last_name)
            else:
                datahub_admin = User.objects.filter(role_id=1).first()
                admin_full_name = string_functions.get_full_name(datahub_admin.first_name, datahub_admin.last_name)
            participant_full_name = string_functions.get_full_name(participant.first_name, participant.last_name)

            data = {
                Constants.datahub_name: os.environ.get(Constants.DATAHUB_NAME, Constants.datahub_name),
                "participant_admin_name": participant_full_name,
                "participant_organization_name": organization.name,
                "datahub_admin": admin_full_name,
                Constants.datahub_site: os.environ.get(Constants.DATAHUB_SITE, Constants.datahub_site),
            }

            # update data & trigger_email
            email_render = render(request, Constants.DATAHUB_ADMIN_UPDATES_PARTICIPANT_ORGANIZATION, data)
            mail_body = email_render.content.decode("utf-8")
            Utils().send_email(
                to_email=participant.email,
                content=mail_body,
                subject=Constants.PARTICIPANT_ORG_UPDATION_SUBJECT
                        + os.environ.get(Constants.DATAHUB_NAME, Constants.datahub_name),
            )

            data = {
                Constants.USER: user_serializer.data,
                Constants.ORGANIZATION: organization_serializer.data,
            }
            return Response(data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    @authenticate_user(model=Organization)
    def destroy(self, request, pk):
        """DELETE method: delete an object"""
        participant = self.get_object()
        user_organization = (
            UserOrganizationMap.objects.select_related(Constants.ORGANIZATION).filter(user_id=pk).first()
        )
        organization = Organization.objects.get(id=user_organization.organization_id)
        if participant.status:
            participant.status = False
            try:
                if participant.on_boarded_by:
                    datahub_admin = participant.on_boarded_by
                else:
                    datahub_admin = User.objects.filter(role_id=1).first()
                admin_full_name = string_functions.get_full_name(datahub_admin.first_name, datahub_admin.last_name)
                participant_full_name = string_functions.get_full_name(participant.first_name, participant.last_name)

                data = {
                    Constants.datahub_name: os.environ.get(Constants.DATAHUB_NAME, Constants.datahub_name),
                    "participant_admin_name": participant_full_name,
                    "participant_organization_name": organization.name,
                    "datahub_admin": admin_full_name,
                    Constants.datahub_site: os.environ.get(Constants.DATAHUB_SITE, Constants.datahub_site),
                }

                # delete data & trigger_email
                self.perform_create(participant)
                email_render = render(
                    request,
                    Constants.DATAHUB_ADMIN_DELETES_PARTICIPANT_ORGANIZATION,
                    data,
                )
                mail_body = email_render.content.decode("utf-8")
                Utils().send_email(
                    to_email=participant.email,
                    content=mail_body,
                    subject=Constants.PARTICIPANT_ORG_DELETION_SUBJECT
                            + os.environ.get(Constants.DATAHUB_NAME, Constants.datahub_name),
                )

                # Set the on_boarded_by_id to null if co_steward is deleted
                User.objects.filter(on_boarded_by=pk).update(on_boarded_by=None)

                return Response(
                    {"message": ["Participant deleted"]},
                    status=status.HTTP_204_NO_CONTENT,
                )
            except Exception as error:
                LOGGER.error(error, exc_info=True)
                return Response({"message": ["Internal server error"]}, status=500)

        elif participant.status is False:
            return Response(
                {"message": ["participant/co-steward already deleted"]},
                status=status.HTTP_204_NO_CONTENT,
            )

        return Response({"message": ["Internal server error"]}, status=500)

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def get_list_co_steward(self, request, *args, **kwargs):
        try:
            users = (
                User.objects.filter(role__id=6, status=True)
                .values("id", "userorganizationmap__organization__name")
                .distinct("userorganizationmap__organization__name")
            )

            data = [
                {
                    "user": user["id"],
                    "organization_name": user["userorganizationmap__organization__name"],
                }
                for user in users
            ]
            return Response(data, status=200)
        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response({"message": str(e)}, status=500)


class MailInvitationViewSet(GenericViewSet):
    """
    This class handles the mail invitation API views.
    """

    def create(self, request, *args, **kwargs):
        """
        This will send the mail to the requested user with content.
        Args:
            request (_type_): Api request object.

        Returns:
            _type_: Retuns the sucess response with message and status code.
        """
        try:
            email_list = request.data.get("to_email")
            emails_found, emails_not_found = ([] for i in range(2))
            # for email in email_list:
            #     if User.objects.filter(email=email):
            #         emails_found.append(email)
            #     else:
            #         emails_not_found.append(email)
            user = User.objects.filter(role_id=1).first()
            full_name = user.first_name + " " + str(user.last_name) if user.last_name else user.first_name
            data = {
                "datahub_name": os.environ.get("DATAHUB_NAME", "datahub_name"),
                "participant_admin_name": full_name,
                "datahub_site": os.environ.get("DATAHUB_SITE", "datahub_site"),
            }
            # render email from query_email template
            for email in email_list:
                try:
                    email_render = render(request, "datahub_admin_invites_participants.html", data)
                    mail_body = email_render.content.decode("utf-8")
                    Utils().send_email(
                        to_email=[email],
                        content=mail_body,
                        subject=os.environ.get("DATAHUB_NAME", "datahub_name")
                                + Constants.PARTICIPANT_INVITATION_SUBJECT,
                    )
                    emails_found.append(email)
                except Exception as e:
                    emails_not_found.append()
            failed = f"No able to send emails to this emails: {emails_not_found}"
            LOGGER.warning(failed)
            return Response(
                {
                    "message": f"Email successfully sent to {emails_found}",
                    "failed": failed,
                },
                status=status.HTTP_200_OK,
            )
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response(
                {"Error": f"Failed to send email"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )  # type: ignore


class DropDocumentView(GenericViewSet):
    """View for uploading organization document files"""

    parser_class = MultiPartParser
    serializer_class = DropDocumentSerializer

    def create(self, request, *args, **kwargs):
        """Saves the document files in temp location before saving"""
        serializer = self.get_serializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        try:
            # get file, file name & type from the form-data
            key = list(request.data.keys())[0]
            file = serializer.validated_data[key]
            file_type = str(file).split(".")[-1]
            file_name = str(key) + "." + file_type
            file_operations.remove_files(file_name, settings.TEMP_FILE_PATH)
            file_operations.file_save(file, file_name, settings.TEMP_FILE_PATH)
            return Response(
                {key: [f"{file_name} uploading in progress ..."]},
                status=status.HTTP_201_CREATED,
            )
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            LOGGER.error(error, exc_info=True)

        return Response({}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["delete"])
    def delete(self, request):
        """remove the dropped documents"""
        try:
            key = list(request.data.keys())[0]
            file_operations.remove_files(key, settings.TEMP_FILE_PATH)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        except Exception as error:
            LOGGER.error(error, exc_info=True)

        return Response({}, status=status.HTTP_400_BAD_REQUEST)


class DocumentSaveView(GenericViewSet):
    """View for uploading all the datahub documents and content"""

    serializer_class = PolicyDocumentSerializer
    queryset = DatahubDocuments.objects.all()

    @action(detail=False, methods=["get"])
    def get(self, request):
        """GET method: retrieve an object or instance of the Product model"""
        try:
            file_paths = file_operations.file_path(settings.DOCUMENTS_URL)
            datahub_obj = DatahubDocuments.objects.last()
            content = {
                Constants.GOVERNING_LAW: datahub_obj.governing_law if datahub_obj else None,
                Constants.PRIVACY_POLICY: datahub_obj.privacy_policy if datahub_obj else None,
                Constants.TOS: datahub_obj.tos if datahub_obj else None,
                Constants.LIMITATIONS_OF_LIABILITIES: datahub_obj.limitations_of_liabilities if datahub_obj else None,
                Constants.WARRANTY: datahub_obj.warranty if datahub_obj else None,
            }

            documents = {
                Constants.GOVERNING_LAW: file_paths.get("governing_law"),
                Constants.PRIVACY_POLICY: file_paths.get("privacy_policy"),
                Constants.TOS: file_paths.get("tos"),
                Constants.LIMITATIONS_OF_LIABILITIES: file_paths.get("limitations_of_liabilities"),
                Constants.WARRANTY: file_paths.get("warranty"),
            }
            if not datahub_obj and not file_paths:
                data = {"content": content, "documents": documents}
                return Response(data, status=status.HTTP_200_OK)
            elif not datahub_obj:
                data = {"content": content, "documents": documents}
                return Response(data, status=status.HTTP_200_OK)
            elif datahub_obj and not file_paths:
                data = {"content": content, "documents": documents}
                return Response(data, status=status.HTTP_200_OK)
            elif datahub_obj and file_paths:
                data = {"content": content, "documents": documents}
                return Response(data, status=status.HTTP_200_OK)

        except Exception as error:
            LOGGER.error(error, exc_info=True)

        return Response({}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

            with transaction.atomic():
                serializer.save()
                # save the document files
                file_operations.create_directory(settings.DOCUMENTS_ROOT, [])
                file_operations.files_move(settings.TEMP_FILE_PATH, settings.DOCUMENTS_ROOT)
                return Response(
                    {"message": "Documents and content saved!"},
                    status=status.HTTP_201_CREATED,
                )
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            LOGGER.error(error, exc_info=True)

        return Response({}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def put(self, request, *args, **kwargs):
        """Saves the document content and files"""
        try:
            # instance = self.get_object()
            datahub_obj = DatahubDocuments.objects.last()
            serializer = self.get_serializer(datahub_obj, data=request.data)
            serializer.is_valid(raise_exception=True)

            with transaction.atomic():
                serializer.save()
                file_operations.create_directory(settings.DOCUMENTS_ROOT, [])
                file_operations.files_move(settings.TEMP_FILE_PATH, settings.DOCUMENTS_ROOT)
                return Response(
                    {"message": "Documents and content updated!"},
                    status=status.HTTP_201_CREATED,
                )
        except Exception as error:
            LOGGER.error(error, exc_info=True)

        return Response({}, status=status.HTTP_400_BAD_REQUEST)


class DatahubThemeView(GenericViewSet):
    """View for modifying datahub branding"""

    parser_class = MultiPartParser
    serializer_class = DatahubThemeSerializer

    def create(self, request, *args, **kwargs):
        """generates the override css for datahub"""
        # user = User.objects.filter(email=request.data.get("email", ""))
        # user = user.first()
        data = {}

        try:
            banner = request.data.get("banner", "null")
            banner = None if banner == "null" else banner
            button_color = request.data.get("button_color", "null")
            button_color = None if button_color == "null" else button_color
            if not banner and not button_color:
                data = {"banner": "null", "button_color": "null"}
            elif banner and not button_color:
                file_name = file_operations.file_rename(str(banner), "banner")
                shutil.rmtree(settings.THEME_ROOT)
                os.mkdir(settings.THEME_ROOT)
                os.makedirs(settings.CSS_ROOT)
                file_operations.file_save(banner, file_name, settings.THEME_ROOT)
                data = {"banner": file_name, "button_color": "null"}

            elif not banner and button_color:
                css = ".btn { background-color: " + button_color + "; }"
                file_operations.remove_files(file_name, settings.THEME_ROOT)
                file_operations.file_save(
                    ContentFile(css),
                    settings.CSS_FILE_NAME,
                    settings.CSS_ROOT,
                )
                data = {"banner": "null", "button_color": settings.CSS_FILE_NAME}

            elif banner and button_color:
                shutil.rmtree(settings.THEME_ROOT)
                os.mkdir(settings.THEME_ROOT)
                os.makedirs(settings.CSS_ROOT)
                file_name = file_operations.file_rename(str(banner), "banner")
                file_operations.remove_files(file_name, settings.THEME_ROOT)
                file_operations.file_save(banner, file_name, settings.THEME_ROOT)

                css = ".btn { background-color: " + button_color + "; }"
                file_operations.remove_files(file_name, settings.THEME_ROOT)
                file_operations.file_save(
                    ContentFile(css),
                    settings.CSS_FILE_NAME,
                    settings.CSS_ROOT,
                )
                data = {"banner": file_name, "button_color": settings.CSS_FILE_NAME}

            # set datahub admin user status to True
            # user.on_boarded = True
            # user.save()
            return Response(data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            LOGGER.error(error, exc_info=True)

        return Response({}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def get(self, request):
        """retrieves Datahub Theme attributes"""
        file_paths = file_operations.file_path(settings.THEME_URL)
        # css_path = file_operations.file_path(settings.CSS_ROOT)
        css_path = settings.CSS_ROOT + settings.CSS_FILE_NAME
        data = {}

        try:
            css_attribute = file_operations.get_css_attributes(css_path, "background-color")

            if not css_path and not file_paths:
                data = {"banner": "null", "css": "null"}
            elif not css_path:
                data = {"banner": file_paths, "css": "null"}
            elif css_path and not file_paths:
                data = {"banner": "null", "css": {"btnBackground": css_attribute}}
            elif css_path and file_paths:
                data = {"banner": file_paths, "css": {"btnBackground": css_attribute}}

            return Response(data, status=status.HTTP_200_OK)

        except Exception as error:
            LOGGER.error(error, exc_info=True)

        return Response({}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False)
    def put(self, request, *args, **kwargs):
        data = {}
        try:
            banner = request.data.get("banner", "null")
            banner = None if banner == "null" else banner
            button_color = request.data.get("button_color", "null")
            button_color = None if button_color == "null" else button_color

            if banner is None and button_color is None:
                data = {"banner": "null", "button_color": "null"}

            elif banner and button_color is None:
                shutil.rmtree(settings.THEME_ROOT)
                os.mkdir(settings.THEME_ROOT)
                os.makedirs(settings.CSS_ROOT)
                file_name = file_operations.file_rename(str(banner), "banner")
                # file_operations.remove_files(file_name, settings.THEME_ROOT)
                file_operations.file_save(banner, file_name, settings.THEME_ROOT)
                data = {"banner": file_name, "button_color": "null"}

            elif not banner and button_color:
                css = ".btn { background-color: " + button_color + "; }"
                file_operations.remove_files(settings.CSS_FILE_NAME, settings.CSS_ROOT)
                file_operations.file_save(
                    ContentFile(css),
                    settings.CSS_FILE_NAME,
                    settings.CSS_ROOT,
                )
                data = {"banner": "null", "button_color": settings.CSS_FILE_NAME}

            elif banner and button_color:
                shutil.rmtree(settings.THEME_ROOT)
                os.mkdir(settings.THEME_ROOT)
                os.makedirs(settings.CSS_ROOT)
                file_name = file_operations.file_rename(str(banner), "banner")
                # file_operations.remove_files(file_name, settings.THEME_ROOT)
                file_operations.file_save(banner, file_name, settings.THEME_ROOT)

                css = ".btn { background-color: " + button_color + "; }"
                file_operations.remove_files(settings.CSS_FILE_NAME, settings.CSS_ROOT)
                file_operations.file_save(
                    ContentFile(css),
                    settings.CSS_FILE_NAME,
                    settings.CSS_ROOT,
                )
                data = {"banner": file_name, "button_color": settings.CSS_FILE_NAME}

            return Response(data, status=status.HTTP_201_CREATED)

        except exceptions as error:
            LOGGER.error(error, exc_info=True)

        return Response({}, status=status.HTTP_400_BAD_REQUEST)


class SupportViewSet(GenericViewSet):
    """
    This class handles the participant support tickets CRUD operations.
    """

    parser_class = JSONParser
    serializer_class = TicketSupportSerializer
    queryset = SupportTicket
    pagination_class = CustomPagination

    def perform_create(self, serializer):
        """
        This function performs the create operation of requested serializer.
        Args:
            serializer (_type_): serializer class object.

        Returns:
            _type_: Returns the saved details.
        """
        return serializer.save()

    def create(self, request, *args, **kwargs):
        """POST method: create action to save an object by sending a POST request"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["post"])
    def filters_tickets(self, request, *args, **kwargs):
        """This function get the filter args in body. based on the filter args orm filters the data."""
        try:
            data = (
                SupportTicket.objects.select_related(
                    Constants.USER_MAP,
                    Constants.USER_MAP_USER,
                    Constants.USER_MAP_ORGANIZATION,
                )
                .filter(user_map__user__status=True, **request.data)
                .order_by(Constants.UPDATED_AT)
                .reverse()
                .all()
            )
        except django.core.exceptions.FieldError as error:  # type: ignore
            LOGGER.error(f"Error while filtering the ticketd ERROR: {error}")
            return Response(f"Invalid filter fields: {list(request.data.keys())}", status=400)

        page = self.paginate_queryset(data)
        participant_serializer = ParticipantSupportTicketSerializer(page, many=True)
        return self.get_paginated_response(participant_serializer.data)

    def update(self, request, *args, **kwargs):
        """PUT method: update or send a PUT request on an object of the Product model"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request, *args, **kwargs):
        """GET method: query all the list of objects from the Product model"""
        data = (
            SupportTicket.objects.select_related(
                Constants.USER_MAP,
                Constants.USER_MAP_USER,
                Constants.USER_MAP_ORGANIZATION,
            )
            .filter(user_map__user__status=True, **request.GET)
            .order_by(Constants.UPDATED_AT)
            .reverse()
            .all()
        )
        page = self.paginate_queryset(data)
        participant_serializer = ParticipantSupportTicketSerializer(page, many=True)
        return self.get_paginated_response(participant_serializer.data)

    def retrieve(self, request, pk):
        """GET method: retrieve an object or instance of the Product model"""
        data = (
            SupportTicket.objects.select_related(
                Constants.USER_MAP,
                Constants.USER_MAP_USER,
                Constants.USER_MAP_ORGANIZATION,
            )
            .filter(user_map__user__status=True, id=pk)
            .all()
        )
        participant_serializer = ParticipantSupportTicketSerializer(data, many=True)
        if participant_serializer.data:
            return Response(participant_serializer.data[0], status=status.HTTP_200_OK)
        return Response([], status=status.HTTP_200_OK)


class DatahubDatasetsViewSet(GenericViewSet):
    """
    This class handles the participant Datsets CRUD operations.
    """

    parser_class = JSONParser
    serializer_class = DatasetSerializer
    queryset = Datasets
    pagination_class = CustomPagination

    def perform_create(self, serializer):
        """
        This function performs the create operation of requested serializer.
        Args:
            serializer (_type_): serializer class object.

        Returns:
            _type_: Returns the saved details.
        """
        return serializer.save()

    def trigger_email(self, request, template, to_email, subject, first_name, last_name, dataset_name):
        # trigger email to the participant as they are being added
        try:
            datahub_admin = User.objects.filter(role_id=1).first()
            admin_full_name = string_functions.get_full_name(datahub_admin.first_name, datahub_admin.last_name)
            participant_full_name = string_functions.get_full_name(first_name, last_name)

            data = {
                "datahub_name": os.environ.get("DATAHUB_NAME", "datahub_name"),
                "participant_admin_name": participant_full_name,
                "datahub_admin": admin_full_name,
                "dataset_name": dataset_name,
                "datahub_site": os.environ.get("DATAHUB_SITE", "datahub_site"),
            }

            email_render = render(request, template, data)
            mail_body = email_render.content.decode("utf-8")
            Utils().send_email(
                to_email=to_email,
                content=mail_body,
                subject=subject + os.environ.get("DATAHUB_NAME", "datahub_name"),
            )

        except Exception as error:
            LOGGER.error(error, exc_info=True)

    def create(self, request, *args, **kwargs):
        """POST method: create action to save an object by sending a POST request"""
        setattr(request.data, "_mutable", True)
        data = request.data

        if not data.get("is_public"):
            if not csv_and_xlsx_file_validatation(request.data.get(Constants.SAMPLE_DATASET)):
                return Response(
                    {
                        Constants.SAMPLE_DATASET: [
                            "Invalid Sample dataset file (or) Atleast 5 rows should be available. please upload valid file"
                        ]
                    },
                    400,
                )
        try:
            data[Constants.APPROVAL_STATUS] = Constants.APPROVED
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @http_request_mutation
    def list(self, request, *args, **kwargs):
        """GET method: query all the list of objects from the Product model"""
        try:
            data = []
            user_id = request.META.get(Constants.USER_ID)
            others = request.data.get(Constants.OTHERS)
            filters = {Constants.USER_MAP_USER: user_id} if user_id and not others else {}
            exclude = {Constants.USER_MAP_USER: user_id} if others else {}
            if exclude or filters:
                data = (
                    Datasets.objects.select_related(
                        Constants.USER_MAP,
                        Constants.USER_MAP_USER,
                        Constants.USER_MAP_ORGANIZATION,
                    )
                    .filter(user_map__user__status=True, status=True, **filters)
                    .exclude(**exclude)
                    .order_by(Constants.UPDATED_AT)
                    .reverse()
                    .all()
                )
            page = self.paginate_queryset(data)
            participant_serializer = DatahubDatasetsSerializer(page, many=True)
            return self.get_paginated_response(participant_serializer.data)
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response(str(error), status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk):
        """GET method: retrieve an object or instance of the Product model"""
        data = (
            Datasets.objects.select_related(
                Constants.USER_MAP,
                Constants.USER_MAP_USER,
                Constants.USER_MAP_ORGANIZATION,
            )
            .filter(user_map__user__status=True, status=True, id=pk)
            .all()
        )
        participant_serializer = DatahubDatasetsSerializer(data, many=True)
        if participant_serializer.data:
            data = participant_serializer.data[0]
            if not data.get("is_public"):
                data[Constants.CONTENT] = read_contents_from_csv_or_xlsx_file(data.get(Constants.SAMPLE_DATASET))
            return Response(data, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        """PUT method: update or send a PUT request on an object of the Product model"""
        setattr(request.data, "_mutable", True)
        data = request.data
        data = {key: value for key, value in data.items() if value != "null"}
        if not data.get("is_public"):
            if data.get(Constants.SAMPLE_DATASET):
                if not csv_and_xlsx_file_validatation(data.get(Constants.SAMPLE_DATASET)):
                    return Response(
                        {
                            Constants.SAMPLE_DATASET: [
                                "Invalid Sample dataset file (or) Atleast 5 rows should be available. please upload valid file"
                            ]
                        },
                        400,
                    )
        category = data.get(Constants.CATEGORY)
        if category:
            data[Constants.CATEGORY] = json.loads(category) if isinstance(category, str) else category
        instance = self.get_object()

        # trigger email to the participant
        user_map_queryset = UserOrganizationMap.objects.select_related(Constants.USER).get(id=instance.user_map_id)
        user_obj = user_map_queryset.user

        # reset the approval status b/c the user modified the dataset after an approval
        if getattr(instance, Constants.APPROVAL_STATUS) == Constants.APPROVED and (
                user_obj.role_id == 3 or user_obj.role_id == 4
        ):
            data[Constants.APPROVAL_STATUS] = Constants.AWAITING_REVIEW

        serializer = DatasetUpdateSerializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        data = request.data

        if data.get(Constants.APPROVAL_STATUS) == Constants.APPROVED:
            self.trigger_email(
                request,
                "datahub_admin_approves_dataset.html",
                user_obj.email,
                Constants.APPROVED_NEW_DATASET_SUBJECT,
                user_obj.first_name,
                user_obj.last_name,
                instance.name,
            )

        elif data.get(Constants.APPROVAL_STATUS) == Constants.REJECTED:
            self.trigger_email(
                request,
                "datahub_admin_rejects_dataset.html",
                user_obj.email,
                Constants.REJECTED_NEW_DATASET_SUBJECT,
                user_obj.first_name,
                user_obj.last_name,
                instance.name,
            )

        elif data.get(Constants.IS_ENABLED) == str(True) or data.get(Constants.IS_ENABLED) == str("true"):
            self.trigger_email(
                request,
                "datahub_admin_enables_dataset.html",
                user_obj.email,
                Constants.ENABLE_DATASET_SUBJECT,
                user_obj.first_name,
                user_obj.last_name,
                instance.name,
            )

        elif data.get(Constants.IS_ENABLED) == str(False) or data.get(Constants.IS_ENABLED) == str("false"):
            self.trigger_email(
                request,
                "datahub_admin_disables_dataset.html",
                user_obj.email,
                Constants.DISABLE_DATASET_SUBJECT,
                user_obj.first_name,
                user_obj.last_name,
                instance.name,
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk):
        """DELETE method: delete an object"""
        dataset = self.get_object()
        dataset.status = False
        self.perform_create(dataset)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["post"])
    def dataset_filters(self, request, *args, **kwargs):
        """This function get the filter args in body. based on the filter args orm filters the data."""
        data = request.data
        org_id = data.pop(Constants.ORG_ID, "")
        others = data.pop(Constants.OTHERS, "")
        user_id = data.pop(Constants.USER_ID, "")
        categories = data.pop(Constants.CATEGORY, None)
        exclude, filters = {}, {}
        if others:
            exclude = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
        else:
            filters = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}

        try:
            if categories is not None:
                data = (
                    Datasets.objects.select_related(
                        Constants.USER_MAP,
                        Constants.USER_MAP_USER,
                        Constants.USER_MAP_ORGANIZATION,
                    )
                    .filter(status=True, **data, **filters)
                    .filter(
                        reduce(
                            operator.or_,
                            (Q(category__contains=cat) for cat in categories),
                        )
                    )
                    .exclude(**exclude)
                    .order_by(Constants.UPDATED_AT)
                    .reverse()
                    .all()
                )

            else:
                data = (
                    Datasets.objects.select_related(
                        Constants.USER_MAP,
                        Constants.USER_MAP_USER,
                        Constants.USER_MAP_ORGANIZATION,
                    )
                    .filter(status=True, **data, **filters)
                    .exclude(**exclude)
                    .order_by(Constants.UPDATED_AT)
                    .reverse()
                    .all()
                )
        except Exception as error:  # type: ignore
            LOGGER.error("Error while filtering the datasets. ERROR: %s", error)
            return Response(f"Invalid filter fields: {list(request.data.keys())}", status=500)

        page = self.paginate_queryset(data)
        participant_serializer = DatahubDatasetsSerializer(page, many=True)
        return self.get_paginated_response(participant_serializer.data)

    @action(detail=False, methods=["post"])
    @http_request_mutation
    def filters_data(self, request, *args, **kwargs):
        """This function provides the filters data"""
        try:
            data = request.data
            org_id = data.pop(Constants.ORG_ID, "")
            others = data.pop(Constants.OTHERS, "")
            user_id = data.pop(Constants.USER_ID, "")

            ####

            org_id = request.META.pop(Constants.ORG_ID, "")
            others = request.META.pop(Constants.OTHERS, "")
            user_id = request.META.pop(Constants.USER_ID, "")

            exclude, filters = {}, {}
            if others:
                exclude = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
                filters = {Constants.APPROVAL_STATUS: Constants.APPROVED}
            else:
                filters = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
            try:
                geography = (
                    Datasets.objects.values_list(Constants.GEOGRAPHY, flat=True)
                    .filter(status=True, **filters)
                    .exclude(geography="null")
                    .exclude(geography__isnull=True)
                    .exclude(geography="")
                    .exclude(**exclude)
                    .all()
                    .distinct()
                )
                crop_detail = (
                    Datasets.objects.values_list(Constants.CROP_DETAIL, flat=True)
                    .filter(status=True, **filters)
                    .exclude(crop_detail="null")
                    .exclude(crop_detail__isnull=True)
                    .exclude(crop_detail="")
                    .exclude(**exclude)
                    .all()
                    .distinct()
                )
                if os.path.exists(Constants.CATEGORIES_FILE):
                    with open(Constants.CATEGORIES_FILE, "r") as json_obj:
                        category_detail = json.loads(json_obj.read())
                else:
                    category_detail = []
            except Exception as error:  # type: ignore
                LOGGER.error("Error while filtering the datasets. ERROR: %s", error)
                return Response(f"Invalid filter fields: {list(request.data.keys())}", status=500)
            return Response(
                {
                    "geography": geography,
                    "crop_detail": crop_detail,
                    "category_detail": category_detail,
                },
                status=200,
            )
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response(str(error), status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    @http_request_mutation
    def search_datasets(self, request, *args, **kwargs):
        data = request.data
        org_id = data.pop(Constants.ORG_ID, "")
        others = data.pop(Constants.OTHERS, "")
        user_id = data.pop(Constants.USER_ID, "")

        org_id = request.META.pop(Constants.ORG_ID, "")
        others = request.META.pop(Constants.OTHERS, "")
        user_id = request.META.pop(Constants.USER_ID, "")

        search_pattern = data.pop(Constants.SEARCH_PATTERNS, "")
        exclude, filters = {}, {}

        if others:
            exclude = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
            filters = {Constants.NAME_ICONTAINS: search_pattern} if search_pattern else {}
        else:
            filters = (
                {
                    Constants.USER_MAP_ORGANIZATION: org_id,
                    Constants.NAME_ICONTAINS: search_pattern,
                }
                if org_id
                else {}
            )
        try:
            data = (
                Datasets.objects.select_related(
                    Constants.USER_MAP,
                    Constants.USER_MAP_USER,
                    Constants.USER_MAP_ORGANIZATION,
                )
                .filter(user_map__user__status=True, status=True, **data, **filters)
                .exclude(**exclude)
                .order_by(Constants.UPDATED_AT)
                .reverse()
                .all()
            )
        except Exception as error:  # type: ignore
            LOGGER.error("Error while filtering the datasets. ERROR: %s", error)
            return Response(
                f"Invalid filter fields: {list(request.data.keys())}",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        page = self.paginate_queryset(data)
        participant_serializer = DatahubDatasetsSerializer(page, many=True)
        return self.get_paginated_response(participant_serializer.data)


class DatahubDashboard(GenericViewSet):
    """Datahub Dashboard viewset"""

    pagination_class = CustomPagination

    @action(detail=False, methods=["get"])
    def dashboard(self, request):
        """Retrieve datahub dashboard details"""
        try:
            # total_participants = User.objects.filter(role_id=3, status=True).count()
            total_participants = (
                UserOrganizationMap.objects.select_related(Constants.USER, Constants.ORGANIZATION)
                .filter(user__role=3, user__status=True, is_temp=False)
                .count()
            )
            total_datasets = (
                DatasetV2.objects.select_related("user_map", "user_map__user", "user_map__organization")
                .filter(user_map__user__status=True, is_temp=False)
                .count()
            )
            # write a function to compute data exchange
            active_connectors = Connectors.objects.filter(status=True).count()
            total_data_exchange = {"total_data": 50, "unit": "Gbs"}

            datasets = Datasets.objects.filter(status=True).values_list("category", flat=True)
            categories = set()
            categories_dict = {}

            for data in datasets:
                if data and type(data) == dict:
                    for element in data.keys():
                        categories.add(element)

            categories_dict = {key: 0 for key in categories}
            for data in datasets:
                if data and type(data) == dict:
                    for key, value in data.items():
                        if value == True:
                            categories_dict[key] += 1

            open_support_tickets = SupportTicket.objects.filter(status="open").count()
            closed_support_tickets = SupportTicket.objects.filter(status="closed").count()
            hold_support_tickets = SupportTicket.objects.filter(status="hold").count()

            # retrieve 3 recent support tickets
            recent_tickets_queryset = SupportTicket.objects.order_by("updated_at")[0:3]
            recent_tickets_serializer = RecentSupportTicketSerializer(recent_tickets_queryset, many=True)
            support_tickets = {
                "open_requests": open_support_tickets,
                "closed_requests": closed_support_tickets,
                "hold_requests": hold_support_tickets,
                "recent_tickets": recent_tickets_serializer.data,
            }

            # retrieve 3 recent updated datasets
            # datasets_queryset = Datasets.objects.order_by("updated_at")[0:3]
            datasets_queryset = Datasets.objects.filter(status=True).order_by("-updated_at").all()
            datasets_queryset_pages = self.paginate_queryset(datasets_queryset)  # paginaged connectors list
            datasets_serializer = RecentDatasetListSerializer(datasets_queryset_pages, many=True)

            data = {
                "total_participants": total_participants,
                "total_datasets": total_datasets,
                "active_connectors": active_connectors,
                "total_data_exchange": total_data_exchange,
                "categories": categories_dict,
                "support_tickets": support_tickets,
                "datasets": self.get_paginated_response(datasets_serializer.data).data,
            }
            return Response(data, status=status.HTTP_200_OK)

        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DatasetV2ViewSet(GenericViewSet):
    """
    ViewSet for DatasetV2 model for create, update, detail/list view, & delete endpoints.

    **Context**
    ``DatasetV2``
        An instance of :model:`datahub_datasetv2`

    **Serializer**
    ``DatasetV2Serializer``
        :serializer:`datahub.serializer.DatasetV2Serializer`

    **Authorization**
        ``ROLE`` only authenticated users/participants with following roles are allowed to make a POST request to this endpoint.
            :role: `datahub_admin` (:role_id: `1`)
            :role: `datahub_participant_root` (:role_id: `3`)
    """

    serializer_class = DatasetV2Serializer
    queryset = DatasetV2.objects.prefetch_related('dataset_cat_map',  'dataset_cat_map__sub_category', 'dataset_cat_map__sub_category__category').all()
    pagination_class = CustomPagination

    @action(detail=False, methods=["post"])
    def validate_dataset(self, request, *args, **kwargs):
        """
        ``POST`` method Endpoint: POST method to check the validation of dataset name and dataset description. [see here][ref]

        **Endpoint**
        [ref]: /datahub/dataset/v2/dataset_validation/
        """
        serializer = DatasetV2Validation(
            data=request.data,
            context={
                "request_method": request.method,
                "dataset_exists": request.query_params.get("dataset_exists"),
                "queryset": self.queryset,
            },
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post", "delete"])
    def temp_datasets(self, request, *args, **kwargs):
        """
        ``POST`` method Endpoint: POST method to save the datasets in a temporary location with
            under a newly created dataset name & source_file directory.
        ``DELETE`` method Endpoint: DELETE method to delete the dataset named directory containing
            the datasets. [see here][ref]

        **Endpoint**
        [ref]: /datahub/dataset/v2/temp_datasets/
        """
        try:
            files = request.FILES.getlist("datasets")

            if request.method == "POST":
                """Create a temporary directory containing dataset files uploaded as source.
                ``Example:``
                    Create below directories with dataset files uploaded
                    /temp/<dataset-name>/file/<files>
                """
                # serializer = DatasetV2TempFileSerializer(data=request.data, context={"request_method": request.method})
                serializer = DatasetV2TempFileSerializer(
                    data=request.data,
                    context={
                        "request_method": request.method,
                        "dataset_exists": request.query_params.get("dataset_exists"),
                        "queryset": self.queryset,
                    },
                )
                if not serializer.is_valid():
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                directory_created = file_operations.create_directory(
                    settings.TEMP_DATASET_URL,
                    [
                        serializer.data.get("dataset_name"),
                        serializer.data.get("source"),
                    ],
                )

                files_saved = []
                for file in files:
                    file_operations.file_save(file, file.name, directory_created)
                    files_saved.append(file.name)

                data = {"datasets": files_saved}
                data.update(serializer.data)
                return Response(data, status=status.HTTP_201_CREATED)

            elif request.method == "DELETE":
                """
                Delete the temporary directory containing datasets created by the POST endpoint
                with the dataset files uploaded as source.
                ``Example:``
                    Delete the below directory:
                    /temp/<dataset-name>/
                """
                serializer = DatasetV2TempFileSerializer(
                    data=request.data,
                    context={
                        "request_method": request.method,
                        "query_params": request.query_params.get("delete_dir"),
                    },
                )

                if not serializer.is_valid():
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                directory = string_functions.format_dir_name(
                    settings.TEMP_DATASET_URL, [request.data.get("dataset_name")]
                )

                """Delete directory temp directory as requested"""
                if request.query_params.get("delete_dir") and os.path.exists(directory):
                    shutil.rmtree(directory)
                    LOGGER.info(f"Deleting directory: {directory}")
                    data = {request.data.get("dataset_name"): "Dataset not created"}
                    return Response(data, status=status.HTTP_204_NO_CONTENT)

                elif not request.query_params.get("delete_dir"):
                    """Delete a single file as requested"""
                    file_name = request.data.get("file_name")
                    file_path = os.path.join(directory, request.data.get("source"), file_name)
                    if os.path.exists(file_path):
                        os.remove(file_path)
                        LOGGER.info(f"Deleting file: {file_name}")
                        data = {file_name: "File deleted"}
                        return Response(data, status=status.HTTP_204_NO_CONTENT)

                return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as error:
            LOGGER.error(error, exc_info=True)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["get"])
    def get_dataset_files(self, request, *args, **kwargs):
        """
        Get list of dataset files from temporary location.
        """
        try:
            # files_list = file_operations.get_csv_or_xls_files_from_directory(settings.TEMP_DATASET_URL + request.query_params.get(Constants.DATASET_NAME))
            dataset = request.data.get("dataset")
            queryset = DatasetV2File.objects.filter(dataset=dataset)
            serializer = DatasetFileV2NewSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response(f"No such dataset created {error}", status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    def get_dataset_file_columns(self, request, *args, **kwargs):
        """
        To retrieve the list of columns of a dataset file from temporary location
        """
        try:
            dataset_file = DatasetV2File.objects.get(id=request.data.get("id"))
            file_path = str(dataset_file.file)
            if file_path.endswith(".xlsx") or file_path.endswith(".xls"):
                df = pd.read_excel(os.path.join(settings.DATASET_FILES_URL, file_path), index_col=None, nrows=1)
            else:
                df = pd.read_csv(os.path.join(settings.DATASET_FILES_URL, file_path), index_col=False, nrows=1)
            df.columns = df.columns.astype(str)
            result = df.columns.tolist()
            return Response(result, status=status.HTTP_200_OK)
        except Exception as error:
            LOGGER.error(f"Cannot get the columns of the selected file: {error}")
            return Response(
                f"Cannot get the columns of the selected file: {error}",
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["post"])
    def standardise(self, request, *args, **kwargs):
        """
        Method to standardise a dataset and generate a file along with it.
        """

        # 1. Take the standardisation configuration variables.
        try:
            standardisation_configuration = request.data.get("standardisation_configuration")
            mask_columns = request.data.get("mask_columns")
            file_path = request.data.get("file_path")
            is_standardised = request.data.get("is_standardised", None)

            if is_standardised:
                file_path = file_path.replace("/standardised", "/datasets")

            if file_path.endswith(".xlsx") or file_path.endswith(".xls"):
                df = pd.read_excel(os.path.join(settings.DATASET_FILES_URL, file_path), index_col=None)
            else:
                df = pd.read_csv(os.path.join(settings.DATASET_FILES_URL, file_path), index_col=False)

            df["status"] = True
            df.loc[df["status"] == True, mask_columns] = "######"
            # df[mask_columns] = df[mask_columns].mask(True)
            del df["status"]
            # print()
            df.rename(columns=standardisation_configuration, inplace=True)
            df.columns = df.columns.astype(str)
            file_dir = file_path.split("/")
            standardised_dir_path = "/".join(file_dir[-3:-1])
            file_name = file_dir[-1]
            if not os.path.exists(os.path.join(settings.TEMP_STANDARDISED_DIR, standardised_dir_path)):
                os.makedirs(os.path.join(settings.TEMP_STANDARDISED_DIR, standardised_dir_path))
            # print(df)
            if file_name.endswith(".csv"):
                df.to_csv(
                    os.path.join(settings.TEMP_STANDARDISED_DIR, standardised_dir_path, file_name)
                )  # type: ignore
            else:
                df.to_excel(
                    os.path.join(settings.TEMP_STANDARDISED_DIR, standardised_dir_path, file_name)
                )  # type: ignore
            return Response(
                {"standardised_file_path": f"{standardised_dir_path}/{file_name}"},
                status=status.HTTP_200_OK,
            )

        except Exception as error:
            LOGGER.error(f"Could not standardise {error}")
            return Response(error, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get", "post"])
    def category(self, request, *args, **kwargs):
        """
        ``GET`` method: GET method to retrieve the dataset category & sub categories from JSON file obj
        ``POST`` method: POST method to create and/or edit the dataset categories &
            sub categories and finally write it to JSON file obj. [see here][ref]

        **Endpoint**
        [ref]: /datahub/dataset/v2/category/
        [JSON File Object]: "/categories.json"
        """
        if request.method == "GET":
            try:
                with open(Constants.CATEGORIES_FILE, "r") as json_obj:
                    data = json.loads(json_obj.read())
                return Response(data, status=status.HTTP_200_OK)
            except Exception as error:
                LOGGER.error(error, exc_info=True)
                raise custom_exceptions.NotFoundException(detail="Categories not found")
        elif request.method == "POST":
            try:
                data = request.data
                with open(Constants.CATEGORIES_FILE, "w+", encoding="utf8") as json_obj:
                    json.dump(data, json_obj, ensure_ascii=False)
                    LOGGER.info(f"Updated Categories: {Constants.CATEGORIES_FILE}")
                return Response(data, status=status.HTTP_201_CREATED)
            except Exception as error:
                LOGGER.error(error, exc_info=True)
                raise exceptions.InternalServerError("Internal Server Error")

    def create(self, request, *args, **kwargs):
        """
        ``POST`` method Endpoint: create action to save the Dataset's Meta data
            with datasets sent through POST request. [see here][ref].

        **Endpoint**
        [ref]: /datahub/dataset/v2/
        """
        try:
            serializer = self.get_serializer(
                data=request.data,
                context={
                    "standardisation_template": request.data.get("standardisation_template"),
                    "standardisation_config": request.data.get("standardisation_config"),
                },
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @authenticate_user(model=DatasetV2)
    def update(self, request, pk, *args, **kwargs):
        """
        ``PUT`` method: PUT method to edit or update the dataset (DatasetV2) and its files (DatasetV2File). [see here][ref]

        **Endpoint**
        [ref]: /datahub/dataset/v2/<uuid>
        """
        # setattr(request.data, "_mutable", True)
        try:
            data = request.data.copy()
            to_delete = ast.literal_eval(data.get("deleted", "[]"))
            sub_categories_map = data.pop("sub_categories_map")
            self.dataset_files(data, to_delete)
            datasetv2 = self.get_object()
            serializer = self.get_serializer(
                datasetv2,
                data=data,
                partial=True,
                context={
                    "standardisation_template": request.data.get("standardisation_template"),
                    "standardisation_config": request.data.get("standardisation_config"),
                },
            )
            serializer.is_valid(raise_exception=True)
            a = DatasetSubCategoryMap.objects.filter(dataset_id=datasetv2).delete()
            serializer.save()
            sub_categories_map = json.loads(sub_categories_map[0]) if c else []
            dataset_sub_cat_instances= [
                DatasetSubCategoryMap(dataset=datasetv2, sub_category=SubCategory.objects.get(id=sub_cat)
                                       ) for sub_cat in sub_categories_map]

            DatasetSubCategoryMap.objects.bulk_create(dataset_sub_cat_instances)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # not being used
    @action(detail=False, methods=["delete"])
    def dataset_files(self, request, id=[]):
        """
        ``DELETE`` method: DELETE method to delete the dataset files (DatasetV2File) referenced by DatasetV2 model. [see here][ref]

        **Endpoint**
        [ref]: /datahub/dataset/v2/dataset_files/
        """
        ids = {}
        for file_id in id:
            dataset_file = DatasetV2File.objects.filter(id=int(file_id))
            if dataset_file.exists():
                LOGGER.info(f"Deleting file: {dataset_file[0].id}")
                file_path = os.path.join("media", str(dataset_file[0].file))
                if os.path.exists(file_path):
                    os.remove(file_path)
                dataset_file.delete()
                ids[file_id] = "File deleted"
        return Response(ids, status=status.HTTP_204_NO_CONTENT)

    def list(self, request, *args, **kwargs):
        """
        ``GET`` method Endpoint: list action to view the list of Datasets via GET request. [see here][ref].

        **Endpoint**
        [ref]: /datahub/dataset/v2/
        """
        queryset = self.get_queryset()
        # serializer = self.get_serializer(queryset, many=True)
        # return Response(serializer.data, status=status.HTTP_200_OK)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response([], status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, pk=None, *args, **kwargs):
        """
        ``GET`` method Endpoint: retrieve action for the detail view of Dataset via GET request
            Returns dataset object view with content of XLX/XLSX file and file URLS. [see here][ref].

        **Endpoint**
        [ref]: /datahub/dataset/v2/<id>/
        """
        user_map = request.GET.get("user_map")
        type = request.GET.get("type", None)
        obj = self.get_object()
        serializer = self.get_serializer(obj).data
        dataset_file_obj = DatasetV2File.objects.prefetch_related("dataset_v2_file").filter(dataset_id=obj.id)
        data = []
        for file in dataset_file_obj:
            path_ = os.path.join(settings.DATASET_FILES_URL, str(file.standardised_file))
            file_path = {}
            file_path["id"] = file.id
            file_path["content"] = read_contents_from_csv_or_xlsx_file(
                os.path.join(settings.DATASET_FILES_URL, str(file.standardised_file)), file.standardised_configuration
            )
            file_path["file"] = path_
            file_path["source"] = file.source
            file_path["file_size"] = file.file_size
            file_path["accessibility"] = file.accessibility
            file_path["standardised_file"] = os.path.join(settings.DATASET_FILES_URL, str(file.standardised_file))
            file_path["standardisation_config"] = file.standardised_configuration
            type_filter = type if type == "api" else "dataset_file"
            queryset = file.dataset_v2_file.filter(type=type_filter)
            if user_map:
                queryset = queryset.filter(user_organization_map=user_map)
            usage_policy = UsagePolicyDetailSerializer(
                queryset.order_by("-updated_at").all(),
                many=True
            ).data if queryset.exists() else []
            file_path["usage_policy"] = usage_policy
            data.append(file_path)

        serializer["datasets"] = data
        return Response(serializer, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def dataset_filters(self, request, *args, **kwargs):
        """This function get the filter args in body. based on the filter args orm filters the data."""
        data = request.data
        org_id = data.pop(Constants.ORG_ID, "")
        others = data.pop(Constants.OTHERS, "")
        categories = data.pop(Constants.CATEGORY, None)
        user_id = data.pop(Constants.USER_ID, "")
        on_boarded_by = data.pop("on_boarded_by", "")
        exclude_filters, filters = {}, {}
        if others:
            exclude_filters = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
        else:
            filters = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
        try:
            data = (
                DatasetV2.objects.select_related(
                    Constants.USER_MAP,
                    Constants.USER_MAP_USER,
                    Constants.USER_MAP_ORGANIZATION,
                ).prefetch_related(
                    'dataset_cat_map')
                .filter(**data, **filters)
                .exclude(is_temp=True)
                .exclude(**exclude_filters)
                .order_by(Constants.UPDATED_AT)
                .reverse()
                .all()
            )
            # if categories is not None:
            #     data = data.filter(
            #         reduce(
            #             operator.or_,
            #             (Q(category__contains=cat) for cat in categories),
            #         )
            #     )
            if on_boarded_by:
                data = (
                    data.filter(user_map__user__on_boarded_by=user_id)
                    if others
                    else data.filter(user_map__user_id=user_id)
                )
            else:
                user_onboarded_by = User.objects.get(id=user_id).on_boarded_by
                if user_onboarded_by:
                    data = (
                        data.filter(
                            Q(user_map__user__on_boarded_by=user_onboarded_by.id)
                            | Q(user_map__user_id=user_onboarded_by.id)
                        )
                        if others
                        else data.filter(user_map__user_id=user_id)
                    )
                else:
                    data = (
                        data.filter(user_map__user__on_boarded_by=None).exclude(user_map__user__role_id=6)
                        if others
                        else data
                    )
        except Exception as error:  # type: ignore
            LOGGER.error("Error while filtering the datasets. ERROR: %s", error, exc_info=True)
            return Response(f"Invalid filter fields: {list(request.data.keys())}", status=500)
        page = self.paginate_queryset(data)
        participant_serializer = DatahubDatasetsV2Serializer(page, many=True)
        return self.get_paginated_response(participant_serializer.data)

    @action(detail=False, methods=["post"])
    @http_request_mutation
    def filters_data(self, request, *args, **kwargs):
        """This function provides the filters data"""
        data = request.META
        org_id = data.pop(Constants.ORG_ID, "")
        others = data.pop(Constants.OTHERS, "")
        user_id = data.pop(Constants.USER_ID, "")

        org_id = request.META.pop(Constants.ORG_ID, "")
        others = request.META.pop(Constants.OTHERS, "")
        user_id = request.META.pop(Constants.USER_ID, "")

        exclude, filters = {}, {}
        if others:
            exclude = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
            # filters = {Constants.APPROVAL_STATUS: Constants.APPROVED}
        else:
            filters = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
        try:
            geography = (
                DatasetV2.objects.values_list(Constants.GEOGRAPHY, flat=True)
                .filter(**filters)
                .exclude(geography="null")
                .exclude(geography__isnull=True)
                .exclude(geography="")
                .exclude(is_temp=True, **exclude)
                .all()
                .distinct()
            )
            # crop_detail = (
            #     Datasets.objects.values_list(Constants.CROP_DETAIL, flat=True)
            #     .filter(status=True, **filters)
            #     .exclude(crop_detail="null")
            #     .exclude(crop_detail__isnull=True)
            #     .exclude(crop_detail="")
            #     .exclude(**exclude)
            #     .all()
            #     .distinct()
            # )
            if os.path.exists(Constants.CATEGORIES_FILE):
                with open(Constants.CATEGORIES_FILE, "r") as json_obj:
                    category_detail = json.loads(json_obj.read())
            else:
                category_detail = []
        except Exception as error:  # type: ignore
            LOGGER.error("Error while filtering the datasets. ERROR: %s", error)
            return Response(f"Invalid filter fields: {list(request.data.keys())}", status=500)
        return Response({"geography": geography, "category_detail": category_detail}, status=200)

    # @action(detail=False, methods=["post"])
    # def search_datasets(self, request, *args, **kwargs):
    #     data = request.data
    #     org_id = data.pop(Constants.ORG_ID, "")
    #     others = data.pop(Constants.OTHERS, "")
    #     user_id = data.pop(Constants.USER_ID, "")
    #     search_pattern = data.pop(Constants.SEARCH_PATTERNS, "")
    #     exclude, filters = {}, {}

    #     if others:
    #         exclude = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
    #         filters = {Constants.NAME_ICONTAINS: search_pattern} if search_pattern else {}
    #     else:
    #         filters = (
    #             {
    #                 Constants.USER_MAP_ORGANIZATION: org_id,
    #                 Constants.NAME_ICONTAINS: search_pattern,
    #             }
    #             if org_id
    #             else {}
    #         )
    #     try:
    #         data = (
    #             DatasetV2.objects.select_related(
    #                 Constants.USER_MAP,
    #                 Constants.USER_MAP_USER,
    #                 Constants.USER_MAP_ORGANIZATION,
    #             )
    #             .filter(user_map__user__status=True, status=True, **data, **filters)
    #             .exclude(**exclude)
    #             .order_by(Constants.UPDATED_AT)
    #             .reverse()
    #             .all()
    #         )
    #         page = self.paginate_queryset(data)
    #         participant_serializer = DatahubDatasetsV2Serializer(page, many=True)
    #         return self.get_paginated_response(participant_serializer.data)
    #     except Exception as error:  # type: ignore
    #         LOGGER.error("Error while filtering the datasets. ERROR: %s", error)
    #         return Response(
    #             f"Invalid filter fields: {list(request.data.keys())}",
    #             status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         )

    @authenticate_user(model=DatasetV2File)
    def destroy(self, request, pk, *args, **kwargs):
        """
        ``DELETE`` method: DELETE method to delete the DatasetV2 instance and its reference DatasetV2File instances,
        along with dataset files stored at the URL. [see here][ref]

        **Endpoint**
        [ref]: /datahub/dataset/v2/
        """
        try:
            dataset_obj = self.get_object()
            if dataset_obj:
                dataset_files = DatasetV2File.objects.filter(dataset_id=dataset_obj.id)
                dataset_dir = os.path.join(settings.DATASET_FILES_URL, str(dataset_obj.name))

                if os.path.exists(dataset_dir):
                    shutil.rmtree(dataset_dir)
                    LOGGER.info(f"Deleting file: {dataset_dir}")

                # delete DatasetV2File & DatasetV2 instances
                LOGGER.info(f"Deleting dataset obj: {dataset_obj}")
                dataset_files.delete()
                dataset_obj.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response(str(error), status=status.HTTP_400_BAD_REQUEST)


class DatasetV2ViewSetOps(GenericViewSet):
    """
    A viewset for performing operations on datasets with Excel files.

    This viewset supports the following actions:

    - `dataset_names`: Returns the names of all datasets that have at least one Excel file.
    - `dataset_file_names`: Given two dataset names, returns the names of all Excel files associated with each dataset.
    - `dataset_col_names`: Given the paths to two Excel files, returns the column names of each file as a response.
    - `dataset_join_on_columns`: Given the paths to two Excel files and the names of two columns, returns a JSON response with the result of an inner join operation on the two files based on the selected columns.
    """

    serializer_class = DatasetV2Serializer
    queryset = DatasetV2.objects.all()
    pagination_class = CustomPagination

    @action(detail=False, methods=["get"])
    def datasets_names(self, request, *args, **kwargs):
        try:
            datasets_with_excel_files = (
                DatasetV2.objects.prefetch_related("datasets")
                .select_related("user_map")
                .filter(
                    Q(datasets__file__endswith=".xls")
                    | Q(datasets__file__endswith=".xlsx")
                    | Q(datasets__file__endswith=".csv")
                )
                .filter(user_map__organization_id=request.GET.get("org_id"), is_temp=False)
                .distinct()
                .values("name", "id", org_name=F("user_map__organization__name"))
            )
            return Response(datasets_with_excel_files, status=status.HTTP_200_OK)
        except Exception as e:
            error_message = f"An error occurred while fetching dataset names: {e}"
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["post"])
    def datasets_file_names(self, request, *args, **kwargs):
        dataset_ids = request.data.get("datasets")
        user_map = request.data.get("user_map")
        if dataset_ids:
            try:
                # Get list of files for each dataset
                files = (
                    DatasetV2File.objects.select_related("dataset_v2_file", "dataset")
                    .filter(dataset_id__in=dataset_ids)
                    .filter(Q(file__endswith=".xls") | Q(file__endswith=".xlsx") | Q(file__endswith=".csv"))
                    .filter(
                        Q(accessibility__in=["public", "registered"])
                        | Q(dataset__user_map_id=user_map)
                        | Q(dataset_v2_file__approval_status="approved")
                    )
                    .values(
                        "id",
                        "dataset",
                        "standardised_file",
                        dataset_name=F("dataset__name"),
                    )
                    .distinct()
                )
                files = [
                    {
                        **row,
                        "file_name": row.get("standardised_file", "").split("/")[-1],
                    }
                    for row in files
                ]
                return Response(files, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response([], status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    def datasets_col_names(self, request, *args, **kwargs):
        try:
            file_paths = request.data.get("files")
            result = {}
            for file_path in file_paths:
                path = file_path
                file_path = unquote(file_path).replace("/media/", "")
                if file_path.endswith(".xlsx") or file_path.endswith(".xls"):
                    df = pd.read_excel(
                        os.path.join(settings.DATASET_FILES_URL, file_path),
                        index_col=None,
                        nrows=3,
                    )
                else:
                    df = pd.read_csv(
                        os.path.join(settings.DATASET_FILES_URL, file_path),
                        index_col=False,
                        nrows=3,
                    )
                df = df.drop(df.filter(regex="Unnamed").columns, axis=1)
                result[path] = df.columns.tolist()
                result[Constants.ID] = DatasetV2File.objects.get(standardised_file=file_path).id
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    def datasets_join_condition(self, request, *args, **kwargs):
        try:
            file_path1 = request.data.get("file_path1")
            file_path2 = request.data.get("file_path2")
            columns1 = request.data.get("columns1")
            columns2 = request.data.get("columns2")
            condition = request.data.get("condition")

            # Load the files into dataframes
            if file_path1.endswith(".xlsx") or file_path1.endswith(".xls"):
                df1 = pd.read_excel(os.path.join(settings.MEDIA_ROOT, file_path1), usecols=columns1)
            else:
                df1 = pd.read_csv(os.path.join(settings.MEDIA_ROOT, file_path1), usecols=columns1)
            if file_path2.endswith(".xlsx") or file_path2.endswith(".xls"):
                df2 = pd.read_excel(os.path.join(settings.MEDIA_ROOT, file_path2), usecols=columns2)
            else:
                df2 = pd.read_csv(os.path.join(settings.MEDIA_ROOT, file_path2), usecols=columns2)
            # Join the dataframes
            result = pd.merge(
                df1,
                df2,
                how=request.data.get("how", "left"),
                left_on=request.data.get("left_on"),
                right_on=request.data.get("right_on"),
            )

            # Return the joined dataframe as JSON
            return Response(result.to_json(orient="records", index=False), status=status.HTTP_200_OK)

        except Exception as e:
            LOGGER.error(str(e), exc_info=True)
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"])
    def organization(self, request, *args, **kwargs):
        """GET method: query the list of Organization objects"""
        on_boarded_by = request.GET.get("on_boarded_by", "")
        user_id = request.GET.get("user_id", "")
        try:
            user_org_queryset = (
                UserOrganizationMap.objects.prefetch_related("user_org_map")
                .select_related("organization", "user")
                .annotate(dataset_count=Count("user_org_map__id"))
                .values(
                    name=F("organization__name"),
                    org_id=F("organization_id"),
                    org_description=F("organization__org_description"),
                )
                .filter(user__status=True, dataset_count__gt=0)
                .all()
            )
            if on_boarded_by:
                user_org_queryset = user_org_queryset.filter(
                    Q(user__on_boarded_by=on_boarded_by) | Q(user_id=on_boarded_by)
                )
            else:
                user_onboarded_by = User.objects.get(id=user_id).on_boarded_by
                if user_onboarded_by:
                    user_org_queryset = user_org_queryset.filter(
                        Q(user__on_boarded_by=user_onboarded_by.id) | Q(user__id=user_onboarded_by.id)
                    )
                else:
                    user_org_queryset = user_org_queryset.filter(user__on_boarded_by=None).exclude(user__role_id=6)
            return Response(user_org_queryset, 200)
        except Exception as e:
            error_message = f"An error occurred while fetching Organization details: {e}"
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StandardisationTemplateView(GenericViewSet):
    serializer_class = StandardisationTemplateViewSerializer
    queryset = StandardisationTemplate.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            LOGGER.info("Standardisation Template Created Successfully.")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["put"])
    def update_standardisation_template(self, request, *args, **kwargs):
        update_list = list()
        create_list = list()
        try:
            for data in request.data:
                if data.get(Constants.ID, None):
                    # Update
                    id = data.pop(Constants.ID)
                    instance = StandardisationTemplate.objects.get(id=id)
                    serializer = StandardisationTemplateUpdateSerializer(instance, data=data, partial=True)
                    serializer.is_valid(raise_exception=True)
                    update_list.append(StandardisationTemplate(id=id, **data))
                else:
                    # Create
                    create_list.append(data)

            create_serializer = self.get_serializer(data=create_list, many=True)
            create_serializer.is_valid(raise_exception=True)
            StandardisationTemplate.objects.bulk_update(
                update_list, fields=["datapoint_category", "datapoint_attributes"]
            )
            create_serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        except Exception as error:
            LOGGER.error("Issue while Updating Standardisation Template", exc_info=True)
            return Response(
                f"Issue while Updating Standardisation Template {error}",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        LOGGER.info(f"Deleted datapoint Category from standardisation template {instance.datapoint_category}")
        return Response(status=status.HTTP_204_NO_CONTENT)

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PolicyListAPIView(generics.ListCreateAPIView):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer


class PolicyDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer


class DatasetV2View(GenericViewSet):
    queryset = DatasetV2.objects.all()
    serializer_class = DatasetV2NewListSerializer
    pagination_class = CustomPagination

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            LOGGER.info("Dataset created Successfully.")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        serializer = DatasetV2DetailNewSerializer(instance=self.get_object())
        return Response(serializer.data, status=status.HTTP_200_OK)

    @authenticate_user(model=DatasetV2)
    def update(self, request, *args, **kwargs):
        # setattr(request.data, "_mutable", True)
        try:
            instance = self.get_object()
            data = request.data.copy()
            # sub_categories_map = data.pop("sub_categories_map")
            data["is_temp"] = False
            serializer = self.get_serializer(instance, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            # DatasetSubCategoryMap.objects.filter(dataset_id=instance).delete()
            serializer.save()
            # sub_categories_map = json.loads(sub_categories_map[0]) if c else []
            # dataset_sub_cat_instances= [
            #     DatasetSubCategoryMap(dataset=instance, sub_category=SubCategory.objects.get(id=sub_cat)
            #                            ) for sub_cat in sub_categories_map]

            # DatasetSubCategoryMap.objects.bulk_create(dataset_sub_cat_instances)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @authenticate_user(model=DatasetV2)
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response(str(error), status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    def requested_datasets(self, request, *args, **kwargs):
        try:
            user_map_id = request.data.get("user_map")
            policy_type = request.data.get("type", None)
            if policy_type == "api":
                dataset_file_id = request.data.get("dataset_file")
                requested_recieved = (
                    UsagePolicy.objects.select_related(
                        "dataset_file",
                        "dataset_file__dataset",
                        "user_organization_map__organization",
                    )
                    .filter(dataset_file__dataset__user_map_id=user_map_id, dataset_file_id=dataset_file_id)
                    .values(
                        "id",
                        "approval_status",
                        "accessibility_time",
                        "updated_at",
                        "created_at",
                        dataset_id=F("dataset_file__dataset_id"),
                        dataset_name=F("dataset_file__dataset__name"),
                        file_name=F("dataset_file__file"),
                        organization_name=F("user_organization_map__organization__name"),
                        organization_email=F("user_organization_map__organization__org_email"),
                        organization_phone_number=F("user_organization_map__organization__phone_number"),
                    )
                    .order_by("-updated_at")
                )
                response_data = []
                for values in requested_recieved:
                    org = {
                        "org_email": values["organization_email"],
                        "name": values["organization_name"],
                        "phone_number": values["organization_phone_number"],
                    }
                    values.pop("organization_email")
                    values.pop("organization_name")
                    values.pop("organization_phone_number")
                    values["file_name"] = values.get("file_name", "").split("/")[-1]

                    values["organization"] = org
                    response_data.append(values)
                return Response(
                    {
                        "recieved": response_data,
                    },
                    200,
                )
            requested_sent = (
                UsagePolicy.objects.select_related(
                    "dataset_file",
                    "dataset_file__dataset",
                    "user_organization_map__organization",
                )
                .filter(user_organization_map=user_map_id, type="dataset_file")
                .values(
                    "id",
                    "approval_status",
                    "updated_at",
                    "accessibility_time",
                    "type",
                    dataset_id=F("dataset_file__dataset_id"),
                    dataset_name=F("dataset_file__dataset__name"),
                    file_name=F("dataset_file__file"),
                    organization_name=F("dataset_file__dataset__user_map__organization__name"),
                    organization_email=F("dataset_file__dataset__user_map__organization__org_email"),
                )
                .order_by("-updated_at")
            )

            requested_recieved = (
                UsagePolicy.objects.select_related(
                    "dataset_file",
                    "dataset_file__dataset",
                    "user_organization_map__organization",
                )
                .filter(dataset_file__dataset__user_map_id=user_map_id, type="dataset_file")
                .values(
                    "id",
                    "approval_status",
                    "accessibility_time",
                    "updated_at",
                    "type",
                    dataset_id=F("dataset_file__dataset_id"),
                    dataset_name=F("dataset_file__dataset__name"),
                    file_name=F("dataset_file__file"),
                    organization_name=F("user_organization_map__organization__name"),
                    organization_email=F("user_organization_map__organization__org_email"),
                )
                .order_by("-updated_at")
            )
            return Response(
                {
                    "sent": [
                        {
                            **values,
                            "file_name": values.get("file_name", "").split("/")[-1],
                        }
                        for values in requested_sent
                    ],
                    "recieved": [
                        {
                            **values,
                            "file_name": values.get("file_name", "").split("/")[-1],
                        }
                        for values in requested_recieved
                    ],
                },
                200,
            )
        except Exception as error:
            LOGGER.error("Issue while Retrive requeted data", exc_info=True)
            return Response(
                f"Issue while Retrive requeted data {error}",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # def list(self, request, *args, **kwargs):
    #     page = self.paginate_queryset(self.queryset)
    #     serializer = self.get_serializer(page, many=True).exclude(is_temp = True)
    #     return self.get_paginated_response(serializer.data)

    @http_request_mutation
    @action(detail=True, methods=["post"])
    def get_dashboard_chart_data(self, request, pk, *args, **kwargs):
        try:
            filters = True
            role_id = request.META.get("role_id")
            map_id = request.META.get("map_id")
            dataset_file_obj = DatasetV2File.objects.get(id=pk)
            dataset_file = str(dataset_file_obj.file)
            if role_id != str(1):
                if UsagePolicy.objects.filter(
                                                user_organization_map=map_id,
                                                dataset_file_id=pk,
                                                approval_status="approved"
                                            ).order_by("-updated_at").first():
                    filters=True
                elif DatasetV2File.objects.select_related("dataset").filter(id=pk, dataset__user_map_id=map_id).first():
                    filters =  True
                else:
                    filters = False
            # Create a dictionary mapping dataset types to dashboard generation functions
            dataset_type_to_dashboard_function = {
                "omfp": generate_omfp_dashboard,
                "fsp": generate_fsp_dashboard,
                "knfd": generate_knfd_dashboard,
                "kiamis": "generate_kiamis_dashboard",
            }

            # Determine the dataset type based on the filename
            dataset_type = None
            for key in dataset_type_to_dashboard_function:
                if key in dataset_file.lower():
                    dataset_type = key
                    break

            # If dataset_type is not found, return an error response
            if dataset_type is None:
                return Response(
                    "Requested resource is currently unavailable. Please try again later.",
                    status=status.HTTP_200_OK,
                )

            # Generate the base hash key
            hash_key = generate_hash_key_for_dashboard(
                dataset_type if role_id == str(1) else pk,
                request.data, role_id, filters
            )

            # Check if the data is already cached
            cache_data = cache.get(hash_key, {})
            if cache_data:
                LOGGER.info("Dashboard details found in cache", exc_info=True)
                return Response(cache_data, status=status.HTTP_200_OK)

            # Get the appropriate dashboard generation function
            dashboard_generator = dataset_type_to_dashboard_function.get(dataset_type)

            if dashboard_generator and dataset_type != 'kiamis':
                # Generate the dashboard data using the selected function
                return dashboard_generator(
                    dataset_file if role_id != str(1) else self.get_consolidated_file(dataset_type),
                    request.data, hash_key, filters
                )

            # serializer = DatahubDatasetFileDashboardFilterSerializer(data=request.data)
            # serializer.is_valid(raise_exception=True)
            counties = []
            sub_counties = []
            gender = []
            value_chain = []

            # if serializer.data.get("county"):
            counties = request.data.get("county")

            # if serializer.data.get("sub_county"):
            sub_counties = request.data.get("sub_county")

            # if serializer.data.get("gender"):
            gender = request.data.get("gender")

            # if serializer.data.get("value_chain"):
            value_chain = request.data.get("value_chain")
            cols_to_read = ['Gender', 'Constituency', 'Millet', 'County', 'Sub County', 'Crop Production',
                            'farmer_mobile_number',
                            'Livestock Production', 'Ducks', 'Other Sheep', 'Total Area Irrigation', 'Family',
                            'Ward',
                            'Other Money Lenders', 'Micro-finance institution', 'Self (Salary or Savings)',
                            "Natural rivers and stream", "Water Pan",
                            'NPK', 'Superphosphate', 'CAN',
                            'Urea', 'Other', 'Do you insure your crops?',
                            'Do you insure your farm buildings and other assets?', 'Other Dual Cattle',
                            'Cross breed Cattle', 'Cattle boma',
                            'Small East African Goats', 'Somali Goat', 'Other Goat', 'Chicken -Indigenous',
                            'Chicken -Broilers', 'Chicken -Layers', 'Highest Level of Formal Education',
                            'Maize food crop', "Beans", 'Cassava', 'Sorghum', 'Potatoes', 'Cowpeas']
            if role_id == str(1):
                dataset_file = self.get_consolidated_file("kiamis")
            try:
                if dataset_file.endswith(".xlsx") or dataset_file.endswith(".xls"):
                    df = pd.read_excel(os.path.join(settings.DATASET_FILES_URL, dataset_file))
                elif dataset_file.endswith(".csv"):
                    df = pd.read_csv(os.path.join(settings.DATASET_FILES_URL, dataset_file), usecols=cols_to_read,
                                     low_memory=False)
                    # df.columns = df.columns.str.strip()
                else:
                    return Response(
                        "Unsupported file please use .xls or .csv.",
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                df['Ducks'] = pd.to_numeric(df['Ducks'], errors='coerce')
                df['Other Sheep'] = pd.to_numeric(df['Other Sheep'], errors='coerce')
                df['Family'] = pd.to_numeric(df['Family'], errors='coerce')
                df['Other Money Lenders'] = pd.to_numeric(df['Other Money Lenders'], errors='coerce')
                df['Micro-finance institution'] = pd.to_numeric(df['Micro-finance institution'], errors='coerce')
                df['Self (Salary or Savings)'] = pd.to_numeric(df['Self (Salary or Savings)'], errors='coerce')
                df['Natural rivers and stream'] = pd.to_numeric(df['Natural rivers and stream'], errors='coerce')
                df["Water Pan"] = pd.to_numeric(df["Water Pan"], errors='coerce')
                df['Total Area Irrigation'] = pd.to_numeric(df['Total Area Irrigation'], errors='coerce')
                df['NPK'] = pd.to_numeric(df['NPK'], errors='coerce')
                df['Superphosphate'] = pd.to_numeric(df['Superphosphate'], errors='coerce')
                df['CAN'] = pd.to_numeric(df['CAN'], errors='coerce')
                df['Urea'] = pd.to_numeric(df['Urea'], errors='coerce')
                df['Other'] = pd.to_numeric(df['Other'], errors='coerce')
                df['Other Dual Cattle'] = pd.to_numeric(df['Other Dual Cattle'], errors='coerce')
                df['Cross breed Cattle'] = pd.to_numeric(df['Cross breed Cattle'], errors='coerce')
                df['Cattle boma'] = pd.to_numeric(df['Cattle boma'], errors='coerce')
                df['Small East African Goats'] = pd.to_numeric(df['Small East African Goats'], errors='coerce')
                df['Somali Goat'] = pd.to_numeric(df['Somali Goat'], errors='coerce')
                df['Other Goat'] = pd.to_numeric(df['Other Goat'], errors='coerce')
                df['Chicken -Indigenous'] = pd.to_numeric(df['Chicken -Indigenous'], errors='coerce')
                df['Chicken -Broilers'] = pd.to_numeric(df['Chicken -Broilers'], errors='coerce')
                df['Chicken -Layers'] = pd.to_numeric(df['Chicken -Layers'], errors='coerce')
                df['Do you insure your crops?'] = pd.to_numeric(df['Do you insure your crops?'], errors='coerce')
                df['Highest Level of Formal Education'] = pd.to_numeric(df['Highest Level of Formal Education'],
                                                                        errors='coerce')
                df['Do you insure your farm buildings and other assets?'] = pd.to_numeric(
                    df['Do you insure your farm buildings and other assets?'], errors='coerce')

                data = filter_dataframe_for_dashboard_counties(
                    df=df,
                    counties=counties if counties else [],
                    sub_counties=sub_counties if sub_counties else [],
                    gender=gender if gender else [],
                    value_chain=value_chain if value_chain else [],
                    hash_key=hash_key,
                    filters=filters
                )
            except Exception as e:
                LOGGER.error(e, exc_info=True)
                return Response(
                    f"Something went wrong, please try again. {e}",
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                data,
                status=status.HTTP_200_OK,
            )

        except DatasetV2File.DoesNotExist as e:
            LOGGER.error(e, exc_info=True)
            return Response(
                "No dataset file for the provided id.",
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(
                f"Something went wrong, please try again. {e}",
                status=status.HTTP_400_BAD_REQUEST,
            )
    
    def get_consolidated_file(self, name):
        consolidated_file = f"consolidated_{name}.csv" 
        dataframes = []
        thread_list = []
        combined_df = pd.DataFrame([])
        try:
            if os.path.exists(os.path.join(settings.DATASET_FILES_URL, consolidated_file)):
                LOGGER.info(f"{consolidated_file} file available")
                return consolidated_file
            else:
                dataset_file_objects = (
                    DatasetV2File.objects
                    .select_related("dataset")
                    .filter(dataset__name__icontains=name, file__iendswith=".csv")
                    .values_list('file', flat=True).distinct()  # Flatten the list of values
                )
                def read_csv_file(file_path):
                    chunk_size = 50000
                    chunk_df = pd.DataFrame([])
                    chunks = 0
                    try:
                        LOGGER.info(f"{file_path} Consolidation started")
                        for chunk in pd.read_csv(file_path, chunksize=chunk_size):
                            # Append the processed chunk to the combined DataFrame
                            chunk_df = pd.concat([chunk_df, chunk], ignore_index=True)
                            chunks = chunks+1
                        LOGGER.info(f"{file_path} Consolidated {chunks} chunks")
                        dataframes.append(chunk_df)
                    except Exception as e:
                        LOGGER.error(f"Error reading CSV file {file_path}", exc_info=True)
                for csv_file in dataset_file_objects:
                    file_path = os.path.join(settings.DATASET_FILES_URL, csv_file)
                    thread = threading.Thread(target=read_csv_file, args=(file_path,))
                    thread_list.append(thread)
                    thread.start()

                # Wait for all threads to complete
                for thread in thread_list:
                    thread.join()
            combined_df = pd.concat(dataframes, ignore_index=True)
            combined_df.to_csv(os.path.join(settings.DATASET_FILES_URL, consolidated_file), index=False)
            LOGGER.info(f"{consolidated_file} file created")
            return consolidated_file
        except Exception as e:
            LOGGER.error(f"Error occoured while creating {consolidated_file}", exc_info=True)
            return Response(
                    "Requested resource is currently unavailable. Please try again later.",
                    status=500,
                )

class DatasetFileV2View(GenericViewSet):
    queryset = DatasetV2File.objects.all()
    serializer_class = DatasetFileV2NewSerializer

    def create(self, request, *args, **kwargs):
        validity = check_file_name_length(incoming_file_name=request.data.get("file"),
                                          accepted_file_name_size=NumericalConstants.FILE_NAME_LENGTH)
        if not validity:
            return Response(
                {"message": f"File name should not be more than {NumericalConstants.FILE_NAME_LENGTH} characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            serializer = self.get_serializer(data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            data = serializer.data
            instance = DatasetV2File.objects.get(id=data.get("id"))
            instance.standardised_file = instance.file  # type: ignore
            instance.file_size = os.path.getsize(os.path.join(settings.DATASET_FILES_URL, str(instance.file)))
            instance.save()
            LOGGER.info("Dataset created Successfully.")
            data = DatasetFileV2NewSerializer(instance)
            return Response(data.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @authenticate_user(model=DatasetV2File)
    def update(self, request, *args, **kwargs):
        # setattr(request.data, "_mutable", True)
        try:
            data = request.data
            instance = self.get_object()
            # Generate the file and write the path to standardised file.
            standardised_configuration = request.data.get("standardised_configuration")
            # mask_columns = request.data.get(
            #     "mask_columns",
            # )
            config = request.data.get("config")
            file_path = str(instance.file)
            if standardised_configuration:
                if file_path.endswith(".xlsx") or file_path.endswith(".xls"):
                    df = pd.read_excel(os.path.join(settings.DATASET_FILES_URL, file_path), index_col=None)
                else:
                    df = pd.read_csv(os.path.join(settings.DATASET_FILES_URL, file_path), index_col=False)

                df.rename(columns=standardised_configuration, inplace=True)
                df.columns = df.columns.astype(str)
                df = df.drop(df.filter(regex="Unnamed").columns, axis=1)

                if not os.path.exists(os.path.join(settings.DATASET_FILES_URL, instance.dataset.name, instance.source)):
                    os.makedirs(os.path.join(settings.DATASET_FILES_URL, instance.dataset.name, instance.source))

                file_name = os.path.basename(file_path).replace(".", "_standerdise.")
                if file_path.endswith(".csv"):
                    df.to_csv(
                        os.path.join(
                            settings.DATASET_FILES_URL,
                            instance.dataset.name,
                            instance.source,
                            file_name,
                        )
                    )  # type: ignore
                else:
                    df.to_excel(
                        os.path.join(
                            settings.DATASET_FILES_URL,
                            instance.dataset.name,
                            instance.source,
                            file_name,
                        )
                    )  # type: ignore
                # data = request.data
                standardised_file_path = os.path.join(instance.dataset.name, instance.source, file_name)
                data["file_size"] = os.path.getsize(os.path.join(settings.DATASET_FILES_URL, str(standardised_file_path)))
            else:
                file_name = os.path.basename(file_path)
                standardised_file_path = os.path.join(instance.dataset.name, instance.source, file_name)
                # data["file_size"] = os.path.getsize(os.path.join(settings.DATASET_FILES_URL, str(standardised_file_path)))
            data["standardised_configuration"] = config
            serializer = self.get_serializer(instance, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            DatasetV2File.objects.filter(id=serializer.data.get("id")).update(standardised_file=standardised_file_path)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request, *args, **kwargs):
        data = DatasetV2File.objects.filter(dataset=request.GET.get("dataset")).values("id", "file")
        return Response(data, status=status.HTTP_200_OK)

    @authenticate_user(model=DatasetV2File)
    def destroy(self, request, *args, **kwargs):
        try:
            dataset_file = self.get_object()
            dataset_file.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response(str(error), status=status.HTTP_400_BAD_REQUEST)

    # @action(detail=False, methods=["put"])
    @authenticate_user(model=DatasetV2File)
    def patch(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response(str(error), status=status.HTTP_400_BAD_REQUEST)


class UsagePolicyListCreateView(generics.ListCreateAPIView):
    queryset = UsagePolicy.objects.all()
    serializer_class = UsagePolicySerializer


class UsagePolicyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UsagePolicy.objects.all()
    serializer_class = UsageUpdatePolicySerializer
    api_builder_serializer_class = APIBuilderSerializer

    @authenticate_user(model=UsagePolicy)
    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        approval_status = request.data.get('approval_status')
        policy_type = request.data.get('type', None)
        instance.api_key = None
        try:
            if policy_type == 'api':
                if approval_status == 'approved':
                    instance.api_key = generate_api_key()
            serializer = self.api_builder_serializer_class(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=200)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response(str(error), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DatahubNewDashboard(GenericViewSet):
    """Datahub Dashboard viewset"""

    pagination_class = CustomPagination

    def participant_metics(self, data):
        on_boarded_by = data.get("onboarded_by")
        role_id = data.get("role_id")
        user_id = data.get("user_id")
        result = {}
        try:
            if on_boarded_by != "None" or role_id == str(6):
                result["participants_count"] = (
                    UserOrganizationMap.objects.select_related(Constants.USER, Constants.ORGANIZATION)
                    .filter(
                        user__status=True,
                        user__on_boarded_by=on_boarded_by if on_boarded_by != "None" else user_id,
                        user__role=3,
                        user__approval_status=True,
                    )
                    .count()
                )
            elif role_id == str(1):
                result["co_steward_count"] = (
                    UserOrganizationMap.objects.select_related(Constants.USER, Constants.ORGANIZATION)
                    .filter(user__status=True, user__role=6)
                    .count()
                )
                result["participants_count"] = (
                    UserOrganizationMap.objects.select_related(Constants.USER, Constants.ORGANIZATION)
                    .filter(
                        user__status=True,
                        user__role=3,
                        user__on_boarded_by=None,
                        user__approval_status=True,
                    )
                    .count()
                )
            else:
                result["participants_count"] = (
                    UserOrganizationMap.objects.select_related(Constants.USER, Constants.ORGANIZATION)
                    .filter(
                        user__status=True,
                        user__role=3,
                        user__on_boarded_by=None,
                        user__approval_status=True,
                    )
                    .count()
                )
            LOGGER.info("Participants Metrics completed")
            return result
        except Exception as error:  # type: ignore
            LOGGER.error(
                "Error while filtering the participants. ERROR: %s",
                error,
                exc_info=True,
            )
            raise Exception(str(error))

    def dataset_metrics(self, data, request):
        on_boarded_by = data.get("onboarded_by")
        role_id = data.get("role_id")
        user_id = data.get("user_id")
        user_org_map = data.get("map_id")
        try:
            query = (
                DatasetV2.objects.prefetch_related("datasets")
                .select_related(
                    Constants.USER_MAP,
                    Constants.USER_MAP_USER,
                    Constants.USER_MAP_ORGANIZATION,
                )
                .exclude(is_temp=True)
            )
            if on_boarded_by != "None" or role_id == str(6):
                query = query.filter(
                    Q(user_map__user__on_boarded_by=on_boarded_by if on_boarded_by != "None" else user_id)
                    | Q(user_map__user_id=on_boarded_by if on_boarded_by != "None" else user_id)
                )
            else:
                query = query.filter(user_map__user__on_boarded_by=None).exclude(user_map__user__role_id=6)
            LOGGER.info("Datasets Metrics completed")
            return query
        except Exception as error:  # type: ignore
            LOGGER.error("Error while filtering the datasets. ERROR: %s", error, exc_info=True)
            raise Exception(str(error))

    def connector_metrics(self, data, dataset_query, request):
        # on_boarded_by = data.get("onboarded_by")
        # role_id = data.get("role_id")
        user_id = data.get("user_id")
        user_org_map = data.get("map_id")
        my_dataset_used_in_connectors = (
                dataset_query.prefetch_related("datasets__right_dataset_file")
                .values("datasets__right_dataset_file")
                .filter(datasets__right_dataset_file__connectors__user_id=user_id)
                .distinct()
                .count()
                + dataset_query.prefetch_related("datasets__left_dataset_file")
                .values("datasets__left_dataset_file")
                .filter(datasets__left_dataset_file__connectors__user_id=user_id)
                .distinct()
                .count()
        )
        connectors_query = Connectors.objects.filter(user_id=user_id).all()

        other_datasets_used_in_my_connectors = (
                                                   dataset_query.prefetch_related("datasets__right_dataset_file")
                                                   .select_related("datasets__right_dataset_file__connectors")
                                                   .filter(datasets__right_dataset_file__connectors__user_id=user_id)
                                                   .values("datasets__right_dataset_file")
                                                   .exclude(user_map_id=user_org_map)
                                                   .distinct()
                                                   .count()
                                               ) + (
                                                   dataset_query.prefetch_related("datasets__left_dataset_file")
                                                   .select_related("datasets__left_dataset_file__connectors")
                                                   .filter(datasets__left_dataset_file__connectors__user_id=user_id)
                                                   .values("datasets__left_dataset_file")
                                                   .exclude(user_map_id=user_org_map)
                                                   .distinct()
                                                   .count()
                                               )
        return {
            "total_connectors_count": connectors_query.count(),
            "other_datasets_used_in_my_connectors": other_datasets_used_in_my_connectors,
            "my_dataset_used_in_connectors": my_dataset_used_in_connectors,
            "recent_connectors": ConnectorsListSerializer(
                connectors_query.order_by("-updated_at")[0:3], many=True
            ).data,
        }

    @action(detail=False, methods=["get"])
    @http_request_mutation
    def dashboard(self, request):
        """Retrieve datahub dashboard details"""
        data = request.META
        try:
            participant_metrics = self.participant_metics(data)
            dataset_query = self.dataset_metrics(data, request)
            # This will fetch connectors metrics
            connector_metrics = self.connector_metrics(data, dataset_query, request)
            if request.GET.get("my_org", False):
                dataset_query = dataset_query.filter(user_map_id=data.get("map_id"))
            dataset_file_metrics = (
                dataset_query.values("datasets__source")
                .annotate(
                    dataset_count=Count("id", distinct=True),
                    file_count=Count("datasets__file", distinct=True),
                    total_size=Sum("datasets__file_size"),
                )
                .filter(file_count__gt=0)
            )

            dataset_state_metrics = dataset_query.values(state_name=F("geography__state__name")).annotate(
                dataset_count=Count("id", distinct=True)
            )
            distinct_keys = (
                DatasetV2.objects.annotate(
                    key=Func(
                        "category",
                        function="JSONB_OBJECT_KEYS",
                        output_field=CharField(),
                    )
                )
                .values_list("key", flat=True)
                .distinct()
            )

            # Iterate over the distinct keys and find the count for each key
            dataset_category_metrics = {}
            for key in distinct_keys:
                dataset_count = dataset_query.filter(category__has_key=key).count()
                if dataset_count:
                    dataset_category_metrics[key] = dataset_count
            recent_datasets = DatasetV2ListNewSerializer(dataset_query.order_by("-updated_at")[0:3], many=True).data
            data = {
                "user": UserOrganizationMap.objects.select_related("user", "organization")
                .filter(id=data.get("map_id"))
                .values(
                    first_name=F("user__first_name"),
                    last_name=F("user__last_name"),
                    logo=Concat(
                        Value("media/"),
                        F("organization__logo"),
                        output_field=CharField(),
                    ),
                    org_email=F("organization__org_email"),
                    name=F("organization__name"),
                )
                .first(),
                "total_participants": participant_metrics,
                "dataset_file_metrics": dataset_file_metrics,
                "dataset_state_metrics": dataset_state_metrics,
                "total_dataset_count": dataset_query.count(),
                "dataset_category_metrics": dataset_category_metrics,
                "recent_datasets": recent_datasets,
                **connector_metrics,
            }
            return Response(data, status=status.HTTP_200_OK)

        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# @http_request_mutation
class ResourceManagementViewSet(GenericViewSet):
    """
    Resource Management viewset.
    """

    queryset = Resource.objects.prefetch_related().all()
    serializer_class = ResourceSerializer
    pagination_class = CustomPagination
   
    @http_request_mutation
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            user_map = request.META.get("map_id")
            # request.data._mutable = True
            data = request.data.copy()
            files = request.FILES.getlist('files')  # 'files' is the key used in FormData
            data["files"] = files
            data["user_map"] = user_map
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @transaction.atomic
    @http_request_mutation
    @authenticate_user(model=Resource)
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            data = request.data.copy()
            sub_categories_map = data.pop("sub_categories_map", [])
            serializer = self.get_serializer(instance, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            resource_id=serializer.data.get("id")
            # ResourceSubCategoryMap.objects.filter(resource=instance).delete()
            
            # sub_categories_map = json.loads(sub_categories_map[0]) if sub_categories_map else []
            # resource_sub_cat_instances= [
            #     ResourceSubCategoryMap(resource=instance, sub_category=SubCategory.objects.get(id=sub_cat)
            #                            ) for sub_cat in sub_categories_map]
            # ResourceSubCategoryMap.objects.bulk_create(resource_sub_cat_instances)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @http_request_mutation
    def list(self, request, *args, **kwargs):
        try:
            user_map = request.META.get("map_id")
            if request.GET.get("others", None):
                queryset = Resource.objects.exclude(user_map=user_map).order_by("-updated_at")
            else:
                queryset = Resource.objects.filter(user_map=user_map).order_by("-updated_at")

            page = self.paginate_queryset(queryset)
            serializer = ResourceListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @http_request_mutation
    @authenticate_user(model=Resource)
    def destroy(self, request, *args, **kwargs):
        resource = self.get_object()
        file_ids = ResourceFile.objects.filter(resource_id=resource.id).values_list("id", flat=True)
        qdrant_embeddings_delete_file_id(file_ids)
        resource.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @transaction.atomic
    @http_request_mutation
    @action(detail=False, methods=["delete"])
    def delete_with_user_map(self, request, *args, **kwargs):
        try:
            user_map = request.META.get("map_id")
            file_ids = ResourceFile.objects.filter(resource__user_map_id=user_map).values_list("id", flat=True)
            qdrant_embeddings_delete_file_id(file_ids)
            Resource.objects.filter(user_map_id=user_map).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @http_request_mutation
    def retrieve(self, request, *args, **kwargs):
        user_map = request.META.get("map_id")
        resource = self.get_object()
        serializer = self.get_serializer(resource)
        data = serializer.data.copy()
        try:
            if str(resource.user_map_id) == str(user_map):
                resource_usage_policy = (
                ResourceUsagePolicy.objects.select_related(
                    "resource",
                )
                .filter(resource=resource)
                .values(
                    "id",
                    "approval_status",
                    "accessibility_time",
                    "updated_at",
                    "type",
                    "api_key",
                    "created_at",
                    "resource_id",
                    resource_title=F("resource__title"),
                    organization_name=F("user_organization_map__organization__name"),
                    organization_email=F("user_organization_map__organization__org_email"),
                    organization_phone_number=F("user_organization_map__organization__phone_number"),
                )
                .order_by("-updated_at")
            )
                # data["retrival"] = MessagesChunksRetriveSerializer(Messages.objects.filter(resource_id=resource.id).order_by("-created_at").all(), many=True).data
            else:
                resource_usage_policy = (
                ResourceUsagePolicy.objects.select_related(
                    "resource"
                )
                .filter(user_organization_map_id=user_map, resource=resource)
                .values(
                    "id",
                    "approval_status",
                    "updated_at",
                    "accessibility_time",
                    "type",
                    "resource_id",
                    "api_key",
                    organization_name=F("user_organization_map__organization__name"),
                    organization_email=F("user_organization_map__organization__org_email"),
                    organization_phone_number=F("user_organization_map__organization__phone_number"),
                )
                .order_by("-updated_at")
            )
            data["resource_usage_policy"] = resource_usage_policy
            print(data.get(resource_usage_policy))
            return Response(data, status=status.HTTP_200_OK)
        except Exception as error:
            LOGGER.error("Issue while Retrive Resource details", exc_info=True)
            return Response(
                f"Issue while Retrive Retrive Resource details {error}",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
    @http_request_mutation
    @action(detail=False, methods=["post"])
    def resources_filter(self, request, *args, **kwargs):
        try:
            data =request.data
            user_map = request.META.get("map_id")
            categories = data.pop(Constants.CATEGORY, None)
            others = data.pop(Constants.OTHERS, "")
            filters = {key: value for key, value in data.items() if value}
            query_set = self.get_queryset().filter(**filters).order_by("-updated_at")
            if categories:
                query_set = query_set.filter(
                    reduce(
                        operator.or_,
                        (Q(category__contains=cat) for cat in categories),
                    )
                )
            query_set = query_set.exclude(user_map=user_map) if others else query_set.filter(
                user_map=user_map)
            
            page = self.paginate_queryset(query_set)
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["post"])
    def requested_resources(self, request, *args, **kwargs):
        try:
            user_map_id = request.data.get("user_map")
            # policy_type = request.data.get("type", None)
            # resource_id = request.data.get("resource")
            requested_recieved = (
                ResourceUsagePolicy.objects.select_related(
                    "resource",
                )
                .filter(resource__user_map_id=user_map_id)
                .values(
                    "id",
                    "approval_status",
                    "accessibility_time",
                    "updated_at",
                    "type",
                    "created_at",
                    "resource_id",
                    resource_title=F("resource__title"),
                    organization_name=F("user_organization_map__organization__name"),
                    organization_email=F("user_organization_map__organization__org_email"),
                    organization_phone_number=F("user_organization_map__organization__phone_number"),
                )
                .order_by("-updated_at")
            )
            
            requested_sent = (
                ResourceUsagePolicy.objects.select_related(
                    "resource"
                )
                .filter(user_organization_map_id=user_map_id)
                .values(
                    "id",
                    "approval_status",
                    "updated_at",
                    "accessibility_time",
                    "type",
                    "resource_id",
                    resource_title=F("resource__title"),
                    organization_name=F("resource__user_map__organization__name"),
                    organization_email=F("resource__user_map__organization__org_email"),
                )
                .order_by("-updated_at")
            )

            return Response(
                {
                    "sent":requested_sent,
                    "recieved": requested_recieved,
                },
                200,
            )
        except Exception as error:
            LOGGER.error("Issue while Retrive Resource requeted data", exc_info=True)
            return Response(
                f"Issue while Retrive Resource requeted data {error}",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# New view set for Auto-categarization of the content
class ResourceManagementAutoCategorizationViewSet(GenericViewSet):
    '''
    This View set is the updated verion of ResourceManagementViewSet, the input format is changed and the
    data have json as well a pdf file for consumption.
    '''
    category_queryset = Category.objects.prefetch_related().all()
    sub_category_queryset = SubCategory.objects.prefetch_related().all()
    serializer_class = ResourceAutoCatSerializer
   
    @http_request_mutation
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            user_map = request.META.get("map_id")
            # request.data._mutable = True
            data = request.data.copy()
            files = request.FILES.getlist('files')  # 'files' is the key used in FormData
            json_files = request.FILES.get('json_files')
            json_content = json.loads(json_files.read())
            categorization_list = [(data.get("value_chain"), self.process_sub_category(data.get("value_chain"), data.get('crop_category'))) for data in json_content]
            category_id_map = {}
            sub_category_id_map = {}
            for category, sub_category in categorization_list:
                if category and validators.format_category_name(category) not in category_id_map.keys():
                    category_query = self.category_queryset.filter(name=validators.format_category_name(category))
                    if category_query.exists():
                        category_id_map[validators.format_category_name(category)] = category_query[0].id
                    else:
                        create_new_category = Category.objects.create(name=validators.format_category_name(category), description="")
                        create_new_category.save()
                        category_id_map[validators.format_category_name(category)] = create_new_category.id
                    if sub_category and validators.format_category_name(sub_category) not in sub_category_id_map.keys():
                        sub_category_query = self.sub_category_queryset.filter(name=validators.format_category_name(sub_category), 
                                                                               category=category_id_map.get(validators.format_category_name(category)))
                        if sub_category_query.exists():
                            sub_category_id_map[validators.format_category_name(sub_category)] = sub_category_query[0].id
                        else:
                            create_new_sub_category = SubCategory.objects.create(name=validators.format_category_name(sub_category), 
                                                                                 category=Category.objects.get(id=category_id_map.get(validators.format_category_name(category))), description="")
                            create_new_sub_category.save()
                            sub_category_id_map[validators.format_category_name(sub_category)] = create_new_sub_category.id
            data["files"] = files
            data["user_map"] = user_map
            data["sub_categories_map"] = sub_category_id_map
            data["uploaded_files"] = []
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            insert_auto_cat_data(serializer.data, json_content, category_id_map, sub_category_id_map)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def process_sub_category(self, category, sub_category):
        try:
            cleaned_text = re.sub(r'\b(n\/a|na)\b', '', sub_category, flags=re.IGNORECASE)
        except:
            cleaned_text = ""
        if not cleaned_text or  cleaned_text == "":
            return category
        else:
            return sub_category


class ResourceFileManagementViewSet(GenericViewSet):
    """
    Resource File Management
    """

    queryset = ResourceFile.objects.all()
    serializer_class = ResourceFileSerializer

    @http_request_mutation
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            data = request.data.copy()
            resource = data.get("resource")
            categories=data.pop("category")
            categories = json.loads(categories[0]) if categories else {}
            state=categories.get("state")
            district=categories.get("district")
            category=categories.get("category_id")
            country=categories.get("country")
            sub_category=categories.get("sub_category_id")
            countries=categories.get("countries")
            states=categories.get("states")
            districts=categories.get("districts")

            if data.get("type") == "youtube":
                # youtube_urls_response = get_youtube_url(data.get("url"))
                # if youtube_urls_response.status_code == 400:
                #     return youtube_urls_response
                # youtube_urls = youtube_urls_response.data
                row = {"resource": resource, "type":"youtube", "transcription": data.get("transcription"), "url": data.get("url")}
                # for row in playlist_urls:
                serializer = self.get_serializer(data=row)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                LOGGER.info(f"Embeding creation started for youtube url: {row.get('url')}")
                serializer_data = serializer.data
                serializer_data["state"] = state
                serializer_data["category"] = category
                serializer_data["sub_category"] = sub_category
                serializer_data["country"] = country
                serializer_data["district"] = district
                serializer_data["countries"] = countries
                serializer_data["states"] = states
                serializer_data["districts"] = districts

                create_vector_db.delay(serializer_data)
                # create_vector_db(serializer_data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                serializer = self.get_serializer(data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                serializer_data = serializer.data
                serializer_data["state"] = state
                serializer_data["category"] = category
                serializer_data["sub_category"] = sub_category
                serializer_data["country"] = country
                serializer_data["district"] = district
                serializer_data["countries"] = countries
                serializer_data["states"] = states
                serializer_data["districts"] = districts
                create_vector_db.delay(serializer_data)
                # create_vector_db(serializer_data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @transaction.atomic
    @http_request_mutation
    @authenticate_user(model=ResourceFile)
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            resourcefile_id = instance.id
            qdrant_embeddings_delete_file_id([resourcefile_id])
            instance.delete()
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=["post"])
    def resource_live_api_export(self, request):
        """This is an API to fetch the data from an External API with an auth token
        and store it in JSON format."""
        try:
            url = request.data.get("url")
            auth_type = request.data.get("auth_type")
            title = request.data.get("title")
            source = request.data.get("source")
            file_name = request.data.get("file_name")
            resource = request.data.get("resource")
            if auth_type == 'NO_AUTH':
                response = requests.get(url)
            elif auth_type == 'API_KEY':
                headers = {request.data.get(
                    "api_key_name"): request.data.get("api_key_value")}
                response = requests.get(url, headers=headers)
            elif auth_type == 'BEARER':
                headers = {"Authorization": "Bearer " +
                                            request.data.get("token")}
                response = requests.get(url, headers=headers)

            # response = requests.get(url)
            if response.status_code in [200, 201]:
                try:
                    data = response.json()
                except ValueError:
                    data = response.text
                file_path = settings.RESOURCES_URL +f"file {str(uuid.uuid4())}.json"
                format = "w" if os.path.exists(file_path) else "x"
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                with open(file_path, format) as outfile:
                    if type(data) == list:
                        json.dump(data, outfile)
                    else:
                        outfile.write(json.dumps(data))  
                if resource:
                    with open(file_path, "rb") as outfile:  # Open the file in binary read mode
                        # Wrap the file content using Django's ContentFile
                        django_file = ContentFile(outfile.read(), name=f"{file_name}.json")  # You can give it any name you prefer

                        # Prepare data for serializer
                        serializer_data = {"resource": resource, "type": "api", "file": django_file}

                        # Initialize and validate serializer
                        serializer = ResourceFileSerializer(data=serializer_data)
                        serializer.is_valid(raise_exception=True)
                        serializer.save()
                        create_vector_db.delay(serializer.data)
                        # create_vector_db(serializer.data)
                        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
                return Response(file_path)
            LOGGER.error("Failed to fetch data from api")
            return Response({"message": f"API Response: {response.json()}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(
                f"Failed to fetch data from api ERROR: {e} and input fields: {request.data}")
            return Response({"message": f"API Response: {e}"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def fetch_videos(self, request):
        url = request.GET.get("url")
        return get_youtube_url(url)
   
    def retrieve(self, request, pk):
        """GET method: retrieve an object or instance of the Product model"""
        team_member = self.get_object()
        serializer = self.get_serializer(team_member)
        return Response(serializer.data, status=status.HTTP_200_OK)

#
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.prefetch_related("subcategory_category").all()
    serializer_class = CategorySerializer

    @action(detail=False, methods=["get"])
    def categories_and_sub_categories(self, request):
        categories_with_subcategories = {}
        # Retrieve all categories and their related subcategories
        categories = Category.objects.all()

        for category in categories:
            # Retrieve the names of all subcategories related to this category
            subcategory_names = [sub_category.name for sub_category in SubCategory.objects.filter(category=category).all()]
            # Assign the list of subcategory names to the category name in the dictionary
            categories_with_subcategories[category.name] = subcategory_names

        return Response(categories_with_subcategories, 200)
    
    @action(detail=False, methods=["POST"])
    def get_sub_category_id(self, request, *args, **kwargs):
        serializer = CategorySubcategoryInputSerializer(data=request.data)
        if serializer.is_valid():
            category_name = serializer.validated_data['category_name']
            subcategory_name = serializer.validated_data['subcategory_name']
            response_data = {
                'category_id': None,
                'subcategory_id': None
            }
            
            # Check if the category and subcategory exist
            try:
                resource = SubCategory.objects.filter(
                    category__name__iexact=category_name.strip(),
                    name__iexact=subcategory_name.strip()
                ).first()
                if resource:
                    response_data['category_id'] = resource.category_id
                    response_data['title'] = resource.description 
                    response_data['subcategory_id'] = resource.id  # Assuming both ids are the same
            except SubCategory.DoesNotExist:
                return Response({"error": "Category or Subcategory not found"}, status=status.HTTP_404_NOT_FOUND)
            
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes=[]

    @action(detail=False, methods=["post"])
    def dump_categories(self, request):
        data=request.data
        for category_name, sub_categories in data.items():
            category, created = Category.objects.get_or_create(name=category_name)
            print(category)
            for sub_category_name in sub_categories:
                SubCategory.objects.get_or_create(category=category, name=sub_category_name)
        return Response("Data dumped")
    
    @action(detail=False, methods=["get"])
    @transaction.atomic
    def dump_resource_categories_map(self, request):
    # Parse the category JSON field
        resources = Resource.objects.all()
        for resource in resources:
            categories = resource.category
            for category_name, sub_category_names in categories.items():
                category = Category.objects.filter(name=category_name).first()
                for sub_category_name in sub_category_names:
                    # Find the corresponding SubCategory instance
                    try:
                        sub_category = SubCategory.objects.filter(name=sub_category_name, category=category).first()
                        print(sub_category)
                        print(resource)
                        if sub_category:
                            ResourceSubCategoryMap.objects.get_or_create(
                                sub_category=sub_category,
                                resource=resource
                            )
                    except SubCategory.DoesNotExist:
                        print(f"SubCategory '{sub_category_name}' does not exist.")
        return Response("Data dumped")

    @action(detail=False, methods=["get"])
    @transaction.atomic
    def dump_dataset_map(self, request):
    # Parse the category JSON field
        resources = DatasetV2.objects.all()
        for resource in resources:
            categories = resource.category
            for category_name, sub_category_names in categories.items():
                category = Category.objects.filter(name=category_name).first()
                for sub_category_name in sub_category_names:
                    # Find the corresponding SubCategory instance
                    try:
                        sub_category = SubCategory.objects.filter(name=sub_category_name, category=category).first()
                        if sub_category:
                            DatasetSubCategoryMap.objects.get_or_create(
                                sub_category=sub_category,
                                dataset=resource
                            )
                    except SubCategory.DoesNotExist:
                        print(f"SubCategory '{sub_category_name}' does not exist.")
        return Response("Data dumped")

class EmbeddingsViewSet(viewsets.ModelViewSet):
    queryset = LangchainPgEmbedding.objects.all()
    serializer_class = LangChainEmbeddingsSerializer
    lookup_field = 'uuid'  # Specify the UUID field as the lookup field

    @action(detail=False, methods=['get'])
    def embeddings_and_chunks(self, request):
        embeddings = []
        collection_id = request.GET.get("resource_file")
        collection = LangchainPgCollection.objects.filter(name=str(collection_id)).first()
        if collection:
            embeddings = LangchainPgEmbedding.objects.filter(collection_id=collection.uuid).values("embedding","document")
        return Response(embeddings)


    @action(detail=False, methods=['post'])
    def get_embeddings(self, request):
        # Use the 'uuid' field to look up the instance
        # instance = self.get_object()
        uuid=request.data.get("uuid")
        data = LangchainPgEmbedding.objects.filter(uuid=uuid).values("embedding", "document")
        # print(data)
        # import pdb; pdb.set_trace()
        # serializer = self.get_serializer(data)
        return Response(data)
    
    @http_request_mutation
    @action(detail=False, methods=['post'])
    def chat_api(self, request):
        map_id = request.META.get("map_id")
        user_id = request.META.get("user_id")
        data=request.data
        query = request.data.get("query")
        resource_id = request.data.get("resource")
        filters = request.data.get("filters", {})

        try:
            user_name = User.objects.get(id=user_id).first_name
            history = Messages.objects.filter(user_map=map_id).order_by("-created_at")
            history = history.filter(resource_id=resource_id).first() if resource_id else history.first()

            if request.data.get("chain"):
                # summary, chunks, condensed_question, prompt_usage = ConversationRetrival.get_input_embeddings_using_chain(query, user_name, resource_id, history)
                summary, chunks, condensed_question, metadata = VectorDBBuilder.get_input_embeddings_using_chain(query, user_name, resource_id, history, filters)

            else:
                summary, chunks, condensed_question, metadata = VectorDBBuilder.get_input_embeddings_test(query, user_name, resource_id, history, filters)
                # summary, chunks, condensed_question, prompt_usage = Retrival.get_input_embeddings(query, user_name, resource_id, history)
            data = {"user_map": UserOrganizationMap.objects.get(id=map_id).id, "resource": resource_id, "query": query, 
                    "query_response": summary, "condensed_question":condensed_question, "output": metadata}
            messages_serializer = MessagesSerializer(data=data)
            messages_serializer.is_valid(raise_exception=True)
            message_instance = messages_serializer.save()  # This returns the Messages model instance
            data =  messages_serializer.data

            if request.data.get("chain") and chunks:
                embeddings_id = [row.embeddings_id for row in chunks]
                message_instance.retrieved_chunks.set(embeddings_id)
            elif chunks:
                message_instance.retrieved_chunks.set(chunks.values_list("uuid", flat=True))
            return Response(data)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(f"Error During the execution: {str(e)}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @http_request_mutation
    @action(detail=False, methods=['post'])
    def chat_histroy(self, request):
        try:
            map_id = request.META.get("map_id")
            resource_id = request.data.get("resource")
            history = Messages.objects.filter(user_map=map_id, bot_type="vistaar").order_by("created_at")
            if resource_id:
                history = history.filter(resource_id=resource_id).all()
            else:
                history = history.filter(resource_id__isnull=True).all()
            total = len(history)
            slice = 0 if total <= 10 else total-10
            history = history[slice:total]
            messages_serializer = MessagesRetriveSerializer(history, many=True)
            return Response(messages_serializer.data)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def dump_embeddings(self, request):
        # queryset = ResourceFile.objects.all()
        from django.db import models
        from django.db.models.functions import Cast

        queryset = ResourceFile.objects.exclude(
            id__in=Subquery(
                LangchainPgCollection.objects.annotate(
                    uuid_name=Cast('name', models.UUIDField())
                ).values('uuid_name')
            )
        ).all()
        serializer = ResourceFileSerializer(queryset, many=True)
        data=serializer.data
        total_files = len(data)
        count=0
        for row in data:
            count +=1
            VectorDBBuilder.create_vector_db(row)
            print(f"resource {row} is completed")
            print(f"{count} completed out of {total_files}")
        return Response("embeddings created for all the files")
    
class ResourceUsagePolicyListCreateView(generics.ListCreateAPIView):
    queryset = ResourceUsagePolicy.objects.all()
    serializer_class = ResourceUsagePolicySerializer

class ResourceUsagePolicyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ResourceUsagePolicy.objects.all()
    serializer_class = ResourceUsagePolicySerializer
    api_builder_serializer_class = ResourceAPIBuilderSerializer

    @authenticate_user(model=ResourceUsagePolicy)
    def patch(self, request, *args, **kwargs):
        # import pdb;pdb.set_trace()
        instance = self.get_object()
        approval_status = request.data.get('approval_status')
        policy_type = request.data.get('type', None)
        instance.api_key = None
        try:
            if approval_status == 'approved':
                instance.api_key = generate_api_key()
            serializer = self.api_builder_serializer_class(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=200)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response(str(error), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MessagesViewSet(generics.RetrieveUpdateDestroyAPIView):
    queryset = Messages.objects.all()
    serializer_class = MessagesSerializer

    def delete(self, request, *args, **kwargs):
        return Response("You don't have access to delete the chat history", status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = MessagesRetriveSerializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response(str(error), status=status.HTTP_400_BAD_REQUEST)

class MessagesCreateViewSet(generics.ListCreateAPIView):
    queryset = Messages.objects.all()
    serializer_class = MessagesSerializer
    pagination_class = CustomPagination

    @http_request_mutation
    def list(self, request, *args, **kwargs):
        resource_id = request.GET.get("resource")
        user_map = request.META.get("map_id")
        if resource_id:
            queryset = Messages.objects.filter(resource_id=resource_id).order_by("-created_at").all()
        else:
            queryset = Messages.objects.filter(user_map=user_map).order_by("-created_at").all()
        page = self.paginate_queryset(queryset)
        serializer = MessagesChunksRetriveSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class FetchFiles(viewsets.ModelViewSet):
    serializer = SourceDetailsSerializer
    permission_classes = []
    
    @action(detail=False, methods=['post'])
    def fetch_files(self, request):
        serializer = self.serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            source_type = serializer.validated_data['source_type']
            details = serializer.validated_data['details']
            try:
                # Handle different source types
                if source_type == 's3':
                    files = self.fetch_files_from_s3(details)
                elif source_type == 'google_drive':
                    files = self.fetch_files_from_google_drive(details)
                elif source_type == 'dropbox':
                    files = self.fetch_files_from_dropbox(details)
                elif source_type == 'azure_blob':
                    files = self.fetch_files_from_azure_blob(details)
                else:
                    return Response({"detail": "Unsupported source type"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                LOGGER.error(f"Failed to pull the recourds from {source_type} ERROR: {e}")
                return Response(str(e), 500)
            
            if not files:
                return Response({"detail": "No files found"}, status=status.HTTP_404_NOT_FOUND)

            # Serialize the file response
            file_response_serializer = FileResponseSerializer(data={'files': files})
            if file_response_serializer.is_valid():
                return Response(file_response_serializer.data, status=status.HTTP_200_OK)

            return Response(file_response_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def fetch_files_from_s3(self, details):
        s3_client = boto3.client(
            's3',
            aws_access_key_id=details['aws_access_key_id'],
            aws_secret_access_key=details['aws_secret_access_key'],
            region_name=details['region']
        )
        bucket_name = details['bucket_name']
        files = s3_client.list_objects_v2(Bucket=bucket_name)

        if 'Contents' not in files:
            return []

        # Allowed file extensions
        allowed_extensions = ('.pdf', '.json', '.doc', '.docx')

        # Filter files by extension
        file_list = []
        for item in files['Contents']:
            file_name = item['Key']
            if file_name.lower().endswith(allowed_extensions):
                https_url = f"https://{bucket_name}.s3.{details['region']}.amazonaws.com/{file_name}"
                file_list.append({'file_name': str(item['Key']).split("/")[-1], 'file_url': https_url})
        
        return file_list
    
    # Fetch files from Google Drive
    def fetch_files_from_google_drive(self, details):
        creds = ServiceAccountCredentials.from_service_account_file("creds.json")
        drive_service = build('drive', 'v3', credentials=creds)

        # Define the query to filter files within the specified folder
        folder_url = details.get('folder_url', '')
        folder_id_match = re.search(r"folders/([a-zA-Z0-9-_]+)", folder_url)
        if not folder_id_match:
            raise ValueError("Invalid folder URL provided.")
        folder_id = folder_id_match.group(1)
        # Recursive function to fetch files
        def fetch_files_in_folder(folder_id):
            query = f"'{folder_id}' in parents and trashed=false"
            results = drive_service.files().list(q=query, fields="files(id, name, mimeType)").execute()
            items = results.get('files', [])
            
            pdf_files = []
            for item in items:
                # Check if it's a folder or a file
                if item['mimeType'] == 'application/vnd.google-apps.folder':
                    # Recursive call for subfolder
                    pdf_files.extend(fetch_files_in_folder(item['id']))
                elif item['mimeType'] == 'application/pdf':
                    # Collect PDF file details
                    pdf_files.append({
                        'file_name': item['name'],
                        'file_url': f"https://drive.google.com/file/d/{item['id']}"
                    })
            return pdf_files

        # Fetch files from the root folder provided in details
        if not folder_id:
            return []

        return fetch_files_in_folder(folder_id)

    # Fetch files from Dropbox
    def fetch_files_from_dropbox(self, details):
        # dbx = dropbox.Dropbox(details['access_token'])
        # result = dbx.files_list_folder('')
        # files = result.entries

        # if not files:
        #     return []

        # return [{'file_name': file.name, 'file_url': f"https://www.dropbox.com/home/{file.path_display}"} for file in files]
        # Initialize Dropbox client
        dbx = dropbox.Dropbox(details['access_token'])
        
        # List files in the root folder
        result = dbx.files_list_folder('')
        files = result.entries

        # If no files are found, return an empty list
        if not files:
            return []

        # List to store file details with public URLs
        file_details = []

        # Loop through each file and generate a shared link
        for file in files:
            if isinstance(file, dropbox.files.FileMetadata):
                try:
                    # Create a shared link for the file
                    shared_link_metadata = dbx.sharing_create_shared_link(file.path_display)
                    file_url = shared_link_metadata.url.replace("dl=0", "dl=1")  # Adjust URL for direct download

                    file_details.append({
                        'file_name': file.name,
                        'file_url': file_url
                    })
                except dropbox.exceptions.ApiError as e:
                    print(f"Error generating shared link for {file.name}: {e}")
        
        return file_details
        # Fetch files from Azure Blob Storage
    def fetch_files_from_azure_blob(self, details):
        blob_service_client = BlobServiceClient(account_url=details['account_url'], credential=details['account_key'])
        container_client = blob_service_client.get_container_client(details['container_name'])
        blob_list = container_client.list_blobs()

        if not blob_list:
            return []

        return [{'file_name': blob.name, 'file_url': f"{details['account_url']}/{details['container_name']}/{blob.name}"} for blob in blob_list]

# old_base_url = 'users/resources/'
# new_base_url = f'https://{settings.AWS_S3_CUSTOM_DOMAIN}/users/resources/'

# resources = ResourceFile.objects.all()
# total = len(resources)
# for index, resource in enumerate(resources):
#     print(f"{index} completed out of {total}")
#     if resource.file.name.startswith('users/resources/'):
#         old_path = resource.file.name
#         new_path = old_path.replace(old_base_url, new_base_url)
#         resource.file.name = new_path
#         resource.save()

# @shared_task
def pull_data_for_user(user_id):
    # Get the user's data pull configuration
    config = UserDataPullConfig.objects.get(user_id=user_id)

    # Determine when the next pull is due
    current_time = datetime.now()

    # Check if the pull frequency is due (weekly or monthly)
    if config.pull_frequency == 'weekly' and (current_time - config.last_pull >= timedelta(weeks=1)):
        # Fetch data from the external API (e.g., some URL)
        response = requests.get("YOUR_DATA_API_URL")
        if response.status_code == 200:
            data = response.json()
            
            for item in data:
                # Create a new DatasetV2File entry for the fetched data
                # Create a unique identifier for the file (you can customize how to name the file)
                file_name = f"{uuid.uuid4().hex}_{item['file_name']}"  # Adjust according to API response

                # If the file is returned as a URL or content, handle accordingly
                file_content = requests.get(item['file_url']).content  # Assuming `file_url` is returned in the API response
                
                # Create the DatasetV2File record
                dataset_file = DatasetV2File.objects.create(
                    dataset=item['dataset'],  # Map to the DatasetV2 instance
                    source="api",  # Indicating that the file source is from the API
                    file=ContentFile(file_content, name=file_name),  # Save the file to Django storage
                    file_size=len(file_content),  # Set the file size from content
                    standardised_file=item.get('standardised_file', None),  # If standardised file exists
                    standardised_configuration=item.get('standardised_configuration', {}),
                    accessibility=item.get('accessibility', 'public'),
                    connection_details=item.get('connection_details', {}),
                )

                # Map the DatasetV2File to UserDataPullConfig
                config.resource_file = dataset_file
                config.save()

        # Update the last pull time
        config.last_pull = current_time
        config.save()

    elif config.pull_frequency == 'monthly' and (current_time - config.last_pull >= timedelta(weeks=4)):
        # Fetch monthly data (similar to weekly but can be different API or logic)
        response = requests.get("YOUR_MONTHLY_DATA_API_URL")
        if response.status_code == 200:
            data = response.json()
            
            for item in data:
                # Create a new DatasetV2File entry for the fetched data
                file_name = f"{uuid.uuid4().hex}_{item['file_name']}"
                file_content = requests.get(item['file_url']).content  # Download the file content

                dataset_file = DatasetV2File.objects.create(
                    dataset=item['dataset'],  # Link to the DatasetV2 model
                    source="api",
                    file=ContentFile(file_content, name=file_name),
                    file_size=len(file_content),
                    standardised_file=item.get('standardised_file', None),
                    standardised_configuration=item.get('standardised_configuration', {}),
                    accessibility=item.get('accessibility', 'public'),
                    connection_details=item.get('connection_details', {}),
                )

                # Link to the UserDataPullConfig
                config.resource_file = dataset_file
                config.save()

        # Update the last pull time
        config.last_pull = current_time
        config.save()
        
def telegram_dashboard(request):
    return render(request, 'streamlit.html', {'url': os.getenv("TELEGRAM_URL")})

def coco_dashboard(request):
    return render(request, 'streamlit.html', {'url':os.getenv("COCO_URL")})

def farmer_registry_dashboard(request):
    return render(request, 'streamlit.html', {'url': os.getenv("FARMER_REGISTRY_URL")})

def da_registry_dashboard(request):
    return render(request, 'streamlit.html', {'url': os.getenv("DA_REGISTRY_URL")})
