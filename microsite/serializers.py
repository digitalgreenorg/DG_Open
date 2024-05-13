import json
import os
from collections import defaultdict

import pandas as pd
from django.db.models import Count, Prefetch, Q
from rest_framework import serializers

from accounts.models import User
from connectors.models import Connectors, ConnectorsMap
from connectors.serializers import OrganizationRetriveSerializer
from core import settings
from core.utils import Constants
from datahub.models import (
    Category,
    DatahubDocuments,
    Datasets,
    DatasetV2,
    LangchainPgCollection,
    LangchainPgEmbedding,
    Organization,
    Policy,
    Resource,
    ResourceFile,
    ResourceSubCategoryMap,
    SubCategory,
    UserOrganizationMap,
)
from datahub.serializers import CategorySerializer, DatasetV2FileSerializer

from .models import FeedBack


class OrganizationMicrositeSerializer(serializers.ModelSerializer):
    """Organization Serializer for microsite"""
    class Meta:
        """_summary_"""

        model = Organization
        exclude = ["created_at", "updated_at"]


class UserSerializer(serializers.ModelSerializer):
    """User serializer for Datasets of microsite"""

    class Meta:
        """_summary_"""

        model = User
        fields = ["first_name", "last_name", "email", "phone_number"]


class DatasetsMicrositeSerializer(serializers.ModelSerializer):
    """Datasets Serializer for microsite"""

    user = UserSerializer(
        read_only=False,
        required=False,
        allow_null=True,
        source="user_map.user",
    )
    organization = OrganizationMicrositeSerializer(
        required=False, allow_null=True, read_only=True, source="user_map.organization"
    )

    class Meta:
        """_summary_"""

        model = Datasets
        exclude = ["user_map"]


class ContactFormSerializer(serializers.Serializer):
    """Contact Form serilizer for microsite guest users or visitors"""

    # SUBJECT_CHOICES = (("Become a Participant", "become_participant"), ("Other queries", "other_queries"))
    # subject = serializers.ChoiceField(choices=SUBJECT_CHOICES)

    first_name = serializers.CharField()
    last_name = serializers.CharField(required=False)
    email = serializers.EmailField()
    contact_number = serializers.CharField()
    subject = serializers.CharField(required=False)
    describe_query = serializers.CharField()


class UserDataMicrositeSerializer(serializers.ModelSerializer):
    class Meta:
        """_summary_"""

        model = User
        fields = ["id", "role_id", "on_boarded"]


class LegalDocumentSerializer(serializers.ModelSerializer):
    """Legal DocumentSerializer class"""

    governing_law = serializers.CharField()
    privacy_policy = serializers.CharField()
    tos = serializers.CharField()
    limitations_of_liabilities = serializers.CharField()
    warranty = serializers.CharField()

    class Meta:
        model = DatahubDocuments
        fields = Constants.ALL


class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = Constants.ALL

class ConnectorsMapSerializer(serializers.ModelSerializer):
    left_dataset_file = DatasetV2FileSerializer(read_only=True, allow_null=True)
    right_dataset_file = DatasetV2FileSerializer(read_only=True, allow_null=True)
    class Meta:
        model = ConnectorsMap
        exclude = ["created_at", "updated_at"]



class ConnectorsListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Connectors
        exclude = ["integrated_file","config"]
    
    dataset_count = serializers.SerializerMethodField(method_name="get_dataset_count")
    providers_count = serializers.SerializerMethodField(method_name="get_providers_count")

    def get_dataset_count(self, connectors):
        count = ConnectorsMap.objects.filter(connectors=connectors.id).count()
        return  count+1 if count else 0
    
    def get_providers_count(self, connectors):
        query = ConnectorsMap.objects.select_related('left_dataset_file_id__dataset', 'right_dataset_file_id__dataset').filter(connectors=connectors.id)
        user_map_ids = list(query.values_list("left_dataset_file_id__dataset__user_map").distinct())
        user_map_ids.extend(list(query.values_list("right_dataset_file_id__dataset__user_map").distinct()))
        count= len(set(user_map_ids))
        return count
    
class DatasetsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatasetV2
        exclude = ["updated_at"]
        
class ParticipantSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
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
    organization = OrganizationMicrositeSerializer(
        required=False,
        allow_null=True,
        read_only=True,
    )
    class Meta:
        model = UserOrganizationMap
        exclude = Constants.EXCLUDE_DATES

class ConnectorsRetriveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connectors
        fields = Constants.ALL

    dataset_and_organizations = serializers.SerializerMethodField(method_name="datasets_data") # type: ignore

    def datasets_data(self, connoctors):
        dastaset_query = ConnectorsMap.objects.filter(connectors_id=connoctors.id).select_related(
            'left_dataset_file__dataset',
            'right_dataset_file__dataset',
        )
        datasets =  dastaset_query.values_list(
            'left_dataset_file__dataset',
            'right_dataset_file__dataset'
        ).distinct()
        organizations = dastaset_query.values_list(
            'left_dataset_file__dataset__user_map__organization',
            'right_dataset_file__dataset__user_map__organization'
        ).distinct()
        organization_ids = list(set([id for tuples in organizations for id in tuples]))
        dataset_ids = list(set([id for tuples in datasets for id in tuples]))

        data = UserOrganizationMap.objects.select_related("user", "organization").all().filter(organization_id__in=organization_ids).distinct()
        searilezer = ParticipantSerializer(data, many=True)
        dataset_data = DatasetV2.objects.all().filter(id__in = dataset_ids).distinct()
        dataset_searilezer = DatasetsSerializer(dataset_data, many=True)
        return {"organizations": searilezer.data, "datasets": dataset_searilezer.data}
      
class DatahubDatasetFileDashboardFilterSerializer(serializers.Serializer):
    county = serializers.ListField(allow_empty=False, required=True)
    sub_county = serializers.ListField(allow_empty=False, required=False)
    gender = serializers.ListField(allow_empty=False, required=False)
    value_chain = serializers.ListField(allow_empty=False, required=False)


class ContentFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceFile
        fields = ["id", "type", "file",  "url", "transcription", "updated_at"]

class ContentFileEmbeddingsSerializer(serializers.ModelSerializer):
    collections = serializers.SerializerMethodField()
    class Meta:
        model = ResourceFile
        fields = ["id", "type", "file",  "url", "transcription", "updated_at", "collections"]
 
    def get_collections(self, obj):
        collection = LangchainPgCollection.objects.filter(name=str(obj.id)).first()
        if collection:
            embeddings = LangchainPgEmbedding.objects.filter(collection_id=collection.uuid).values("embedding", "document")
            return embeddings
        return []

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name"]

class SubCategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer(allow_null=True, read_only=True)

    class Meta:
        model = SubCategory
        fields = ["name", "category"]


class ResourceSubCategoryMapSerializer(serializers.ModelSerializer):
    sub_category = SubCategorySerializer(allow_null=True, read_only=True)
    class Meta:
        model = ResourceSubCategoryMap
        fields = ["sub_category"]

class ResourceEmbeddingsSerializer(serializers.ModelSerializer):
    resources = ContentFileEmbeddingsSerializer(many=True, read_only=True)
    category = serializers.SerializerMethodField()
    # category = ResourceSubCategoryMapSerializer(many=True, read_only=True, source='resource_cat_map')

    class Meta:
        model = Resource
        fields = ["id", "title", "description", "resources", "category"]
    
    def get_category(self, instance):
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
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        resource_sub_category_maps = data.get('category', [])
        category_aggregate = defaultdict(list)

        for resource_map in resource_sub_category_maps:
            sub_category_data = resource_map.get('sub_category')
            if sub_category_data:
                category_name = sub_category_data['category']['name']
                sub_category_name = sub_category_data['name']
                category_aggregate[category_name].append(sub_category_name)

        aggregated_data = {k: v for k, v in category_aggregate.items()}
        data['category'] = aggregated_data
        return data

class ResourceMicrsositeSerializer(serializers.ModelSerializer):
    resources = ContentFileSerializer(many=True, read_only=True)
    category = serializers.SerializerMethodField()
    class Meta:
        model = Resource
        fields = ["id", "title", "description", "resources", "category"]
    
    def get_category(self, instance):
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

class ContentSerializer(serializers.ModelSerializer):
    resources = ContentFileSerializer(many=True, read_only=True)
    category = ResourceSubCategoryMapSerializer(many=True, read_only=True, source='resource_cat_map')

    class Meta:
        model = Resource
        fields = ["id", "title", "description", "resources", "category"]
    def to_representation(self, instance):
        data = super().to_representation(instance)
        resource_sub_category_maps = data.get('category', [])
        category_aggregate = defaultdict(list)

        for resource_map in resource_sub_category_maps:
            sub_category_data = resource_map.get('sub_category')
            if sub_category_data:
                category_name = sub_category_data['category']['name']
                sub_category_name = sub_category_data['name']
                category_aggregate[category_name].append(sub_category_name)

        aggregated_data = {k: v for k, v in category_aggregate.items()}
        data['category'] = aggregated_data
        return data
  
class FeedBackSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedBack
        fields = '__all__'
