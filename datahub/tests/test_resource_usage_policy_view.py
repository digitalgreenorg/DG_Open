from rest_framework.reverse import reverse
from django.test import Client, TestCase
import json
from datahub.models import  Organization, UserOrganizationMap,Resource,ResourceFile,ResourceUsagePolicy
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


class TestCasesResourceUsagePolicy(TestCase):
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        self.user_co_steward=Client()
        self.client_admin = Client()
        self.user_participant=Client() 
        self.user=Client() 
        self.resource_usage_policy_url=reverse("resource_usage-policy-list-create")
        self.resource_management_url=reverse("resource_management-list")

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

        ################# Resources ################

        self.dummy_resource = Resource.objects.create(
        title="Dummy Resource",
        description="This is a dummy resource description.",
        user_map=self.admin_map,
        category={"Crops": ["Paddy"], "States": ["Bihar"]})

        dummy_resource_file = ResourceFile.objects.create(
                resource=self.dummy_resource,
                file=None,  
                file_size=1024,  
                type="youtube",
                url="https://www.youtube.com/shorts/m7YedCGtE70",
                transcription="This is a dummy transcription.",
            )

        data = {
            "resource": self.dummy_resource,
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
    
    def test_resource_usage_policy_create(self):

        resource_data = {
            "resource": self.dummy_resource.id,
            "type": "resource",
            "user_organization_map": self.admin_map.id,
        }     
        response = self.client_admin.post(self.resource_usage_policy_url, resource_data)
        data = response.json()
        assert response.status_code == 201
        assert data["approval_status"]== 'requested'
        assert data["api_key"]== None
        assert data["type"]== "resource"


        resource_data_two = {
            "resource": self.dummy_resource.id,
            "type": "embeddings",
            "user_organization_map": self.co_steward_map.id,
        }     
        response = self.user_co_steward.post(self.resource_usage_policy_url, resource_data_two)
        data = response.json()
        assert response.status_code == 201
        assert data["approval_status"]== 'requested'
        assert data["api_key"]== None
        assert data["type"]== "embeddings"

    def test_resource_usage_policy_list(self):
   
        response = self.client_admin.get(self.resource_usage_policy_url)
        data = response.json()
        assert response.status_code == 200
        assert data[0]["approval_status"]== 'requested'
        assert data[0]["api_key"]== None
        assert data[0]["type"]== "resource"

        response = self.user_co_steward.get(self.resource_usage_policy_url)
        data = response.json()
        assert response.status_code == 200
        assert data[0]["approval_status"]== 'requested'
        assert data[0]["api_key"]== None

    def test_resource_usage_policy_patch(self):
   
        response = self.client_admin.get(self.resource_usage_policy_url)
        data = response.json()
        assert response.status_code == 200
        url=self.resource_usage_policy_url+data[0]["id"]+'/'
        data={"approval_status":"approved","accessibility_time":"2024-01-31","type":"resource"}

        response = self.client_admin.patch(url,data,content_type='application/json')
        assert response.status_code == 200
        data=response.json()
        assert data["approval_status"]== 'approved'
        assert data["api_key"]!= None
        assert data["accessibility_time"]== '2024-01-31'

########### Negative test cases #####################
        
    def test_resource_usage_policy_patch_negative_test_case(self):
   
        response = self.client_admin.get(self.resource_usage_policy_url)
        data = response.json()
        assert response.status_code == 200
        url=self.resource_usage_policy_url+data[0]["id"]+'/'
        data={"approval_status":"nn","accessibility_time":"2024-01-31","type":"resource"}

        response = self.client_admin.patch(url,data,content_type='application/json')
        assert response.status_code == 400
        data=response.json()
        assert data=={'approval_status': ['"nn" is not a valid choice.']} 


    def test_resource_usage_policy_patch_error(self):
   
        response = self.client_admin.get(self.resource_usage_policy_url)
        data = response.json()
        assert response.status_code == 200
        url=self.resource_usage_policy_url+data[0]["id"]+"/"
        data={"approval_status":"approved","accessibility_time":"2024-01-31","type":"resource"}

        response = self.client_admin.patch(self.resource_usage_policy_url,data,content_type='application/json')
        assert response.status_code == 405
        data=response.json()
        assert data=={'detail': 'Method "PATCH" not allowed.'}

    def test_requested_resources_list(self):
        resource_data = {
            "resource": self.dummy_resource.id,
            "type": "resource",
            "user_organization_map": self.co_steward_map.id,
        }     
        response = self.user_co_steward.post(self.resource_usage_policy_url, resource_data)
        data = response.json()
        assert response.status_code == 201
        assert data["approval_status"]== 'requested'
        assert data["api_key"]== None
        assert data["type"]== "resource"

        resource_data_two = {
            "resource": self.dummy_resource.id,
            "type": "embeddings",
            "user_organization_map": self.co_steward_map.id,
        }     
        response = self.user_co_steward.post(self.resource_usage_policy_url, resource_data_two)
        data = response.json()
        assert response.status_code == 201
        url=self.resource_management_url+'requested_resources/'
        data={
            "user_map":self.co_steward_map.id
        }
        response = self.user_co_steward.post(url,data)
        data = response.json()
        assert response.status_code == 200
        assert len(data['sent']) == 2