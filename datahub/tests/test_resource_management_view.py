from rest_framework.reverse import reverse
from django.test import Client, TestCase
import json
from datahub.models import  Organization, UserOrganizationMap,Resource,ResourceFile,ResourceUsagePolicy,Category,SubCategory,ResourceSubCategoryMap
from accounts.models import User, UserRole
from participant.tests.test_util import TestUtils


auth = {
    "token": "null"
}

auth_co_steward = {
    "token": "null"
}

auth_participant = {
    "token": "null"
}


class TestCasesResourceManagement(TestCase):
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        self.user_co_steward=Client()
        self.client_admin = Client()
        self.user_participant=Client() 
        self.user=Client() 
        self.resource_management_url=reverse("resource_management-list")
        self.categories_url=reverse("category-list")
        self.subcategories_url=reverse("subcategory-list")

        ################# create user roles #############
        self.admin_role = UserRole.objects.create(
            id="1",
            role_name="datahub_admin"
        )
        self.participant_role = UserRole.objects.create(id=3, role_name="datahub_participant_root")
        self.co_steward_role = UserRole.objects.create(id=6, role_name="datahub_co_steward")


        ############# create users #################
        self.admin = User.objects.create(
            email="akshata@digitalgreen.org",
            role_id=self.admin_role.id,

        )
        self.user_id=self.admin.id
        self.co_steward = User.objects.create(
            email="costeward@digitalgreen.org",
            role_id=self.co_steward_role.id,
          
        )
        self.participant = User.objects.create(
            email="participant@digitalgreen.org",
            role_id=self.participant_role.id,     
        )


        ############# create organization ###############
        self.admin_org = Organization.objects.create(
            org_email="akshata@dg.org",
            name="Akshata Naik",
            phone_number="5678909876",
            website="htttps://google.com",
            address=json.dumps({"city": "Banglore"}),
        ) 
        self.co_steward_org = Organization.objects.create(
            org_email="costeward@dg.org",
            name="Co steward",
            phone_number="5678909876",
            website="htttps://google.com",
            address=json.dumps({"city": "Banglore"}),
        ) 
        self.participant_org = Organization.objects.create(
            org_email="aman@dg.org",
            name="Aman",
            phone_number="5678909876",
            website="htttps://google.com",
            address=json.dumps({"city": "Banglore"}),
        ) 
        self.co_steward.on_boarded_by=self.co_steward

        ################# user map #################
        self.admin_map=UserOrganizationMap.objects.create(user_id=self.admin.id, organization_id=self.admin_org.id)
        self.co_steward_map=UserOrganizationMap.objects.create(user_id=self.co_steward.id, organization_id=self.co_steward_org.id)
        self.participant_map=UserOrganizationMap.objects.create(user_id=self.participant.id, organization_id=self.participant_org.id)


        ##################################################

                # Create a dummy Category object
        dummy_category = Category.objects.create(
            name="Dummy Category",
            description="This is a dummy category description."
        )
        dummy_category_two = Category.objects.create(
            name="Dummy Category_Two",
            description="This is a dummy category description 2."
        )

        # Create a dummy SubCategory object associated with the dummy Category
        dummy_subcategory = SubCategory.objects.create(
            name="Dummy SubCategory",
            category=dummy_category
        )
        dummy_subcategory_two = SubCategory.objects.create(
            name="Dummy SubCategory two",
            category=dummy_category_two
        )

        # Assuming you have a Resource model, create a dummy Resource object
        dummy_resource = Resource.objects.create(
            title="Dummy Resource 12345",
            description="This is a dummy resource description.",
            user_map=self.admin_map,
            category={"Crops": ["Paddy"], "States": ["Bihar"]}
        )

        # Create a dummy ResourceSubCategoryMap object associating the dummy SubCategory and Resource
        dummy_resource_subcategory_map = ResourceSubCategoryMap.objects.create(
            sub_category=dummy_subcategory,
            resource=dummy_resource
        )
        dummy_resource_subcategory_map_two = ResourceSubCategoryMap.objects.create(
            sub_category=dummy_subcategory_two,
            resource=dummy_resource
        )

        # print("data 1---------->",dummy_category.__dict__)
        # print("self.dummy_subcategory 2---------->",dummy_subcategory.__dict__)
        # print("self.dummy_resource----->",dummy_resource.__dict__)
        # print("self.dummy_resource_subcategory_map---------->",dummy_resource_subcategory_map.__dict__)
        ################# Resources ################

        dummy_resource = Resource.objects.create(
        title="Dummy Resource",
        description="This is a dummy resource description.",
        user_map=self.admin_map,
        category={"Crops": ["Paddy"], "States": ["Bihar"]})

        dummy_resource_file = ResourceFile.objects.create(
                resource=dummy_resource,
                file=None,  
                file_size=1024,  
                type="youtube",
                url="https://www.youtube.com/shorts/m7YedCGtE70",
                transcription="This is a dummy transcription.",
            )

        data = {
            "resource": dummy_resource,
            "type": "resource",
            "user_organization_map": self.admin_map,
        }


        resource_usage_policy=ResourceUsagePolicy.objects.create(**data)

        ################ admin token ##################
        auth["token"] = TestUtils.create_token_for_user(self.admin, self.admin_map)
        admin_header=self.set_auth_headers(self=self)
        self.client_admin.defaults['HTTP_AUTHORIZATION'] = admin_header[0]
        self.client_admin.defaults['CONTENT_TYPE'] = admin_header[1]

        auth_co_steward["token"] = TestUtils.create_token_for_user(self.co_steward, self.co_steward_map)
        co_steward_header=self.set_auth_headers(self=self, co_steward=True)
        self.user_co_steward.defaults['HTTP_AUTHORIZATION'] = co_steward_header[0]
        self.user_co_steward.defaults['CONTENT_TYPE'] = co_steward_header[1]

        auth_participant["token"] = TestUtils.create_token_for_user(self.participant, self.participant_map)
        participant_header=self.set_auth_headers(self=self, participant=True)
        self.user_participant.defaults['HTTP_AUTHORIZATION'] = participant_header[0]
        self.user_participant.defaults['CONTENT_TYPE'] = participant_header[1]

            ######### Generic function to return headers #############

    def set_auth_headers(self, participant=False, co_steward=False):  
        auth_data = auth_participant if participant else (auth_co_steward if co_steward else auth)
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_data["token"]}'
        }
        return headers['Authorization'],headers['Content-Type']
    

    def test_get_category_list(self):
        url=self.categories_url+"categories_and_sub_categories/"
        response=self.client_admin.get(url)
        data=response.json()
        assert response.status_code==200
        assert data=={'Dummy Category': ['Dummy SubCategory'], 'Dummy Category_Two': ['Dummy SubCategory two']}

  
    def test_get_subcategory_list(self):
        response=self.client_admin.get(self.subcategories_url,follow=True,content_type="application/json")
        data=response.json()
        assert response.status_code==200
        assert len(data) == 2
        subcategory_1 = data[0]
        assert subcategory_1['name'] == 'Dummy SubCategory'
        subcategory_2 = data[1]
        assert subcategory_2['name'] == 'Dummy SubCategory two'
    
    def test_resource_management_get_list(self):
        response = self.client_admin.get(self.resource_management_url)
        assert response.status_code == 200
        data = response.json()
        assert data['count'] == 2
        results = data['results']
        resource_1 = results[0]
        assert resource_1['title'] == 'Dummy Resource'
        assert resource_1['description'] == 'This is a dummy resource description.'
        resource_2 = results[1]
        assert resource_2['title'] == 'Dummy Resource 12345'
        assert resource_2['description'] == 'This is a dummy resource description.'

    def test_resource_management_get_list_other_organization(self):
        url=self.resource_management_url
        data={
            "others":"true"
        }
        response = self.client_admin.get(url,data)
        assert response.status_code == 200
        data = response.json()
        assert data=={'count': 0, 'next': None, 'previous': None, 'results': []}


    def test_resource_management_get_single_resource(self):
        response = self.client_admin.get(self.resource_management_url)
        assert response.status_code == 200
        data = response.json()
        assert data['count'] == 2
        results = data['results']
        resource_1 = results[0]
        resource_1_id = results[0]['id']
        url=self.resource_management_url+resource_1_id+'/'
        response = self.client_admin.get(url)
        assert response.status_code == 200
        data = response.json()
        resources = data['resources']
        assert len(resources) == 1
        resource = resources[0]
        assert resource['type'] == 'youtube'
        assert resource['url'] == 'https://www.youtube.com/shorts/m7YedCGtE70'

        organization = data['organization']
        assert organization['org_email'] == 'akshata@dg.org'
        assert organization['name'] == 'Akshata Naik'

        # Check resource usage policy details
        resource_usage_policy = data['resource_usage_policy'][0]
        assert resource_usage_policy['approval_status'] == 'requested'
        assert resource_usage_policy['type'] == 'resource'
        assert resource_usage_policy['resource_title'] == 'Dummy Resource'
        assert resource_usage_policy['organization_name'] == 'Akshata Naik'
        assert resource_usage_policy['organization_email'] == 'akshata@dg.org'
        assert resource_usage_policy['organization_phone_number'] == '5678909876'

    def test_resource_management_resources_filter(self):
        url=self.resource_management_url+"resources_filter"+'/'
        data={"title__icontains": "jopopo"}
        response = self.client_admin.post(url,data,content_type='application/json')
        assert response.status_code == 200
        assert response.json()=={'count': 0, 'next': None, 'previous': None, 'results': []}

        data={"title__icontains": "Dummy Resource 12345"}
        response = self.client_admin.post(url,data,content_type='application/json')
        data=response.json()
        assert response.status_code == 200
        assert data['count'] == 1
        results = data['results']
        resource = results[0]
        assert resource['title'] == 'Dummy Resource 12345'
        assert resource['description'] == 'This is a dummy resource description.'


    def test_resource_management_delete(self):
        response = self.client_admin.get(self.resource_management_url)
        assert response.status_code == 200
        data = response.json()
        assert data['count'] == 2
        results = data['results']
        resource_1 = results[0]
        resource_1_id = results[0]['id']
        url=self.resource_management_url+resource_1_id+'/'
        response = self.client_admin.delete(url)
        assert response.status_code == 204


    def test_resource_management_error_404(self):
        response = self.client_admin.get(self.resource_management_url)
        assert response.status_code == 200
        data = response.json()
        assert data['count'] == 2
        results = data['results']
        url=self.resource_management_url+'/'
        response = self.client_admin.get(url)
        assert response.status_code == 404



    # def test_resource_management_edit_resource(self):
    #     response = self.client_admin.get(self.resource_management_url)
    #     assert response.status_code == 200
    #     data = response.json()
    #     assert data['count'] == 2
    #     results = data['results']
    #     resource_1 = results[0]
    #     resource_1_id = results[0]['id']
    #     url=self.resource_management_url+resource_1_id+'/'
    #     response = self.client_admin.get(url)
    #     assert response.status_code == 200
    #     data = response.json()
    #     data['title'] = 'Updated Dummy Resource'
    #     updated_data_json = json.dumps(data)

    #     response = self.client_admin.put(url, data=updated_data_json, content_type='application/json')
    #     assert response.status_code == 200
    #     # print("response-------->",response.json())

    
    # def test_resource_management_create(self):
    #     with open('/Users/akshatanaik/Akshata/vistar_fs/farmstack-backend/datahub/tests/test_data/dummy.pdf', 'rb') as f:
    #         file_data = f.read()

    #     form_data = {
    #         'title': 'Create new farmer resource',
    #         'description': 'description about ---',
    #         'category': [],
    #         'sub_categories_map': self.dummy_subcategory.id,
    #         'uploaded_files': {
    #             'type': 'youtube',
    #             'url': 'https://www.youtube.com/shorts/H0CqSuxCbKY',
    #             'transcription': 'Growing an avocado tree from seed'
    #         }
    #     }

    #     files = {'file': ('dummy.pdf', file_data)}

    #     response = self.client_admin.post(
    #         self.resource_management_url,form_data)
    #     data = response.json()
    #     print("data---->", data)
    #     self.assertEqual(response.status_code, 201)
