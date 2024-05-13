import datetime
import json
import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from rest_framework import serializers

from accounts import models
from accounts.models import User
from accounts.serializers import UserSerializer
from core.constants import Constants
from datahub.models import Datasets, Organization, UserOrganizationMap
from datahub.serializers import (
    OrganizationRetriveSerializer,
    UserOrganizationMapSerializer, OrganizationSerializer,
)
from participant.models import (
    Connectors,
    ConnectorsMap,
    Department,
    Project,
    SupportTicket, SupportTicketV2, Resolution,
)
from utils import string_functions


class TicketSupportSerializer(serializers.ModelSerializer):
    """_summary_

    Args:
        serializers (_type_): _description_
    """

    class Meta:
        """_summary_"""

        model = SupportTicket
        fields = Constants.ALL


class ParticipantSupportTicketSerializer(serializers.ModelSerializer):
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
        model = SupportTicket
        # exclude = Constants.EXCLUDE_DATES
        fields = "__all__"


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
            "id",
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
            "approval_status",
            "is_public",
        ]


class ParticipantDatasetsDetailSerializer(serializers.ModelSerializer):
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


class ParticipantDatasetsSerializer(serializers.ModelSerializer):
    class OrganizationDatsetsListRetriveSerializer(serializers.ModelSerializer):
        class Meta:
            model = Organization
            fields = ["org_email", "org_description", "name", "logo", "address"]

    class UserDatasetSerializer(serializers.ModelSerializer):
        class Meta:
            model = models.User
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
        # exclude = Constants.EXCLUDE_DATES
        fields = [
            "id",
            "name",
            "description",
            "is_enabled",
            "created_at",
            "organization",
            "organization_id",
            "user",
            "user_id",
            "category",
            "geography",
            "crop_detail",
            "age_of_date",
            "is_public",
        ]


class ParticipantDatasetsSerializerForEmail(serializers.ModelSerializer):
    class Meta:
        model = Datasets
        fields = [
            "name",
            "description",
            "category",
            "geography",
            "crop_detail",
            "constantly_update",
            "age_of_date",
            "data_capture_start",
            "data_capture_end",
            "dataset_size",
            "connector_availability",
        ]

    def to_representation(self, instance):
        """Return formatted data for email template"""
        ret = super().to_representation(instance)
        data = []
        if ret.get("category"):
            for key, value in json.loads(ret["category"]).items():
                if value == True:
                    data.append(re.sub("_", " ", key).title())
                ret["category"] = data
        else:
            ret["category"] = "N/A"

        ret["name"] = ret.get("name").title() if ret.get("name") else "N/A"
        ret["crop_detail"] = ret.get("crop_detail").title() if ret.get("crop_detail") else "N/A"
        ret["geography"] = ret.get("geography").title() if ret.get("geography") else "N/A"
        ret["connector_availability"] = (
            re.sub("_", " ", ret.get("connector_availability")).title() if ret.get("connector_availability") else "N/A"
        )
        ret["dataset_size"] = ret.get("dataset_size") if ret.get("dataset_size") else "N/A"
        ret["age_of_date"] = ret.get("age_of_date") if ret.get("age_of_date") else "N/A"

        if ret.get("constantly_update"):
            if ret["constantly_update"] == True:
                ret["constantly_update"] = "Yes"
            elif ret["constantly_update"] == False:
                ret["constantly_update"] = "No"
        else:
            ret["constantly_update"] = "N/A"

        if ret.get("data_capture_start"):
            date = ret["data_capture_start"].split("T")[0]
            ret["data_capture_start"] = datetime.datetime.strptime(date, "%Y-%m-%d").strftime("%d/%m/%Y")
        else:
            ret["data_capture_start"] = "N/A"

        if ret.get("data_capture_end"):
            date = ret["data_capture_end"].split("T")[0]
            ret["data_capture_end"] = datetime.datetime.strptime(date, "%Y-%m-%d").strftime("%d/%m/%Y")
        else:
            ret["data_capture_end"] = "N/A"

        return ret


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "department_name", "department_discription", "organization"]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "project_name",
            "project_discription",
            "department",
            "organization",
        ]


class ProjectDepartmentSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(
        read_only=True,
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "project_name",
            "project_discription",
            "department",
            "organization",
        ]


class ConnectorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connectors
        fields = Constants.ALL


class ConnectorsSerializerForEmail(serializers.ModelSerializer):
    class OrganizationSerializer(serializers.ModelSerializer):
        class Meta:
            model = Organization
            fields = ["name", "org_email", "phone_number", "address"]

        def to_representation(self, instance):
            """Return formatted data for email template"""
            ret = super().to_representation(instance)
            ret["name"] = ret.get("name").title() if ret.get("name") else "N/A"
            if ret.get("address"):
                address = ret.get("address")
                data = {
                    "address": address.get("address", "") + ", " + address.get("city", ""),
                    "pincode": address.get("pincode", ""),
                    "country": address.get("country", ""),
                }
                ret["address"] = data
            else:
                ret["address"] = "N/A"
            return ret

    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ["full_name", "email", "phone_number", "on_boarded_by"]

        full_name = serializers.SerializerMethodField(method_name="get_full_name")

        def get_full_name(self, instance):
            user = User.objects.get(id=instance.id)
            return user.first_name + " " + user.last_name if user.last_name else user.first_name

    class DatasetSerializer(serializers.ModelSerializer):
        class Meta:
            model = Datasets
            fields = ["name"]

        def to_representation(self, instance):
            ret = super().to_representation(instance)
            ret["name"] = ret.get("name").title() if ret.get("name") else "N/A"
            return ret

    organization = OrganizationSerializer(required=False, read_only=True, source="user_map.organization")
    user = UserSerializer(required=False, read_only=True, source="user_map.user")
    dataset_detail = DatasetSerializer(required=False, read_only=True, source="dataset")

    class Meta:
        model = Connectors
        fields = [
            "connector_name",
            "connector_type",
            "connector_description",
            "dataset_detail",
            "user",
            "organization",
        ]


class ConnectorsListSerializer(serializers.ModelSerializer):
    department_details = DepartmentSerializer(required=False, allow_null=True, read_only=True, source="department")
    project_details = ProjectSerializer(required=False, allow_null=True, read_only=True, source="project")

    class Meta:
        model = Connectors
        # exclude = Constants.EXCLUDE_DATES
        fields = Constants.ALL


class ConnectorsRetriveSerializer(serializers.ModelSerializer):
    class DatasetSerializer(serializers.ModelSerializer):
        class Meta:
            model = Datasets
            fields = ["id", "name", "description"]

    class OrganizationConnectorSerializer(serializers.ModelSerializer):
        class Meta:
            model = Organization
            fields = ["id", "name", "website"]

    department_details = DepartmentSerializer(required=False, allow_null=True, read_only=True, source="department")
    project_details = ProjectSerializer(required=False, allow_null=True, read_only=True, source="project")
    dataset_details = DatasetSerializer(required=False, allow_null=True, read_only=True, source="dataset")
    organization_details = OrganizationConnectorSerializer(
        required=False, allow_null=True, read_only=True, source="user_map.organization"
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=models.User.objects.all(),
        allow_null=True,
        required=False,
        source="user_map.user",
    )

    class Meta:
        model = Connectors
        # exclude = Constants.EXCLUDE_DATES
        fields = Constants.ALL


class ConnectorsMapProviderRetriveSerializer(serializers.ModelSerializer):
    class DatasetSerializer(serializers.ModelSerializer):
        class Meta:
            model = Datasets
            fields = ["id", "name", "description"]

    class OrganizationConnectorSerializer(serializers.ModelSerializer):
        class Meta:
            model = Organization
            fields = ["id", "name", "website"]

    department_details = DepartmentSerializer(
        required=False, allow_null=True, read_only=True, source="provider.department"
    )
    project_details = ProjectSerializer(required=False, allow_null=True, read_only=True, source="provider.project")
    dataset_details = DatasetSerializer(required=False, allow_null=True, read_only=True, source="provider.dataset")
    organization_details = OrganizationConnectorSerializer(
        required=False,
        allow_null=True,
        read_only=True,
        source="provider.user_map.organization",
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=models.User.objects.all(),
        allow_null=True,
        required=False,
        source="provider.user_map.user",
    )
    connector_details = ConnectorsSerializer(required=False, allow_null=True, read_only=True, source="provider")

    class Meta:
        model = ConnectorsMap
        # exclude = Constants.EXCLUDE_DATES
        fields = Constants.ALL


class ConnectorsMapConsumerRetriveSerializer(serializers.ModelSerializer):
    class DatasetSerializer(serializers.ModelSerializer):
        class Meta:
            model = Datasets
            fields = ["id", "name", "description"]

    class OrganizationConnectorSerializer(serializers.ModelSerializer):
        class Meta:
            model = Organization
            fields = ["id", "name", "website"]

    department_details = DepartmentSerializer(
        required=False, allow_null=True, read_only=True, source="consumer.department"
    )
    project_details = ProjectSerializer(required=False, allow_null=True, read_only=True, source="consumer.project")
    dataset_details = DatasetSerializer(required=False, allow_null=True, read_only=True, source="consumer.dataset")
    organization_details = OrganizationConnectorSerializer(
        required=False,
        allow_null=True,
        read_only=True,
        source="consumer.user_map.organization",
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=models.User.objects.all(),
        allow_null=True,
        required=False,
        source="consumer.user_map.user",
    )
    connector_details = ConnectorsSerializer(required=False, allow_null=True, read_only=True, source="consumer")

    class Meta:
        model = ConnectorsMap
        # exclude = Constants.EXCLUDE_DATES
        fields = Constants.ALL


class ConnectorsConsumerRelationSerializer(serializers.ModelSerializer):
    connectors = ConnectorsSerializer(required=False, allow_null=True, read_only=True, source="consumer")

    class Meta:
        model = ConnectorsMap
        # exclude = Constants.EXCLUDE_DATES
        fields = Constants.ALL


class ConnectorsProviderRelationSerializer(serializers.ModelSerializer):
    connectors = ConnectorsSerializer(required=False, allow_null=True, read_only=True, source="provider")

    class Meta:
        model = ConnectorsMap
        # exclude = Constants.EXCLUDE_DATES
        fields = Constants.ALL


class ConnectorsMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectorsMap
        # exclude = Constants.EXCLUDE_DATES
        fields = Constants.ALL


class ParticipantDatasetsDropDownSerializer(serializers.ModelSerializer):
    class Meta:
        model = Datasets
        fields = ["id", "name"]


class ConnectorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connectors
        fields = ["id", "connector_name"]


from rest_framework import serializers


class DatabaseConfigSerializer(serializers.Serializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        """Remove fields based on the request type"""
        if "context" in kwargs:
            if "source" in kwargs["context"]:
                source = kwargs.get("context").get("source")
                if not source == Constants.SOURCE_MYSQL_FILE_TYPE:
                    self.fields.pop("username")
                    self.fields.pop("database")
                elif not source == Constants.SOURCE_POSTGRESQL_FILE_TYPE:
                    self.fields.pop("user")
                    self.fields.pop("dbname")

    host = serializers.CharField(max_length=200, allow_blank=False)
    port = serializers.IntegerField()
    password = serializers.CharField(max_length=200, allow_blank=False)
    database_type = serializers.CharField(max_length=200, allow_blank=False)

    # for mysql
    username = serializers.CharField(max_length=200, allow_blank=False)
    database = serializers.CharField(max_length=200, allow_blank=False)

    # postgresql
    user = serializers.CharField(max_length=200, allow_blank=False)
    dbname = serializers.CharField(max_length=200, allow_blank=False)


class DatabaseColumnRetrieveSerializer(serializers.Serializer):
    table_name = serializers.CharField(max_length=200, allow_blank=False)




class DatabaseDataExportSerializer(serializers.Serializer):
    table_name = serializers.CharField(max_length=200, allow_blank=False)
    col = serializers.ListField(allow_empty=False)
    dataset_name = serializers.CharField(max_length=200, allow_blank=False)
    source = serializers.CharField(max_length=200, allow_blank=False)
    file_name = serializers.CharField(max_length=85, allow_blank=False)
    filter_data = serializers.ListField(allow_empty=True,required=False)
    # {
    #     "column_name" : "column_name",
    #     "operation" : "operation",
    #     "value" : "value",
    # }


class UserSupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "phone_number",
            "role",
        )


class OrganizationsSupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        """_summary_"""

        model = Organization
        fields = (
            "name",
            "hero_image",
            "phone_number",
            "logo",
        )


class UserOrganizationMapSerializerSupport(serializers.ModelSerializer):
    user = UserSupportTicketSerializer()
    organization = OrganizationsSupportTicketSerializer()

    class Meta:
        model = UserOrganizationMap
        exclude = Constants.EXCLUDE_DATES


class SupportTicketV2Serializer(serializers.ModelSerializer):
    user_map = UserOrganizationMapSerializerSupport()

    class Meta:
        model = SupportTicketV2
        fields = '__all__'


class UpdateSupportTicketV2Serializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicketV2
        fields = ('status',)


class CreateSupportTicketV2Serializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicketV2
        fields = '__all__'


class SupportTicketResolutionsSerializer(serializers.ModelSerializer):
    ticket = SupportTicketV2Serializer()

    class Meta:
        model = Resolution
        fields = '__all__'


class SupportTicketResolutionsSerializerMinimised(serializers.ModelSerializer):
    user_map = UserOrganizationMapSerializerSupport()

    class Meta:
        model = Resolution
        fields = '__all__'


class CreateSupportTicketResolutionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resolution
        fields = '__all__'
