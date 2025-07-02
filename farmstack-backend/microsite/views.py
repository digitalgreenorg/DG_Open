import datetime
import gzip
import json
import logging
import math
import operator
import os
import pickle
import threading
from collections import defaultdict
from functools import reduce

import pandas as pd
import requests
from django.conf import settings
from django.core.cache import cache
from django.core.paginator import Paginator
from django.db.models import Count, Q
from django.http import FileResponse, HttpResponse, HttpResponseNotFound, JsonResponse
from django.shortcuts import get_object_or_404, render
from python_http_client import exceptions
from rest_framework import generics, mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from accounts.models import User, UserRole
from accounts.serializers import UserCreateSerializer
from ai.retriever.manual_retrival import QuadrantRetrival
from connectors.models import Connectors
from core.constants import Constants
from core.utils import (
    CustomPagination,
    DefaultPagination,
    Utils,
    csv_and_xlsx_file_validatation,
    date_formater,
    generate_hash_key_for_dashboard,
    read_contents_from_csv_or_xlsx_file,
)
from datahub.models import (
    Category,
    DatahubDocuments,
    Datasets,
    DatasetV2,
    DatasetV2File,
    Messages,
    Organization,
    Policy,
    Resource,
    ResourceFile,
    ResourceSubCategoryMap,
    ResourceUsagePolicy,
    SubCategory,
    UsagePolicy,
    UserOrganizationMap,
)
from datahub.serializers import (
    CategorySerializer,
    DatahubDatasetsV2Serializer,
    DatasetV2Serializer,
    MessagesSerializer,
    OrganizationSerializer,
    ParticipantCostewardSerializer,
    ParticipantSerializer,
    ResourceListSerializer,
    ResourceSerializer,
    micrositeOrganizationSerializer,
)
from microsite.models import FeedBack
from microsite.serializers import (
    ConnectorsListSerializer,
    ConnectorsRetriveSerializer,
    ContactFormSerializer,
    ContentFileSerializer,
    ContentSerializer,
    DatahubDatasetFileDashboardFilterSerializer,
    DatasetsMicrositeSerializer,
    FeedBackSerializer,
    LegalDocumentSerializer,
    OrganizationMicrositeSerializer,
    PolicySerializer,
    ResourceEmbeddingsSerializer,
    ResourceMicrsositeSerializer,
    UserDataMicrositeSerializer,
    UserSerializer,
)
from utils import custom_exceptions, file_operations
from utils.embeddings_creation import VectorDBBuilder
from utils.file_operations import (
    check_file_name_length,
    filter_dataframe_for_dashboard_counties,
    generate_fsp_dashboard,
    generate_knfd_dashboard,
    generate_omfp_dashboard,
)
from utils.jwt_services import http_request_mutation

LOGGER = logging.getLogger(__name__)


class OrganizationMicrositeViewSet(GenericViewSet):
    """Organization viewset for microsite"""

    permission_classes = []

    @action(detail=False, methods=["get"])
    def admin_organization(self, request):
        """GET method: retrieve an object of Organization using User ID of the User (IMPORTANT: Using USER ID instead of Organization ID)"""
        try:
            datahub_admin = User.objects.filter(role_id=1)

            if not datahub_admin:
                data = {Constants.USER: None, "message": ["Datahub admin not Found."]}
                return Response(data, status=status.HTTP_200_OK)

            user_queryset = datahub_admin.first()
            user_serializer = UserSerializer(user_queryset)
            user_org_queryset = UserOrganizationMap.objects.prefetch_related(
                Constants.USER, Constants.ORGANIZATION
            ).filter(user=user_queryset.id)

            if not user_org_queryset:
                data = {
                    Constants.USER: user_serializer.data,
                    Constants.ORGANIZATION: None,
                    "message": ["Datahub admin is not associated with any organization."],
                }
                return Response(data, status=status.HTTP_200_OK)

            org_obj = Organization.objects.get(id=user_org_queryset.first().organization_id)
            org_seriliazer = OrganizationMicrositeSerializer(org_obj)
            data = {
                Constants.USER: user_serializer.data,
                Constants.ORGANIZATION: org_seriliazer.data,
            }
            return Response(data, status=status.HTTP_200_OK)

        except Exception as error:
            LOGGER.error(f"Error occured in OrganizationMicrositeViewSet admin_organization ERROR: {error}", exc_info=True)
            return Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DatahubThemeMicrositeViewSet(GenericViewSet):
    permission_classes = []

    @action(detail=False, methods=["get"])
    def theme(self, request):
        """retrieves Datahub Theme attributes"""
        file_paths = file_operations.file_path(settings.THEME_URL)
        css_path = settings.CSS_ROOT + settings.CSS_FILE_NAME
        data = {}

        try:
            css_attribute = file_operations.get_css_attributes(css_path, "background-color")

            if not css_path and not file_paths:
                data = {"hero_image": None, "css": None}
            elif not css_path:
                data = {"hero_image": file_paths, "css": None}
            elif css_path and not file_paths:
                data = {"hero_image": None, "css": {"btnBackground": css_attribute}}
            elif css_path and file_paths:
                data = {
                    "hero_image": file_paths,
                    "css": {"btnBackground": css_attribute},
                }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            LOGGER.error(f"Error occured in DatahubThemeMicrositeViewSet theme ERROR: {e}", exc_info=True)

        return Response({}, status=status.HTTP_400_BAD_REQUEST)


class DatasetsMicrositeViewSet(GenericViewSet):
    """Datasets viewset for microsite"""

    serializer_class = DatasetV2Serializer
    queryset = DatasetV2.objects.prefetch_related(
                    'dataset_cat_map',
                    'dataset_cat_map__sub_category',
                    'dataset_cat_map__sub_category__category').all()
    pagination_class = CustomPagination
    permission_classes = [permissions.AllowAny]

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
        try:
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            return Response([], status=status.HTTP_404_NOT_FOUND)
        except Exception as error:
            LOGGER.error(f"Error occured in DatasetsMicrositeViewSet list ERROR: {error}", exc_info=True)
            return Response(str(error), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None, *args, **kwargs):
        """
        ``GET`` method Endpoint: retrieve action for the detail view of Dataset via GET request
            Returns dataset object view with content of XLX/XLSX file and file URLS. [see here][ref].

        **Endpoint**
        [ref]: /datahub/dataset/v2/<id>/
        """
        obj = self.get_object()
        serializer = self.get_serializer(obj).data

        dataset_file_obj = DatasetV2File.objects.filter(dataset_id=obj.id)
        data = []
        for file in dataset_file_obj:
            path_ = os.path.join(settings.DATASET_FILES_URL, str(file.standardised_file))
            file_path = {}
            file_path["content"] = read_contents_from_csv_or_xlsx_file(path_, file.standardised_configuration)
            # Omitted the actual name of the file so the user can't manually download the file
            # Added file name : As they need to show the file name in frontend.
            file_path["id"] = file.id
            file_path["file"] = path_.split("/")[-1]
            file_path["source"] = file.source
            file_path["file_size"] = file.file_size
            file_path["accessibility"] = file.accessibility
            file_path["standardised_file"] = (
                os.path.join(settings.DATASET_FILES_URL, str(file.standardised_file))
                if file.accessibility == Constants.PUBLIC
                else None
            )
            data.append(file_path)

        serializer["datasets"] = data
        return Response(serializer, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["get"])
    def get_json_response(self, request, *args, **kwargs):
        try:
            next = False
            file_path = request.GET.get('file_path')
            page = int(request.GET.get('page', 1))
            start_index = 0  + 50*(page-1)  # Adjust the start index as needed
            end_index = 50*page
            if file_path.endswith(".xlsx") or file_path.endswith(".xls"):
                df_headers = pd.read_excel(file_path, nrows=1, header=None)
                df = pd.read_excel(file_path, index_col=None, skiprows=range(0, start_index), nrows=end_index - start_index+1)
            else:
                df_headers = pd.read_csv(file_path, nrows=1, header=None)
                df = pd.read_csv(file_path, index_col=False, skiprows=range(0, start_index), nrows=end_index - start_index+1)       
            if df.empty  :
                raise pd.errors.EmptyDataError("The file is empty or Reached end of file.")     
            for i, value in enumerate(df_headers.iloc[0]):
                df_headers[i] = str(value)
            df.columns = df_headers.iloc[0]
            df=df.fillna("")
            next, df = (True, df[0:-1]) if len(df) > 50 else (False,df)
            column = {
            "ellipsis": True,
            "width": 200
            }
            return JsonResponse({
            'columns': [{**column,"title": col.replace("_", " ").strip(), "dataIndex": col } for col in df.columns.to_list()],
            'next': next,
            'current_page': page,
            'data': df.to_dict(orient='records')
            }, safe=False,status=200)       
        except pd.errors.EmptyDataError:
            LOGGER.info("The file is empty or Reached end of file.")
            return Response(str("Table is Empty or Reached End of the table"), status=400)
        except Exception as error:
            LOGGER.error(f"Error occured in DatasetsMicrositeViewSet get_json_response ERROR: {error}", exc_info=True)
            return Response(str(error), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    @action(detail=False, methods=["post"])
    def dataset_filters(self, request, *args, **kwargs):
        """This function get the filter args in body. based on the filter args orm filters the data."""
        data = request.data
        org_id = data.pop(Constants.ORG_ID, "")
        others = data.pop(Constants.OTHERS, "")
        categories = data.pop(Constants.CATEGORY, None)
        user_id = data.pop(Constants.USER_ID, "")
        exclude, filters = {}, {}
        if others:
            exclude = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
        else:
            filters = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
        try:
            # if categories is not None:
            #     data = (
            #         DatasetV2.objects.select_related(
            #             Constants.USER_MAP,
            #             Constants.USER_MAP_USER,
            #             Constants.USER_MAP_ORGANIZATION,
            #         )
            #         .filter(is_temp=False, **data, **filters)
            #         .filter(
            #             reduce(
            #                 operator.or_,
            #                 (Q(category__contains=cat) for cat in categories),
            #             )
            #         )
            #         .exclude(**exclude)
            #         .order_by(Constants.UPDATED_AT)
            #         .reverse()
            #         .all()
            #     )
            # else:
            data = (
                    DatasetV2.objects.select_related(
                        Constants.USER_MAP,
                        Constants.USER_MAP_USER,
                        Constants.USER_MAP_ORGANIZATION,
                    ).prefetch_related('dataset_cat_map')
                    .filter(is_temp=False, **data, **filters)
                    .exclude(**exclude)
                    .order_by(Constants.UPDATED_AT)
                    .reverse()
                    .all()
                )
        except Exception as error:  # type: ignore
            LOGGER.error(f"Error occured in DatasetsMicrositeViewSet dataset_filters ERROR: {error}", exc_info=True)
            return Response(f"Invalid filter fields: {list(request.data.keys())}", status=500)

        page = self.paginate_queryset(data)
        participant_serializer = DatahubDatasetsV2Serializer(page, many=True)
        return self.get_paginated_response(participant_serializer.data)

    @action(detail=False, methods=["post"])
    def filters_data(self, request, *args, **kwargs):
        """This function provides the filters data"""
        data = request.data
        org_id = data.pop(Constants.ORG_ID, "")
        others = data.pop(Constants.OTHERS, "")
        user_id = data.pop(Constants.USER_ID, "")
        exclude, filters = {}, {}
        if others:
            exclude = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
            # filters = {Constants.APPROVAL_STATUS: Constants.APPROVED}
        else:
            filters = {Constants.USER_MAP_ORGANIZATION: org_id} if org_id else {}
        try:
            geography = (
                DatasetV2.objects.values_list(Constants.GEOGRAPHY, flat=True)
                .filter(status=True, **filters)
                .exclude(geography="null")
                .exclude(geography__isnull=True)
                .exclude(geography="")
                .exclude(**exclude)
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
            LOGGER.error(f"Error occured in DatasetsMicrositeViewSet filters_data ERROR: {error}", exc_info=True)
            return Response(f"Invalid filter fields: {list(request.data.keys())}", status=500)
        return Response({"geography": geography, "category_detail": category_detail}, status=200)

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
                LOGGER.error(f"Error occured in DatasetsMicrositeViewSet category ERROR: {error}", exc_info=True)
                raise custom_exceptions.NotFoundException(detail="Categories not found")

    @action(detail=False, methods=["post"])
    def search_datasets(self, request, *args, **kwargs):
        data = request.data
        search_pattern = data.pop(Constants.SEARCH_PATTERNS, "")
        filters = {Constants.NAME_ICONTAINS: search_pattern} if search_pattern else {}
        try:
            data = (
                DatasetV2.objects.select_related(
                    Constants.USER_MAP,
                    Constants.USER_MAP_USER,
                    Constants.USER_MAP_ORGANIZATION,
                )
                .filter(user_map__user__status=True, is_temp=False, **filters)
                .order_by(Constants.UPDATED_AT)
                .reverse()
                .all()
            )
            page = self.paginate_queryset(data)
            participant_serializer = DatahubDatasetsV2Serializer(page, many=True)
            return self.get_paginated_response(participant_serializer.data)
        except Exception as error:  # type: ignore
            LOGGER.error(f"Error occured in DatasetsMicrositeViewSet search_datasets ERROR: {error}", exc_info=True)
            return Response(
                f"Invalid filter fields: {list(request.data.keys())}",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def get_dashboard_chart_data(self, request, pk, *args, **kwargs):
        try:
            hash_key = generate_hash_key_for_dashboard(pk, request.data)
            cache_data = cache.get(hash_key, {})
            if cache_data:
                LOGGER.info("Dashboard details found in cache", exc_info=True)
                return Response(
                cache_data,
                status=status.HTTP_200_OK,
                )
            dataset_file_object = DatasetV2File.objects.get(id=pk)
            dataset_file = str(dataset_file_object.file)

            if "omfp" in dataset_file.lower():
                return generate_omfp_dashboard(dataset_file, request.data, hash_key, False)
            if "fsp" in dataset_file.lower():
                return generate_fsp_dashboard(dataset_file, request.data, hash_key, False)
            if "knfd" in dataset_file.lower():
                return generate_knfd_dashboard(dataset_file, request.data, hash_key, False)
            if not "kiamis" in dataset_file.lower():
                 return Response(
                    "Requested resource is currently unavailable. Please try again later.",
                    status=status.HTTP_200_OK,
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
                    filters=True
                )
            except Exception as e:
                LOGGER.error(f"Error occured in kiamis dashboard generation ERROR: {e}", exc_info=True)
                return Response(
                    f"Something went wrong, please try again. {e}",
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                data,
                status=status.HTTP_200_OK,
            )
        except DatasetV2File.DoesNotExist:
            return Response(
                "No dataset file for the provided id.",
                status=status.HTTP_404_NOT_FOUND,
            )


class ContactFormViewSet(GenericViewSet):
    """Contact Form for guest users to mail queries or application to become participant on datahub"""

    serializer_class = ContactFormSerializer
    permission_classes = []

    def create(self, request):
        """POST method to create a query and mail it to the datahub admin"""
        datahub_admin = User.objects.filter(role_id=1).first()
        serializer = self.get_serializer(data=request.data)
        print(serializer)
        serializer.is_valid(raise_exception=True)
        try:
            date = datetime.datetime.now().strftime("%d-%m-%Y")
            data = serializer.data
            data.update({"date": date})
            # render email from query_email template
            email_render = render(request, "user_fills_in_contact_form.html", data)
            mail_body = email_render.content.decode("utf-8")
            Utils().send_email(
                to_email=[datahub_admin.email],
                content=mail_body,
                subject=serializer.data.get("subject", Constants.DATAHUB),
            )
            return Response(
                {"Message": "Your query is submitted! Thank you."},
                status=status.HTTP_200_OK,
            )

        except Exception as error:
            LOGGER.error(f"Error occured in ContactFormViewSet create ERROR: {error}", exc_info=True)
            return Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DocumentsMicrositeViewSet(GenericViewSet):
    """View for uploading all the datahub documents and content"""

    serializer_class = LegalDocumentSerializer
    queryset = DatahubDocuments.objects.all()
    permission_classes = []

    @action(detail=False, methods=["get"])
    def legal_documents(self, request):
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
            LOGGER.error(f"Error occured in DocumentsMicrositeViewSet legal_documents ERROR: {error}", exc_info=True)
            return Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ParticipantMicrositeViewSet(GenericViewSet):

    """View for uploading all the datahub documents and content"""

    serializer_class = UserCreateSerializer
    queryset = User.objects.all()
    pagination_class = CustomPagination
    permission_classes = []

    def list(self, request, *args, **kwargs):
        """GET method: query all the list of objects from the Product model"""
        on_boarded_by = request.GET.get("on_boarded_by", None)
        co_steward = request.GET.get("co_steward", False)
        approval_status = request.GET.get(Constants.APPROVAL_STATUS, True)
        name = request.GET.get(Constants.NAME, "")
        filter = {Constants.ORGANIZATION_NAME_ICONTAINS: name} if name else {}
        try:
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
                        # user__on_boarded_by=None,
                        user__approval_status=approval_status,
                        **filter,
                    )
                    .order_by("-user__updated_at")
                    .all()
                )
            page = self.paginate_queryset(roles)
            participant_serializer = ParticipantSerializer(page, many=True)
            return self.get_paginated_response(participant_serializer.data)
        except Exception as error:
            LOGGER.error(f"Error occured in ParticipantMicrositeViewSet list ERROR: {error}", exc_info=True)
            return Response(str(error.__context__), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk):
        """GET method: retrieve an object or instance of the Product model"""
        roles = (
            UserOrganizationMap.objects.prefetch_related(Constants.USER, Constants.ORGANIZATION)
            .filter(user__status=True, user=pk)
            .all()
        )
        participant_serializer = ParticipantSerializer(roles, many=True)
        try:
            if participant_serializer.data:
                return Response(participant_serializer.data[0], status=status.HTTP_200_OK)
            return Response([], status=status.HTTP_200_OK)
        except Exception as error:
            LOGGER.error(f"Error occured in ParticipantMicrositeViewSet retrive ERROR: {error}", exc_info=True)
            return Response(str(error), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["get"])
    def organizations(self, request, *args, **kwargs):
        """GET method: query the list of Organization objects"""
        co_steward = request.GET.get("co_steward", False)
        try:
            if co_steward:
                roles = (
                    UserOrganizationMap.objects.select_related(Constants.ORGANIZATION)
                    .filter(user__status=True, user__role=6)
                    .all()
                )
            else:
                roles = (
                    UserOrganizationMap.objects.select_related(Constants.USER, Constants.ORGANIZATION)
                    .filter((Q(user__role=3) | Q(user__role=1)), user__status=True)
                    .all()
                )
            page = self.paginate_queryset(roles)
            participant_serializer = micrositeOrganizationSerializer(page, many=True)
            return self.get_paginated_response(participant_serializer.data)
        except Exception as error:
            LOGGER.error(f"Error occured in ParticipantMicrositeViewSet organizations ERROR: {error}", exc_info=True)
            return Response(str(error), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PolicyAPIView(GenericViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    permission_classes = []

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class APIResponseViewSet(GenericViewSet):
    permission_classes = []

    @action(detail=False, methods=["get"])
    def api(self, request, *args, **kwargs):
        try:
            get_api_key = request.META.get("HTTP_API_KEY", None)
            page = int(request.GET.get('page', 1))
            file_path_query_set=UsagePolicy.objects.select_related('dataset_file').filter(api_key=get_api_key).values('dataset_file__standardised_file', 'configs')
            if get_api_key is None or not file_path_query_set:
                return Response(
                {
                    "message" : "Invalid auth credentials provided."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )          
            file_path = file_path_query_set[0]["dataset_file__standardised_file"]
            configs = file_path_query_set[0]["configs"]
            protected_file_path = os.path.join(settings.DATASET_FILES_URL, str(file_path))
            next=False
            start_index = 0  + 50*(page-1) 
            end_index = 50*page  
            if protected_file_path.endswith(".xlsx") or protected_file_path.endswith(".xls"):
                df_header = pd.read_excel(protected_file_path, nrows=1, header=None)                       
                df = pd.read_excel(protected_file_path, index_col=None,  header=0, skiprows=range(0, start_index), nrows=end_index - start_index+1)
            else:
                df_header = pd.read_csv(protected_file_path, nrows=1, header=None)
                df = pd.read_csv(protected_file_path, index_col=False, header=0, skiprows=range(0, start_index), nrows=end_index - start_index+1)
            if df.empty  :
                raise pd.errors.EmptyDataError("The file is empty or Reached end of file.")      
            for i, value in enumerate(df_header.iloc[0]):
                df_header[i] = str(value)
            df.columns = df_header.iloc[0]
            df=df[configs.get('columns')] if configs.get('columns', []) else df
            df=df.fillna("")
            next, df = (True, df[0:-1]) if len(df) > 50 else (False,df)   
            return JsonResponse(
            {
            'next': next,
            'current_page': page,
            'data': df.to_dict(orient='records')
            }, safe=False,status=200)       
        except pd.errors.EmptyDataError:
            LOGGER.info("The file is empty or Reached end of file.")
            return Response(str("File is Empty or Reached End of the file"), status=400)
        except Exception as error:
            LOGGER.error(f"Error occured in APIResponseViewSet api ERROR: {error}", exc_info=True)
            return Response(str(error), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=["get"])
    def flw_validation(self, request, *args, **kwargs):
        try:
            phone_number=request.GET.get("phone_number")
            department_details=request.GET.get("department_details", False)
            df = self.get_consolidated_dataframe()
            if df.empty:
                return Response(str(f"With this phone_number:{phone_number} Flew is not availbe"), status=400)
            df.fillna("",  inplace=True) # type: ignore
            df["Phone Number"] = df["Phone Number"].astype(str) # type: ignore
            result = df[df['Phone Number'] == phone_number]
            if not result.empty: # type: ignore
                if department_details:
                    return Response(result['KVK and Contact persons'].iloc[0], 200)  # type: ignore # Return only the kvk details column value
                else:
                    return Response(result.iloc[0].to_dict(), 200)  # type: ignore # Return the first matching row as a dictionary
            else:
                return Response(str(f"With this phone_number:{phone_number} Flew is not availbe"), status=400)
        except pd.errors.EmptyDataError:
            LOGGER.info("The flw file is emty.")
            return Response(str("No Flew regiestry are available"), status=400)
        except Exception as error:
            LOGGER.error(f"Error occured in flw_validation api ERROR: {error}", exc_info=True)
            return Response(str("Error during execution of flw validations"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["get"])
    def get_consolidated_dataframe(self, category={}):
        consolidated_file = f"consolidated_flw_registry.csv" 
        dataframes = []
        thread_list = []
        combined_df = pd.DataFrame([])
        try:
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
                        LOGGER.error(f"Error reading CSV file {file_path}: {e}", exc_info=True)
                
            if cache.get("flw_consolidated_file"):
                LOGGER.info(f"{consolidated_file} file available in cache")
                file_path = os.path.join(settings.DATASET_FILES_URL, consolidated_file)
                read_csv_file(file_path)
                combined_df = pd.concat(dataframes, ignore_index=True)
                return combined_df
            else:
                dataset_file_objects = (
                    DatasetV2File.objects
                    .select_related("dataset")
                    .filter(file__iendswith=".csv", dataset__is_temp=False)
                    .values_list('file', flat=True).distinct()  # Flatten the list of values
                )
                import pdb; pdb.set_trace()

                dataset_file_objects = dataset_file_objects.filter(dataset__category__contains=category if category else {"States": ["Bihar"]})
                # dataset_file_objects = ["/Users/ugesh/PycharmProjects/datahub-api/protected/datasets/sample/bihar.csv"]
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
            cache.set("flw_consolidated_file", consolidated_file, 86400)
            return combined_df
        except Exception as e:
            LOGGER.error(f"Error occoured while creating {consolidated_file}: {e}", exc_info=True)
            return pd.DataFrame([])

    @action(detail=False, methods=["get"])
    def bot_dashboard(self, request, *args):
        def get_user_organization_map_count(role_id, result_dict):
            count = (
                    UserOrganizationMap.objects.select_related(Constants.USER, Constants.ORGANIZATION)
                    .filter(user__status=True, user__role=role_id)
                    .count()
                )
            result_dict[role_id]=count
        def get_resources_count(result_dict):
            rsources_count = ResourceFile.objects.values('type').annotate(count=Count('type'))
            result_dict["resource"]= rsources_count
        def run_query(thread, target, *args):
            result = target(*args)
            thread.result = result
        threads = []  # List to store thread objects
        result_dict = {}

        # Create threads for each query in a loop
        for role in [6, 3]:
            thread = threading.Thread(target=lambda r=role: get_user_organization_map_count(r, result_dict))
            threads.append(thread)
            thread.start()

        resources_count_thread = threading.Thread(target=get_resources_count(result_dict))
        threads.append(resources_count_thread)
        resources_count_thread.start()

        # Wait for all threads to finish
        for thread in threads:
            thread.join()

        # Retrieve results
        states_result = result_dict.get(6)
        participants_result = result_dict.get(3)
        resources_count_result = result_dict.get("resource")

        response = requests.get("https://farmerchat.farmstack.co/dashboard_be/dashboard_api/dashboard_data/?instance=vistaar")
        if response.status_code ==200:
            bot_mobile_numbers = response.json().get("mobile_numbers", [])
            mobile_number_message_count = response.json().get("user_wise_message_count", [])
            total_flews_df = self.get_consolidated_dataframe()
            total_flews_df["Gender"] = total_flews_df["Gender"].str.upper().str.strip()
            print(total_flews_df["Gender"].unique())
            gender_changes = {'M': 'MALE', 'F': 'FEMALE', "FEMALE": 'FEMALE', "MALE":"MALE"}
            total_flews_df['Gender'] = total_flews_df['Gender'].astype(str).map(gender_changes).fillna('') # type: ignore
            total_flews = total_flews_df.size
            bot_users = len(bot_mobile_numbers)
            merged_df = pd.merge(pd.DataFrame(mobile_number_message_count), total_flews_df[["Phone Number", "Gender", "State","Department","District Name","FLEW Name"]], left_on="phone", right_on="Phone Number", how="inner")
            gender_wise_total_count_df = total_flews_df.groupby(["Gender"]).size().reset_index(name='Count')

            # pivot_table = gender_wise_count_df.pivot_table(index='District Name', columns='Gender', values='Count', fill_value=0)
            gender_wise_total_count = gender_wise_total_count_df.to_dict(orient='records')
            
            gender_wise_count_df = merged_df.groupby(["Gender"]).size().reset_index(name='Count')

            # pivot_table = gender_wise_count_df.pivot_table(index='District Name', columns='Gender', values='Count', fill_value=0)
            gender_wise_count = gender_wise_count_df.to_dict(orient='records')

            total_questions_answered = merged_df["answered"].sum()
            total_questions_unanswered = merged_df["unanswered"].sum()
            total_questions_asked = merged_df["total_messages"].sum()
            # Convert the DataFrame to a dictionary with the desired format

            
            # Convert the DataFrame to a dictionary with the desired format
            message_count_sum_by_district = merged_df.groupby("District Name").agg({
                "total_messages": "sum",
                "answered": "sum",
                "unanswered": "sum"
            }).reset_index()

            message_count_sum_by_district.columns = ['District Name', 'Total_Messages', 'Answered', 'Unanswered']
            questions_asked_by_location = message_count_sum_by_district.set_index('District Name').to_dict(orient='index')

            questions_asked_by_gender_df = merged_df.groupby("Gender").agg({
                "total_messages": "sum",
                "answered": "sum",
                "unanswered": "sum"
            }).reset_index()

            # Rename the columns for clarity
            questions_asked_by_gender_df.columns = ['Gender', 'Total_Messages', 'Answered', 'Unanswered']

            # Convert the DataFrame to a dictionary with the desired format
            questions_asked_by_gender = questions_asked_by_gender_df.set_index('Gender').to_dict(orient='index')
            return Response({"gender_wise_total_count": gender_wise_total_count,
                            "total_questions_asked":total_questions_asked,
                            "total_questions_answered": total_questions_answered,
                            "total_questions_unanswered": total_questions_unanswered,
                            "states":states_result,
                            "departments": participants_result,
                            "respources": resources_count_result,
                            "total_flews": total_flews,
                            "flew_users_in_bot": bot_users,
                            "flew_users_not_in_bot": total_flews-bot_users,
                            "languages_supported": response.json().get("languages_supported", []),
                            "date_wise_message_count": response.json().get("date_wise_message_count", []),
                            "location_wise_message_count": questions_asked_by_location,
                            "bot_gender_wise_count": gender_wise_count,
                            "questions_asked_by_gender": questions_asked_by_gender
                            }, 200)
        else:
            return Response(f"Bot is responding with status code:{response.status_code}", 500)

    @action(detail=False, methods=["get"])
    def resource(self, request, *args, **kwargs):
        try:
            get_api_key = request.META.get("HTTP_API_KEY", None)
            # page = int(request.GET.get('page', 1))
            file_path_query_set=Resource.objects.prefetch_related('resource_usage_policy').filter(resource_usage_policy__api_key=get_api_key).first()

            if get_api_key is None or not file_path_query_set:
                return Response(
                {
                    "message" : "Invalid auth credentials provided."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )          
            if file_path_query_set.resource_usage_policy.filter(type='embeddings'):
                serializer = ResourceEmbeddingsSerializer(file_path_query_set)
            elif file_path_query_set.resource_usage_policy.filter(type='resource'):
                serializer = ResourceMicrsositeSerializer(file_path_query_set)
                
            return Response(serializer.data,status=200)       
        except Exception as error:
            LOGGER.error(f"Error occured in APIResponseViewSet api ERROR: {error}", exc_info=True)
            return Response(str(error), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
    @action(detail=False, methods=["get"])
    def resource_bot(self, request, *args, **kwargs):
        try:
            get_api_key = request.META.get("HTTP_API_KEY", None)
            # page = int(request.GET.get('page', 1))
            query = request.GET.get("query")
            file_path_query_set=Resource.objects.prefetch_related('resource_usage_policy').filter(resource_usage_policy__api_key=get_api_key).first()
            if get_api_key is None or not file_path_query_set:
                return Response(
                {
                    "message" : "Invalid auth credentials provided."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
            map_id = ResourceUsagePolicy.objects.get(api_key=get_api_key).user_organization_map_id        
            history = Messages.objects.filter(user_map=map_id).order_by("-created_at")
            history = history.filter(resource_id=file_path_query_set.id).first() if file_path_query_set else history.first()
      
            # print(chat_history)
            # chat_history = history.condensed_question if history else ""
            summary, chunks, condensed_question, prompt_usage = VectorDBBuilder.get_input_embeddings(query, "Guest User", file_path_query_set.id, history)
            data = {"user_map": UserOrganizationMap.objects.get(id=map_id).id, "resource": file_path_query_set.id, "query": query, 
                    "query_response": summary, "condensed_question":condensed_question, "bot_type":"vistaar_api",
                    "prompt_usage": prompt_usage}
            messages_serializer = MessagesSerializer(data=data)
            messages_serializer.is_valid(raise_exception=True)
            message_instance = messages_serializer.save()  # This returns the Messages model instance
            if chunks:
                message_instance.retrieved_chunks.set(chunks.values_list("uuid", flat=True))
            return Response(summary)
        except Exception as error:
            LOGGER.error(f"Error occured in APIResponseViewSet api ERROR: {error}", exc_info=True)
            return Response(str(error), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                

class UserDataMicrositeViewSet(GenericViewSet):
    """UserData Microsite ViewSet for microsite"""

    permission_classes = []

    @action(detail=False, methods=["get"])
    def user_data(self, request):
        """GET method: retrieve an object of Organization using User ID of the User (IMPORTANT: Using USER ID instead of Organization ID)"""
        try:
            datahub_admin = User.objects.get(id=request.GET.get("user_id", ""))
            print(datahub_admin, "datahub_admin")

            serializer = UserDataMicrositeSerializer(datahub_admin)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as error:
            LOGGER.error(f"Error occured in UserDataMicrositeViewSet use_data ERROR: {error}", exc_info=True)
            return Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# @permissions.AllowAny
# class PolicyDetailAPIView(generics.RetrieveAPIView):
#     queryset = Policy.objects.all()
#     serializer_class = PolicySerializer


def microsite_media_view(request):
    file = get_object_or_404(DatasetV2File, id=request.GET.get("id"))
    file_path = ""
    try:
        if file.accessibility == Constants.PUBLIC:
            file_path = str(file.file)
            file_path = os.path.join(settings.DATASET_FILES_URL, file_path)
            if not os.path.exists(file_path):
                return HttpResponseNotFound("File not found", 404)
            response = FileResponse(open(file_path, "rb"))
        else:
            return HttpResponse(
                f"You don't have access to download this private file, Your request status is", status=403
            )

        return response
    except Exception as error:
        LOGGER.error(f"Error occured in microsite_media_view ERROR: {error}", exc_info=True)
        return Response({str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConnectorMicrositeViewSet(GenericViewSet):
    """Viewset for Product model"""

    permission_classes = []
    queryset = Connectors.objects.all()
    pagination_class = CustomPagination

    def list(self, request, *args, **kwargs):
        data = Connectors.objects.all().order_by(Constants.UPDATED_AT).reverse()
        page = self.paginate_queryset(data)
        connectors_data = ConnectorsListSerializer(page, many=True)
        return self.get_paginated_response(connectors_data.data)

    def retrieve(self, request, pk):
        """GET method: retrieve an object or instance of the Product model"""
        try:
            instance = self.get_object()
            serializer = ConnectorsRetriveSerializer(instance=instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as error:
            LOGGER.error(f"Error occured in ConnectorMicrositeViewSet list ERROR: {error}", exc_info=True)
            return Response(str(error), status=status.HTTP_400_BAD_REQUEST)


class ResourceMicrositeViewSet(GenericViewSet):
    permission_classes = []
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    pagination_class = CustomPagination

    # @http_request_mutation
    def list(self, request, *args, **kwargs):
        try:
            page = self.paginate_queryset(self.get_queryset().order_by("-updated_at"))
            serializer = ResourceListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(f"Error occured in ResourceMicrositeViewSet list ERROR: {e}", exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        resource = self.get_object()
        serializer = self.get_serializer(resource)
        # serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["post"])
    def resources_filter(self, request, *args, **kwargs):
        try:
            data =request.data
            categories = data.pop(Constants.CATEGORY, None)
            filters = {key: value for key, value in data.items() if value}
            query_set = self.get_queryset().filter(**filters).order_by("-updated_at")
            if categories:
                query_set = query_set.filter(
                    reduce(
                        operator.or_,
                        (Q(category__contains=cat) for cat in categories),
                    )
                )
            page = self.paginate_queryset(query_set)
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(f"Error occured in ResourceMicrositeViewSet resources_filter ERROR: {e}", exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["post"])
    def content_data(self, request, *args, **kwargs):
        try:
            data =request.data
            categories = data.pop(Constants.CATEGORY, [])
            filters = {key: value for key, value in data.items() if value}
            file_filters = data.get("resources__updated_at__gt", None)
            query_set = Resource.objects.filter(**filters).prefetch_related('resources', "resource_cat_map","resource_cat_map__sub_category", "resource_cat_map__sub_category__category")
            category_query = Q()
            if categories:
                for cat in categories:
                    for key, values in cat.items():
                        # Build a Q object for each category and subcategory
                        category_query &= Q(resource_cat_map__sub_category__name__in=values,
                                            resource_cat_map__sub_category__category__name=key)
                            
                query_set = query_set.filter(category_query)
            file_filters = {"updated_at__gt":datetime.datetime.fromisoformat(file_filters)} if file_filters else {} # type: ignore
            if file_filters:
                data = []
                for resource in query_set.distinct():
                    category_aggregate = defaultdict(list)
                    for resource_map in resource.resource_cat_map.all():
                        sub_category_data = resource_map.sub_category
                        if sub_category_data:
                            category_name = sub_category_data.category.name
                            sub_category_name = sub_category_data.name
                            category_aggregate[category_name].append(sub_category_name)
                            aggregated_data = {k: v for k, v in category_aggregate.items()}
                    resources_data={"id": resource.id, "title": resource.title, "description": resource.description, "category": aggregated_data}
                    files = ResourceFile.objects.filter(**file_filters, resource=resource.id).all()
                    resources_data["resources"] = ContentFileSerializer(files, many=True).data
                    data.append(resources_data)
                return Response(data, status=status.HTTP_200_OK)
            else:
                serializer = ContentSerializer(query_set, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(f"Error occured in ResourceMicrositeViewSet resources_filter ERROR: {e}", exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["get"])
    def crops_list(self, request, *args, **kwargs):
        try:
            state =request.GET.get("state")
            if state:
                # Filter the queryset to get records with the desired state
                records_with_state = Resource.objects.filter(category__States__contains=[state]).all()
                print(records_with_state)
                # Extract the crops from the filtered records
                crops_list = [item for record in records_with_state 
                              for item in record.category.get("Crops", [])]
                return Response(list(set(crops_list)), status=200)
            else:
                with open(Constants.DATAHUB_CATEGORIES_FILE, "r") as json_obj:
                    data = json.loads(json_obj.read())
                    print(data)
                    return Response(data.get("Crops", []), status=200)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            LOGGER.error(f"Error occured in ResourceMicrositeViewSet resources_filter ERROR: {e}", exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=["get"])
    def get_organizations(self, request):
        # Get all unique organizations that are linked through the user_map in the Resource model
        organizations = Organization.objects.filter(
            id__in=Resource.objects.values_list('user_map__organization', flat=True).distinct()
        )

        # Serialize the list of organizations
        serializer = OrganizationSerializer(organizations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def get_categories_by_org(self, request):
        """
        API to return a list of categories and subcategories based on organization_id or email,
        excluding resources where category is 'states'.
        """
        organization_id = request.query_params.get('id', None)
        email = request.query_params.get('email', None)
# Step 1: Filter resources based on organization or user email
        if organization_id:
            resources = Resource.objects.filter(user_map__organization_id=organization_id)
        elif email:
            resources = Resource.objects.filter(user_map__user__email=email)
        else:
            return Response(
                {"error": "Please provide either organization_id or email"},
                status=status.HTTP_400_BAD_REQUEST
            )
        resource_sub_cat_map_id = ResourceSubCategoryMap.objects.filter(resource__in=resources).values_list('sub_category_id', flat=True)
        # Step 2: Get all subcategories linked to the filtered resources via ResourceSubCategoryMap
        subcategories = SubCategory.objects.filter(
            id__in=resource_sub_cat_map_id
        )
        # Step 3: Get the categories linked to these subcategories, excluding where category is 'states'
        categories = Category.objects.filter(
            id__in=subcategories.values_list('category_id', flat=True)
        ).prefetch_related('subcategory_category')

        # Step 4: Serialize the categories
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
      
    @action(detail=False, methods=["post"])
    def get_content(self, request):
        embeddings = []
        email = request.data.get("email")
        query = request.data.get("query")
        user_obj = User.objects.filter(email=email)
        user = user_obj.first()
        data = (
                ResourceFile.objects.select_related(
                    "resource",
                    "resource__user_map",
                    "resource__user_map__user"
                )
            )
        if not user:
            return Response([])
        elif user.on_boarded_by:
            data = (
                data.filter(
                    Q(resource__user_map__user__on_boarded_by=user.on_boarded_by)
                    | Q(resource__user_map__user_id=user.on_boarded_by)
                    )
            )
        elif user.role_id == 6:
            data = (
                data.filter(
                    Q(resource__user_map__user__on_boarded_by=user.id)
                    | Q(resource__user_map__user_id=user.id)
                    )
            )
        else:
            data = (
                data.filter(resource__user_map__user__on_boarded_by=None).exclude(resource__user_map__user__role_id=6)
            )
        resource_file_ids = data.values_list("id", flat=True).all()

        similar_chunks = QuadrantRetrival().retrieve_chunks(resource_file_ids, query, "", "","","","","", 10, 0.17)
        return Response(similar_chunks)


# Created a new class to return data from kde, agnext and krishitantra data stored in json format in utils folder
class AdexAPIDatasetViewSet(GenericViewSet):

    permission_classes = []
    
    def list(self, request, *args, **kwargs):
        try:
            # Checking the auth params form headers
            if request.headers.get('x-api-key', '') == '' or request.headers.get('x-api-key', None) != settings.SAGUBAGU_API_KEY:
                return Response({"message":"Invalid auth credentials provided."},status=status.HTTP_401_UNAUTHORIZED)
            # Getting query paarmas
            data_list = []
            data_dict = {}
            if request.GET.get('krishitantra') == 'True' or request.GET.get('krishitantra') =='true':
                data_list.append('krishitantra_data')
            if request.GET.get('agnext') == 'True' or request.GET.get('agnext') == 'true':
                data_list.append('agnext_data')
            if request.GET.get('kde') == 'True' or request.GET.get('kde') == 'true':
                data_list.append('kde_data')
            if data_list == []:
                data_list = ['krishitantra_data','agnext_data','kde_data']
            for datasets in data_list:
                with open(f"./utils/{datasets}.json", 'r') as file:
                    json_data = json.loads(file.read())
                data_dict[datasets] = []
                for value in json_data.values():
                    data_dict[datasets].append(value)
            return Response(data_dict, status=200)
        except Exception as e:
            LOGGER.error(f"Error occured in data retreival ERROR: {e}", exc_info=True)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MyModelListCreateView(generics.ListCreateAPIView):
    permission_classes = []
    queryset = FeedBack.objects.all()
    serializer_class = FeedBackSerializer

class MyModelDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = []
    queryset = FeedBack.objects.all()
    serializer_class = FeedBackSerializer

class CategoryViewSet(GenericViewSet):
    queryset = Category.objects.prefetch_related("subcategory_category").all()
    serializer_class = CategorySerializer
    permission_classes=[]
 
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)