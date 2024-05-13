from rest_framework.reverse import reverse
from django.test import Client, TestCase
import json
from datahub.models import DatasetV2, Organization, UserOrganizationMap, DatasetV2File,UsagePolicy
from accounts.models import User, UserRole
from participant.tests.test_util import TestUtils
from _pytest.monkeypatch import MonkeyPatch
from django.core.files.uploadedfile import SimpleUploadedFile


auth = {
    "token": "null"
}

auth_co_steward = {
    "token": "null"
}

auth_participant = {
    "token": "null"
}

first_datasets_dump_data = {
    "name": "dump_datasets 1",
    "description": "dataset description 1",
    "geography": "tpt 1",
    "constantly_update": False,
}

datasets_dump_data = {
    "name": "data",
    "description": "dataset description.......",
    "geography": "tpt 1",
    "constantly_update": False,
}

class TestApiBuilder(TestCase):
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        self.user_co_steward=Client()
        self.client_admin = Client()
        self.user_participant=Client() 
        self.user=Client() 
        self.monkeypatch = MonkeyPatch()     
        self.dataset_files_url=reverse("dataset_files-list")
        self.usage_policy_url=reverse("usage-policy-list-create")

        self.json_url=reverse("dataset_json_response-api")
        self.dataset_url=reverse("dataset/v2-list")

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
                                                **first_datasets_dump_data)
        self.second_dataset = DatasetV2.objects.create( user_map=self.participant_map,
                                                **datasets_dump_data)       
        
        self.dataset_id1 = self.first_dataset.id
        self.dataset_id2=self.second_dataset.id

        file_data1 = {
            "dataset": str(self.first_dataset.id),
            "file":open("microsite/tests/test_files/sheet.xlsx","rb"),
            "source": "file",
        }
        response = self.client_admin.post(self.dataset_files_url, file_data1)
        self.datasetfile_id=response.json()['id']
        file_data2 = {
            "dataset": str(self.second_dataset.id),
            "file" : open("microsite/tests/test_files/File.csv", "rb"),
            "source": "file",
        }
        response = self.user_participant.post(self.dataset_files_url, file_data2)
        self.datasetfile_id_two=response.json()['id']


    ######### Generic function to return headers #############

    def set_auth_headers(self, participant=False, co_steward=False):  
        auth_data = auth_participant if participant else (auth_co_steward if co_steward else auth)
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_data["token"]}'
        }
        return headers['Authorization'],headers['Content-Type']

    def test_response_based_on_api_key_xls_files(self):
        ######## requesting ######
        usage_policy_valid = {
            "dataset_file": self.datasetfile_id,
            "user_organization_map": self.admin_map.id,
            "type": 'api'
        }
        response = self.client_admin.post(self.usage_policy_url, usage_policy_valid)
        self.id = response.json()["id"]

        ###### approved #########
        payload = {
            "type": 'api',
            "approval_status": "approved",
        }
        url_name = 'usage-policy-retrieve-update-destroy'
        usage_policy_id = self.id
        url = reverse(url_name, kwargs={'pk': usage_policy_id})
        res = self.client_admin.patch(url, payload, content_type="application/json")
        assert res.status_code == 200
        assert res.json()["approval_status"] == 'approved'
        api_key = res.json()["api_key"]
        usage_policy_valid["api_key"]=api_key
        usage_policy_valid["approval_status"]=res.json()["approval_status"]

        ##### retrive single dataset 
        params= f'{self.dataset_id1}/?user_map={self.admin_map.id}'
        response = self.client_admin.get(self.dataset_url+params)
        data = response.json()

        ################# return json response ######################
        page = 1
        url = self.json_url + f'?page={page}'
        headers = {'HTTP_API_KEY': usage_policy_valid["api_key"]}
        response = self.client_admin.get(url, **headers)
        assert response.status_code==200
        assert response.json()["current_page"]==1
        assert response.json()=={'next': False, 'current_page': 1, 'data': [{'Name': 'Akshata', 'Age': 25, 'Country': 'India'}, {'Name': 'Arun', 'Age': 20, 'Country': 'India'}, {'Name': 'Aman', 'Age': 12, 'Country': 'India'}, {'Name': 'Amogh', 'Age': 34, 'Country': 'India'}]}

        ####### Handling Out-of-Range Sheet Index #########
        page_num = 100
        url = self.json_url + f'?page={page_num}'
        headers = {'HTTP_API_KEY': usage_policy_valid["api_key"]}
        response = self.client_admin.get(url, **headers)
        assert response.status_code==400
        assert response.json()=="File is Empty or Reached End of the file"

    def test_response_based_on_api_key_xls_files_invalid_auth(self):
        ######## requesting ######
        usage_policy_valid = {
            "dataset_file": self.datasetfile_id,
            "user_organization_map": self.admin_map.id,
            "type": 'api'
        }
        response = self.client_admin.post(self.usage_policy_url, usage_policy_valid)
        self.id = response.json()["id"]

        ######### rejected ##########
        payload = {
            "type": 'api',
            "approval_status": "rejected",
        }
        url_name = 'usage-policy-retrieve-update-destroy'
        usage_policy_id = self.id
        url = reverse(url_name, kwargs={'pk': usage_policy_id})
        res = self.client_admin.patch(url, payload, content_type="application/json")
        assert res.status_code == 200
        assert res.json()["approval_status"] == 'rejected'
        api_key = res.json()["api_key"]
        usage_policy_valid["api_key"]=api_key
        usage_policy_valid["approval_status"]=res.json()["approval_status"]

        ##### Negative test cases with Invalid credential ##########
        params= f'{self.dataset_id1}/?user_map={self.admin_map.id}'
        response = self.client_admin.get(self.dataset_url+params)
        data = response.json()
        page = 1
        url = self.json_url + f'?page={page}'
        headers = {'HTTP_API_KEY': usage_policy_valid["api_key"]}
        response = self.client_admin.get(url, **headers)
        assert response.status_code==401
        assert response.json()=={'message': 'Invalid auth credentials provided.'}


    ################### negative test case ##############################
    def test_response_based_on_api_key_csv(self):
        usage_policy_valid = {
            "dataset_file": self.datasetfile_id_two,
            "user_organization_map": self.participant_map.id,
            "type": 'api'
        }
        response = self.user_participant.post(self.usage_policy_url, usage_policy_valid)
        self.id = response.json()["id"]
        payload = {
            "type": 'api',
            "approval_status": "approved",
        }
        url_name = 'usage-policy-retrieve-update-destroy'
        usage_policy_id = self.id
        url = reverse(url_name, kwargs={'pk': usage_policy_id})
        res = self.user_participant.patch(url, payload, content_type="application/json")
        assert res.status_code == 200
        assert res.json()["approval_status"] == 'approved'
        api_key = res.json()["api_key"]
        usage_policy_valid["api_key"]=api_key
        usage_policy_valid["approval_status"]=res.json()["approval_status"]

        params= f'{self.dataset_id1}/?user_map={self.participant_map.id}'
        response = self.user_participant.get(self.dataset_url+params)
        data = response.json()

        ####### Handling Out-of-Range Sheet Index #########
        page = 1000
        url = self.json_url + f'?page={page}'
        headers = {'HTTP_API_KEY': usage_policy_valid["api_key"]}
        response = self.user_participant.get(url, **headers)
        assert response.json()=="File is Empty or Reached End of the file"
        assert response.status_code==400