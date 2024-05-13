from rest_framework.reverse import reverse
from django.test import Client, TestCase
import json
from datahub.models import DatasetV2, Organization, UserOrganizationMap, DatasetV2File
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

class TestApiBuilder(TestCase):
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        self.user_co_steward=Client()
        self.client_admin = Client()
        self.user_participant=Client() 
        self.user=Client() 
        self.monkeypatch = MonkeyPatch()
        self.get_json_response_url=reverse('datasets-list')

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

    ######### Generic function to return headers #############

    def set_auth_headers(self, participant=False, co_steward=False):  
        auth_data = auth_participant if participant else (auth_co_steward if co_steward else auth)
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_data["token"]}'
        }
        return headers['Authorization'],headers['Content-Type']
    
    ################ positive test cases ######################
    def test_get_json_response_xls_file_data_format(self):
        page=1
        path="microsite/tests/test_files/file.xls"
        params = f'?page={page}&&file_path={path}'
        url = self.get_json_response_url + 'get_json_response/' + params
        response = self.client_admin.get(url)
        assert response.status_code==200
        assert response.json()['columns'][0]=={'ellipsis': True, 'width': 200, 'title': 'SR.', 'dataIndex': 'SR.'}
        assert response.json()['columns'][2]=={'ellipsis': True, 'width': 200, 'title': 'GENDER', 'dataIndex': 'GENDER'}

      
    def test_get_json_response_csv_file_data_format(self):
        page=1
        path="microsite/tests/test_files/File.csv"
        params = f'?page={page}&&file_path={path}'
        url = self.get_json_response_url + 'get_json_response/' + params
        response = self.client_admin.get(url)
        assert response.status_code==200
        assert len(response.json()['columns'])==14
        assert response.json()['columns'][0]=={'ellipsis': True, 'width': 200, 'title': 'Deries reference', 'dataIndex': 'Deries_reference'}
        assert response.json()['columns'][1]=={'ellipsis': True, 'width': 200, 'title': 'Period', 'dataIndex': 'Period'}


    def test_get_json_response_page_within_range(self): 
        page=1
        path="protected/datasets/dump_datasets/file/addresses.csv"
        params = f'?page={page}&&file_path={path}'
        url = self.get_json_response_url + 'get_json_response/' + params
        response = self.client_admin.get(url)
        assert response.status_code==200
        assert len(response.json()['columns'])==6
        assert response.json()['columns'][0]=={'ellipsis': True, 'width': 200, 'title': 'John', 'dataIndex': 'John'}
        assert response.json()['columns'][1]=={'ellipsis': True, 'width': 200, 'title': 'Doe', 'dataIndex': 'Doe'}


    ############## Negative test case without query params ##################
    def test_get_json_response_without_query_params(self):
        url = self.get_json_response_url + 'get_json_response/'
        response_error = self.client_admin.get(url)
        assert response_error.json()=="'NoneType' object has no attribute 'endswith'"
        assert response_error.status_code==500


    ############## Negative test cases with float type page number  ##################
    def test_get_json_response_invalid_query_params(self):
        page=0.8
        path="protected/datasets/dump_/file/file.xls"
        params = f'?page={page}&&file_path={path}'
        url = self.get_json_response_url + 'get_json_response/' + params
        response = self.client_admin.get(url)
        assert response.json()=="invalid literal for int() with base 10: '0.8'"
        assert response.status_code==500

 ############## Negative test cases with page out of range ##################
    def test_get_json_response_page_out_of_range(self):    
        page=10
        path="protected/datasets/dump_datasets/file/addresses.csv"
        params = f'?page={page}&&file_path={path}'
        url = self.get_json_response_url + 'get_json_response/' + params
        response = self.client_admin.get(url)
        assert response.status_code==400
        assert response.json()=="Table is Empty or Reached End of the table"