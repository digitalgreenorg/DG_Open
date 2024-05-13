import json
import logging
from unittest import TestCase

from django.core.files.base import File
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, TestCase
from rest_framework.reverse import reverse

from accounts.models import User, UserRole
from connectors.models import Connectors, ConnectorsMap
from datahub.models import DatasetV2, DatasetV2File, Organization, UserOrganizationMap
from participant.tests.test_util import TestUtils

LOGGER = logging.getLogger(__name__)

left_datasets_dump_data = {
    "name": "dump_datasets",
    "description": "dataset description",
    "geography": "tpt",
    "constantly_update": False,
}

right_datasets_dump_data = {
    "name": "fhgjhjkkj_datasets",
    "description": "description about data set",
    "geography": "tpt",
    "constantly_update": False,
}

datasetOne = {
    "name": "data_set_one",
    "description": "dataset description one",
    "geography": "tpt",
    "constantly_update": False,
}

datasetOnepr = {
    "name": "participant data set",
    "description": "dataset description one",
    "geography": "tpt",
    "constantly_update": False,
}

datasetTwopr = {
    "name": "participant data set two",
    "description": "description two",
    "geography": "tpt",
    "constantly_update": False,
}

datasetThreepr = {
    "name": "participant data set three",
    "description": "description three",
    "geography": "tpt",
    "constantly_update": False,
}

datasetTwo = {
    "name": "data_set_two",
    "description": "description two",
    "geography": "tpt",
    "constantly_update": False,
}

connectors_dump_data = {
    'name': "connector one",
    "description": "description about....",
}

connectors_data = {
    'name': "Agri connect Hub",
    "description": "AgriConnect Hub is an innovative and comprehensive platform designed to bridge the gap between farmers and the agricultural ecosystem."
}

auth = {
    "token": "null"
}

auth_co_steward = {
    "token": "null"
}

auth_participant = {
    "token": "null"
}

connectors_info = {
    'name': 'connector hub',
    "description": 'vjskmjks',
}

create_connector = {
    "name": "creating_connector",
    "description": "created agriculture database connectors",
    "integrated_file": open("connectors/tests/test_files/file_example_XLS_100.xls", "rb")
}

create_connector_two = {
    "name": "creating_connector_two",
    "description": ".........",
    "integrated_file": open("connectors/tests/test_files/file_example_XLS_100.xls", "rb")
}

create_connector_new = {
    "name": 'creating_connector',
    "description": 'created agriculture database connectors ,,,,,,,,,,,,,',
}

connector_details = {
    "name": "creating_connector_two",
    "description": ".........",
    "integrated_file": open("connectors/tests/test_files/file_example_XLS_100.xls", "rb")
}
class TestCasesConnectors(TestCase):
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        self.user_co_steward=Client()
        self.client_admin = Client()
        self.user_participant=Client()    
        self.dummy=Client()    
        self.connectors_url=reverse("microsite_connectors-list")

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
        # auth["token"] = TestUtils.create_token_for_user(self.admin, self.admin_map)
        # admin_header=self.set_auth_headers(self=self) # type: ignore
        # self.client_admin.defaults['HTTP_AUTHORIZATION'] = admin_header[0]
        # self.client_admin.defaults['CONTENT_TYPE'] = admin_header[1]

        # auth_co_steward["token"] = TestUtils.create_token_for_user(self.co_steward, self.co_steward_map)
        # co_steward_header=self.set_auth_headers(self=self, co_steward=True)
        # self.user_co_steward.defaults['HTTP_AUTHORIZATION'] = co_steward_header[0]
        # self.user_co_steward.defaults['CONTENT_TYPE'] = co_steward_header[1]

        # auth_participant["token"] = TestUtils.create_token_for_user(self.participant, self.participant_map)
        # participant_header=self.set_auth_headers(self=self, participant=True)
        # self.user_participant.defaults['HTTP_AUTHORIZATION'] = participant_header[0]
        # self.user_participant.defaults['CONTENT_TYPE'] = participant_header[1]

        ########## data set ############
        self.left_dataset_pr = DatasetV2.objects.create(user_map=self.participant_map, **datasetOnepr)
        self.right_dataset_pr = DatasetV2.objects.create(user_map=self.participant_map, **datasetTwopr)
        self.right_dataset_pr_two = DatasetV2.objects.create(user_map=self.participant_map, **datasetThreepr)
        with open('connectors/tests/test_files/file_example_XLS_100.xls','rb') as file:
            file_obj = file.read()
        file = SimpleUploadedFile("file_example_XLS_100.xls", file_obj) 
        datasetv2_file_response=DatasetV2File.objects.create(dataset_id=self.left_dataset_pr.id ,file=file)
        self.datasetv2_file_pr1 = datasetv2_file_response
        with open('connectors/tests/test_files/file_example_XLS_50.xls','rb') as file:
            file_obj = file.read()
        file = SimpleUploadedFile("file_example_XLS_50.xls", file_obj) 
        self.datasetv2_file_pr2=DatasetV2File.objects.create(dataset_id=self.right_dataset_pr.id ,file=file)
        self.datasetv2_file_pr3=DatasetV2File.objects.create(dataset_id=self.right_dataset_pr_two.id ,file=file)
        left_dataset = DatasetV2.objects.create(user_map=self.admin_map, **left_datasets_dump_data)
        right_dataset = DatasetV2.objects.create(user_map=self.admin_map, **right_datasets_dump_data)
        left_dataset_cs = DatasetV2.objects.create(user_map=self.co_steward_map, **datasetOne)
        right_dataset_cs = DatasetV2.objects.create(user_map=self.co_steward_map, **datasetTwo)
        datasetv2_file_cs1=DatasetV2File.objects.create(dataset_id=right_dataset_cs.id )
        datasetv2_file_cs2=DatasetV2File.objects.create(dataset_id=left_dataset_cs.id )
        connector_cs = Connectors.objects.create(user_id=self.co_steward.id,**connectors_info)
        connector_map_cs = ConnectorsMap.objects.create(connectors_id=connector_cs.id,left_dataset_file_id=datasetv2_file_cs1.id, right_dataset_file_id=datasetv2_file_cs2.id)
        self.create_connector_id=self.participant.id

        ############# create datasetv2 file
        datasetv2_file_one=DatasetV2File.objects.create(dataset_id=left_dataset.id,)
        with open("connectors/tests/test_files/file_example_XLS_10.xls", "rb") as file:
            datasetv2_file_one.source="file"
            datasetv2_file_one.save()
            datasetv2_file_one.file.save("name_new_file.xls",File(file))
            datasetv2_file_one.save()

        self.file_one_id = datasetv2_file_one.id
        with open('connectors/tests/test_files/file.xls','rb') as file:
            file_obj = file.read()
        file = SimpleUploadedFile("file_example_XLS_10.xls", file_obj)  
        datasetv2_file_two=DatasetV2File.objects.create(dataset_id=right_dataset.id, file=file )
        connector = Connectors.objects.create(user_id=self.admin.id, **connectors_dump_data)
        agri_connector_hub = Connectors.objects.create(user_id=self.admin.id, **connectors_data)
        self.agri_connector_id=agri_connector_hub.id
        connector_map = ConnectorsMap.objects.create(connectors_id=agri_connector_hub.id, left_dataset_file_id=datasetv2_file_one.id, right_dataset_file_id=datasetv2_file_two.id)
        agri_connector_hub_map = ConnectorsMap.objects.create(connectors_id=connector.id, left_dataset_file_id=datasetv2_file_one.id, right_dataset_file_id=datasetv2_file_two.id)
        self.agri_connector_hub_map_id=agri_connector_hub_map.id
        self.connector_map_id=connector_map.id
        self.connector_id=connector.id

    def test_get_list_of_valid_connectors(self):
        response = self.client_admin.get(self.connectors_url)
        assert response.status_code == 200
        assert response.json()['results'][0]['name']==connectors_data['name']
        assert response.json()['results'][0]['description']==connectors_data['description']
        assert response.json()['results'][1]['name']==connectors_dump_data["name"]
        assert response.json()['results'][1]['description']==connectors_dump_data["description"]
        assert response.json()['results'][0]['dataset_count']==2
        assert response.json()['results'][0]['providers_count']==1
        assert response.json()['results'][1]['dataset_count']==2
        assert response.json()['results'][1]['providers_count']==1       


    #################### Retrive single connector #####################
    def test_retrieve_connector_single(self):
        params=f'{self.agri_connector_id}/'
        response = self.client_admin.get(self.connectors_url+params)
        response_data = response.json()
        logging.info(response.json())
        assert response.status_code == 200
        assert response_data['name']==connectors_data['name']
        assert response_data['description']==connectors_data['description']
        assert len(response_data['dataset_and_organizations'])== 2
        assert len(response_data['dataset_and_organizations']['datasets'])== 2
        assert len(response_data['dataset_and_organizations']['organizations'])== 1
        assert response_data['dataset_and_organizations']['datasets'][0]["name"] == left_datasets_dump_data["name"]
        assert response_data['dataset_and_organizations']['datasets'][1]["name"] == right_datasets_dump_data["name"]
        assert response_data['dataset_and_organizations']['organizations'][0]["org_email"] == 'akshata@dg.org'

    def test_get_connector_invalid_id_handling(self):
        params=f'{self.agri_connector_hub_map_id}/'
        response = self.client_admin.get(self.connectors_url+params)
        response_data = response.json()
        assert response.status_code == 400
        assert response_data=='No Connectors matches the given query.'
