from rest_framework.reverse import reverse
from django.test import Client, TestCase
from rest_framework import status
import json
from datahub.models import DatasetV2, Organization, UserOrganizationMap, DatasetV2File
from accounts.models import User, UserRole
from connectors.models import Connectors, ConnectorsMap
from participant.tests.test_util import TestUtils
from django.core.files.base import File
from django.core.files.uploadedfile import SimpleUploadedFile
from connectors.models import Connectors
from connectors.views import ConnectorsViewSet
from connectors.serializers import ConnectorsListSerializer
from unittest.mock import patch, MagicMock
from rest_framework.exceptions import ValidationError
import logging
from rest_framework.response import Response
from django.http import HttpRequest
import uuid


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
        self.connectors_url=reverse("connectors-list")

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

    ######### Generic function to return headers #############
    def set_auth_headers(self, participant=False, co_steward=False):  
        auth_data = auth_participant if participant else (auth_co_steward if co_steward else auth)
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_data["token"]}'
        }
        return headers['Authorization'],headers['Content-Type']

    ##################### List of connectors #######################
    def test_get_list_of_valid_connectors(self):
        params=f'?user={self.admin.id}&co_steward=false'
        response = self.client_admin.get(self.connectors_url+params)
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
        params=f'{self.agri_connector_id}/?user={self.admin.id}&co_steward=false'
        response = self.client_admin.get(self.connectors_url+params)
        response_data = response.json()
        assert response.status_code == 200
        assert response_data['name']==connectors_data['name']
        assert response_data['description']==connectors_data['description']
        left_dataset_name = response_data['maps'][0]['left_dataset_file']['dataset']['name']
        left_dataset_description = response_data['maps'][0]['left_dataset_file']['dataset']['description']
        assert left_dataset_name==left_datasets_dump_data['name']
        assert left_dataset_description==left_datasets_dump_data['description']
        right_dataset_name = response_data['maps'][0]['right_dataset_file']['dataset']['name']
        right_dataset_description = response_data['maps'][0]['right_dataset_file']['dataset']['description']
        assert right_dataset_name==right_datasets_dump_data['name']
        assert right_dataset_description==right_datasets_dump_data["description"]

 ###############---CREATE---RETRIEVE---UPDATE---######################
    def test_handle_create_edit_integrate_and_get_connector(self):
        create_connector_two["user"] = str(self.participant.id)
        create_connector_two["maps"]=json.dumps([{
            "condition":{
                "how":"outer",
                "left_on":["Age"],
                "right_on":["Age"],
                "left_selected": ["First Name",
                    "Gender",
                    "Age", ],
                "right_selected": ["Last Name",
                    "Gender",
                    "Country",
                    "Age", ]
            },
            "left_dataset_file":str(self.datasetv2_file_pr1.id),
            "left_dataset_file_path": str(self.datasetv2_file_pr1.file),
            "right_dataset_file":str(self.datasetv2_file_pr1.id),
            "right_dataset_file_path":str(self.datasetv2_file_pr1.file)
        }])
        url=self.connectors_url+'integration/'
        params=f'?user={self.participant.id}&co_steward=false'

        ###########Calling integration API ################
        response = self.user_participant.post(url+params, create_connector_two)     
        response_data = response.json()
        assert response.status_code == 200                    
        data={
            "name":create_connector_two["name"],
            "description":create_connector_two["description"],
            "integrated_file":create_connector_two["integrated_file"],
            "user":create_connector_two["user"],
            "maps":json.dumps([{
            "condition":{
                "how":"outer",
                "left_on":["Age"],
                "right_on":["Age"],
                "left_selected": ["First Name",
                    "Gender",
                    "Age", ],
                "right_selected": ["Last Name",
                    "Gender",
                    "Country",
                    "Age", ]
            },"left_dataset_file":str(self.datasetv2_file_pr1.id),
            "right_dataset_file":str(self.datasetv2_file_pr1.id),
            "left_dataset_file_path": str(self.datasetv2_file_pr1.file),
            "right_dataset_file_path":str(self.datasetv2_file_pr1.file),
            }]),
        }

        #####################CREATE-CONNECTORS######################
        response = self.user_participant.post(self.connectors_url, data)       
        created_data = response.json()
        assert response.status_code == 201
        assert created_data["name"]==create_connector_two["name"]
        assert created_data["description"]==create_connector_two["description"]

        ################## GET CREATED CONNECTOR DATA###################
        id=created_data["id"]
        params=f'{id}/?user={self.participant.id}&co_steward=false'
        response = self.user_participant.get(self.connectors_url+params)
        assert response.status_code == 200 
        assert response.json()["id"] == id


        ############################### UPDATE DATA WITH ID ####################################
        connector_id=response.json()['id']
        extract_connector_data={
                     "user":str(self.participant.id),
                    "name":response.json()["name"],
                    "description":response.json()["description"],
                    "integrated_file":response.json()["integrated_file"],
                    "maps":json.dumps([{
                            "condition":{
                                "how":"outer",
                                "left_on":["Age"],
                                "right_on":["Age"],
                                "left_selected": ["First Name",
                                    "Gender",
                                    "Age", ],
                                "right_selected": ["Last Name",
                                    "Gender",
                                    "Country",
                                    "Age", ]
                            },"id":response.json()['maps'][0]['id'],
                            "left_dataset_file":str(self.datasetv2_file_pr1.id),
                            "right_dataset_file":str(self.datasetv2_file_pr1.id),
                            "left_dataset_file_path": str(self.datasetv2_file_pr1.file),
                            "right_dataset_file_path":str(self.datasetv2_file_pr1.file)}])
                }
        extract_connector_data.update({'description': 'UPDATED DATAAAAAAAAAAAAAA'})      
        params=f'{connector_id}/?user={self.participant.id}&co_steward=false'   
        updated_response = self.user_participant.put(self.connectors_url+params,extract_connector_data,content_type='application/json') 
        assert updated_response.status_code == 200
        assert updated_response.json()["description"] == 'UPDATED DATAAAAAAAAAAAAAA'

        ########################### UPDATE CONNECTOR  WITHOUT PASSING ID ###############################
        connector_id=response.json()['id']
        id_pk=uuid.uuid4()
        extract_connector_data={
             "user":str(self.participant.id),
                    "name":response.json()["name"],
                    "description":response.json()["description"],
                    "integrated_file":response.json()["integrated_file"],
                    "maps":json.dumps([{
                            "condition":{
                                "how":"outer",
                                "left_on":["Age"],
                                "right_on":["Age"],
                                "left_selected": ["First Name",
                                    "Gender",
                                    "Age", ],
                                "right_selected": ["Last Name",
                                    "Gender",
                                    "Country",
                                    "Age", ]
                            },
                            "left_dataset_file":str(self.datasetv2_file_pr1.id),
                            "right_dataset_file":str(self.datasetv2_file_pr1.id)}])
                }
        extract_connector_data.update({'description': 'UPDATED DATAAAAAAAAAAAAAA 123'})      
        params=f'{connector_id}/?user={self.participant.id}&co_steward=false'   
        updated_response = self.user_participant.put(self.connectors_url+params,extract_connector_data,content_type='application/json') 
        assert updated_response.status_code == 200
        retrive_response = self.user_participant.get(self.connectors_url+params)
        assert len(retrive_response.json().get("maps")) == 2

    ############ APPENDING ONE MORE MAP DATA######### 
        new_row={
            "condition":{
                "how":"outer",
                "left_on":["Age"],
                "right_on":["Age"],
                "left_selected": [
                    "Gender",
                    "Age", ],
                "right_selected": ["Last Name",
                    "Gender",
                    "Country",
                    "Age", ]
            },
            "left_dataset_file":str(self.datasetv2_file_pr1.id),
            "left_dataset_file_path": str(self.datasetv2_file_pr1.file),
            "right_dataset_file":str(self.datasetv2_file_pr1.id),
            "right_dataset_file_path":str(self.datasetv2_file_pr1.file)
        }
        maps_data = json.loads(create_connector_two["maps"])
        maps_data.append(new_row)
        create_connector_two["maps"] = json.dumps(maps_data)
        create_connector_two["integrated_file"]=open("connectors/tests/test_files/file_example_XLS_50.xls","rb") 
        url=self.connectors_url+'integration/?edit=True'
        params=f'?user={self.participant.id}&co_steward=false'
        response = self.user_participant.post(url+params, create_connector_two)  
        response_data_second = response.json()
        assert response.status_code == 200
   
        create_connector_two["description"]= "description updated"
        create_connector_two["integrated_file"]=response_data_second["integrated_file"]     
        maps=json.loads(create_connector_two["maps"])
        id=created_data['id']
        params=f'{id}/?user={self.participant.id}&co_steward=false'   
        updated_response = self.user_participant.put(self.connectors_url+params,create_connector_two,content_type='application/json')    
        assert updated_response.status_code == 200
        assert updated_response.json()["description"]=="description updated"


    #################### GET API CALL(LISTING) ###################
        params=f'?user={self.participant.id}&co_steward=false'
        response = self.user_participant.get(self.connectors_url+params)
        assert response.status_code == 200 
        assert response.json()["results"][0]['dataset_count']==5
        assert response.json()["results"][0]['providers_count']==1


    ################ Negative test cases ######################

    def test_update_connector_description_exceeding_512_chars(self):   
        params=f'{self.connector_id}/?user={self.admin.id}&co_steward=false'
        response = self.client_admin.get(self.connectors_url+params) 
        response_data=response.json()
        extract_connector_data={
            'name':response_data['name'],
            'description':response_data["description"],
            'integrated_file':response_data['integrated_file'],
            'status':response_data['status'],
        }
        extract_connector_data.update({'description': 'A dataset is a structured collection of data that is organized and presented in a specific format for use in analysis, research, or other purposes. Datasets can come in various forms, such as tables, spreadsheets, text files, images, videos, audio recordings, and more. They are a fundamental component in the field of data science, machine learning, and artificial intelligence as they serve as the raw material for training models, making predictions, and extracting insights.A dataset is a structured collection of data that is organized and presented in a specific form'})
        params=f'{self.connector_id}/?user={self.admin.id}&co_steward=false'
        updated_response = self.client_admin.put(self.connectors_url+params,extract_connector_data,content_type='application/json') 
        assert updated_response.status_code == 400
        assert updated_response.json()=={'description': ['Ensure this field has no more than 512 characters.']}

    def test_get_connector_invalid_id_handling(self):
        params=f'{self.agri_connector_hub_map_id}/?user={self.admin.id}&co_steward=false'
        response = self.client_admin.get(self.connectors_url+params)
        response_data = response.json()
        assert response.status_code == 400
        assert response_data=='No Connectors matches the given query.'

    def test_create_connector_existing_name_check(self):
        data={
            "name":"connector hub",
            "description":create_connector_two["description"],
            "integrated_file":connector_details["integrated_file"],
            "maps":json.dumps([{
            "condition":{
                "how":"outer",
                "left_on":["Age"],
                "right_on":["Age"],
                "left_selected": ["First Name",
                    "Gender",
                    "Age", ],
                "right_selected": ["Last Name",
                    "Gender",
                    "Country",
                    "Age", ]
            },"left_dataset_file":str(self.datasetv2_file_pr1.id),
            "right_dataset_file":str(self.datasetv2_file_pr1.id),
            "left_dataset_file_path": str(self.datasetv2_file_pr1.file),
            "right_dataset_file_path":str(self.datasetv2_file_pr1.file),
            }]),
        }
        response = self.user_participant.post(self.connectors_url, data)       
        created_data = response.json()
        assert response.status_code == 400
        assert created_data=={'name': ['connectors with this name already exists.'], 'user': ['This field is required.']}
 
    def test_get_list_of_invalid_user_id(self):
        response = self.dummy.get(self.connectors_url)
        assert response.status_code == 401
        assert response.json()=={'message': 'Invalid auth credentials provided.'}