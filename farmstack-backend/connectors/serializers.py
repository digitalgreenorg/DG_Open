import json
import os

import pandas as pd
from django.db.models import DEFERRED, Count, F, Q
from rest_framework import serializers

from accounts.models import User
from connectors.models import Connectors, ConnectorsMap
from core import settings
from core.constants import Constants
from datahub.models import DatasetV2, DatasetV2File, Organization, UserOrganizationMap
from datahub.serializers import DatasetV2FileSerializer
from django.db.models import Subquery, Min, Count
from django.db import models


class OrganizationRetriveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = [
            "org_email",
            "org_description",
            "name",
        ]

class UserOrganizationMapSerializer(serializers.ModelSerializer):
    organization = OrganizationRetriveSerializer(read_only=True, allow_null=True)
    class Meta:
        model = UserOrganizationMap
        exclude = ["created_at", "updated_at"]


class DatasetSerializerSerializr(serializers.ModelSerializer):
    user_map = UserOrganizationMapSerializer(read_only=True, allow_null=True)
    class Meta:
        model = DatasetV2
        fields = ["name", "description", "user_map"]

class DatasetV2FileSerializer(serializers.ModelSerializer):
    dataset = DatasetSerializerSerializr(read_only=True,  allow_null=True)
    class Meta:
        model = DatasetV2File
        exclude = ["created_at", "updated_at"]

class ConnectorsMapSerializer(serializers.ModelSerializer):
    left_dataset_file = DatasetV2FileSerializer(read_only=True, allow_null=True)
    right_dataset_file = DatasetV2FileSerializer(read_only=True, allow_null=True)
    class Meta:
        model = ConnectorsMap
        exclude = ["created_at", "updated_at"]


class ConnectorsSerializer(serializers.ModelSerializer):
    maps = ConnectorsMapSerializer(many=True, source='connectorsmap_set')
    class Meta:
        model = Connectors
        exclude = ["created_at", "updated_at"]

class ConnectorsCreateSerializer(serializers.ModelSerializer):
   class Meta:
        model = Connectors
        exclude = ["created_at", "updated_at"]


class ConnectorsMapCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectorsMap
        exclude = ["created_at", "updated_at"]

# class ConnectorsMapListCreateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ConnectorsMap
#         exclude = ["created_at", "updated_at"]  
#     dataset_count = serializers.SerializerMethodField(method_name="get_dataset_count")
#     # providers_count = serializers.SerializerMethodField(method_name="get_users_count")

#     def get_dataset_count(self, connectors):
#         return ConnectorsMap.objects.filter(connectors=connectors.connectors).count()+1

class ConnectorsListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Connectors
        fields = Constants.ALL
    
    dataset_count = serializers.SerializerMethodField(method_name="get_dataset_count")
    providers_count = serializers.SerializerMethodField(method_name="get_providers_count")

    def get_dataset_count(self, connectors):
        count = ConnectorsMap.objects.filter(connectors=connectors.id).count()
        return  count+1 if count else 0
    
    def get_providers_count(self, connectors):
        query = ConnectorsMap.objects.select_related('left_dataset_file__dataset', 'right_dataset_file__dataset').filter(connectors=connectors.id)
        user_map_ids = list(query.values_list("left_dataset_file_id__dataset__user_map").distinct())
        user_map_ids.extend(list(query.values_list("right_dataset_file_id__dataset__user_map").distinct()))
        count= len(set(user_map_ids))
        return count

class ConnectorsRetriveSerializer(serializers.ModelSerializer):
    maps = ConnectorsMapSerializer(many=True, source='connectorsmap_set')
    class Meta:
        model = Connectors
        fields = Constants.ALL

    data = serializers.SerializerMethodField(method_name="extract_data")

    def extract_data(self, connector):
        integrated_file = str(connector.integrated_file).replace("media/", "").replace("%20", " ")
        df = pd.read_csv(os.path.join(settings.MEDIA_ROOT, integrated_file), 
            ) if integrated_file else pd.DataFrame([])
        no_of_records = len(df)
        if no_of_records > 20:
            df = df.iloc[:20]
        data = json.loads(df.to_json(orient='table',index=False))
        data["no_of_records"] = no_of_records
        return data
    