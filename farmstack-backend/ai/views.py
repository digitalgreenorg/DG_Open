from django.db.models import Prefetch
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from accounts.models import User
from ai.retriever.manual_retrival import QuadrantRetrival
from datahub.models import (
    Category,
    Organization,
    Resource,
    ResourceFile,
    ResourceSubCategoryMap,
    SubCategory,
    UserOrganizationMap,
)
from datahub.serializers import OrganizationSerializer


class EmbeddingsViewSet(ModelViewSet):
    lookup_field = 'uuid'  # Specify the UUID field as the lookup field
    permission_classes=[]

    @action(detail=False, methods=['get'])
    def embeddings_and_chunks(self, request):
        collection_id = request.GET.get("resource_file")
        # Define the metadata criteria for the chunks you want to retrieve
        metadata_criteria = {
            'resource_file': collection_id  # Adjusted to include only files and images
        }

        # Retrieve chunks based on the metadata
        chunks = QuadrantRetrival().embeddings_and_chunks(collection_id)
        return Response(chunks)

    @action(detail=False, methods=["post"])
    def get_content(self, request):
        embeddings = []
        email = request.data.get("email")
        organization_id = request.data.get("organization_id")
        query = request.data.get("query")
        query = query.replace("\n", " ") if query else "" 
        country = request.data.get("country", "").lower()
        state = request.data.get("state", "").lower()
        category = request.data.get("category", "").lower()
        sub_category = request.data.get("sub_category", "")
        district = request.data.get("district", "").lower()
        k = request.data.get("k", 0)
        threshold = request.data.get("threshold", 0)
        source_type = request.data.get("source_type", None)
        file_ids=[]
        if sub_category:
            filter = {"resource__resource_cat_map__sub_category_id":sub_category,
                      "resource__user_map__organization_id": organization_id} if organization_id else {"resource__resource_cat_map__sub_category_id":sub_category}
            print(filter)
            file_ids = list(ResourceFile.objects.filter(**filter
                            ).values_list('id', flat=True).distinct().all())
            print(len(file_ids))
        chunks = QuadrantRetrival().retrieve_chunks(file_ids, query, country, state,district, category, sub_category, source_type, k, threshold)
        return Response(chunks)
    
    @action(detail=False, methods=["post"])
    def get_content_v2(self, request):

        organization_ids = request.data.get("organization_id")
        query = request.data.get("query")
        query = query.replace("\n", " ") if query else "" 
        countries = request.data.get("countries", [])
        state = request.data.get("state", "").lower()
        category = request.data.get("category", "").lower()
        sub_category = request.data.get("sub_category", "")
        district = request.data.get("district", "").lower()
        k = request.data.get("k", 0)
        threshold = request.data.get("threshold", 0)
        source_type = request.data.get("source_type", None)
        # if sub_category:
            # filter = {"resource__resource_cat_map__sub_category_id":sub_category,
            #           "resource__user_map__organization_id": organization_id[0]} if organization_id else {"resource__resource_cat_map__sub_category_id":sub_category}
        filter = {"pk__in":organization_ids}
        org_names = list(Organization.objects.filter(**filter
                        ).values_list('name', flat=True).distinct().all())
        chunks = QuadrantRetrival().retrieve_chunks_v2(org_names, organization_ids, query, countries, state, district, category, sub_category, source_type, k, threshold)
        return Response(chunks)

    @action(detail=False, methods=["GET"])
    def get_crops(self, request):
        state=request.GET.get("state")
        country=request.GET.get("country")
        result=[]
        if state:
            result = self.get_state_crops(state)

        elif country:
            result = self.get_country_crops(country)

        return Response(result)
    
    @action(detail=False, methods=["GET"])
    def get_categories(self, request):
        org_id=request.GET.get("org_id")
        result=[]
        if org_id:
            result = self.get_crop_by_org_id(org_id)

        return Response(result)
    
    def get_crop_by_org_id(self, org_id):
        user_map_id = list(UserOrganizationMap.objects.filter(organization_id=org_id).values_list('id', flat=True).distinct().all())
        filter = {"user_map_id__in": user_map_id}
        resource_ids = list(Resource.objects.filter(**filter
                        ).values_list('id', flat=True).distinct().all())
        related_sub_category_maps = ResourceSubCategoryMap.objects.filter(
            resource_id__in=resource_ids
        ).select_related('sub_category__category')
        
        # Prepare a dictionary to collect categories and their subcategories
        category_dict = {}

        for resource_map in related_sub_category_maps:
            category = resource_map.sub_category.category
            sub_category = resource_map.sub_category

            # Initialize category entry if not exists
            if category.id not in category_dict:
                category_dict[category.id] = {
                    'category_name': category.name,
                    'category_id': category.id,
                    'sub_categories': []
                }

            # Add subcategory to the category's sub_categories list
            if not any(sub['sub_category_id'] == sub_category.id for sub in category_dict[category.id]['sub_categories']):
                category_dict[category.id]['sub_categories'].append({
                    'sub_category_name': sub_category.name,
                    'sub_category_id': sub_category.id,
                    'description': sub_category.description

                })
        return list(category_dict.values())
    
    def get_country_crops(self, country):
        # resource_sub_category_maps = ResourceSubCategoryMap.objects.filter(
        #     sub_category__name__icontains=country
        # ).select_related('sub_category__category', 'resource')

        # Get the list of resource IDs associated with the state
        resource_ids = Resource.objects.filter(country__countryName=country).values_list('id', flat=True).distinct()

        # Fetch all subcategories related to these resources, excluding categories named "States"
        related_sub_category_maps = ResourceSubCategoryMap.objects.filter(
            resource_id__in=resource_ids
        ).select_related('sub_category__category').exclude(sub_category__category__name="States")

        # Prepare a dictionary to collect categories and their subcategories
        category_dict = {}

        for resource_map in related_sub_category_maps:
            category = resource_map.sub_category.category
            sub_category = resource_map.sub_category

            # Initialize category entry if not exists
            if category.id not in category_dict:
                category_dict[category.id] = {
                    'category_name': category.name,
                    'category_id': category.id,
                    'sub_categories': []
                }

            # Add subcategory to the category's sub_categories list
            if not any(sub['sub_category_id'] == sub_category.id for sub in category_dict[category.id]['sub_categories']):
                category_dict[category.id]['sub_categories'].append({
                    'sub_category_name': sub_category.name,
                    'sub_category_id': sub_category.id,
                    'description': sub_category.description

                })

        # Convert category_dict to a list
        return list(category_dict.values())
    
    def get_state_crops(self, state):

        # resource_sub_category_maps = ResourceSubCategoryMap.objects.filter(
        #     sub_category__name__icontains=state
        # ).select_related('sub_category__category', 'resource')

        # Get the list of resource IDs associated with the state
        # resource_ids = resource_sub_category_maps.values_list('resource_id', flat=True).distinct()
        resource_ids = Resource.objects.filter(state__name=state).values_list('id', flat=True).distinct()

        # Fetch all subcategories related to these resources, excluding categories named "States"
        related_sub_category_maps = ResourceSubCategoryMap.objects.filter(
            resource_id__in=resource_ids
        ).select_related('sub_category__category').exclude(sub_category__category__name="States")

        # Prepare a dictionary to collect categories and their subcategories
        category_dict = {}

        for resource_map in related_sub_category_maps:
            category = resource_map.sub_category.category
            sub_category = resource_map.sub_category

            # Initialize category entry if not exists
            if category.id not in category_dict:
                category_dict[category.id] = {
                    'category_name': category.name,
                    'category_id': category.id,
                    'sub_categories': []
                }

            # Add subcategory to the category's sub_categories list
            if not any(sub['sub_category_id'] == sub_category.id for sub in category_dict[category.id]['sub_categories']):
                category_dict[category.id]['sub_categories'].append({
                    'sub_category_name': sub_category.name,
                    'sub_category_id': sub_category.id, 
                    'description': sub_category.description

                })

        # Convert category_dict to a list
        return list(category_dict.values())

    @action(detail=False, methods=["get"])
    def get_organizations(self, request):
        # Define a map of possible filterable fields in Resource model
        filterable_fields = ["country", "state", "district", "village"]

        # Build a dynamic query filter based on the query parameters
        filters = {}
        for field in filterable_fields:
            if field in request.query_params:
                # Compare query params in lowercase with the JSONField values in the database
                filters[f"{field}__icontains"] = request.query_params[field].lower()

        # Apply the filters dynamically to the Resource model (without LOWER() for JSONField)
        resources = Resource.objects.filter(user_map__user__role_id=3, user_map__user__on_boarded_by=None,**filters)

        # Extract all unique organizations linked through the user_map field in Resource
        organizations = Organization.objects.filter(
            id__in=resources.values_list("user_map__organization", flat=True).distinct())

        # Serialize the list of organizations
        serializer = OrganizationSerializer(organizations, many=True)
        return Response(serializer.data, status=200)
   
