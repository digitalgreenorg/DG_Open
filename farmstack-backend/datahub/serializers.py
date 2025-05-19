import json
import logging
import os
import re
import secrets
import shutil
import string
import uuid
from urllib.parse import quote

import plazy
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.core.files.base import ContentFile
from django.core.validators import URLValidator
from django.db.models import Count, Prefetch, Q
from django.utils.translation import gettext as _
from requests import Response
from rest_framework import serializers, status

from accounts import models
from accounts.models import User, UserRole
from accounts.serializers import (
    UserCreateSerializer,
    UserRoleSerializer,
    UserSerializer,
)
from core.constants import Constants
from datahub.models import (
    DatahubDocuments,
    Datasets,
    DatasetV2,
    DatasetV2File,
    Organization,
    Resource,
    ResourceFile,
    ResourceUsagePolicy,
    StandardisationTemplate,
    UserOrganizationMap,
)
from participant.models import Connectors, SupportTicket
from utils.custom_exceptions import NotFoundException
from utils.embeddings_creation import VectorDBBuilder
from utils.file_operations import create_directory, move_directory
from utils.string_functions import check_special_chars
from utils.validators import (
    validate_dataset_size,
    validate_dataset_type,
    validate_document_type,
    validate_file_size,
    validate_image_type,
)
from utils.youtube_helper import get_youtube_url

from .models import (  # Conversation,
    Category,
    DatasetSubCategoryMap,
    LangchainPgCollection,
    LangchainPgEmbedding,
    Messages,
    Policy,
    ResourceSubCategoryMap,
    SubCategory,
    UsagePolicy,
)

LOGGER = logging.getLogger(__name__)

from ai.vector_db_builder.vector_build import create_vector_db, load_categories


class OrganizationRetriveSerializer(serializers.ModelSerializer):
    """_summary_

    Args:
        serializers (_type_): _description_
    """

    class Meta:
        """_summary_"""

        model = Organization
        exclude = Constants.EXCLUDE_DATES


class OrganizationSerializer(serializers.ModelSerializer):
    # org_email = serializers.EmailField()
    # website = serializers.CharField()

    # def validate(self, attrs):
    #     # Use URLValidator to validate the website field
    #     website = attrs.get("website")
    #     if website:
    #         validator = URLValidator(schemes=["https"])
    #         try:
    #             validator(website)
    #         except ValidationError:
    #             raise serializers.ValidationError({"website": "Invalid website URL"})

    #     return attrs

    class Meta:
        model = Organization

        fields="__all__"

class UserOrganizationCreateSerializer(serializers.Serializer):
    """_summary_

    Args:
        serializers (_type_): _description_
    """

    user = UserSerializer(
        read_only=True,
        allow_null=True,
        required=False,
    )
    organization = OrganizationRetriveSerializer(
        read_only=True,
        allow_null=True,
        required=False,
    )

    # class Meta:
    #     """_summary_"""

    # model = UserOrganizationMap
    # fields = [Constants.ORGANIZATION, Constants.USER]
    # exclude = Constants.EXCLUDE_DATES


class UserOrganizationMapSerializer(serializers.ModelSerializer):
    """_summary_

    Args:
        serializers (_type_): _description_
    """

    class Meta:
        """_summary_"""

        model = UserOrganizationMap
        fields = Constants.ALL
        # exclude = Constants.EXCLUDE_DATES


class ParticipantSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=models.User.objects.all(),
        required=True,
        source=Constants.USER,
    )
    organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        allow_null=True,
        required=False,
        source=Constants.ORGANIZATION,
    )
    user = UserSerializer(
        read_only=False,
        required=False,
    )
    organization = OrganizationRetriveSerializer(
        required=False,
        allow_null=True,
        read_only=True,
    )

    class Meta:
        model = UserOrganizationMap
        exclude = Constants.EXCLUDE_DATES

    dataset_count = serializers.SerializerMethodField(method_name="get_dataset_count")
    content_files_count = serializers.SerializerMethodField(method_name="get_content_files_count")
    connector_count = serializers.SerializerMethodField(method_name="get_connector_count")
    number_of_participants = serializers.SerializerMethodField()

    def get_dataset_count(self, user_org_map):
        return DatasetV2.objects.filter(user_map_id=user_org_map.id, is_temp=False).count()
    
    def get_content_files_count(self, user_org_map):
        return ResourceFile.objects.select_related("resource").filter(
            Q(resource__user_map_id=user_org_map.id) |
            Q(resource__user_map__user__on_boarded_by=user_org_map.user_id)
                            ).values('type').annotate(count=Count('type'))
    def get_connector_count(self, user_org_map):
        return Connectors.objects.filter(user_map_id=user_org_map.id).count()

    def get_number_of_participants(self, user_org_map):
        return (
            UserOrganizationMap.objects.select_related(Constants.USER, Constants.ORGANIZATION)
            .filter(user__status=True, user__on_boarded_by=user_org_map.user.id, user__role=3)
            .all()
            .count()
        )


class DropDocumentSerializer(serializers.Serializer):
    """DropDocumentSerializer class"""

    governing_law = serializers.FileField(validators=[validate_file_size, validate_document_type])
    privacy_policy = serializers.FileField(validators=[validate_file_size, validate_document_type])
    tos = serializers.FileField(validators=[validate_file_size, validate_document_type])
    limitations_of_liabilities = serializers.FileField(validators=[validate_file_size, validate_document_type])
    warranty = serializers.FileField(validators=[validate_file_size, validate_document_type])


class PolicyDocumentSerializer(serializers.ModelSerializer):
    """PolicyDocumentSerializer class"""

    governing_law = serializers.CharField()
    privacy_policy = serializers.CharField()
    tos = serializers.CharField()
    limitations_of_liabilities = serializers.CharField()
    warranty = serializers.CharField()

    class Meta:
        model = DatahubDocuments
        fields = Constants.ALL


class DatahubThemeSerializer(serializers.Serializer):
    """DatahubThemeSerializer class"""

    banner = serializers.ImageField(
        validators=[validate_file_size, validate_image_type],
        required=False,
        allow_null=True,
    )
    button_color = serializers.CharField(required=False, allow_null=True)
    # email = serializers.EmailField()


class TeamMemberListSerializer(serializers.Serializer):
    """
    Create Team Member Serializer.
    """

    class Meta:
        model = User

    id = serializers.UUIDField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    role = serializers.PrimaryKeyRelatedField(queryset=UserRole.objects.all(), read_only=False)
    profile_picture = serializers.FileField()
    status = serializers.BooleanField()
    on_boarded = serializers.BooleanField()


class TeamMemberCreateSerializer(serializers.ModelSerializer):
    """
    Create a Team Member
    """

    class Meta:
        model = User
        fields = ("email", "first_name", "last_name", "role", "on_boarded_by", "on_boarded")


class TeamMemberDetailsSerializer(serializers.ModelSerializer):
    """
    Details of a Team Member
    """

    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "role", "on_boarded_by", "on_boarded")


class TeamMemberUpdateSerializer(serializers.ModelSerializer):
    """
    Update Team Member
    """

    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "role", "on_boarded_by", "on_boarded")


class DatasetSerializer(serializers.ModelSerializer):
    """_summary_

    Args:
        serializers (_type_): _description_
    """

    def validate_sample_dataset(self, value):
        """
        Validator function to check the file size limit.
        """
        MAX_FILE_SIZE = (
            Constants.MAX_PUBLIC_FILE_SIZE if self.initial_data.get("is_public") else Constants.MAX_FILE_SIZE
        )
        filesize = value.size
        if filesize > MAX_FILE_SIZE:
            raise ValidationError(
                _("You cannot upload a file more than %(value)s MB"),
                params={"value": MAX_FILE_SIZE / 1048576},
            )
        return value

    class Meta:
        """_summary_"""

        model = Datasets
        fields = [
            "user_map",
            "name",
            "description",
            "category",
            "geography",
            "crop_detail",
            "constantly_update",
            "dataset_size",
            "connector_availability",
            "age_of_date",
            "sample_dataset",
            "data_capture_start",
            "data_capture_end",
            "remarks",
            "is_enabled",
            "approval_status",
            "is_public",
        ]


class DatasetUpdateSerializer(serializers.ModelSerializer):
    """_summary_

    Args:
        serializers (_type_): _description_
    """

    class Meta:
        """_summary_"""

        model = Datasets
        fields = Constants.ALL


class DatahubDatasetsDetailSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=models.User.objects.all(), required=True, source="user_map.user"
    )
    organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        allow_null=True,
        required=False,
        source="user_map.organization",
    )
    user = UserSerializer(
        read_only=False,
        required=False,
        allow_null=True,
        source="user_map.user",
    )
    organization = OrganizationRetriveSerializer(
        required=False, allow_null=True, read_only=True, source="user_map.organization"
    )

    class Meta:
        model = Datasets
        exclude = Constants.EXCLUDE_DATES


class DatahubDatasetsSerializer(serializers.ModelSerializer):
    class OrganizationDatsetsListRetriveSerializer(serializers.ModelSerializer):
        class Meta:
            model = Organization
            fields = [
                "org_email",
                "org_description",
                "name",
                "logo",
                "address",
                "phone_number",
            ]

    class UserDatasetSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ["last_name", "first_name", "email", "on_boarded_by"]

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=models.User.objects.all(), required=True, source="user_map.user"
    )
    organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        allow_null=True,
        required=False,
        source="user_map.organization",
    )

    organization = OrganizationDatsetsListRetriveSerializer(
        required=False, allow_null=True, read_only=True, source="user_map.organization"
    )
    user = UserDatasetSerializer(required=False, allow_null=True, read_only=True, source="user_map.user")

    class Meta:
        model = Datasets
        fields = Constants.ALL


class RecentSupportTicketSerializer(serializers.ModelSerializer):
    class OrganizationRetriveSerializer(serializers.ModelSerializer):
        class Meta:
            model = Organization
            fields = ["id", "org_email", "name"]

    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ["id", "first_name", "last_name", "email", "role", "on_boarded_by"]

    organization = OrganizationRetriveSerializer(
        allow_null=True, required=False, read_only=True, source="user_map.organization"
    )

    user = UserSerializer(allow_null=True, required=False, read_only=True, source="user_map.user")

    class Meta:
        model = SupportTicket
        fields = ["id", "subject", "category", "updated_at", "organization", "user"]


# class RecentConnectorListSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Connectors
#         fields = ["id", "connector_name", "updated_at", "dataset_count", "activity"]
#
#     dataset_count = serializers.SerializerMethodField(method_name="get_dataset_count")
#     activity = serializers.SerializerMethodField(method_name="get_activity")
#
#     def get_dataset_count(self, connectors_queryset):
#         return Datasets.objects.filter(status=True, user_map__user=connectors_queryset.user_map.user_id).count()
#
#     def get_activity(self, connectors_queryset):
#         try:
#             if Connectors.objects.filter(status=True, user_map__id=connectors_queryset.user_map.id).first().status == True:
#                 return Constants.ACTIVE
#             else:
#                 return Constants.NOT_ACTIVE
#         except Exception as error:
#             LOGGER.error(error, exc_info=True)
#
#         return None


class RecentDatasetListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Datasets
        fields = ["id", "name", "updated_at", "connector_count", "activity"]

    connector_count = serializers.SerializerMethodField(method_name="get_connector_count")
    activity = serializers.SerializerMethodField(method_name="get_activity")

    def get_connector_count(self, datasets_queryset):
        return Connectors.objects.filter(status=True, dataset_id=datasets_queryset.id).count()

    def get_activity(self, datasets_queryset):
        try:
            datasets_queryset = Datasets.objects.filter(status=True, id=datasets_queryset.id)
            if datasets_queryset:
                if datasets_queryset.first().status == True:
                    return Constants.ACTIVE
                else:
                    return Constants.NOT_ACTIVE
            else:
                return Constants.NOT_ACTIVE
        except Exception as error:
            LOGGER.error(error, exc_info=True)

        return None


class DatasetV2Validation(serializers.Serializer):
    """
    Serializer to validate dataset name & dataset description.
    """

    def validate_dataset_name(self, name):
        """
        Validator function to check if the dataset name includes special characters.

        **Parameters**
        ``name`` (str): dataset name to validate
        """
        if check_special_chars(name):
            raise ValidationError("dataset name cannot include special characters.")
        name = re.sub(r"\s+", " ", name)

        if not self.context.get("dataset_exists") and self.context.get("queryset"):
            queryset = self.context.get("queryset")
            if queryset.filter(name=name).exists():
                raise ValidationError("dataset v2 with this name already exists.")

        return name

    dataset_name = serializers.CharField(max_length=100, allow_null=False)
    description = serializers.CharField(max_length=512, allow_null=False)


class DatasetV2TempFileSerializer(serializers.Serializer):
    """
    Serializer for DatasetV2File model to serialize dataset files.
    Following are the fields required by the serializer:
        `datasets` (Files, mandatory): Multi upload Dataset files
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        """Remove fields based on the request type"""
        if "context" in kwargs:
            if "request_method" in kwargs["context"]:
                request_method = kwargs.get("context").get("request_method")
                if request_method == "DELETE" and not kwargs.get("context").get("query_params"):
                    # remove `datasets` field as `DELETE` method only requires `dataset_name`, `file_name` & `source` fields
                    self.fields.pop("datasets")
                elif request_method == "DELETE" and kwargs.get("context").get("query_params"):
                    # remove `datasets` & `file_name` fields as `DELETE` method to delete directory only requires `dataset_name` & `source` field
                    self.fields.pop("datasets")
                    self.fields.pop("file_name")
                    self.fields.pop("source")
                elif request_method == "POST":
                    # remove `file_name` field as `POST` method only requires `dataset_name`, `datasets` & `source` fields
                    self.fields.pop("file_name")

    def validate_datasets(self, files):
        """
        Validator function to check for dataset file types & dataset file size (Constants.DATASET_MAX_FILE_SIZE) in MB.

        **Parameters**
        ``files`` ([Files]): list of files to validate the file type included in Constants.DATASET_FILE_TYPES.
        """
        for file in files:
            if not validate_dataset_type(file, Constants.DATASET_FILE_TYPES):
                raise ValidationError(
                    f"Document type not supported. Only following documents are allowed: {Constants.DATASET_FILE_TYPES}"
                )

            if not validate_dataset_size(file, Constants.DATASET_MAX_FILE_SIZE):
                raise ValidationError(
                    f"You cannot upload/export file size more than {Constants.DATASET_MAX_FILE_SIZE}MB."
                )

        return files

    def validate_dataset_name(self, name):
        """
        Validator function to check if the dataset name includes special characters.

        **Parameters**
        ``name`` (str): dataset name to validate
        """
        if check_special_chars(name):
            raise ValidationError("dataset name cannot include special characters.")
        name = re.sub(r"\s+", " ", name)

        if not self.context.get("dataset_exists") and self.context.get("queryset"):
            queryset = self.context.get("queryset")
            if queryset.filter(name=name).exists():
                raise ValidationError("dataset v2 with this name already exists.")

        return name

    dataset_name = serializers.CharField(max_length=100, allow_null=False)
    datasets = serializers.ListField(
        child=serializers.FileField(max_length=255, use_url=False, allow_empty_file=False),
        write_only=True,
    )
    file_name = serializers.CharField(allow_null=False)
    source = serializers.CharField(allow_null=False)


class DatasetV2FileSerializer(serializers.ModelSerializer):
    """
    Serializer for DatasetV2File model to serialize dataset files.
    Following are the fields required by the serializer:
        `id` (int): auto-generated Identifier
        `dataset` (DatasetV2, FK): DatasetV2 reference object
        `file` (File, mandatory): Dataset file
    """

    class Meta:
        model = DatasetV2File
        fields = [
            "id",
            "dataset",
            "file",
            "source",
            "standardised_file",
            "standardised_configuration",
            "accessibility",
        ]

# class CategoryReverseSerializer(serializers.ModelSerializer):
  
#     class Meta:
#         model = Category
#         fields = ["id", "name", "subcategories"]

# class SubCategoryReverseSerializer(serializers.ModelSerializer):
#     category = CategoryReverseSerializer(read_only=True, many=True)
#     class Meta:
#         model = SubCategory
#         fields = ["id", "name", "category"]

class DatasetSubCategoryMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatasetSubCategoryMap
        fields = ['id', 'sub_category', 'dataset']

class DatasetV2Serializer(serializers.ModelSerializer):
    """
    Serializer for DatasetV2 model to serialize the Meta Data of Datasets.
    Following are the fields required by the serializer:
        `id` (UUID): auto-generated Identifier
        `name` (String, unique, mandatory): Dataset name
        `user_map` (UUID, mandatory): User Organization map ID, related to :model:`datahub_userorganizationmap` (UserOrganizationMap)
        `description` (Text): Dataset description
        `category` (JSON, mandatory): Category as JSON object
        `geography` (String): Geography of the dataset
        `data_capture_start` (DateTime): Start DateTime of the dataset captured
        `data_capture_end` (DateTime): End DateTime of the dataset captured
        `datasets` (Files, FK, read only): Dataset files stored
        `upload_datasets` (List, mandatory): List of dataset files to be uploaded
    """

    class OrganizationRetriveSerializer(serializers.ModelSerializer):
        class Meta:
            model = Organization
            fields = [
                "org_email",
                "org_description",
                "name",
                "logo",
                "phone_number",
                "address",
            ]

    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ["id", "first_name", "last_name", "email", "on_boarded_by"]

    organization = OrganizationRetriveSerializer(
        allow_null=True, required=False, read_only=True, source="user_map.organization"
    )
    categories = serializers.SerializerMethodField()

    user = UserSerializer(allow_null=True, required=False, read_only=True, source="user_map.user")

    datasets = DatasetV2FileSerializer(many=True, read_only=True)
    upload_datasets = serializers.ListField(
        child=serializers.FileField(max_length=255, use_url=False, allow_empty_file=False),
        write_only=True,
        required=False,
    )

    def validate_name(self, name):
        if check_special_chars(name):
            raise ValidationError("dataset name cannot include special characters.")
        name = re.sub(r"\s+", " ", name)
        return name

    class Meta:
        model = DatasetV2
        fields = [
            "id",
            "name",
            "user_map",
            "description",
            "category",
            "geography",
            "constantly_update",
            "data_capture_start",
            "data_capture_end",
            "organization",
            "user",
            "datasets",
            "upload_datasets",
            "categories"
        ]

    def get_categories(self, instance):
        category_and_sub_category = Category.objects.prefetch_related(
              Prefetch("subcategory_category",
                        queryset=SubCategory.objects.prefetch_related(
                            "dataset_sub_category_map__dataset").filter(
                                dataset_sub_category_map__dataset_id=instance.id),
                        ), 
        'subcategory_category__dataset_sub_category_map'
        ).filter(subcategory_category__dataset_sub_category_map__dataset_id=instance.id).distinct().all()
        serializer = CategorySerializer(category_and_sub_category, many=True)
        return serializer.data
    
    def create(self, validated_data):
        """
        Override the create method to save meta data (DatasetV2) with multiple dataset files on to the referenced model (DatasetV2File).

        **Parameters**
        ``validated_data`` (Dict): Validated data from the serializer

        **Returns**
        ``dataset_obj`` (DatasetV2 instance): Save & return the dataset
        """
        # create meta dataset obj
        # uploaded_files = validated_data.pop("upload_datasets")
        file_paths = {}

        try:
            # create_directory()
            directory_created = move_directory(
                os.path.join(settings.BASE_DIR, settings.TEMP_DATASET_URL, validated_data.get("name")),
                settings.DATASET_FILES_URL,
            )
            to_find = [
                Constants.SOURCE_FILE_TYPE,
                Constants.SOURCE_MYSQL_FILE_TYPE,
                Constants.SOURCE_POSTGRESQL_FILE_TYPE,
            ]

            # import pdb
            # pdb.set_trace()

            standardised_directory_created = move_directory(
                os.path.join(settings.BASE_DIR, settings.TEMP_STANDARDISED_DIR, validated_data.get("name")),
                settings.STANDARDISED_FILES_URL,
            )

            file_paths = plazy.list_files(root=directory_created, is_include_root=True)
            standardisation_template = json.loads(self.context.get("standardisation_template"))
            standardisation_config = json.loads(self.context.get("standardisation_config", {}))
            if file_paths:
                dataset_obj = DatasetV2.objects.create(**validated_data)
                for file_path in file_paths:
                    dataset_file_path = file_path.replace("media/", "")
                    dataset_name_file_path = "/".join(dataset_file_path.split("/")[-3:])
                    DatasetV2File.objects.create(
                        dataset=dataset_obj,
                        file=dataset_file_path,
                        source=file_path.split("/")[-2],
                        standardised_file=(settings.STANDARDISED_FILES_URL + dataset_name_file_path).replace(
                            "media/", ""
                        )
                        if os.path.isfile(
                            settings.STANDARDISED_FILES_URL
                            + standardisation_template.get("temp/datasets/" + dataset_name_file_path, "")
                        )
                        else dataset_file_path,
                        standardised_configuration=standardisation_config.get(
                            "temp/datasets/" + dataset_name_file_path
                        )
                        if standardisation_config.get("temp/datasets/" + dataset_name_file_path, "")
                        else {},
                    )
                return dataset_obj

        except Exception as error:
            LOGGER.error(error, exc_info=True)
            raise NotFoundException(
                detail="Dataset files are not uploaded or missing. Failed to create meta dataset.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, instance, validated_data):
        """
        Override the update method to save meta data (DatasetV2) with multiple new dataset files on to the referenced model (DatasetV2File).

        **Parameters**
        ``instance`` (obj): Instance of DatasetV2 model
        ``validated_data`` (Dict): Validated data from the serializer

        **Returns**
        ``instance`` (DatasetV2 instance): Save & return the dataset
        """
        temp_directory = os.path.join(settings.TEMP_DATASET_URL, instance.name)
        file_paths = {}
        to_find = [
            Constants.SOURCE_FILE_TYPE,
            Constants.SOURCE_MYSQL_FILE_TYPE,
            Constants.SOURCE_POSTGRESQL_FILE_TYPE,
        ]

        # iterate through temp_directory to fetch file paths & file names
        # for sub_dir in to_find:
        #     direct = os.path.join(temp_directory, sub_dir)
        #     if os.path.exists(direct):
        #         file_paths.update({
        #             os.path.join(direct, f): [sub_dir, f]
        #             for f in os.listdir(direct)
        #             if os.path.isfile(os.path.join(direct, f))
        #         })

        # # save the files at actual dataset location & update in DatasetV2File table
        # if file_paths:
        #     for file_path, sub_file in file_paths.items():
        #         directory_created = create_directory(os.path.join(settings.DATASET_FILES_URL), [instance.name, sub_file[0]])
        #         shutil.copy(file_path, directory_created)

        #         path_to_save = os.path.join(directory_created, sub_file[1])
        #         if not DatasetV2File.objects.filter(file=path_to_save.replace("media/", "")):
        #             DatasetV2File.objects.create(dataset=instance, file=path_to_save.replace("media/", ""), source=sub_file[0])

        # save the files at actual dataset location & update in DatasetV2File table
        # standardised_directory_created = move_directory(
        #         os.path.join(settings.TEMP_STANDARDISED_DIR,instance.name), settings.STANDARDISED_FILES_URL
        # )
        standardised_temp_directory = os.path.join(settings.TEMP_STANDARDISED_DIR, instance.name)
        standardised_file_paths = (
            plazy.list_files(root=standardised_temp_directory, is_include_root=True)
            if os.path.exists(standardised_temp_directory)
            else None
        )
        standardisation_template = json.loads(self.context.get("standardisation_template"))
        standardisation_config = json.loads(self.context.get("standardisation_config", {})) 

        if standardised_file_paths:
            for file_path in standardised_file_paths:
                directory_created = create_directory(
                    os.path.join(settings.STANDARDISED_FILES_URL), [instance.name, file_path.split("/")[-2]]
                )
                # file_path = file_path.replace("temp/standardised/","")
                shutil.copy2(file_path, directory_created)

                dataset_name_file_path = str(directory_created).replace("media/", "") + file_path.split("/")[-1]
                dataset_file_path_alone = "datasets/" + "/".join(file_path.split("/")[-3:])
                standardised_dataset_file_path_alone = "standardised/" + "/".join(file_path.split("/")[-3:])
                print("*****", dataset_name_file_path)
                # import pdb; pdb.set_trace()
                # path_to_save = os.path.join(directory_created, file_path.split("/")[-1])
                DatasetV2File.objects.filter(file=dataset_file_path_alone).update(
                    dataset=instance,
                    source=file_path.split("/")[-2],
                    standardised_file=standardised_dataset_file_path_alone,
                    standardised_configuration=standardisation_config.get(
                        str(directory_created) + file_path.split("/")[-1]
                    )
                    if standardisation_config.get(str(directory_created) + file_path.split("/")[-1], "")
                    else {},
                )
            # delete the temp directory
            shutil.rmtree(standardised_temp_directory)

        if os.path.exists(temp_directory):
            file_paths = (
                plazy.list_files(root=temp_directory, is_include_root=True) if os.path.exists(temp_directory) else None
            )

            if file_paths:
                for file_path in file_paths:
                    directory_created = create_directory(
                        os.path.join(settings.DATASET_FILES_URL), [instance.name, file_path.split("/")[-2]]
                    )
                    shutil.copy2(file_path, directory_created)
                    dataset_file_path = file_path.replace("media/", "")
                    dataset_name_file_path = "/".join(dataset_file_path.split("/")[-3:])

                    path_to_save = os.path.join(directory_created, file_path.split("/")[-1])
                    if not DatasetV2File.objects.filter(standardised_file=path_to_save.replace("media/", "")):
                        DatasetV2File.objects.create(
                            dataset=instance,
                            file=path_to_save.replace("media/", ""),
                            source=file_path.split("/")[-2],
                            standardised_file=(settings.STANDARDISED_FILES_URL + dataset_name_file_path).replace(
                                "media/", ""
                            )
                            if os.path.isfile(
                                settings.STANDARDISED_FILES_URL
                                + standardisation_template.get("temp/datasets/" + dataset_name_file_path, "")
                            )
                            else dataset_file_path,
                            standardised_configuration=standardisation_config.get(
                                "temp/datasets/" + dataset_name_file_path
                            )
                            if standardisation_config.get("temp/datasets/" + dataset_name_file_path, "")
                            else {},
                        )

            # delete the temp directory
            shutil.rmtree(temp_directory)

        instance = super(DatasetV2Serializer, self).update(instance, validated_data)
        return instance

class DatahubDatasetsV2Serializer(serializers.ModelSerializer):
    """
    Serializer for filtered list of datasets.
    """

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=models.User.objects.all(), required=True, source="user_map.user"
    )
    organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        allow_null=True,
        required=False,
        source="user_map.organization",
    )
    categories= serializers.SerializerMethodField()
    organization = DatahubDatasetsSerializer.OrganizationDatsetsListRetriveSerializer(
        required=False, allow_null=True, read_only=True, source="user_map.organization"
    )
    user = DatahubDatasetsSerializer.UserDatasetSerializer(
        required=False, allow_null=True, read_only=True, source="user_map.user"
    )

    class Meta:
        model = DatasetV2
        fields = Constants.ALL

    def get_categories(self, instance):
        category_and_sub_category = Category.objects.prefetch_related(
              Prefetch("subcategory_category",
                        queryset=SubCategory.objects.prefetch_related(
                            "dataset_sub_category_map__dataset").filter(
                                dataset_sub_category_map__dataset_id=instance.id),
                        ), 
        'subcategory_category__dataset_sub_category_map'
        ).filter(subcategory_category__dataset_sub_category_map__dataset_id=instance.id).distinct().all()
        serializer = CategorySerializer(category_and_sub_category, many=True)
        return serializer.data
    
class micrositeOrganizationSerializer(serializers.ModelSerializer):
    organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        allow_null=True,
        required=False,
        source=Constants.ORGANIZATION,
    )
    organization = OrganizationRetriveSerializer(
        required=False,
        allow_null=True,
        read_only=True,
    )

    class Meta:
        model = UserOrganizationMap
        exclude = Constants.EXCLUDE_DATES

    dataset_count = serializers.SerializerMethodField(method_name="get_dataset_count")
    users_count = serializers.SerializerMethodField(method_name="get_users_count")

    def get_dataset_count(self, user_org_map):
        return DatasetV2.objects.filter(user_map__organization=user_org_map.organization.id, is_temp=False).count()

    def get_users_count(self, user_org_map):
        return UserOrganizationMap.objects.filter(
            user__status=True, organization_id=user_org_map.organization.id
        ).count()


class StandardisationTemplateViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = StandardisationTemplate
        exclude = Constants.EXCLUDE_DATES


class StandardisationTemplateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StandardisationTemplate
        exclude = Constants.EXCLUDE_DATES


class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = Constants.ALL


class DatasetV2NewListSerializer(serializers.ModelSerializer):
    # dataset = DatasetFileV2NewSerializer()
    class Meta:
        model = DatasetV2
        fields = Constants.ALL


class DatasetFileV2NewSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatasetV2File
        exclude = ["standardised_file"]


class DatasetFileV2StandardisedSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatasetV2File
        fields = Constants.ALL


class DatasetFileV2ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatasetV2File
        exclude = ["created_at", "updated_at"]


class DatasetV2ListNewSerializer(serializers.ModelSerializer):
    dataset_files = DatasetFileV2ListSerializer(many=True, source="datasets")

    class Meta:
        model = DatasetV2
        exclude = ["created_at", "updated_at"]


class DatasetV2DetailNewSerializer(serializers.ModelSerializer):
    dataset_files = DatasetFileV2StandardisedSerializer(many=True, source="datasets")

    class Meta:
        model = DatasetV2
        fields = Constants.ALL
        # fields = ['id', 'name', 'geography', 'category', 'dataset_files']


class UsagePolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = UsagePolicy
        exclude = ["created_at", "updated_at", "approval_status"]

class UsageUpdatePolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = UsagePolicy
        fields = "__all__"

class APIBuilderSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsagePolicy
        fields = ["approval_status", "accessibility_time", "api_key"]


class UsagePolicyDetailSerializer(serializers.ModelSerializer):
    organization = DatahubDatasetsSerializer.OrganizationDatsetsListRetriveSerializer(
        required=False, allow_null=True, read_only=True, source="user_organization_map.organization"
    )
    user = DatahubDatasetsSerializer.UserDatasetSerializer(
        required=False, allow_null=True, read_only=True, source="user_organization_map.user"
    )

    class Meta:
        model = UsagePolicy
        fields = "__all__"


class ResourceUsagePolicyDetailSerializer(serializers.ModelSerializer):
    organization = DatahubDatasetsSerializer.OrganizationDatsetsListRetriveSerializer(
        required=False, allow_null=True, read_only=True, source="user_organization_map.organization"
    )
    user = DatahubDatasetsSerializer.UserDatasetSerializer(
        required=False, allow_null=True, read_only=True, source="user_organization_map.user"
    )

    class Meta:
        model = ResourceUsagePolicy
        fields = "__all__"

class CustomJSONField(serializers.JSONField):
    """
    Custom JSON field to handle non-JSON data.
    """

    def to_representation(self, obj):
        """
        Serialize the field value.
        """
        try:
            return super().to_representation(obj)
        except Exception as e:
            # Handle non-JSON data here, for example, by converting it to a JSON-compatible format
            return str(obj)

class LangChainEmbeddingsSerializer(serializers.ModelSerializer):
    # cmetadata = CustomJSONField()
    class Meta:
        model=LangchainPgEmbedding
        fields=["embedding", "document"]
    
    # def to_representation(self, instance):
    #     try:
    #         data = super().to_representation(instance)
    #         # Attempt to decode JSON in cmetadata
    #         data['cmetadata'] = json.loads(data['cmetadata'])
    #         return data
    #     except json.JSONDecodeError:
    #         # Handle the case where cmetadata is not valid JSON
    #         data['cmetadata'] = {}  # Provide a default value or appropriate fallback
    #         return data

class ResourceFileSerializer(serializers.ModelSerializer):
    # collections = serializers.SerializerMethodField()
    class Meta:
        model = ResourceFile
        fields = "__all__"
    
    def get_collections(self, obj):
        # Assuming that 'obj' is an instance of ResourceFile
        # Retrieve the related LangchainPgEmbedding instances
        collection = LangchainPgCollection.objects.filter(name=str(obj.id)).first()
        # return collection
        # print(collection)
        # import pdb; pdb.set_trace()
        if collection:
            embeddings = LangchainPgEmbedding.objects.filter(collection_id=collection.uuid).values("embedding", "document")

            # print(embeddings)
            # # Serialize the retrieved embeddings using LangchainPgEmbeddingSerializert
            # embeddings_serializer = LangChainEmbeddingsSerializer(embeddings, many=True)

            # Return the serialized embeddings
            return embeddings
        return []

class DatahubDatasetFileDashboardFilterSerializer(serializers.Serializer):
    county = serializers.ListField(allow_empty=False, required=True)
    sub_county = serializers.ListField(allow_empty=False, required=False)
    gender = serializers.ListField(allow_empty=False, required=False)
    value_chain = serializers.ListField(allow_empty=False, required=False)


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ["id", "name", "category"]
    
class CategorySerializer(serializers.ModelSerializer):
    subcategories =  SubCategorySerializer(many=True,
        read_only=True,  source="subcategory_category"
    )
    class Meta:
        model = Category
        fields = ["id", "name", "subcategories"]

class ResourceSubCategoryMapSerializer(serializers.ModelSerializer):
    sub_categories =  CategorySerializer(many=True, read_only=True, source="subcategory_category")
    class Meta:
        model = ResourceSubCategoryMap
        fields = "__all__"

class ResourceSerializer(serializers.ModelSerializer):
    
    class OrganizationRetriveSerializer(serializers.ModelSerializer):
        class Meta:
            model = Organization
            fields = ["id", "org_email", "name", "logo", "address"]

    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ["id", "first_name", "last_name", "email", "role", "on_boarded_by"]
    categories = serializers.SerializerMethodField(read_only=True)
    resources = ResourceFileSerializer(many=True, read_only=True)
    uploaded_files = serializers.ListField(child=serializers.JSONField(), write_only=True, required=False)
    files = serializers.ListField(child=serializers.ListField(), write_only=True, required=False)
    sub_categories_map = serializers.ListField(write_only=True)
    organization = OrganizationRetriveSerializer(
        allow_null=True, required=False, read_only=True, source="user_map.organization"
    )
    user = UserSerializer(allow_null=True, required=False, read_only=True, source="user_map.user")
    content_files_count = serializers.SerializerMethodField(method_name="get_content_files_count")

    class Meta:
        model = Resource
        fields = (
            "id",
            "title",
            "description",
            "user_map",
            "category",
            "resources",
            "uploaded_files",
            "organization",
            "user",
            "created_at",
            "updated_at",
            "content_files_count",
            "sub_categories_map",
            "categories",
            "files",
            "country"
        )
    
    def get_categories(self, instance):
        category_and_sub_category = Category.objects.prefetch_related(
              Prefetch("subcategory_category",
                        queryset=SubCategory.objects.prefetch_related(
                            "resource_sub_category_map").filter(
                                resource_sub_category_map__resource=instance.id),
                        ), 
        'subcategory_category__resource_sub_category_map'
        ).filter(subcategory_category__resource_sub_category_map__resource=instance.id).distinct().all()
        serializer = CategorySerializer(category_and_sub_category, many=True)
        return serializer.data
    
    def get_content_files_count(self, resource):
        return ResourceFile.objects.filter(resource=resource.id).values('type').annotate(count=Count('type'))
    
    def construct_file_path(self, instance, filename):
        # Generate a unique string to append to the filename
        unique_str = get_random_string(length=8)
        # Construct the file path
        file_path = f"users/resources/{unique_str}_{filename.replace('/','')}"
        return file_path
    
    def create_and_process_resource_file(self, resource, resource_file, state, category, sub_category, country, district, countries, states, sub_categories, districts):
        """
        A helper function to handle the creation and processing of ResourceFile objects.
        """
        # Prepare the common serializer data
        serializer_data = {
            "resource": resource.id,
            "state": state,
            "category": category,
            "sub_category": sub_category,
            "country": country,
            "district": district,
            "countries": countries,
            "states": states,
            "districts": districts,
            "sub_categories": sub_categories
        }

        # Merge additional resource_file-specific data
        serializer_data.update(resource_file)

        # Create the serializer and save it
        serializer = ResourceFileSerializer(data=serializer_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Log the start of embedding creation
        LOGGER.info(f"Embedding creation started for url: {resource_file.get('url') or resource_file.get('file')}")
        
        # Trigger the tasks
        serializer_data = serializer.data  # Get the serialized data
        create_vector_db.delay(serializer_data)
        # create_vector_db(serializer_data)


    def create(self, validated_data):
        try:
            resource_files_data = validated_data.pop("uploaded_files")
            resource_files = validated_data.pop("files")
            sub_categories_map = validated_data.pop("sub_categories_map")
            category_data = validated_data.get("category")
            
            # Extract category-related information
            state = category_data.get("state")
            district = category_data.get("district")
            category = category_data.get("category_id")
            sub_category = category_data.get("sub_category_id")
            country = category_data.get("country")
            countries = category_data.get("countries")
            sub_categories = category_data.get("sub_categories", [])
            districts = category_data.get("districts", [])
            states = category_data.get("states", [])

            # Create the resource
            resource = Resource.objects.create(**validated_data)
            
            # Parse resource files data and subcategories map
            resource_files_data = json.loads(resource_files_data[0]) if resource_files_data else []
            sub_categories_map = json.loads(sub_categories_map[0]) if sub_categories_map else []

            # Process each resource file
            for resource_file in resource_files_data:
                if resource_file.get("type") == "youtube":
                    playlist_urls = [{"resource": resource.id, **resource_file}]
                    for row in playlist_urls:
                        self.create_and_process_resource_file(
                            resource, row, state, category,
                            sub_category, country, district,
                            countries, states, sub_categories,
                            districts)
                elif resource_file.get("type") == "api":
                    with open(resource_file.get("file").replace("/media/", ''), "rb") as outfile:
                        django_file = ContentFile(outfile.read(), name=f"{resource_file.get('file_name', 'file')}.json")
                        resource_file['file'] = django_file
                        self.create_and_process_resource_file(
                            resource, resource_file, state, 
                            category, sub_category, country, 
                            district, countries, states, sub_categories, 
                            districts)
                else:
                    self.create_and_process_resource_file(
                        resource, resource_file, state, 
                        category, sub_category, country, district,
                        countries, states, sub_categories, districts)

            # Process additional files in resource_files[0]
            for file in resource_files[0]:
                data = {"resource": resource.id, "file": file, "type": "file"}
                self.create_and_process_resource_file(resource, data, state, category, sub_category, country, district, countries, states, sub_categories, districts)

            return resource
        except Exception as e:
            LOGGER.error(e, exc_info=True)
            return e



    # def create(self, validated_data):
    #     try:
    #         resource_files_data = validated_data.pop("uploaded_files")
    #         resource_files = validated_data.pop("files")
    #         sub_categories_map=validated_data.pop("sub_categories_map")
    #         state=validated_data.get("category").get("state")
    #         district=validated_data.get("category").get("district")
    #         category=validated_data.get("category").get("category_id")
    #         sub_category=validated_data.get("category").get("sub_category_id")
    #         country=validated_data.get("category").get("country")
    #         countries = validated_data.get("category").get("countries")
    #         sub_categories = validated_data.get("category").get("sub_categories",[])
    #         districts = validated_data.get("category").get("districts", [])
    #         states = validated_data.get("category").get("states", [])

    #         resource = Resource.objects.create(**validated_data)
    #         resource_files_data = json.loads(resource_files_data[0]) if resource_files_data else []
    #         sub_categories_map = json.loads(sub_categories_map[0]) if sub_categories_map else []
    #         for resource_file in resource_files_data:
    #             if resource_file.get("type") == "youtube":
    #                 playlist_urls=[{"resource": resource.id, **resource_file}]
    #                 for row in playlist_urls:
    #                     serializer = ResourceFileSerializer(data=row, partial=True)
    #                     serializer.is_valid(raise_exception=True)
    #                     serializer.save()
    #                     serializer_data = serializer.data

    #                     LOGGER.info(f"Embeding creation started for youtube url: {row.get('url')}")
    #                     serializer_data = serializer.data
    #                     serializer_data["state"] = state
    #                     serializer_data["category"] =category
    #                     serializer_data["sub_category"] = sub_category
    #                     serializer_data["country"] = country
    #                     serializer_data["district"] = district
    #                     serializer_data["countries"] = countries
    #                     serializer_data["states"] = states
    #                     serializer_data["districts"] = districts

    #                     serializer_data["sub_categories"] = sub_categories
    #                     create_vector_db.delay(serializer_data)
    #                     load_categories.delay(serializer_data)
    #             elif resource_file.get("type") == "api":
    #                 with open(resource_file.get("file").replace("/media/", ''), "rb") as outfile:  # Open the file in binary read mode
    #                     # Wrap the file content using Django's ContentFile
    #                     django_file = ContentFile(outfile.read(), name=f"{resource_file.get('file_name', 'file')}.json")  # You can give it any name you prefer
    #                     # Prepare data for serializer
    #                     serializer_data = {"resource": resource.id, "type": "api", "file": django_file}
    #                     serializer = ResourceFileSerializer(data=serializer_data, partial=True)
    #                     serializer.is_valid(raise_exception=True)
    #                     serializer.save()
    #                     serializer_data = serializer.data

    #                     LOGGER.info(f"Embeding creation started for youtube url: {resource_file.get('file')}")
    #                     serializer_data["state"] = state
    #                     serializer_data["category"] =category
    #                     serializer_data["sub_category"] = sub_category
    #                     serializer_data["country"] = country
    #                     serializer_data["district"] = district
    #                     serializer_data["countries"] = countries
    #                     serializer_data["states"] = states
    #                     serializer_data["districts"] = districts
    #                     serializer_data["sub_categories"] = sub_categories
    #                     create_vector_db.delay(serializer_data)
    #                     load_categories.delay(serializer_data)
    #             else:
    #                 serializer = ResourceFileSerializer(data={"resource": resource.id, **resource_file}, partial=True)
    #                 serializer.is_valid(raise_exception=True)
    #                 serializer.save()
    #                 serializer_data = serializer.data
    #                 LOGGER.info(f"Embeding creation started for url: {resource_file.get('url')} or file: {resource_file.get('url')}")
    #                 serializer_data["state"] = state
    #                 serializer_data["category"] =category
    #                 serializer_data["sub_category"] = sub_category
    #                 serializer_data["country"] = country
    #                 serializer_data["district"] = district
    #                 serializer_data["countries"] = district
    #                 serializer_data["countries"] = countries
    #                 serializer_data["states"] = states
    #                 serializer_data["districts"] = districts
    #                 serializer_data["sub_categories"] = sub_categories
    #                 create_vector_db.delay(serializer_data)
    #                 load_categories.delay(serializer_data)
    #         for file in resource_files[0]:
    #             data = {"resource":resource.id, "file":file, "type": "file"}
    #             serializer = ResourceFileSerializer(data = data)
    #             serializer.is_valid(raise_exception=True)
    #             serializer.save()
    #             serializer_data = serializer.data
    #             serializer_data["state"] = state
    #             serializer_data["category"] =category
    #             serializer_data["sub_category"] = sub_category
    #             serializer_data["country"] = country
    #             serializer_data["district"] = district
    #             serializer_data["countries"] = countries
    #             serializer_data["states"] = states
    #             serializer_data["districts"] = districts
    #             serializer_data["sub_categories"] = sub_categories
    #             create_vector_db.delay(serializer_data)
    #             load_categories.delay(serializer_data)

    #         return resource
    #     except Exception as e:
    #         LOGGER.error(e,exc_info=True)
    #         return e
        
# This serializer of auto categorization.

class ResourceAutoCatSerializer(serializers.ModelSerializer):

    class OrganizationRetriveSerializer(serializers.ModelSerializer):
        class Meta:
            model = Organization
            fields = ["id", "org_email", "name", "logo", "address"]

    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ["id", "first_name", "last_name", "email", "role", "on_boarded_by"]
    

    categories = serializers.SerializerMethodField(read_only=True)
    resources = ResourceFileSerializer(many=True, read_only=True)
    uploaded_files = serializers.ListField(child=serializers.JSONField(), write_only=True, required=False)
    files = serializers.ListField(child=serializers.ListField(), write_only=True, required=False)
    sub_categories_map = serializers.ListField(write_only=True)
    organization = OrganizationRetriveSerializer(
        allow_null=True, required=False, read_only=True, source="user_map.organization"
    )
    user = UserSerializer(allow_null=True, required=False, read_only=True, source="user_map.user")
    content_files_count = serializers.SerializerMethodField(method_name="get_content_files_count")

    class Meta:
        model = Resource
        fields = (
            "id",
            "title",
            "description",
            "user_map",
            "category",
            "resources",
            "uploaded_files",
            "organization",
            "user",
            "created_at",
            "updated_at",
            "content_files_count",
            "sub_categories_map",
            "categories",
            "files",
            "country"
        )
    
    def get_categories(self, instance):
        category_and_sub_category = Category.objects.prefetch_related(
              Prefetch("subcategory_category",
                        queryset=SubCategory.objects.prefetch_related(
                            "resource_sub_category_map").filter(
                                resource_sub_category_map__resource=instance.id),
                        ), 
        'subcategory_category__resource_sub_category_map'
        ).filter(subcategory_category__resource_sub_category_map__resource=instance.id).distinct().all()
        serializer = CategorySerializer(category_and_sub_category, many=True)
        return serializer.data
    
    def get_content_files_count(self, resource):
        return ResourceFile.objects.filter(resource=resource.id).values('type').annotate(count=Count('type'))
    
    def construct_file_path(self, filename):
        # Generate a unique string to append to the filename
        unique_str = get_random_string(length=8)
        # Construct the file path
        file_path = f"users/resources/{unique_str}_{filename.replace('/','')}"
        return file_path
    
    def create(self, validated_data):
        try:
            resource_files_data = validated_data.pop("uploaded_files")
            resource_files = validated_data.pop("files")
            sub_categories_map=validated_data.pop("sub_categories_map")
            validated_data["district"] = {}
            validated_data["village"] = {}
            validated_data["state"] = {}
            resource = Resource.objects.create(**validated_data)
            resource_sub_cat_instances= [
                ResourceSubCategoryMap(resource=resource, sub_category=SubCategory.objects.get(id=sub_cat)
                                       ) for sub_cat in sub_categories_map[0].values()]

            ResourceSubCategoryMap.objects.bulk_create(resource_sub_cat_instances)
            for files in resource_files[0]:
                data = {"resource":resource.id, "file": files, "type": "file"}
                serializer = ResourceFileSerializer(data = data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
            return resource
        except Exception as e:
            LOGGER.error(e,exc_info=True)
            return e



class ParticipantCostewardSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=models.User.objects.all(),
        required=True,
        source=Constants.USER,
    )
    organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        allow_null=True,
        required=False,
        source=Constants.ORGANIZATION,
    )
    user = UserSerializer(
        read_only=False,
        required=False,
    )
    organization = OrganizationRetriveSerializer(
        required=False,
        allow_null=True,
        read_only=True,
    )

    class Meta:
        model = UserOrganizationMap
        exclude = Constants.EXCLUDE_DATES

    dataset_count = serializers.SerializerMethodField(method_name="get_dataset_count")
    content_files_count = serializers.SerializerMethodField(method_name="get_content_files_count")
    connector_count = serializers.SerializerMethodField(method_name="get_connector_count")
    number_of_participants = serializers.SerializerMethodField()

    def get_dataset_count(self, user_org_map):
        return DatasetV2.objects.filter(user_map_id=user_org_map.id, is_temp=False).count()
    
    def get_content_files_count(self, user_org_map):
        return ResourceFile.objects.select_related("resource").filter(
            Q(resource__user_map_id=user_org_map.id) |
            Q(resource__user_map__user__on_boarded_by=user_org_map.user_id)
                            ).values('type').annotate(count=Count('type'))
 
    def get_connector_count(self, user_org_map):
        return Connectors.objects.filter(user_map_id=user_org_map.id).count()

    def get_number_of_participants(self, user_org_map):
        return (
            UserOrganizationMap.objects.select_related(Constants.USER, Constants.ORGANIZATION)
            .filter(user__status=True, user__on_boarded_by=user_org_map.user.id, user__role=3)
            .all()
            .count()
        )

class ResourceUsagePolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceUsagePolicy
        fields = "__all__"

class ResourceAPIBuilderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceUsagePolicy
        fields = ["approval_status", "accessibility_time", "api_key"]

def get_random_string(length=8):
    characters = string.ascii_letters + string.digits
    unique_str = ''.join(secrets.choice(characters) for _ in range(length))
    return quote(unique_str, safe='')

class MessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = "__all__"

class MessagesRetriveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        exclude = ["retrieved_chunks"]

class MessagesChunksRetriveSerializer(serializers.ModelSerializer):
    retrieved_chunks = serializers.SerializerMethodField()
    class Meta:
        model = Messages
        fields = "__all__"

    def get_retrieved_chunks(self, instance):
        related_embeddings = instance.retrieved_chunks.defer("cmetadata").all()
        related_documents = [embedding.document for embedding in related_embeddings]
        return related_documents

class ResourceListSerializer(serializers.ModelSerializer):
    class OrganizationRetriveSerializer(serializers.ModelSerializer):
        class Meta:
            model = Organization
            fields = ["id", "org_email", "name", "logo", "address"]

    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ["id", "first_name", "last_name", "email", "role", "on_boarded_by"]
    organization = OrganizationRetriveSerializer(
        allow_null=True, required=False, read_only=True, source="user_map.organization"
    )
    user = UserSerializer(allow_null=True, required=False, read_only=True, source="user_map.user")
    content_files_count = serializers.SerializerMethodField(method_name="get_content_files_count")

    class Meta:
        model = Resource
        fields = "__all__"
   
    def get_content_files_count(self, resource):
        return ResourceFile.objects.filter(resource=resource.id).values('type').annotate(count=Count('type'))

   
class CategorySubcategoryInputSerializer(serializers.Serializer):
    category_name = serializers.CharField(max_length=255)
    subcategory_name = serializers.CharField(max_length=255)


class SourceDetailsSerializer(serializers.Serializer):
    source_type = serializers.CharField(max_length=50)
    details = serializers.DictField()

class FileItemSerializer(serializers.Serializer):
    file_name = serializers.CharField(max_length=255)
    file_url = serializers.CharField(max_length=255)

class FileResponseSerializer(serializers.Serializer):
    files = FileItemSerializer(many=True)