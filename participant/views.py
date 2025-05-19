import ast
import datetime
import json
import logging
import operator
import os
import re
import subprocess
import time
import csv
from bdb import set_trace
from contextlib import closing
from functools import reduce
from sre_compile import isstring
from struct import unpack
from timeit import Timer

import mysql.connector
import pandas as pd
import psycopg2
import requests
import xlwt
from django.conf import settings
from django.db.models import Q
from django.db.models.functions import Lower
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from psycopg2 import errorcodes
from rest_framework import pagination, serializers, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ViewSet
from uritemplate import partial

from accounts.models import User
from core.constants import Constants, NumericalConstants
from core.utils import (
    CustomPagination,
    DefaultPagination,
    Utils,
    csv_and_xlsx_file_validatation,
    date_formater,
    one_day_date_formater,
    read_contents_from_csv_or_xlsx_file,
    timer,
)
from datahub.models import (
    Datasets,
    DatasetV2,
    DatasetV2File,
    Organization,
    UserOrganizationMap,
)
from datahub.serializers import DatasetFileV2NewSerializer
from participant.internal_services.support_ticket_internal_services import (
    SupportTicketInternalServices,
)
from participant.models import (
    Connectors,
    ConnectorsMap,
    Department,
    Project,
    Resolution,
    SupportTicket,
    SupportTicketV2,
)
from participant.serializers import (
    ConnectorListSerializer,
    ConnectorsConsumerRelationSerializer,
    ConnectorsListSerializer,
    ConnectorsMapConsumerRetriveSerializer,
    ConnectorsMapProviderRetriveSerializer,
    ConnectorsMapSerializer,
    ConnectorsProviderRelationSerializer,
    ConnectorsRetriveSerializer,
    ConnectorsSerializer,
    ConnectorsSerializerForEmail,
    CreateSupportTicketResolutionsSerializer,
    CreateSupportTicketV2Serializer,
    DatabaseColumnRetrieveSerializer,
    DatabaseConfigSerializer,
    DatabaseDataExportSerializer,
    DatasetSerializer,
    DepartmentSerializer,
    ParticipantDatasetsDetailSerializer,
    ParticipantDatasetsDropDownSerializer,
    ParticipantDatasetsSerializer,
    ParticipantDatasetsSerializerForEmail,
    ParticipantSupportTicketSerializer,
    ProjectDepartmentSerializer,
    ProjectSerializer,
    SupportTicketResolutionsSerializer,
    SupportTicketResolutionsSerializerMinimised,
    SupportTicketV2Serializer,
    TicketSupportSerializer,
    UpdateSupportTicketV2Serializer,
)
from utils import file_operations as file_ops
from utils import string_functions
from utils.authorization_services import support_ticket_role_authorization

# from utils.connector_utils import run_containers, stop_containers
from utils.file_operations import check_file_name_length
from utils.jwt_services import http_request_mutation

LOGGER = logging.getLogger(__name__)


class ParticipantSupportViewSet(GenericViewSet):
    """
    This class handles the participant CRUD operations.
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
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @http_request_mutation
    def list(self, request, *args, **kwargs):
        """GET method: query all the list of objects from the Product model"""
        try:
            user_id = request.META.get(Constants.USER_ID)
            data = (
                SupportTicket.objects.select_related(
                    Constants.USER_MAP,
                    Constants.USER_MAP_USER,
                    Constants.USER_MAP_ORGANIZATION,
                )
                .filter(user_map__user__status=True, user_map__user=user_id)
                .order_by(Constants.UPDATED_AT)
                .reverse()
                .all()
            )
            page = self.paginate_queryset(data)
            participant_serializer = ParticipantSupportTicketSerializer(page, many=True)
            return self.get_paginated_response(participant_serializer.data)
        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk):
        """GET method: retrieve an object or instance of the Product model"""
        try:
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
        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        """PUT method: update or send a PUT request on an object of the Product model"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=None)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ParticipantDatasetsViewSet(GenericViewSet):
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

    def create(self, request, *args, **kwargs):
        """creates a new participant dataset and triggers an email to the datahub admin requesting for approval of dataset"""
        setattr(request.data, "_mutable", True)

        data = request.data
        user_org_map = UserOrganizationMap.objects.get(
            id=data.get(Constants.USER_MAP))
        user = User.objects.get(id=user_org_map.user_id)

        if not data.get("is_public"):
            if not csv_and_xlsx_file_validatation(request.data.get(Constants.SAMPLE_DATASET)):
                return Response(
                    {
                        Constants.SAMPLE_DATASET: [
                            "Invalid Sample dataset file (or) Atleast 5 rows should be available. please upload valid file"
                        ]
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if data.get("constantly_update") == "false":
            formatted_date = one_day_date_formater(
                [data.get("data_capture_start", ""), data.get("data_capture_end")])
            data["data_capture_start"] = formatted_date[0]
            data["data_capture_end"] = formatted_date[1]
        if user.approval_status == True:
            data["approval_status"] = Constants.APPROVED
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)  # save data

        try:
            # initialize an email to datahub admin for approval of the dataset and save the data
            serializer_email = ParticipantDatasetsSerializerForEmail(data)
            recepient = User.objects.filter(role_id=1).first()
            subject = Constants.ADDED_NEW_DATASET_SUBJECT + os.environ.get(
                Constants.DATAHUB_NAME, Constants.datahub_name
            )
            datahub_admin_name = string_functions.get_full_name(
                recepient.first_name, recepient.last_name)
            formatted_date = one_day_date_formater(
                [data.get("data_capture_start", ""), data.get("data_capture_end")])
            email_data = {
                Constants.datahub_name: os.environ.get(Constants.DATAHUB_NAME, Constants.datahub_name),
                "datahub_admin_name": datahub_admin_name,
                Constants.datahub_site: os.environ.get(Constants.DATAHUB_SITE, Constants.datahub_site),
                "dataset": serializer_email.data,
            }

            email_render = render(
                request, Constants.NEW_DATASET_UPLOAD_REQUEST_IN_DATAHUB, email_data)
            mail_body = email_render.content.decode("utf-8")
            Utils().send_email(
                to_email=recepient.email,
                content=mail_body,
                subject=subject,
            )
            LOGGER.info(
                f"Successfully saved the dataset and emailed datahub admin: {recepient.email} for approval of dataset. \n dataset saved: {serializer.data}"
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response({"Error": ["Bad Request"]}, status=status.HTTP_400_BAD_REQUEST)

    @http_request_mutation
    def list(self, request, *args, **kwargs):
        """GET method: query all the list of objects from the Product model"""
        try:
            data = []
            user_id = request.META.get(Constants.USER_ID, "")
            org_id = request.META.get(Constants.ORG_ID)
            exclude = {Constants.USER_MAP_USER: user_id} if org_id else {}
            filters = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {Constants.USER_MAP_USER: user_id}
            if filters:
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
            participant_serializer = ParticipantDatasetsSerializer(page, many=True)
            return self.get_paginated_response(participant_serializer.data)
        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["get"])
    @http_request_mutation
    def list_of_datasets(self, request, *args, **kwargs):
        """GET method: query all the list of objects from the Product model"""
        try:
            data = []
            user_id = request.META.get(Constants.USER_ID, "")
            filters = {Constants.USER_MAP_USER: user_id} if user_id else {}
            data = (
                Datasets.objects.select_related(
                    Constants.USER_MAP,
                    Constants.USER_MAP_USER,
                    Constants.USER_MAP_ORGANIZATION,
                )
                .filter(
                    user_map__user__status=True,
                    status=True,
                    approval_status="approved",
                    **filters,
                )
                .order_by(Constants.UPDATED_AT)
                .reverse()
                .all()
            )
            participant_serializer = ParticipantDatasetsDropDownSerializer(data, many=True)
            return Response(participant_serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk):
        """GET method: retrieve an object or instance of the Product model"""
        try:
            data = (
                Datasets.objects.select_related(
                    Constants.USER_MAP,
                    Constants.USER_MAP_USER,
                    Constants.USER_MAP_ORGANIZATION,
                )
                .filter(user_map__user__status=True, status=True, id=pk)
                .all()
            )
            participant_serializer = ParticipantDatasetsDetailSerializer(data, many=True)
            if participant_serializer.data:
                data = participant_serializer.data[0]
                if not data.get("is_public"):
                    data[Constants.CONTENT] = read_contents_from_csv_or_xlsx_file(data.get(Constants.SAMPLE_DATASET))

                return Response(data, status=status.HTTP_200_OK)
            return Response({}, status=status.HTTP_200_OK)
        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        if data.get("constantly_update") == "false":
            if "data_capture_start" in data and "data_capture_end" in data:
                formatted_date = one_day_date_formater(
                    [data.get("data_capture_start", ""),
                     data.get("data_capture_end")]
                )
                data["data_capture_start"] = formatted_date[0]
                data["data_capture_end"] = formatted_date[1]
        category = data.get(Constants.CATEGORY)
        if category:
            data[Constants.CATEGORY] = json.dumps(json.loads(
                category)) if isinstance(category, str) else category
        instance = self.get_object()

        # trigger email to the participant
        user_map_queryset = UserOrganizationMap.objects.select_related(
            Constants.USER).get(id=instance.user_map_id)
        user_obj = user_map_queryset.user

        # reset the approval status b/c the user modified the dataset after an approval
        if getattr(instance, Constants.APPROVAL_STATUS) == Constants.APPROVED and (
                user_obj.role_id == 3 or user_obj.role_id == 4
        ):
            data[Constants.APPROVAL_STATUS] = Constants.AWAITING_REVIEW

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        try:
            # initialize an email to datahub admin for approval of the dataset and save the data
            serializer_email = ParticipantDatasetsSerializerForEmail(data)
            recepient = User.objects.filter(role_id=1).first()
            subject = Constants.UPDATED_DATASET_SUBJECT + os.environ.get(
                Constants.DATAHUB_NAME, Constants.datahub_name
            )
            datahub_admin_name = string_functions.get_full_name(
                recepient.first_name, recepient.last_name)
            formatted_date = one_day_date_formater(
                [data.get("data_capture_start", ""), data.get("data_capture_end")])
            email_data = {
                Constants.datahub_name: os.environ.get(Constants.DATAHUB_NAME, Constants.datahub_name),
                "datahub_admin_name": datahub_admin_name,
                Constants.datahub_site: os.environ.get(Constants.DATAHUB_SITE, Constants.datahub_site),
                "dataset": serializer_email.data,
            }

            email_render = render(
                request, Constants.DATASET_UPDATE_REQUEST_IN_DATAHUB, email_data)
            mail_body = email_render.content.decode("utf-8")
            Utils().send_email(
                to_email=recepient.email,
                content=mail_body,
                subject=subject,
            )
            LOGGER.info(
                f"Successfully updated the dataset and emailed datahub admin: {recepient.email} for approval of dataset. \n dataset saved: {serializer.data}"
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response({"Error": ["Bad Request"]}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk):
        """DELETE method: delete an object"""
        try:
            product = self.get_object()
            product.status = False
            self.perform_create(product)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["post"])
    @http_request_mutation
    def dataset_filters(self, request, *args, **kwargs):
        """This function get the filter args in body. based on the filter args orm filters the data."""
        data = request.data
        org_id = data.pop(Constants.ORG_ID, "")
        others = data.pop(Constants.OTHERS, "")
        user_id = data.pop(Constants.USER_ID, "")

        org_id = request.META.pop(Constants.ORG_ID, "")
        others = request.META.pop(Constants.OTHERS, "")
        user_id = request.META.pop(Constants.USER_ID, "")

        categories = data.pop(Constants.CATEGORY, None)
        exclude, filters = {}, {}
        if others:
            exclude = {
                Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
            filters = {Constants.APPROVAL_STATUS: Constants.APPROVED}
        else:
            filters = {
                Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
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
                    .filter(
                        user_map__user__status=True,
                        status=True,
                        **data,
                        **filters,
                    )
                    .exclude(**exclude)
                    .order_by(Constants.UPDATED_AT)
                    .reverse()
                    .all()
                )
        except Exception as error:  # type: ignore
            LOGGER.error(
                "Error while filtering the datasets. ERROR: %s", error)
            return Response(f"Invalid filter fields: {list(request.data.keys())}", status=500)

        page = self.paginate_queryset(data)
        participant_serializer = ParticipantDatasetsSerializer(page, many=True)
        return self.get_paginated_response(participant_serializer.data)

    @action(detail=False, methods=["post"])
    @http_request_mutation
    def filters_data(self, request, *args, **kwargs):
        """This function provides the filters data"""
        data = request.data
        org_id = data.pop(Constants.ORG_ID, "")
        others = data.pop(Constants.OTHERS, "")
        user_id = data.pop(Constants.USER_ID, "")

        org_id = request.META.pop(Constants.ORG_ID, "")
        others = request.META.pop(Constants.OTHERS, "")
        user_id = request.META.pop(Constants.USER_ID, "")

        exclude, filters = {}, {}
        if others:
            exclude = {
                Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
            filters = {Constants.APPROVAL_STATUS: Constants.APPROVED}
        else:
            filters = {
                Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
        try:
            geography = (
                Datasets.objects.all()
                .select_related(Constants.USER_MAP_ORGANIZATION, Constants.USER_MAP_USER)
                .values_list(Constants.GEOGRAPHY, flat=True)
                .filter(user_map__user__status=True, status=True, **filters)
                .exclude(geography="")
                .exclude(**exclude)
                .all()
                .distinct()
            )
            crop_detail = (
                Datasets.objects.all()
                .select_related(Constants.USER_MAP_ORGANIZATION, Constants.USER_MAP_USER)
                .values_list(Constants.CROP_DETAIL, flat=True)
                .filter(user_map__user__status=True, status=True, **filters)
                .exclude(crop_detail="")
                .exclude(**exclude)
                .all()
                .distinct()
            )
            with open(Constants.CATEGORIES_FILE, "r") as json_obj:
                category_detail = json.loads(json_obj.read())
        except Exception as error:  # type: ignore
            LOGGER.error(
                "Error while filtering the datasets. ERROR: %s", error)
            return Response(f"Invalid filter fields: {list(request.data.keys())}", status=500)
        return Response(
            {
                "geography": geography,
                "crop_detail": crop_detail,
                "category_detail": category_detail,
            },
            status=200,
        )

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
            exclude = {
                Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
            filters = (
                {
                    Constants.APPROVAL_STATUS: Constants.APPROVED,
                    Constants.NAME_ICONTAINS: search_pattern,
                }
                if search_pattern
                else {}
            )
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
            LOGGER.error(
                "Error while filtering the datasets. ERROR: %s", error)
            return Response(
                f"Invalid filter fields: {list(request.data.keys())}",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        page = self.paginate_queryset(data)
        participant_serializer = ParticipantDatasetsSerializer(page, many=True)
        return self.get_paginated_response(participant_serializer.data)


class ParticipantConnectorsViewSet(GenericViewSet):
    """
    This class handles the participant Datsets CRUD operations.
    """

    parser_class = JSONParser
    serializer_class = ConnectorsSerializer
    queryset = Connectors
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

    def trigger_email(self, request, template, subject, user_org_map, connector_data, dataset):
        """trigger email to the respective users"""
        try:
            datahub_admin = User.objects.filter(role_id=1).first()
            admin_full_name = string_functions.get_full_name(
                datahub_admin.first_name, datahub_admin.last_name)
            participant_org = Organization.objects.get(
                id=user_org_map.organization_id) if user_org_map else None
            participant_org_address = string_functions.get_full_address(
                participant_org.address)
            participant = User.objects.get(id=user_org_map.user_id)
            participant_full_name = string_functions.get_full_name(
                participant.first_name, participant.last_name)

            data = {
                "datahub_name": os.environ.get("DATAHUB_NAME", "datahub_name"),
                "datahub_admin": admin_full_name,
                "participant_admin_name": participant_full_name,
                "participant_email": participant.email,
                "connector": connector_data,
                "participant_org": participant_org,
                "participant_org_address": participant_org_address,
                "dataset": dataset,
                "datahub_site": os.environ.get("DATAHUB_SITE", "datahub_site"),
            }

            email_render = render(request, template, data)
            mail_body = email_render.content.decode("utf-8")
            Utils().send_email(
                to_email=datahub_admin.email,
                content=mail_body,
                subject=subject,
            )

        except Exception as error:
            LOGGER.error(error, exc_info=True)

    def create(self, request, *args, **kwargs):
        """POST method: create action to save an object by sending a POST request"""
        setattr(request.data, "_mutable", True)
        data = request.data
        docker_image = data.get(Constants.DOCKER_IMAGE_URL)
        try:
            docker = docker_image.split(":")
            response = requests.get(
                f"https://hub.docker.com/v2/repositories/{docker[0]}/tags/{docker[1]}")
            images = response.json().get(Constants.IMAGES, [{}])
            hash = [image.get(Constants.DIGEST, "")
                    for image in images if image.get("architecture") == "amd64"]
            data[Constants.USAGE_POLICY] = hash[0].split(":")[1].strip()
        except Exception as error:
            LOGGER.error(
                "Error while fetching the hash value. ERROR: %s", error)
            return Response(
                {Constants.DOCKER_IMAGE_URL: [
                    f"Invalid docker Image: {docker_image}"]},
                status=400,
            )
        serializer = self.get_serializer(data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        user_org_map = UserOrganizationMap.objects.select_related(Constants.ORGANIZATION).get(
            id=serializer.data.get(Constants.USER_MAP)
        )
        dataset = Datasets.objects.get(
            id=serializer.data.get(Constants.DATASET))
        self.trigger_email(
            request,
            Constants.CREATE_CONNECTOR_AND_REQUEST_CERTIFICATE,
            Constants.CREATE_CONNECTOR_AND_REQUEST_CERTIFICATE_SUBJECT,
            user_org_map,
            serializer.data,
            dataset,
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        """GET method: query all the list of objects from the Product model"""
        try:
            data = []
            user_id = request.query_params.get(Constants.USER_ID, "")
            filters = {Constants.USER_MAP_USER: user_id} if user_id else {}
            if filters:
                data = (
                    Connectors.objects.select_related(
                        Constants.DATASET,
                        Constants.USER_MAP,
                        Constants.PROJECT,
                        Constants.PROJECT_DEPARTMENT,
                    )
                    .filter(
                        user_map__user__status=True,
                        dataset__status=True,
                        status=True,
                        **filters,
                    )
                    .order_by(Constants.UPDATED_AT)
                    .reverse()
                    .all()
                )
            page = self.paginate_queryset(data)
            participant_serializer = ConnectorsListSerializer(page, many=True)
            return self.get_paginated_response(participant_serializer.data)
        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk):
        """GET method: retrieve an object or instance of the Product model"""
        try:
            data = (
                Connectors.objects.select_related(
                    Constants.DATASET,
                    Constants.USER_MAP,
                    Constants.USER_MAP_USER,
                    Constants.USER_MAP_ORGANIZATION,
                )
                .filter(user_map__user__status=True, dataset__status=True, status=True, id=pk)
                .all()
            )
            participant_serializer = ConnectorsRetriveSerializer(data, many=True)
            if participant_serializer.data:
                data = participant_serializer.data[0]
                if data.get(Constants.CONNECTOR_TYPE) == "Provider":
                    relation = (
                        ConnectorsMap.objects.select_related(
                            Constants.CONSUMER,
                            Constants.CONSUMER_DATASET,
                            Constants.CONSUMER_PROJECT,
                            Constants.CONSUMER_PROJECT_DEPARTMENT,
                            Constants.CONSUMER_USER_MAP_ORGANIZATION,
                        )
                        .filter(
                            status=True,
                            provider=pk,
                            consumer__status=True,
                            connector_pair_status__in=[
                                Constants.PAIRED,
                                Constants.AWAITING_FOR_APPROVAL,
                            ],
                        )
                        .all()

                    )
                    relation_serializer = ConnectorsMapConsumerRetriveSerializer(relation, many=True)
                else:
                    relation = (
                        ConnectorsMap.objects.select_related(
                            Constants.PROVIDER,
                            Constants.PROVIDER_DATASET,
                            Constants.PROVIDER_PROJECT,
                            Constants.PROVIDER_PROJECT_DEPARTMENT,
                            Constants.PROVIDER_USER_MAP_ORGANIZATION,
                        )
                        .filter(
                            status=True,
                            consumer=pk,
                            provider__status=True,
                            connector_pair_status__in=[
                                Constants.PAIRED,
                                Constants.AWAITING_FOR_APPROVAL,
                            ],
                        )
                        .all()
                    )
                    relation_serializer = ConnectorsMapProviderRetriveSerializer(relation, many=True)
                data[Constants.RELATION] = relation_serializer.data
                return Response(data, status=status.HTTP_200_OK)
            return Response({}, status=status.HTTP_200_OK)
        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        """PUT method: update or send a PUT request on an object of the Product model"""
        instance = self.get_object()
        setattr(request.data, "_mutable", True)
        data = request.data
        docker_image = data.get(Constants.DOCKER_IMAGE_URL)
        if docker_image:
            try:
                docker = docker_image.split(":")
                response = requests.get(
                    f"https://hub.docker.com/v2/repositories/{docker[0]}/tags/{docker[1]}")
                images = response.json().get(Constants.IMAGES, [{}])
                hash = [image.get(Constants.DIGEST, "") for image in images if image.get(
                    "architecture") == "amd64"]
                data[Constants.USAGE_POLICY] = hash[0].split(":")[1].strip()
            except Exception as error:
                LOGGER.error(
                    "Error while fetching the hash value. ERROR: %s", error)
                return Response(
                    {Constants.DOCKER_IMAGE_URL: [
                        f"Invalid docker Image: {docker_image}"]},
                    status=400,
                )
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        if request.data.get(Constants.CERTIFICATE):
            user_org_map = UserOrganizationMap.objects.select_related(Constants.ORGANIZATION).get(
                id=serializer.data.get(Constants.USER_MAP)
            )
            dataset = Datasets.objects.get(
                id=serializer.data.get(Constants.DATASET))
            subject = (
                    "A certificate on " +
                    os.environ.get("DATAHUB_NAME", "datahub_name") +
                    " was successfully installed"
            )
            self.trigger_email(
                request,
                Constants.PARTICIPANT_INSTALLS_CERTIFICATE,
                subject,
                user_org_map,
                serializer.data,
                dataset,
            )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk):
        """DELETE method: delete an object"""
        try:
            connector = self.get_object()
            if connector.connector_status in [Constants.UNPAIRED, Constants.REJECTED]:
                connector.status = False
                self.perform_create(connector)
            else:
                return Response(
                    ["Connector status should be either unpaired or rejected to delete"],
                    status=400,
                )
            user_org_map = UserOrganizationMap.objects.select_related(Constants.ORGANIZATION).get(
                id=connector.user_map_id
            )
            dataset = Datasets.objects.get(id=connector.dataset_id)
            self.trigger_email(
                request,
                "deleting_connector.html",
                Constants.CONNECTOR_DELETION +
                os.environ.get("DATAHUB_NAME", "datahub_name"),
                user_org_map,
                connector,
                dataset,
            )

            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["post"])
    @http_request_mutation
    def connectors_filters(self, request, *args, **kwargs):
        """This function get the filter args in body. based on the filter args orm filters the data."""
        data = request.META
        user_id = data.pop(Constants.USER_ID, "")
        filters = {Constants.USER_MAP_USER: user_id} if user_id else {}
        try:
            data = (
                Connectors.objects.select_related(
                    Constants.DATASET,
                    Constants.USER_MAP,
                    Constants.PROJECT,
                    Constants.DEPARTMENT,
                )
                .filter(
                    status=True,
                    dataset__status=True,
                    **data,
                    **filters,
                )
                .order_by(Constants.UPDATED_AT)
                .reverse()
                .all()
            )
        except Exception as error:  # type: ignore
            LOGGER.error(
                "Error while filtering the datasets. ERROR: %s", error)
            return Response(f"Invalid filter fields: {list(request.data.keys())}", status=500)

        page = self.paginate_queryset(data)
        participant_serializer = ConnectorsListSerializer(page, many=True)
        return self.get_paginated_response(participant_serializer.data)

    @action(detail=False, methods=["post"])
    @http_request_mutation
    def filters_data(self, request, *args, **kwargs):
        """This function provides the filters data"""
        data = request.META
        user_id = data.pop(Constants.USER_ID)
        filters = {Constants.USER_MAP_USER: user_id} if user_id else {}
        try:
            projects = (
                Connectors.objects.select_related(
                    Constants.DATASET, Constants.PROJECT, Constants.USER_MAP)
                .values_list(Constants.PROJECT_PROJECT_NAME, flat=True)
                .distinct()
                .filter(dataset__status=True, status=True, **filters)
                .exclude(project__project_name__isnull=True, project__project_name__exact="")
            )
            departments = (
                Connectors.objects.select_related(
                    Constants.DATASET, Constants.DEPARTMENT, Constants.DATASET_USER_MAP)
                .values_list(Constants.DEPARTMENT_DEPARTMENT_NAME, flat=True)
                .distinct()
                .filter(dataset__status=True, status=True, **filters)
                .exclude(
                    project__department__department_name__isnull=True,
                    project__department__department_name__exact="",
                )
            )
            datasests = (
                Datasets.objects.all()
                .select_related(Constants.USER_MAP, Constants.USER_MAP_USER)
                .filter(user_map__user=user_id, user_map__user__status=True, status=True)
            )
            is_datset_present = True if datasests else False
        except Exception as error:  # type: ignore
            LOGGER.error(
                "Error while filtering the datasets. ERROR: %s", error)
            return Response(f"Invalid filter fields: {list(request.data.keys())}", status=500)
        return Response(
            {
                Constants.PROJECTS: list(projects),
                Constants.DEPARTMENTS: list(departments),
                Constants.IS_DATASET_PRESENT: is_datset_present,
            },
            status=200,
        )

    @action(detail=False, methods=["get"])
    def get_connectors(self, request, *args, **kwargs):
        try:
            dataset_id = request.query_params.get(Constants.DATASET_ID, "")
            data = Connectors.objects.all().filter(
                dataset=dataset_id,
                status=True,
                connector_status__in=[
                    Constants.UNPAIRED,
                    Constants.PAIRING_REQUEST_RECIEVED,
                ],
                connector_type="Provider",
            )
            connector_serializer = ConnectorListSerializer(data, many=True)
            return Response(connector_serializer.data, status=200)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)


        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["get"])
    def show_data(self, request, *args, **kwargs):
        port = request.query_params.get("port", "")
        return Response(
            requests.get(
                f'{os.environ.get("REACT_APP_BASEURL_without_slash_view_data")}{port}/show_data').json(),
            200,
        )


class ParticipantConnectorsMapViewSet(GenericViewSet):
    """
    This class handles the participant Datsets CRUD operations.
    """

    parser_class = JSONParser
    serializer_class = ConnectorsMapSerializer
    queryset = ConnectorsMap
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

    def trigger_email_for_pairing(self, request, template, subject, consumer_connector, provider_connector):
        # trigger email to the participant as they are being added
        try:
            consumer_org_map = (
                UserOrganizationMap.objects.select_related(Constants.ORGANIZATION).get(
                    id=consumer_connector.user_map_id
                )
                if consumer_connector.user_map_id
                else None
            )
            consumer_org = Organization.objects.get(
                id=consumer_org_map.organization_id) if consumer_org_map else None
            consumer = User.objects.get(
                id=consumer_org_map.user_id) if consumer_org_map else None
            consumer_full_name = string_functions.get_full_name(
                consumer.first_name, consumer.last_name)
            provider_org_map = (
                UserOrganizationMap.objects.select_related(Constants.ORGANIZATION).get(
                    id=provider_connector.user_map_id
                )
                if provider_connector.user_map_id
                else None
            )
            provider_org = Organization.objects.get(
                id=provider_org_map.organization_id) if provider_org_map else None
            provider = User.objects.get(
                id=provider_org_map.user_id) if provider_org_map else None
            provider_full_name = string_functions.get_full_name(
                provider.first_name, provider.last_name)
            dataset = Datasets.objects.get(id=provider_connector.dataset_id)

            if str(provider_connector.user_map_id) == request.data.get("user_map"):
                print("CTA by provider. Trigger email to consumer")
                data = {
                    "consumer_admin_name": consumer_full_name,
                    "consumer_connector": consumer_connector,
                    "provider_org": provider_org,
                    "dataset": dataset,
                    "provider_connector": provider_connector,
                    "datahub_site": os.environ.get(Constants.DATAHUB_SITE, Constants.datahub_site),
                }

                email_render = render(request, template, data)
                mail_body = email_render.content.decode("utf-8")
                Utils().send_email(
                    to_email=consumer.email,
                    content=mail_body,
                    subject=subject,
                )

            elif str(consumer_connector.user_map_id) == request.data.get("user_map"):
                print("CTA by consumer. Trigger email to provider")
                data = {
                    "provider_admin_name": provider_full_name,
                    "consumer_connector": consumer_connector,
                    "consumer_org": consumer_org,
                    "dataset": dataset,
                    "provider_connector": provider_connector,
                    "datahub_site": os.environ.get(Constants.DATAHUB_SITE, Constants.datahub_site),
                }

                email_render = render(request, template, data)
                mail_body = email_render.content.decode("utf-8")
                Utils().send_email(
                    to_email=provider.email,
                    content=mail_body,
                    subject=subject,
                )

        except Exception as error:
            LOGGER.error(error, exc_info=True)

    @action(detail=False, methods=["get"])
    def data_size(self, request, *args, **kwargs):
        try:
            size = request.query_params.get("size", "")
            print("**********SIZE OF DATA************************")
            print(size)
            return Response([], status=200)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        """POST method: create action to save an object by sending a POST request"""
        serializer = self.get_serializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        provider = request.data.get(Constants.PROVIDER)
        consumer = request.data.get(Constants.CONSUMER)
        provider_obj = Connectors.objects.get(id=provider)
        consumer_obj = Connectors.objects.get(id=consumer)
        if provider_obj.connector_status == Constants.PAIRED:
            return Response(
                [f"Provider connector ({({provider_obj.connector_name})}) is already paired with another connector"],
                400,
            )
        elif consumer_obj.connector_status == Constants.PAIRED:
            return Response(
                [f"Consumer connector ({consumer_obj.connector_name}) is already paired with another connector"],
                400,
            )
        consumer_obj.connector_status = Constants.AWAITING_FOR_APPROVAL
        provider_obj.connector_status = Constants.PAIRING_REQUEST_RECIEVED
        self.perform_create(provider_obj)
        self.perform_create(consumer_obj)
        self.perform_create(serializer)

        try:
            # trigger email
            consumer_serializer = ConnectorsSerializerForEmail(consumer_obj)
            provider_serializer = ConnectorsSerializerForEmail(provider_obj)
            data = {
                "consumer": consumer_serializer.data,
                "provider": provider_serializer.data,
                "datahub_site": os.environ.get(Constants.DATAHUB_SITE, Constants.datahub_site),
                "datahub_name": os.environ.get(Constants.DATAHUB_NAME, Constants.datahub_name),
            }
            to_email = provider_serializer.data.get("user").get("email")

            email_render = render(
                request, Constants.REQUEST_CONNECTOR_PAIRING, data)
            mail_body = email_render.content.decode("utf-8")
            Utils().send_email(
                to_email=to_email,
                content=mail_body,
                subject=Constants.PAIRING_REQUEST_RECIEVED_SUBJECT,
            )

        except Exception as error:
            LOGGER.error(error, exc_info=True)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """PUT method: update or send a PUT request on an object of the Product model"""
        setattr(request.data, "_mutable", True)
        instance = self.get_object()
        data = request.data
        if request.data.get(Constants.CONNECTOR_PAIR_STATUS) == Constants.REJECTED:
            connectors = Connectors.objects.get(id=instance.consumer.id)
            connectors.connector_status = Constants.REJECTED
            self.perform_create(connectors)

            if (
                    not ConnectorsMap.objects.all()
                            .filter(
                        provider=instance.provider.id,
                        connector_pair_status=Constants.AWAITING_FOR_APPROVAL,
                    )
                            .exclude(id=instance.id)
            ):
                connectors = Connectors.objects.get(id=instance.provider.id)
                connectors.connector_status = Constants.UNPAIRED
                self.perform_create(connectors)

            provider_connectors = Connectors.objects.get(
                id=instance.provider.id)
            consumer_connectors = Connectors.objects.get(
                id=instance.consumer.id)

            self.trigger_email_for_pairing(
                request,
                Constants.PAIRING_REQUEST_REJECTED,
                Constants.PAIRING_REQUEST_REJECTED_SUBJECT
                + os.environ.get(Constants.DATAHUB_NAME,
                                 Constants.datahub_name),
                consumer_connectors,
                provider_connectors,
            )

        elif request.data.get(Constants.CONNECTOR_PAIR_STATUS) == Constants.PAIRED:
            consumer_connectors = Connectors.objects.get(
                id=instance.consumer.id)
            provider_connectors = Connectors.objects.get(
                id=instance.provider.id)
            if provider_connectors.connector_status == Constants.PAIRED:
                return Response(
                    [
                        f"Provider connector ({({provider_connectors.connector_name})}) is already paired with another connector"
                    ],
                    400,
                )
            elif consumer_connectors.connector_status == Constants.PAIRED:
                return Response(
                    [
                        f"Consumer connector ({consumer_connectors.connector_name}) is already paired with another connector"
                    ],
                    400,
                )
            # ports = run_containers(provider_connectors, consumer_connectors)
            provider_connectors.connector_status = Constants.PAIRED
            consumer_connectors.connector_status = Constants.PAIRED
            self.perform_create(consumer_connectors)
            self.perform_create(provider_connectors)

            self.trigger_email_for_pairing(
                request,
                Constants.PAIRING_REQUEST_APPROVED,
                Constants.PAIRING_REQUEST_APPROVED_SUBJECT
                + os.environ.get(Constants.DATAHUB_NAME,
                                 Constants.datahub_name),
                consumer_connectors,
                provider_connectors,
            )

            rejection_needed_connectors = (
                ConnectorsMap.objects.all()
                .filter(
                    provider=instance.provider.id,
                    connector_pair_status=Constants.AWAITING_FOR_APPROVAL,
                )
                .exclude(id=instance.id)
            )
            if rejection_needed_connectors:
                for map_connectors in rejection_needed_connectors:
                    map_connectors.connector_pair_status = Constants.REJECTED
                    map_connectors_consumer = Connectors.objects.get(
                        id=map_connectors.consumer.id)
                    map_connectors_consumer.connector_status = Constants.REJECTED
                    self.perform_create(map_connectors)
                    self.perform_create(map_connectors_consumer)
            print(ports)
            data["ports"] = json.dumps(ports)
        elif request.data.get(Constants.CONNECTOR_PAIR_STATUS) == Constants.UNPAIRED:
            consumer_connectors = Connectors.objects.get(
                id=instance.consumer.id)
            provider_connectors = Connectors.objects.get(
                id=instance.provider.id)
            provider_connectors.connector_status = Constants.UNPAIRED
            consumer_connectors.connector_status = Constants.UNPAIRED
            self.perform_create(consumer_connectors)
            self.perform_create(provider_connectors)
            # stop_containers(provider_connectors, consumer_connectors)

            self.trigger_email_for_pairing(
                request,
                Constants.WHEN_CONNECTOR_UNPAIRED,
                Constants.CONNECTOR_UNPAIRED_SUBJECT +
                os.environ.get(Constants.DATAHUB_NAME, Constants.datahub_name),
                consumer_connectors,
                provider_connectors,
            )

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk):
        """GET method: retrieve an object or instance of the Product model"""
        try:
            data = ConnectorsMap.objects.filter(id=pk).all()
            participant_serializer = ConnectorsMapSerializer(data, many=True)
            if participant_serializer.data:
                return Response(participant_serializer.data[0], status=status.HTTP_200_OK)
            return Response([], status=status.HTTP_200_OK)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, pk):
        """DELETE method: delete an object"""
        try:
            connector = self.get_object()
            connector.status = False
            self.perform_create(connector)
            return Response(status=status.HTTP_204_NO_CONTENT)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ParticipantDepatrmentViewSet(GenericViewSet):
    """
    This class handles the participant Datsets CRUD operations.
    """

    parser_class = JSONParser
    serializer_class = DepartmentSerializer
    queryset = Department
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
            serializer = self.get_serializer(data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        """PUT method: update or send a PUT request on an object of the Product model"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk):
        """GET method: retrieve an object or instance of the Product model"""
        try:
            queryset = Department.objects.filter(Q(status=True, id=pk) | Q(department_name=Constants.DEFAULT, id=pk))
            serializer = self.serializer_class(queryset, many=True)
            if serializer.data:
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response([], status=status.HTTP_200_OK)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["get"])
    @http_request_mutation
    def department_list(self, request, *args, **kwargs):
        """GET method: query all the list of objects from the Product model"""
        data = []
        org_id = request.META.get(Constants.ORG_ID)
        filters = {Constants.ORGANIZATION: org_id} if org_id else {}
        data = (
            # Department.objects.filter(Q(status=True, **filters) | Q(department_name=Constants.DEFAULT))
            Department.objects.filter(status=True, **filters)
            .exclude(department_name=Constants.DEFAULT)
            .order_by(Constants.UPDATED_AT)
            .reverse()
            .all()
        )
        page = self.paginate_queryset(data)
        department_serializer = DepartmentSerializer(page, many=True)
        return self.get_paginated_response(department_serializer.data)

    @http_request_mutation
    def list(self, request, *args, **kwargs):
        """GET method: query all the list of objects from the Product model"""
        data = []
        org_id = request.META.get(Constants.ORG_ID)
        filters = {Constants.ORGANIZATION: org_id} if org_id else {}
        data = (
            Department.objects.filter(
                Q(status=True, **filters) | Q(department_name=Constants.DEFAULT))
            .order_by(Constants.UPDATED_AT)
            .reverse()
            .all()
        )
        department_serializer = DepartmentSerializer(data, many=True)
        return Response(department_serializer.data)

    def destroy(self, request, pk):
        """DELETE method: delete an object"""
        try:
            Connectors.objects.filter(department=pk).update(department="e459f452-2b4b-4129-ba8b-1e1180c87888")
            product = self.get_object()
            product.status = False
            self.perform_create(product)
            return Response(status=status.HTTP_204_NO_CONTENT)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ParticipantProjectViewSet(GenericViewSet):
    """
    This class handles the participant Datsets CRUD operations.
    """

    parser_class = JSONParser
    serializer_class = ProjectSerializer
    queryset = Project
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
            serializer = self.get_serializer(data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk):
        """PUT method: update or send a PUT request on an object of the Product model"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk):
        """GET method: retrieve an object or instance of the Product model"""
        try:
            queryset = Project.objects.filter(
                Q(status=True, id=pk) | Q(project_name=Constants.DEFAULT, id=pk))
            serializer = ProjectDepartmentSerializer(queryset, many=True)
            if serializer.data:
                return Response(serializer.data[0], status=status.HTTP_200_OK)
        except Exception as error:
            LOGGER.error(error, exc_info=True)
            return Response({"message": error}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["post"])
    @http_request_mutation
    def project_list(self, request, *args, **kwargs):
        """GET method: query all the list of objects from the Product model"""
        data = []
        org_id = request.META.get(Constants.ORG_ID)
        filters = {Constants.ORGANIZATION: org_id} if org_id else {}
        data = (
            Project.objects.select_related(Constants.DEPARTMENT_ORGANIZATION)
            # .filter(Q(status=True, **filters) | Q(project_name=Constants.DEFAULT))
            .filter(status=True, **filters)
            .exclude(project_name=Constants.DEFAULT)
            .order_by(Constants.UPDATED_AT)
            .reverse()
            .all()
        )
        page = self.paginate_queryset(data)
        project_serializer = ProjectDepartmentSerializer(page, many=True)
        return self.get_paginated_response(project_serializer.data)

    def list(self, request, *args, **kwargs):
        """GET method: query all the list of objects from the Product model"""
        try:
            data = []
            department = request.query_params.get(Constants.DEPARTMENT)
            org_id = request.query_params.get(Constants.ORG_ID)
            # filters = {Constants.DEPARTMENT: department} if department else {}
            filters = {Constants.DEPARTMENT: department, Constants.ORGANIZATION: org_id} if department or org_id else {}
            data = (
                Project.objects.select_related(Constants.DEPARTMENT_ORGANIZATION)
                .filter(Q(status=True, **filters) | Q(project_name=Constants.DEFAULT))
                # .filter(status=True, **filters)
                # .exclude(project_name=Constants.DEFAULT)
                .order_by(Constants.UPDATED_AT)
                .reverse()
                .all()
            )
            project_serializer = ProjectDepartmentSerializer(data, many=True)
            return Response(project_serializer.data)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, pk):
        """DELETE method: delete an object"""
        try:
            Connectors.objects.filter(project=pk).update(project="3526bd39-4514-43fe-bbc4-ee0980bde252")
            project = self.get_object()
            project.status = False
            self.perform_create(project)
            return Response(status=status.HTTP_204_NO_CONTENT)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def update_cookies(key, value, response):
    try:
        max_age = 1 * 24 * 60 * 60
        expires = datetime.datetime.strftime(
            datetime.datetime.utcnow() + datetime.timedelta(seconds=max_age),
            "%a, %d-%b-%Y %H:%M:%S GMT",
        )
        response.set_cookie(
            key,
            value,
            max_age=max_age,
            expires=expires,
            domain=os.environ.get("PUBLIC_DOMAIN"),
            secure=False,
        )
        return response

    except ValidationError as e:
        LOGGER.error(e, exc_info=True)
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        LOGGER.error(e, exc_info=True)
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DataBaseViewSet(GenericViewSet):
    """
    This class handles the participant external Databases  operations.
    """

    parser_class = JSONParser
    serializer_class = DatabaseConfigSerializer

    @action(detail=False, methods=["post"])
    def database_config(self, request):
        """
        Configure the database connection based on the database type.
        Return tables retrieved from the database and set database configuration in the cookies.
        """
        database_type = request.data.get("database_type")
        serializer = self.get_serializer(data=request.data, context={
            "source": database_type})
        serializer.is_valid(raise_exception=True)
        cookie_data = serializer.data
        config = serializer.validated_data
        # remove database_type before passing it to db conn
        config.pop("database_type")
        if database_type == Constants.SOURCE_MYSQL_FILE_TYPE:
            """Create a MySQL connection object on valid database credentials and return tables"""
            LOGGER.info(f"Connecting to {database_type}")

            try:
                # Try to connect to the database using the provided configuration
                mydb = mysql.connector.connect(**config)
                mycursor = mydb.cursor()
                db_name = request.data.get("database")
                mycursor.execute("use " + db_name + ";")
                mycursor.execute("show tables;")
                table_list = mycursor.fetchall()
                table_list = [
                    element for innerList in table_list for element in innerList]

                # send the tables as a list in response body
                response = HttpResponse(json.dumps(
                    table_list), status=status.HTTP_200_OK)
                # set the cookies in response
                response = update_cookies(
                    "conn_details", cookie_data, response)
                return response
            except mysql.connector.Error as err:
                if err.errno == mysql.connector.errorcode.ER_ACCESS_DENIED_ERROR:
                    return Response(
                        {
                            "username": ["Incorrect username or password"],
                            "password": ["Incorrect username or password"],
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif err.errno == mysql.connector.errorcode.ER_NO_SUCH_TABLE:
                    return Response({"table": ["Table does not exist"]},
                                    status=status.HTTP_400_BAD_REQUEST)
                elif err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                    # Port is incorrect
                    return Response({
                        "dbname": ["Invalid database name. Connection Failed."]}, status=status.HTTP_400_BAD_REQUEST)
                # Return an error message if the connection fails
                return Response({"host": ["Invalid host . Connection Failed."]}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        elif database_type == Constants.SOURCE_POSTGRESQL_FILE_TYPE:
            """Create a PostgreSQL connection object on valid database credentials"""
            LOGGER.info(f"Connecting to {database_type}")
            try:
                tables = []
                with closing(psycopg2.connect(**config)) as conn:
                    with closing(conn.cursor()) as cursor:
                        cursor.execute(
                            "SELECT table_name FROM information_schema.tables WHERE table_schema='public';")
                        table_list = cursor.fetchall()
                # send the tables as a list in response body & set cookies
                tables = [
                    table for inner_list in table_list for table in inner_list]
                response = HttpResponse(json.dumps(
                    tables), status=status.HTTP_200_OK)
                response = update_cookies(
                    "conn_details", cookie_data, response)
                return response
            except psycopg2.Error as err:
                print(err)
                if "password authentication failed for user" in str(err) or "role" in str(err):
                    # Incorrect username or password
                    return Response(
                        {
                            "username": ["Incorrect username or password"],
                            "password": ["Incorrect username or password"],
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif "database" in str(err):
                    # Database does not exist
                    return Response({"dbname": ["Database does not exist"]}, status=status.HTTP_400_BAD_REQUEST)
                elif "could not translate host name" in str(err):
                    # Database does not exist
                    return Response({"host": ["Invalid Host address"]}, status=status.HTTP_400_BAD_REQUEST)

                elif "Operation timed out" in str(err):
                    # Server is not available
                    return Response({"port": ["Invalid port or DB Server is down"]}, status=status.HTTP_400_BAD_REQUEST)

                # Return an error message if the connection fails
                return Response({"error": [str(err)]}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    def database_col_names(self, request):
        """Return the column names as a list from the requested table by reading the db config from cookies."""
        conn_details = request.COOKIES.get("conn_details", request.data)
        config = ast.literal_eval(conn_details)
        database_type = config.get("database_type")
        table_name = request.data.get("table_name")
        # remove database_type before passing it to db conn
        config.pop("database_type")

        serializer = DatabaseColumnRetrieveSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if database_type == Constants.SOURCE_MYSQL_FILE_TYPE:
            """Create a PostgreSQL connection object on valid database credentials"""
            LOGGER.info(f"Connecting to {database_type}")
            try:
                # Try to connect to the database using the provided configuration
                connection = mysql.connector.connect(**config)
                mydb = connection
                mycursor = mydb.cursor()
                db_name = config["database"]
                mycursor.execute("use " + db_name + ";")
                mycursor.execute("SHOW COLUMNS FROM " +
                                 db_name + "." + table_name + ";")

                # Fetch columns & return as a response
                col_list = mycursor.fetchall()
                cols = [column_details[0] for column_details in col_list]
                response = HttpResponse(json.dumps(
                    cols), status=status.HTTP_200_OK)
                return response

            except mysql.connector.Error as err:
                if err.errno == mysql.connector.errorcode.ER_ACCESS_DENIED_ERROR:
                    return Response(
                        {
                            "username": ["Incorrect username or password"],
                            "password": ["Incorrect username or password"],
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif err.errno == mysql.connector.errorcode.ER_NO_SUCH_TABLE:
                    return Response({"table_name": ["Table does not exist"]}, status=status.HTTP_400_BAD_REQUEST)
                elif err.errno == mysql.connector.errorcode.ER_KEY_COLUMN_DOES_NOT_EXITS:
                    return Response({"col": ["Columns does not exist."]}, status=status.HTTP_400_BAD_REQUEST)
                # Return an error message if the connection fails
                return Response({"error": [str(err)]}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                LOGGER.error(e, exc_info=True)
                return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        elif database_type == Constants.SOURCE_POSTGRESQL_FILE_TYPE:
            """Create a PostgreSQL connection object on valid database credentials"""
            LOGGER.info(f"Connecting to {database_type}")
            try:
                col_list = []
                with closing(psycopg2.connect(**config)) as conn:
                    with closing(conn.cursor()) as cursor:
                        cursor = conn.cursor()
                        # Fetch columns & return as a response
                        cursor.execute(
                            "SELECT column_name FROM information_schema.columns WHERE table_name='{0}';".format(
                                table_name
                            )
                        )
                        col_list = cursor.fetchall()

                if len(col_list) <= 0:
                    return Response({"table_name": ["Table does not exist."]}, status=status.HTTP_400_BAD_REQUEST)

                cols = [column_details[0] for column_details in col_list]
                return HttpResponse(json.dumps(cols), status=status.HTTP_200_OK)
            except psycopg2.Error as error:
                LOGGER.error(error, exc_info=True)

    @action(detail=False, methods=["post"])
    def database_xls_file(self, request):
        """
        Export the data extracted from the database by reading the db config from cookies to a temporary location.
        """
        dataset_name = request.data.get("dataset_name")

        # if not request.query_params.get("dataset_exists"):
        #     if DatasetV2.objects.filter(name=dataset_name).exists():
        #         return Response(
        #             {"dataset_name": ["dataset v2 with this name already exists."]}, status=status.HTTP_400_BAD_REQUEST
        #         )

        conn_details = request.COOKIES.get("conn_details", request.data)

        config = ast.literal_eval(conn_details)
        database_type = config.get("database_type")
        serializer = DatabaseDataExportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        dataset = DatasetV2(id=request.data.get("dataset"))
        t_name = request.data.get("table_name")
        col_names = request.data.get("col")
        col_names = ast.literal_eval(col_names)
        col_names = ", ".join(col_names)
        source = request.data.get("source")
        file_name = request.data.get("file_name")
        # remove database_type before passing it to db conn
        config.pop("database_type")

        if database_type == Constants.SOURCE_MYSQL_FILE_TYPE:
            """Create a PostgreSQL connection object on valid database credentials"""
            LOGGER.info(f"Connecting to {database_type}")

            try:
                mydb = mysql.connector.connect(**config)
                mycursor = mydb.cursor()
                db_name = config["database"]
                mycursor.execute("use " + db_name + ";")

                query_string = f"SELECT {col_names} FROM {t_name}"
                sub_queries = []  # List to store individual filter sub-queries
                if serializer.data.get("filter_data"):

                    filter_data = json.loads(serializer.data.get("filter_data")[0])
                    for query_dict in filter_data:
                        query_string = f"SELECT {col_names} FROM {t_name} WHERE "
                        column_name = query_dict.get('column_name')
                        operation = query_dict.get('operation')
                        value = query_dict.get('value')
                        sub_query = f"{column_name} {operation} '{value}'"  # Using %s as a placeholder for the value
                        sub_queries.append(sub_query)
                    query_string += " AND ".join(sub_queries)

                mycursor.execute(query_string)
                result = mycursor.fetchall()

                # save the list of files to a temp directory
                file_path = file_ops.create_directory(
                    settings.DATASET_FILES_URL, [dataset_name, source])

                df = pd.read_sql(query_string, mydb)
                if df.empty:
                    return Response({"data": [f"No data was found for the filter applied. Please try again."]},
                                    status=status.HTTP_400_BAD_REQUEST)
                df = df.astype(str)
                df.to_csv(file_path + "/" + file_name + ".csv")
                instance = DatasetV2File.objects.create(
                    dataset=dataset,
                    source=source,
                    file=os.path.join(dataset_name, source,
                                      file_name + ".csv"),
                    file_size=os.path.getsize(
                        os.path.join(settings.DATASET_FILES_URL, dataset_name, source, file_name + ".xls")),
                    standardised_file=os.path.join(
                        dataset_name, source, file_name + ".csv"),
                )
                # result = os.listdir(file_path)
                serializer = DatasetFileV2NewSerializer(instance)
                return JsonResponse(serializer.data, status=status.HTTP_200_OK)
                # return HttpResponse(json.dumps(result), status=status.HTTP_200_OK)

            except mysql.connector.Error as err:
                LOGGER.error(err, exc_info=True)
                if err.errno == mysql.connector.errorcode.ER_ACCESS_DENIED_ERROR:
                    return Response(
                        {
                            "username": ["Incorrect username or password"],
                            "password": ["Incorrect username or password"],
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif err.errno == mysql.connector.errorcode.ER_NO_SUCH_TABLE:
                    return Response({"table_name": ["Table does not exist"]}, status=status.HTTP_400_BAD_REQUEST)
                # elif err.errno == mysql.connector.errorcode.ER_KEY_COLUMN_DOES_NOT_EXITS:
                elif str(err).__contains__("Unknown column"):
                    return Response({"col": ["Columns does not exist."]}, status=status.HTTP_400_BAD_REQUEST)
                # Return an error message if the connection fails
                return Response({"": [str(err)]}, status=status.HTTP_400_BAD_REQUEST)

        elif database_type == Constants.SOURCE_POSTGRESQL_FILE_TYPE:
            """Create a PostgreSQL connection object on valid database credentials"""
            LOGGER.info(f"Connecting to {database_type}")
            try:
                with closing(psycopg2.connect(**config)) as conn:
                    try:

                        query_string = f"SELECT {col_names} FROM {t_name}"
                        sub_queries = []  # List to store individual filter sub-queries

                        if serializer.data.get("filter_data"):
                            filter_data = json.loads(serializer.data.get("filter_data")[0])

                            for query_dict in filter_data:
                                query_string = f"SELECT {col_names} FROM {t_name} WHERE "
                                column_name = query_dict.get('column_name')
                                operation = query_dict.get('operation')
                                value = query_dict.get('value')
                                sub_query = f"{column_name} {operation} '{value}'"  # Using %s as a placeholder for the value
                                sub_queries.append(sub_query)
                            query_string += " AND ".join(sub_queries)
                        df = pd.read_sql(query_string, conn)
                        if df.empty:
                            return Response({"data": [f"No data was found for the filter applied. Please try again."]},
                                            status=status.HTTP_400_BAD_REQUEST)

                        df = df.astype(str)
                    except pd.errors.DatabaseError as error:
                        LOGGER.error(error, exc_info=True)
                        return Response({"col": ["Columns does not exist."]}, status=status.HTTP_400_BAD_REQUEST)

                file_path = file_ops.create_directory(
                    settings.DATASET_FILES_URL, [dataset_name, source])
                df.to_csv(os.path.join(
                    file_path, file_name + ".xls"))
                instance = DatasetV2File.objects.create(
                    dataset=dataset,
                    source=source,
                    file=os.path.join(dataset_name, source,
                                      file_name + ".csv"),
                    file_size=os.path.getsize(
                        os.path.join(settings.DATASET_FILES_URL, dataset_name, source, file_name + ".xls")),
                    standardised_file=os.path.join(
                        dataset_name, source, file_name + ".csv"),
                )
                # result = os.listdir(file_path)
                serializer = DatasetFileV2NewSerializer(instance)
                return JsonResponse(serializer.data, status=status.HTTP_200_OK)

            except psycopg2.Error as error:
                LOGGER.error(error, exc_info=True)

    @action(detail=False, methods=["post"])
    def database_live_api_export(self, request):
        """This is an API to fetch the data from an External API with an auth token
        and store it in JSON format."""
        try:
            dataset = DatasetV2(id=request.data.get("dataset"))
            url = request.data.get("url")
            auth_type = request.data.get("auth_type")
            dataset_name = request.data.get("dataset_name")
            source = request.data.get("source")
            file_name = request.data.get("file_name")
            headers = {}
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

                # Create the directory to store the file
                file_path = file_ops.create_directory(
                    settings.DATASET_FILES_URL, [dataset_name, source])

                # Determine file extension based on data type (list or not)
                if isinstance(data, list):
                    file_extension = ".csv"
                else:
                    file_extension = ".json"

                # Set file name
                file_name_with_extension = file_name + file_extension

                # Save data as CSV if it is a list, otherwise save it as JSON
                if isinstance(data, list):
                    # Save as CSV
                    with open(file_path + "/" + file_name_with_extension, "w", newline='', encoding='utf-8') as outfile:
                        writer = csv.DictWriter(outfile, fieldnames=data[0].keys())
                        writer.writeheader()
                        writer.writerows(data)
                else:
                    # Save as JSON
                    with open(file_path + "/" + file_name_with_extension, "w", encoding='utf-8') as outfile:
                        json.dump(data, outfile)

                # Create DatasetV2File instance
                current_time = datetime.datetime.utcnow()
                current_time_str = current_time.strftime('%Y-%m-%d %H:%M:%S')
                instance = DatasetV2File.objects.create(
                    dataset=dataset,
                    source=source,
                    file=os.path.join(dataset_name, source, file_name_with_extension),
                    file_size=os.path.getsize(
                        os.path.join(settings.DATASET_FILES_URL, dataset_name, source, file_name_with_extension)),
                    standardised_file=os.path.join(dataset_name, source, file_name_with_extension),
                    connection_details={"auth_type": auth_type, "url": url, "headers": headers,
                                        "frequency": request.data.get("frequency", ""), 
                                        "file_replace": request.data.get("file_replace", False),
                                        "last_pull": current_time_str,
                                        "file_name": file_name}
                )

                # Serialize and return the response
                serializer = DatasetFileV2NewSerializer(instance)
                return JsonResponse(serializer.data, status=status.HTTP_200_OK)

            LOGGER.error("Failed to fetch data from api")
            return Response({"message": f"API Response: {response.json()}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(
                f"Failed to fetch data from api ERROR: {e} and input fields: {request.data}")
            return Response({"message": f"API Response: {e}"}, status=status.HTTP_400_BAD_REQUEST)


class SupportTicketV2ModelViewSet(GenericViewSet):
    parser_class = JSONParser
    queryset = SupportTicketV2.objects.all()
    # serializer_class = SupportTicketV2Serializer
    pagination_class = CustomPagination

    def get_serializer_class(self):
        if self.request.method == "PUT":
            return UpdateSupportTicketV2Serializer
        return SupportTicketV2Serializer

    @action(detail=False, methods=["post"])
    @http_request_mutation
    def list_tickets(self, request, *args, **kwargs):
        data = request.data
        others = bool(data.pop("others", False))
        filters_data = data
        role_id = request.META.get("role_id")
        map_id = request.META.get("map_id")
        user_id = request.META.get("user_id")
        queryset = SupportTicketV2.objects.select_related(
            "user_map__organization", "user_map__user", "user_map__user__role", "user_map"
        ).order_by("-updated_at").all()
        # print(filters_data)
        # import pdb; pdb.set_trace()
        try:
            if str(role_id) == "1":
                # the person is an admin/steward so he should be able to view tickets:
                # 1. raise by co-stewards
                # 2. raised by participants under the steward.
                filter = {"user_map__user__role_id": 3} if others else {"user_map__user__role_id": 6}
                queryset = queryset.filter(user_map__user__on_boarded_by_id=None).filter(**filter, **filters_data)

            elif str(role_id) == "6":
                # the person is co-steward
                # 1. raised by himself
                # 2. raised by participants under himself.
                filter = {"user_map__user__on_boarded_by_id": user_id} if others else {"user_map_id": map_id}
                queryset = queryset.filter(**filter, **filters_data)

            elif str(role_id) == "3":
                print(filters_data)
                # participant
                # can only see his tickets
                queryset = queryset.filter(
                    user_map_id=map_id, **filters_data
                )
            page = self.paginate_queryset(queryset)
            support_tickets_serializer = SupportTicketV2Serializer(page, many=True)
            return self.get_paginated_response(support_tickets_serializer.data)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # API to retrieve a single object by its ID
    @timer
    @http_request_mutation
    def retrieve(self, request, pk):
        try:
            ticket_instance = SupportTicketV2.objects.prefetch_related(
                'resolution_set').get(id=pk)
        except SupportTicketV2.DoesNotExist as e:
            LOGGER.error(e, exc_info=True)
            return Response({
                "message": "No ticket found for this id.",
            }, status=status.HTTP_404_NOT_FOUND)
        try:
            current_user = UserOrganizationMap.objects.select_related(
                "organization").get(id=request.META.get("map_id"))
        except UserOrganizationMap.DoesNotExist:
            return Response(
                {
                    "message": "No user found for the map id."
                }, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            ticket_serializer = SupportTicketV2Serializer(ticket_instance)
            resolution_serializer = SupportTicketResolutionsSerializerMinimised(
                ticket_instance.resolution_set.order_by("created_at"),
                many=True)
            data = {
                'ticket': ticket_serializer.data,
                'resolutions': resolution_serializer.data,
                "logged_in_organization": {
                    "org_id": str(current_user.organization.id),
                    "org_logo": str(f"/media/{current_user.organization.logo}")
                }
            }
            return Response(data)
        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # API to create a new object

    @http_request_mutation
    def create(self, request):
        try:
            if request.data.get("ticket_attachment"):
                validity = check_file_name_length(incoming_file_name=request.data.get("ticket_attachment"),
                                                  accepted_file_name_size=NumericalConstants.FILE_NAME_LENGTH)
                if not validity:
                    file_length = len(str(request.data.get("ticket_attachment")))
                    return Response(
                        {"ticket_attachment": [
                            f"Ensure this filename has at most 100 characters ( it has {file_length} )."]},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            serializer = CreateSupportTicketV2Serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            object = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @timer
    @support_ticket_role_authorization(model_name="SupportTicketV2")
    def update(self, request, pk=None):
        try:
            queryset = self.get_queryset().select_related(
                "user_map__organization",
                "user_map__user", "user_map__user__role", "user_map"
            )
            object = get_object_or_404(queryset, pk=pk)
            serializer = self.get_serializer(
                object, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            object = serializer.save()
            return Response(serializer.data)
        except ValidationError as error:
            LOGGER.error(error, exc_info=True)
            return Response(error.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # API to delete an existing object by its ID
    @timer
    @support_ticket_role_authorization(model_name="SupportTicketV2")
    def destroy(self, request, pk=None):
        try:
            queryset = self.get_queryset()
            object = get_object_or_404(queryset, pk=pk)
            object.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # @http_request_mutation
    # @action(detail=False, methods=["get"])
    # def filter_support_tickets(self, request, *args, **kwargs):
    #     org_id = request.META.get("org_id")
    #     map_id = request.META.get("map_id")
    #     user_id = request.META.get("user_id")
    #     tickets = SupportTicketInternalServices.filter_support_ticket_service(
    #         map_id=map_id,
    #         org_id=org_id,
    #         role_id=request.META.get("role_id"),
    #         onboarded_by_id=request.META.get("onboarded_by"),
    #         status=request.GET.dict().get("status", None),
    #         category=request.GET.dict().get("category", None),
    #         start_date=request.GET.dict().get("start_date", None),
    #         end_date=request.GET.dict().get("end_date", None),
    #         results_for=request.GET.dict().get("results_for"),
    #         user_id=user_id
    #     )
    #
    #     page = self.paginate_queryset(tickets)
    #     support_tickets_serializer = SupportTicketV2Serializer(page, many=True)
    #     return self.get_paginated_response(support_tickets_serializer.data)

    @timer
    @http_request_mutation
    @action(detail=False, methods=["post"])
    def search_support_tickets(self, request, *args, **kwargs):
        try:
            tickets = SupportTicketInternalServices.search_tickets(
                search_text=request.data.get("name__icontains"),
                user_id=request.META.get("user_id")
            )

            page = self.paginate_queryset(tickets)
            support_tickets_serializer = SupportTicketV2Serializer(page, many=True)
            return self.get_paginated_response(support_tickets_serializer.data)

        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SupportTicketResolutionsViewset(GenericViewSet):
    parser_class = JSONParser
    queryset = Resolution.objects.all()
    serializer_class = SupportTicketResolutionsSerializer
    pagination_class = CustomPagination

    @timer
    @support_ticket_role_authorization(model_name="Resolution")
    def create(self, request):
        # set map in in request object
        try:
            setattr(request.data, "_mutable", True)
            request_data = request.data
            request_data["user_map"] = request.META.get("map_id")
            serializer = CreateSupportTicketResolutionsSerializer(
                data=request_data)
            serializer.is_valid(raise_exception=True)
            object = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as error:
            LOGGER.error(error, exc_info=True)
            return Response(error.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # API to update an existing object by its ID
    @timer
    @support_ticket_role_authorization(model_name="Resolution")
    def update(self, request, pk=None):
        try:
            queryset = self.get_queryset()
            object = get_object_or_404(queryset, pk=pk)
            serializer = self.get_serializer(
                object, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            object = serializer.save()
            return Response(serializer.data)
        except ValidationError as error:
            LOGGER.error(error, exc_info=True)
            return Response(error.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # API to delete an existing object by its ID
    @timer
    @support_ticket_role_authorization(model_name="Resolution")
    def destroy(self, request, pk=None):
        try:
            queryset = self.get_queryset()
            object = get_object_or_404(queryset, pk=pk)
            object.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            LOGGER.error(e, exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
