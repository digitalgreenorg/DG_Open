import email
from unicodedata import category
from rest_framework.reverse import reverse
from django.test import Client, TestCase
# from rest_framework import status
import json
from unicodedata import category

from django.core.files.base import File
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, TestCase
from rest_framework.reverse import reverse

from accounts.models import User, UserRole
from connectors.models import Connectors, ConnectorsMap
from datahub.models import (
    DatasetV2,
    DatasetV2File,
    Organization,
    UsagePolicy,
    UserOrganizationMap,
)
from datahub.views import UsagePolicyListCreateView

# from connectors.models import Connectors, ConnectorsMap
from participant.tests.test_util import TestUtils

first_datasets_dump_data = {
    "name": "dump_datasets 1",
    "description": "dataset description 1",
    "geography": "tpt 1",
    "constantly_update": False,
}
second_datasets_dump_data = {
    "name": "dump_datasets 2",
    "description": "dataset description 2",
    "geography": "tpt 2",
    "constantly_update": False,
}
third_datasets_dump_data = {
    "name": "dump_datasets 3",
    "description": "dataset description 3",
    "geography": "tpt 3",
    "constantly_update": False,
}
auth = {
    "token": "null"
}
auth_co_steward = {
    "token": "null"
}
auth_participant= {
    "token": "null"
}

class TestCasesDatasets(TestCase):
    """test cases for dataset details and request for access of datasets""" 
    def setUp(self) -> None:
        self.user=Client()
        self.client_admin = Client()
        self.dataset_url=reverse("dataset/v2-list")
        self.dataset_files_url=reverse("dataset_files-list")
        self.dataset_request=reverse("datasets/v2-list")
        #create user role
        self.admin_role = UserRole.objects.create(
                        id= "1",
                        role_name= "datahub_admin"
                        )
        #create users
        self.admin_user1 = User.objects.create(
                        email= "admin1@dgreen.org",
                        role_id= self.admin_role.id,
                        )
        self.admin_user2 = User.objects.create(
                        email= "admin2@dg.org",
                        role_id= self.admin_role.id,
                        )
        self.admin_user3 = User.objects.create(
                        email= "admin3@dg.org",
                        role_id= self.admin_role.id,
                        )
        #create organizations
        self.admin_org1 = Organization.objects.create(
                        org_email= "admin1_org@dg.org",
                        name= "admin org1",
                        phone_number= "+91 99876-62188",
                        website= "htttps://google.com",
                        address= ({"city": "Banglore"}),
                        )
        self.admin_org2 = Organization.objects.create(
                        org_email= "admin2_org@dg.org",
                        name= "admin org2",
                        phone_number= "+91 66666-62188",
                        website= "htttps://google.com",
                        address= ({"city": "LA"}),
                        )
        self.admin_org3 = Organization.objects.create(
                        org_email= "admin3_org@dg.org",
                        name= "admin org3",
                        phone_number= "+91 99999-62188",
                        website= "htttps://google.com",
                        address= ({"city": "London"}),
                        )
        #create user map
        self.admin_map1 = UserOrganizationMap.objects.create(
                                        user_id= self.admin_user1.id,
                                        organization_id= self.admin_org1.id,
                                        )
        self.admin_map2 = UserOrganizationMap.objects.create(
                                        user_id= self.admin_user2.id,
                                        organization_id= self.admin_org2.id,
                                        )
        self.admin_map3 = UserOrganizationMap.objects.create(
                                        user_id= self.admin_user3.id,
                                        organization_id= self.admin_org3.id,
                                        )
        #admin token
        auth["token"] = TestUtils.create_token_for_user(self.admin_user1, self.admin_map1)
        auth["token"] = TestUtils.create_token_for_user(self.admin_user2, self.admin_map2)
        auth["token"] = TestUtils.create_token_for_user(self.admin_user3, self.admin_map3)
        admin_header= self.set_auth_headers()
        self.client_admin.defaults['HTTP_AUTHORIZATION'] = admin_header[0]
        self.client_admin.defaults['CONTENT_TYPE'] = admin_header[1]
        #create data set
        self.first_dataset = DatasetV2.objects.create( user_map=self.admin_map1,
                                                **first_datasets_dump_data)
        self.dataset_id1 = self.first_dataset.id
        self.second_dataset = DatasetV2.objects.create( user_map=self.admin_map2,
                                                **second_datasets_dump_data)
        self.dataset_id2 = self.second_dataset.id
        self.third_dataset = DatasetV2.objects.create( user_map=self.admin_map3,
                                                **third_datasets_dump_data)
        self.dataset_id3 = self.third_dataset.id
        #create datasetv2 file
        file_data1 = {
            "dataset": str(self.first_dataset.id),
            "file" : open("datahub/tests/test_data/file.xls", "rb"),
            "source": "file",
        }
        response1 = self.client_admin.post(self.dataset_files_url, file_data1)
        # print("file------>", response1.json())
        file_data2 = {
            "dataset": str(self.first_dataset.id),
            "file" : open("datahub/tests/test_data/file_example_XLS_10.xls", "rb"),
            "source": "file",
            "accessibility": "private",
        }
        self.response2 = self.client_admin.post(self.dataset_files_url, file_data2)
        file_data3 = {
            "dataset": str(self.second_dataset.id),
            "file" : open("datahub/tests/test_data/file.xls", "rb"),
            "source": "file",
            "accessibility": "private",
        }
        self.response3 = self.client_admin.post(self.dataset_files_url, file_data3)
        
    def set_auth_headers(self,participant=False, co_steward=False):  
        """ authorization """
        auth_data = auth_participant if participant else (auth_co_steward if co_steward else auth)
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_data["token"]}'
        }
        return headers['Authorization'],headers['Content-Type']
    
    #test case for get method w/o usage_policy(valid case)
    def test_dataset_retrieve_valid_self(self):
        """ retrieving self dataset details by admin1 user"""
        response = self.client_admin.get(self.dataset_url+f"{self.dataset_id1}/")
        data = response.json()
        # print("***test_dataset_retrieve_valid_self***", data)
        # print("***test_dataset_retrieve_valid_self***", response.status_code)
        assert response.status_code == 200
        assert data['name'] == first_datasets_dump_data['name']
        assert data['description'] == first_datasets_dump_data['description']
        assert data['datasets'][0]['file'] == 'protected/datasets/dump_datasets 1/file/file.xls'
        #asserting column for file
        content_column = data['datasets'][0]['content'][0]
        keys_to_check_left = list(content_column.keys())
        keys_to_check_right = ['SR.', 'NAME', 'GENDER', 'AGE', 'DATE ', 'COUNTRY']
        # Compare the keys
        assert keys_to_check_left == keys_to_check_right
        
    #test case for get method w/o usage_policy(valid case)
    def test_dataset_retrieve_valid_other(self):
        """ retrieving other dataset details by admin2 user """
        # self.user_map = self.admin_map2.id
        params= f'{self.dataset_id1}/?user_map={self.admin_map2.id}'
        response = self.client_admin.get(self.dataset_url+params)
        data = response.json()
        # print("***test_dataset_retrieve_valid_other***", data)
        # print("***test_dataset_retrieve_valid_other***", response.status_code)
        assert response.status_code == 200
        assert data['name'] == first_datasets_dump_data['name']
        assert data['description'] == first_datasets_dump_data['description']
        
    #test case for get method usage_policy(valid case)
    def test_dataset_retrieve_usage_policy_one_req(self):
        """ retrieving self dataset details by admin1 user"""
        file2_id= self.response2.json()['id']
        self.usage_policy1 = UsagePolicy.objects.create(dataset_file_id= file2_id,
                                                       user_organization_map=self.admin_map2)
        #retrieving admin1 dataset to check requested file in self
        response = self.client_admin.get(self.dataset_url+f"{self.dataset_id1}/")
        data = response.json()
        # print("***test_dataset_retrieve_usage_policy***", data)
        # print("***test_dataset_retrieve_usage_policy***", response.status_code)
        assert response.status_code == 200
        assert data['datasets'][1]['usage_policy'][0]['organization']['org_email'] == 'admin2_org@dg.org'

        #retrieving admin2 dataset to check requested check in other
        params= f'{self.dataset_id1}/?user_map={self.admin_map2.id}'
        response = self.client_admin.get(self.dataset_url+params)
        data = response.json()
        # print("***test_dataset_retrieve_usage_policy***", data)
        # print("***test_dataset_retrieve_usage_policy***", response.status_code)
        assert response.status_code == 200
        assert data['datasets'][1]['usage_policy']['organization']['org_email'] == 'admin2_org@dg.org'
        assert data['datasets'][1]['usage_policy']['approval_status'] == 'requested'
        
        #requesting for admin3
        self.usage_policy2 = UsagePolicy.objects.create(dataset_file_id= file2_id,
                                                       user_organization_map=self.admin_map3)
        #retrieving admin1 dataset to check requested file in self
        response = self.client_admin.get(self.dataset_url+f"{self.dataset_id1}/")
        data = response.json()
        # print("***test_dataset_retrieve_usage_policy***", data)
        # print("***test_dataset_retrieve_usage_policy***", response.status_code)
        assert response.status_code == 200
        assert data['datasets'][1]['usage_policy'][1]['organization']['org_email'] == 'admin3_org@dg.org'

        #retrieving admin3 dataset to check requested check in other
        params= f'{self.dataset_id1}/?user_map={self.admin_map3.id}'
        response = self.client_admin.get(self.dataset_url+params)
        data = response.json()
        # print("***test_dataset_retrieve_usage_policy***", data)
        # print("***test_dataset_retrieve_usage_policy***", response.status_code)
        assert response.status_code == 200
        assert not data['datasets'][1]['usage_policy']['organization']['org_email'] == 'admin2_org@dg.org'
        assert data['datasets'][1]['usage_policy']['organization']['org_email'] == 'admin3_org@dg.org'
        assert data['datasets'][1]['usage_policy']['approval_status'] == 'requested'
        
    #test case for request api(valid case)
    def test_request_dataset_receive_send(self):
        """ REQUEST API- requesting file access for both admin1 and admin2 """
        #admin2 requesting for file2 access
        file2_id= self.response2.json()['id']
        UsagePolicy.objects.create(dataset_file_id= file2_id,
                                    user_organization_map=self.admin_map2)
        #admin1 requesting for file3 access
        file3_id= self.response3.json()['id']
        UsagePolicy.objects.create(dataset_file_id= file3_id,
                                    user_organization_map=self.admin_map1)
        #admin3 requesting for file2 access
        UsagePolicy.objects.create(dataset_file_id= file2_id,
                                    user_organization_map=self.admin_map3)
        data_user = {
            "user_map": self.admin_map1.id
        }
        response = self.client_admin.post(self.dataset_request+"requested_datasets/", data_user)
        data = response.json()
        # print("***test_request_dataset_receive_send***", response.status_code)
        # print("***test_request_dataset_receive_send***", data)
        assert response.status_code == 200
        assert data['recieved'][0]['organization_email'] == 'admin3_org@dg.org'
        assert data['recieved'][1]['organization_email'] == 'admin2_org@dg.org'
        assert data['sent'][0]['organization_email'] == 'admin2_org@dg.org'
    
    # invalid case
    def test_request_dataset_invalid(self):
        """ invalid user map request-dataset """
        file2_id= self.response2.json()['id']
        UsagePolicy.objects.create(dataset_file_id= file2_id,
                                    user_organization_map=self.admin_map2)
        file3_id= self.response3.json()['id']
        UsagePolicy.objects.create(dataset_file_id= file3_id,
                                    user_organization_map=self.admin_map1)
        data_user = {
            "user_map": "123"
        }
        response = self.client_admin.post(self.dataset_request+"requested_datasets/", data_user)
        data = response.json()
        # print("***test_request_dataset_invalid***", response.status_code)
        # print("***test_request_dataset_invalid***", data)
        assert response.status_code == 500
        assert data == f"Issue while Retrive requeted data ['“{data_user['user_map']}” is not a valid UUID.']"
        
first_datasets = {
    "name": "dataset dash 1",
    "description": "dataset dash desc 1",
    "geography": "tpt 1",
    "constantly_update": False,
    "is_temp": False,
    "category": ({"category dash": ["dashboard category"]}),
}
second_datasets = {
    "name": "dataset dash 2",
    "description": "dataset dash desc 2",
    "geography": "tpt 2",
    "constantly_update": False,
    "is_temp": False,
    "category": ({"category dash": ["dashboard category"]}),
}
third_datasets = {
    "name": "dataset dash 3",
    "description": "dataset dash desc 3",
    "geography": "tpt 3",
    "constantly_update": False,
    "is_temp": False,
    "category": ({"category dash": ["dashboard category"]}),
}
fourth_datasets = {
    "name": "dataset dash 4",
    "description": "dataset dash desc 4",
    "geography": "tpt 3",
    "constantly_update": False,
    "is_temp": False,
    "category": ({"category dash": ["dashboard category"]}),
}
connectors_info1 ={
    'name':'connector hub 1',
    "description":'connector 1 desc',
}
connectors_info2 ={
    'name':'connector hub 2',
    "description":'connector 2 desc',
}
datasetOnepr = {
     "name": "participant dataset 1",
    "description": "part description 1",
    "geography": "tpt",
    "constantly_update": False,
    "is_temp": False,
    "category": ({"category dash": ["dashboard category"]}),
}
datasetTwopr = {
     "name": "participant dataset 2",
    "description": "part description 2",
    "geography": "tpt",
    "constantly_update": False,
}

class TestCasesDashboard(TestCase):
    """test cases for dashboard """ 
    @classmethod
    def setUpClass(self) -> None:
        super().setUpClass()
        self.user=Client()
        self.client_admin = Client()
        self.client_participant=Client()
        self.dataset_url=reverse("dataset/v2-list")
        self.dataset_files_url=reverse("dataset_files-list")
        self.dashboard_url = reverse("new_dashboard-dashboard")
        self.admin_role = UserRole.objects.create(
                        id= "1",
                        role_name= "datahub_admin"
                        )
        self.participant_role = UserRole.objects.create(
                        id=3,
                        role_name="datahub_participant_root")
        self.admin_user2 = User.objects.create(
                            email= "admin2@dgreen.org",
                            role_id= self.admin_role.id,
                            )
        self.admin_org2 = Organization.objects.create(
                        org_email= "admin2_org@dg.org",
                        name= "admin org2",
                        phone_number= "+91 99000-62188",
                        website= "htttps://google.com",
                        address= ({"city": "Banglore"}),
                        )
        self.admin_map2 = UserOrganizationMap.objects.create(
                                        user_id= self.admin_user2.id,
                                        organization_id= self.admin_org2.id,
                                        )
        self.admin_user1 = User.objects.create(
                        email= "admin1@dgreen.org",
                        role_id= self.admin_role.id,
                        )
        self.participant_user1 = User.objects.create(
                                email= "participant@digitalgreen.org",
                                role_id= self.participant_role.id,
                                # on_boarded_by=self.co_steward      
                                )
        self.admin_org1 = Organization.objects.create(
                        org_email= "admin1_org@dg.org",
                        name= "admin org1",
                        phone_number= "+91 99876-62188",
                        website= "htttps://google.com",
                        address= ({"city": "Banglore"}),
                        )
        self.participant_org = Organization.objects.create(
                                org_email="part_org@dg.org",
                                name="part org1",
                                phone_number="5678909876",
                                website="htttps://google.com",
                                address=json.dumps({"city": "Banglore"}),
                                ) 
        self.admin_map1 = UserOrganizationMap.objects.create(
                                        user_id= self.admin_user1.id,
                                        organization_id= self.admin_org1.id,
                                        )
        self.participant_map = UserOrganizationMap.objects.create(
                                user_id = self.participant_user1.id,
                                organization_id = self.participant_org.id)
        #admin auth
        auth["token"] = TestUtils.create_token_for_user(self.admin_user1, self.admin_map1)
        # auth["token"] = TestUtils.create_token_for_user(self.admin_user2, self.admin_map2)
        admin_header= self.set_auth_headers(self=self)
        self.client_admin.defaults['HTTP_AUTHORIZATION'] = admin_header[0]
        self.client_admin.defaults['CONTENT_TYPE'] = admin_header[1]
        #participant auth
        auth_participant["token"] = TestUtils.create_token_for_user(
                                    self.participant_user1, self.participant_map)
        participant_header= self.set_auth_headers(self=self, participant=True)
        self.client_participant.defaults['HTTP_AUTHORIZATION'] = participant_header[0]
        self.client_participant.defaults['CONTENT_TYPE'] = participant_header[1]
        #admin2
        self.fourth_dataset = DatasetV2.objects.create( user_map=self.admin_map2,
                                                       **fourth_datasets)
        self.dataset_id4 = self.fourth_dataset.id
        self.left_dataset_pr = DatasetV2.objects.create(
                            user_map=self.participant_map, **datasetOnepr)
        file_data3 = {
            "dataset": str(self.fourth_dataset.id),
            "file" : open("datahub/tests/test_data/file.xls", "rb"),
            "source": "file",
        }
        self.response_file3 = self.client_admin.post(self.dataset_files_url, file_data3)
        file_data4 = {
            "dataset": str(self.fourth_dataset.id),
            "file" : open("datahub/tests/test_data/file_example_XLS_10.xls", "rb"),
            "source": "file",
            "accessibility": "private",
        }
        self.response_file4 = self.client_admin.post(self.dataset_files_url, file_data4)
        connector_cs2 = Connectors.objects.create(user_id=self.admin_user2.id,
                                                 **connectors_info2)
        connector_map_cs2 = ConnectorsMap.objects.create(connectors_id=connector_cs2.id,
                            left_dataset_file_id = self.response_file3.json()['id'],
                            right_dataset_file_id = self.response_file4.json()['id'])
        #admin1
        self.first_dataset = DatasetV2.objects.create( user_map=self.admin_map1,
                                                **first_datasets)
        self.second_dataset = DatasetV2.objects.create( user_map=self.admin_map1,
                                                **second_datasets)
        self.dataset_id2 = self.second_dataset.id
        self.third_dataset = DatasetV2.objects.create( user_map=self.admin_map1,
                                                **third_datasets)
        self.dataset_id3 = self.third_dataset.id
        file_data1 = {
            "dataset": str(self.first_dataset.id),
            "file" : open("datahub/tests/test_data/file.xls", "rb"),
            "source": "file",
        }
        self.response_file1 = self.client_admin.post(self.dataset_files_url, file_data1)
        file_data2 = {
            "dataset": str(self.first_dataset.id),
            "file" : open("datahub/tests/test_data/file_example_XLS_10.xls", "rb"),
            "source": "file",
            "accessibility": "private",
        }
        self.response_file2 = self.client_admin.post(self.dataset_files_url, file_data2)
        connector_cs1 = Connectors.objects.create(user_id=self.admin_user1.id,
                                                 **connectors_info1)
        connector_map_cs1 = ConnectorsMap.objects.create(connectors_id=connector_cs1.id,
                            left_dataset_file_id = self.response_file1.json()['id'],
                            right_dataset_file_id = self.response_file2.json()['id'])
        
     
    def set_auth_headers(self, participant=False, co_steward=False):  
        """ authorization """
        auth_data = auth_participant if participant else (auth_co_steward if co_steward else auth)
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_data["token"]}'
        }
        return headers['Authorization'],headers['Content-Type']
    
    #test case for admin1 my_org for dashboard
    def test_dashboard_admin_myorg_valid(self):
        """ retrieving dashboard details by admin1 user for myorg """
        data = {
            "my_org": True
        }
        response = self.client_admin.get(self.dashboard_url, data)
        data = response.json()
        user_data = data['user']
        org_email = user_data['org_email']
        # print("***test_dashboard_admin_myorg_valid***", data)
        # print("***test_dashboard_admin_myorg_valid***", response.status_code)
        assert response.status_code == 200
        assert org_email == 'admin1_org@dg.org'
        assert data['total_participants']['participants_count'] == 1
        assert data['dataset_file_metrics'][0]['file_count'] == 2
        assert data['total_dataset_count'] == 3
        assert data['dataset_category_metrics']['category dash'] == 3
        assert data['recent_datasets'][0]['id'] == str(self.dataset_id3)
        assert data['total_connectors_count'] == 1
        assert data['recent_connectors'][0]['providers_count'] == 1
        assert data['recent_connectors'][0]['name'] == connectors_info1['name']
        
    #test case for admin1 for other org in dashboard
    def test_dashboard_admin_other_valid(self):
        """ retrieving dashboard details for admin1 user in other org """
        response = self.client_admin.get(self.dashboard_url)
        data = response.json()
        user_data = data['user']
        org_email = user_data['org_email']
        # print("***test_dashboard_admin_other_valid***", data)
        # print("***test_dashboard_admin_other_valid***", response.status_code)
        assert response.status_code == 200
        assert org_email == 'admin1_org@dg.org'
        assert data['total_participants']['participants_count'] == 1
        assert data['total_dataset_count'] == 5
        assert data['dataset_file_metrics'][0]['file_count'] == 4
        assert data['dataset_category_metrics']['category dash'] == 5
        assert data['total_connectors_count'] == 1
        
    #test case for participant for dashboard
    def test_dashboard_participant_valid(self):
        """ retrieving dashboard details by participant"""
        data = {
            "my_org": True
        }
        response = self.client_participant.get(self.dashboard_url, data)
        data = response.json()
        user_data = data['user']
        org_email = user_data['org_email']
        # print("***test_dashboard_participant_valid***", data)
        # print("***test_dashboard_participant_valid***", response.status_code)
        assert response.status_code == 200
        assert org_email == 'part_org@dg.org'
        assert data['total_dataset_count'] == 1
        assert data['dataset_category_metrics']['category dash'] == 1
        assert data['total_connectors_count'] == 0
        
        
        
class TestCasesUsagePolicy(TestCase):
    """test cases for usage policy """ 
    @classmethod
    def setUpClass(self) -> None:
        super().setUpClass()
        self.user=Client()
        self.client_admin = Client()
        # self.client_participant=Client()
        self.dataset_url=reverse("dataset/v2-list")
        self.dataset_files_url=reverse("dataset_files-list")
        self.usage_policy_url=reverse("usage-policy-list-create")
        self.dataset_request=reverse("datasets/v2-list")
        # self.dashboard_url = reverse("new_dashboard-dashboard")
        self.admin_role = UserRole.objects.create(
                            id= "1",
                            role_name= "datahub_admin"
                            )
        self.participant_role = UserRole.objects.create(
                        id=3,
                        role_name="datahub_participant_root")
        self.admin_user1 = User.objects.create(
                            email= "admin1@dgreen.org",
                            role_id= self.admin_role.id,
                            )
        self.admin_org1 = Organization.objects.create(
                            org_email= "admin1_org@dg.org",
                            name= "admin org1",
                            phone_number= "+91 99876-62188",
                            website= "htttps://google.com",
                            address= ({"city": "Banglore"}),
                            )
        self.admin_map1 = UserOrganizationMap.objects.create(
                                        user_id= self.admin_user1.id,
                                        organization_id= self.admin_org1.id,
                                        )
        self.admin_user2 = User.objects.create(
                            email= "admin2@dgreen.org",
                            role_id= self.admin_role.id,
                            )
        self.admin_org2 = Organization.objects.create(
                        org_email= "admin2_org@dg.org",
                        name= "admin org2",
                        phone_number= "+91 99000-62188",
                        website= "htttps://google.com",
                        address= ({"city": "Banglore"}),
                        )
        self.admin_map2 = UserOrganizationMap.objects.create(
                                        user_id= self.admin_user2.id,
                                        organization_id= self.admin_org2.id,
                                        )
        self.participant_user1 = User.objects.create(
                                email= "participant@digitalgreen.org",
                                role_id= self.participant_role.id,
                                # on_boarded_by=self.co_steward      
                                )
        self.participant_org1 = Organization.objects.create(
                                org_email="part_org@dg.org",
                                name="part org1",
                                phone_number="5678909876",
                                website="htttps://google.com",
                                address=json.dumps({"city": "Banglore"}),
                                ) 
        self.participant_map1 = UserOrganizationMap.objects.create(
                                user_id = self.participant_user1.id,
                                organization_id = self.participant_org1.id)
        #admin auth
        auth["token"] = TestUtils.create_token_for_user(self.admin_user1, self.admin_map1)
        # auth["token"] = TestUtils.create_token_for_user(self.admin_user2, self.admin_map2)
        admin_header= self.set_auth_headers(self=self)
        self.client_admin.defaults['HTTP_AUTHORIZATION'] = admin_header[0]
        self.client_admin.defaults['CONTENT_TYPE'] = admin_header[1]
        #admin1
        self.first_dataset = DatasetV2.objects.create( user_map=self.admin_map1,
                                                **first_datasets)
        self.second_dataset = DatasetV2.objects.create( user_map=self.admin_map2,
                                                **second_datasets)
        self.third_dataset = DatasetV2.objects.create( user_map=self.participant_map1,
                                                **third_datasets)
        file_data1 = {
            "dataset": str(self.first_dataset.id),
            "file" : open("datahub/tests/test_data/file.xls", "rb"),
            "source": "file",
        }
        self.response_file1 = self.client_admin.post(self.dataset_files_url, file_data1)
        file_data2 = {
            "dataset": str(self.second_dataset.id),
            "file" : open("datahub/tests/test_data/file_example_XLS_10.xls", "rb"),
            "source": "file",
            "accessibility": "private",
        }
        self.response_file2 = self.client_admin.post(self.dataset_files_url, file_data2)
        file_data3 = {
            "dataset": str(self.third_dataset.id),
            "file" : open("datahub/tests/test_data/file.xls", "rb"),
            "source": "file",
            "accessibility": "private",
        }
        self.response_file3 = self.client_admin.post(self.dataset_files_url, file_data3)
        
    def set_auth_headers(self, participant=False, co_steward=False):  
        """ authorization """
        auth_data = auth_participant if participant else (auth_co_steward if co_steward else auth)
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_data["token"]}'
        }
        return headers['Authorization'],headers['Content-Type']
    
    #valid test case
    def test_usage_policy_valid(self):
        """ valid usage policy creation for api access where type is dataset_file """
        usage_policy_valid = {
            "dataset_file": self.response_file1.json()['id'],
            "user_organization_map": self.admin_map1.id,
        }
        response = self.client_admin.post(self.usage_policy_url, usage_policy_valid)
        data = response.json()
        # print("***test_usage_policy_valid***", response.status_code)
        # print("***test_usage_policy_valid***", data)
        assert response.status_code == 201
        assert data['dataset_file'] == self.response_file1.json()['id']
        assert data['user_organization_map'] == str(self.admin_map1.id)
        assert data['api_key'] is None
        assert data['type'] == 'dataset_file'
        
    def test_usage_policy_valid_api(self):
        """ valid usage policy creation for api access where type is api """
        usage_policy_valid = {
            "dataset_file": self.response_file1.json()['id'],
            "user_organization_map": self.admin_map2.id,
            "type": "api",
        }
        response1 = self.client_admin.post(self.usage_policy_url, usage_policy_valid)
        data1 = response1.json()
        # print("***test_usage_policy_valid_api***", data1)
        assert response1.status_code == 201
        assert data1['dataset_file'] == self.response_file1.json()['id']
        assert data1['user_organization_map'] == str(self.admin_map2.id)
        assert data1['type'] == 'api'
        
        usage_policy_valid = {
            "dataset_file": self.response_file1.json()['id'],
            "user_organization_map": self.participant_map1.id,
            "type": "api",
        }
        response2 = self.client_admin.post(self.usage_policy_url, usage_policy_valid)
        data_user = {
            "user_map": self.admin_map1.id,
            "type": "api",
            "dataset_file": self.response_file1.json()['id'],
        }
        
        response3 = self.client_admin.post(self.dataset_request+"requested_datasets/", data_user)
        data3 = response3.json()
        # print("file_id", self.response_file1.json()['id'])
        # print("***test_usage_policy_valid_api***", response3.status_code)
        # print("***test_usage_policy_valid_api***", data3)
        assert response3.status_code == 200
        assert data3['recieved'][0]['file_name'] == 'file.xls'
        assert data3['recieved'][0]['organization']['org_email'] == 'part_org@dg.org'
        assert data3['recieved'][1]['organization']['org_email'] == 'admin2_org@dg.org'
        # assert data3['sent'][0]['organization_email'] == 'admin2_org@dg.org'
        
    #invalid test case
    def test_usage_policy_invalid(self):
        """ invalid usage policy creation for api access """
        #empty request
        response = self.client_admin.post(self.usage_policy_url)
        data = response.json()
        # print("***test_usage_policy_invalid***", response.status_code)
        # print("***test_usage_policy_invalid***", data)
        assert response.status_code == 400
        assert data['dataset_file'] == ['This field is required.']
        assert data['user_organization_map'] == ['This field is required.']
        
        #invalid user_map
        usage_policy_invalid = {
            "dataset_file": self.response_file1.json()['id'],
            "user_organization_map": "123",
        }
        
        response = self.client_admin.post(self.usage_policy_url, usage_policy_invalid)
        data = response.json()
        # print("***test_usage_policy_invalid***", response.status_code)
        # print("***test_usage_policy_invalid***", data)
        assert response.status_code == 400
        assert data['user_organization_map'] == ['“123” is not a valid UUID.']
        
        #invalid dataset_file
        usage_policy_invalid = {
            "dataset_file": "123",
            "user_organization_map": self.admin_map1.id,
        }
        
        response = self.client_admin.post(self.usage_policy_url, usage_policy_invalid)
        data = response.json()
        # print("***test_usage_policy_invalid***", response.status_code)
        # print("***test_usage_policy_invalid***", data)
        assert response.status_code == 400
        assert data['dataset_file'] == ['“123” is not a valid UUID.']
        
        #invalid choice for type
        usage_policy_invalid = {
            "dataset_file": self.response_file1.json()['id'],
            "user_organization_map": self.admin_map1.id,
            "type": "hrjkfjrjhrfjkhrfkjf123",
        }
        
        response = self.client_admin.post(self.usage_policy_url, usage_policy_invalid)
        data = response.json()
        # print("***test_usage_policy_invalid***", response.status_code)
        # print("***test_usage_policy_invalid***", data)
        assert response.status_code == 400
        assert data['type'] == ['"hrjkfjrjhrfjkhrfkjf123" is not a valid choice.']
        
        #invalid length api_key
        usage_policy_invalid = {
            "dataset_file": self.response_file1.json()['id'],
            "user_organization_map": self.admin_map1.id,
            "api_key": "f150b6c-19a1-4bb8-8d2-9116f5172aa2-f150b6c-19a1-4bb8-8d2-9116f5172aa2",
        }
        
        response = self.client_admin.post(self.usage_policy_url, usage_policy_invalid)
        data = response.json()
        # print("***test_usage_policy_invalid***", response.status_code)
        # print("***test_usage_policy_invalid***", data)
        assert response.status_code == 400
        assert data['api_key'] == ['Ensure this field has no more than 64 characters.']
        