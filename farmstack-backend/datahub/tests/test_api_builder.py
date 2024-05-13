from rest_framework.reverse import reverse
from django.test import Client, TestCase
import json
from datahub.models import DatasetV2, Organization, UserOrganizationMap
from accounts.models import User, UserRole
from participant.tests.test_util import TestUtils
from _pytest.monkeypatch import MonkeyPatch



auth = {
    "token": "null"
}

auth_co_steward = {
    "token": "null"
}

auth_participant = {
    "token": "null"
}

dataset = {
    "name": "dataset dash 1",
    "description": "dataset dash desc 1",
    "geography": "tpt 1",
    "constantly_update": False,
    "is_temp": False,
    "category": ({"category dash": ["dashboard category"]}),
}


class TestCasesConnectors(TestCase):
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        self.user_co_steward=Client()
        self.client_admin = Client()
        self.user_participant=Client() 
        self.user=Client() 
        self.monkeypatch = MonkeyPatch()
        self.dataset_url=reverse("dataset/v2-list")
        self.usage_policy_url=reverse("usage-policy-list-create")
        self.dataset_files_url=reverse("dataset_files-list")
        self.url=("usage-policy-retrieve-update-destroy")

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



        self.first_dataset = DatasetV2.objects.create( user_map=self.admin_map,
                                                **dataset)
        file_data1 = {
            "dataset": str(self.first_dataset.id),
            "file" : open("datahub/tests/test_data/file.xls", "rb"),
            "source": "file",
        }
        self.response_file1 = self.client_admin.post(self.dataset_files_url, file_data1)


    ######### Generic function to return headers #############

    def set_auth_headers(self, participant=False, co_steward=False):  
        auth_data = auth_participant if participant else (auth_co_steward if co_steward else auth)
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_data["token"]}'
        }
        return headers['Authorization'],headers['Content-Type']

    def test_usage_policy_valid(self):

        usage_policy_valid = {
            "dataset_file": self.response_file1.json()['id'],
            "user_organization_map": self.admin_map.id,
        }
        response = self.client_admin.post(self.usage_policy_url, usage_policy_valid)
        participant_response = self.user_participant.post(self.usage_policy_url, usage_policy_valid)
        co_steward_response = self.user_co_steward.post(self.usage_policy_url, usage_policy_valid)
        participant_data=participant_response.json()
        co_steward_data=co_steward_response.json()
        data = response.json()
        assert response.status_code == 201
        assert data['dataset_file'] == self.response_file1.json()['id']
        assert data['user_organization_map'] == str(self.admin_map.id)
        self.id=data["id"]
        self.user_id=participant_data["id"]
        self.co_steward_id=co_steward_data["id"]

        ################### approval_status= "REQUESTED" ######################

        payload={
            "type":'api',
            "approval_status":"requested",
           }
        url_name = 'usage-policy-retrieve-update-destroy'
        usage_policy_id = self.id
        url = reverse(url_name, kwargs={'pk': usage_policy_id})
        patch_response = self.client_admin.patch(url,payload, content_type="application/json")
        
        assert patch_response.status_code==200
        assert patch_response.json()=={'approval_status': 'requested', 'api_key': None}

        ################### approval_status= "APPROVED" ######################

        payload={
            "type":'api',
            "approval_status":"approved",
        }
        url_name = 'usage-policy-retrieve-update-destroy'
        usage_policy_id = self.user_id
        url = reverse(url_name, kwargs={'pk': usage_policy_id})
        res = self.user_participant.patch(url,payload, content_type="application/json")
        assert res.status_code==200
        assert res.json()["approval_status"]== 'approved'

        ################### approval_status= "REJECTED" ######################

        data={
            "type":'api',
            "approval_status":"rejected",
        }
        url_name = 'usage-policy-retrieve-update-destroy'
        usage_policy_id = self.user_id
        url = reverse(url_name, kwargs={'pk': usage_policy_id})
        response = self.user_participant.patch(url,data, content_type="application/json")
        assert response.status_code==200
        assert response.json()=={'approval_status': 'rejected', 'api_key': None}

        ################### approval_status= "REQUESTED" ######################

        data={
            "type":'api',
            "approval_status":"requested",
        }
        url_name = 'usage-policy-retrieve-update-destroy'
        usage_policy_id = self.user_id
        url = reverse(url_name, kwargs={'pk': usage_policy_id})
        res = self.user_participant.patch(url,data, content_type="application/json")
        assert res.status_code==200
        assert res.json()=={'approval_status': 'requested', 'api_key': None}


        ################### approval_status= "REJECTED" ######################

        payload_req={
            "type":'api',
            "approval_status":"rejected",
        }
        url_name = 'usage-policy-retrieve-update-destroy'
        usage_policy_id = self.co_steward_id
        url = reverse(url_name, kwargs={'pk': usage_policy_id})
        res = self.user_co_steward.patch(url,payload_req, content_type="application/json")
        assert res.status_code==200
        assert res.json()=={'approval_status': 'rejected', 'api_key': None}


        ##################### Empty payolad ########################

        data={
            "type":'',
            "approval_status":"",
        }
        url_name = 'usage-policy-retrieve-update-destroy'
        usage_policy_id = self.id
        url = reverse(url_name, kwargs={'pk': usage_policy_id})
        response = self.client_admin.patch(url,data, content_type="application/json")
        assert response.json()=={'approval_status': ['"" is not a valid choice.']}
        assert response.status_code==400


        ##################### return exception ########################

        def mock_generate_api():
            raise Exception({'detail': 'Something went wrong while generating api key'})
        
        data={
            "type":'api',
            "approval_status":"approved",
        }
        self.monkeypatch.setattr("datahub.views.generate_api_key", mock_generate_api)

        response = self.client_admin.patch(self.usage_policy_url+f"{self.id}/",data, content_type="application/json")
        assert response.status_code==500
        assert response.json()=="{'detail': 'Something went wrong while generating api key'}"


        ##################### type!= 'api' #####################

        data={
            "accessibility_time":"2023-08-15",
            "approval_status":"approved",
        }
        url_name = 'usage-policy-retrieve-update-destroy'
        usage_policy_id = self.id
        url = reverse(url_name, kwargs={'pk': usage_policy_id})
        response = self.client_admin.patch(url,data, content_type="application/json")
        assert response.json()=={'approval_status': 'approved', 'api_key': None}
        assert response.status_code==200

