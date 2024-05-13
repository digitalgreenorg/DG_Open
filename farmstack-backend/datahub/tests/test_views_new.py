import json
import uuid
from turtle import st

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User, UserRole
from datahub.models import Organization, StandardisationTemplate, UserOrganizationMap


class TestViews(APITestCase):
    
    # Create your tests here.
    def setUp(self) -> None:
        self.client = APIClient()
        self.datahub_stardardise_url = reverse("standardise-list")
        datapoint_attributes_data = {
                    "data_attribute1": "",
                    "data_attribute2": ""
                }
        StandardisationTemplate.objects.create(
            datapoint_category= "farmers info",
            datapoint_description= "farmer details is here",
            datapoint_attributes= datapoint_attributes_data
            )
        StandardisationTemplate.objects.create(
            datapoint_category= "farmers 2",
            datapoint_description= "farmer 2 details is here",
            datapoint_attributes= []
            )
        user_role_admin = UserRole.objects.create(
            id="1",
            role_name="datahub_admin"
        )

        user_role_participant = UserRole.objects.create(
            id="3",
            role_name="datahub_participant_root"
        )

        user_role_co_steward = UserRole.objects.create(
            id="6",
            role_name="datahub_co_steward"
        )

        user = User.objects.create(
            first_name="SYSTEM",
            last_name="ADMIN",
            email="admin@gmail.com",
            role_id=user_role_admin.id,
        )

        organization = Organization.objects.create(
            name="Some Organization",
            org_email="org@gmail.com",
            address="{}",
        )

        user_map = UserOrganizationMap.objects.create(
            user_id=user.id,
            organization_id=organization.id
        )
        auth = {}

        refresh = RefreshToken.for_user(user)
        refresh["org_id"] = str(user_map.organization_id) if user_map else None
        refresh["map_id"] = str(user_map.id) if user_map else None
        refresh["role"] = str(user.role_id)
        refresh["onboarded_by"] = str(user.on_boarded_by_id)

        refresh.access_token["org_id"] = str(user_map.organization_id) if user_map else None
        refresh.access_token["map_id"] = str(user_map.id) if user_map else None
        refresh.access_token["role"] = str(user.role_id)
        refresh.access_token["onboarded_by"] = str(user.on_boarded_by_id)
        auth["token"] = refresh.access_token

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
    #test case for create method(valid case)        
    def test_stardardise_create_valid(self):
        stardardise_valid_data = [
            {
            "datapoint_category": "farmers",
            "datapoint_description": "farmer details is here"
        }]
        response = self.client.post(self.datahub_stardardise_url, json.dumps(stardardise_valid_data), content_type="application/json",secure=True)
        data = response.json()
        # print("***test_stardardise_create_valid data***", data[0])
        # print("***test_stardardise_create_valid status_code***", response.status_code)
        assert response.status_code == 201
        assert data[0]['datapoint_category'] == stardardise_valid_data[0]["datapoint_category"]
        
    #test case for create method(invalid case)        
    def test_stardardise_create_invalid_length_category(self):
        datapoint_attributes_data = {
                    "data_attribute1": "",
                    "data_attribute2": ""
                }
        datapoint_category_invalid_data = [{
                "datapoint_category": "farmersinfonvefjhfjhfjfjfjhfjffffffiurnnnfurrfmnjfnfrd",
                "datapoint_description": "farmer details is here",
                "datapoint_attributes": datapoint_attributes_data
        }]
        response = self.client.post(self.datahub_stardardise_url, json.dumps(datapoint_category_invalid_data), content_type="application/json", secure=True)
        data = response.json()
        # print("***test_stardardise_create_invalid***", data[0]['datapoint_category'])
        # print("***test_stardardise_create_invalid***", response.status_code)
        assert response.status_code == 400
        assert data[0]['datapoint_category'] == ['Ensure this field has no more than 50 characters.']
        
    #test case for create method(invalid case)        
    def test_stardardise_create_invalid_unique_category(self):
        datapoint_category_invalid_data = [{
            "datapoint_category": "farmers info",
            "datapoint_description":"farmer details is here",
            "datapoint_attributes":[]
            }]
        response = self.client.post(self.datahub_stardardise_url, json.dumps(datapoint_category_invalid_data), content_type="application/json", secure=True)
        data = response.json()
        # print("***test_stardardise_create_invalid***", data)
        # print("***test_stardardise_create_invalid***", response.status_code)
        assert response.status_code == 400
        assert data[0]['datapoint_category'] == ['standardisation template with this datapoint category already exists.']
        
    #test case for create method(invalid case)  
    def test_stardardise_create_invalid_length_description(self):
        datapoint_attributes_data = {
                    "data_attribute1": "",
                    "data_attribute2": ""
                }
        datapoint_category_invalid_data = [{
                "datapoint_category": "farmers",
                "datapoint_description": "dnjsnjdnksanmckadmcnkdmndnjsnjdnksanmckadmcnkdmnckmnckdmclakdscamdnjsnjdnksanmckadmcnkdmnckmnckdmclakdscamdnjsnjdnksanmckadmcnkdmnckmnckdmclakdscamdnjsnjdnksanmckadmcnkdmnckmnckdmclakdscamdnjsnjdnksanmckadmcnkdmnckmnckdmclakdscamdnjsnjdnksanmckadmcnkdmnckm",
                "datapoint_attributes": datapoint_attributes_data
        }]
        response = self.client.post(self.datahub_stardardise_url, json.dumps(datapoint_category_invalid_data), content_type="application/json", secure=True)
        data = response.json()
        # print("***test_stardardise_create_invalid***", data[0]['datapoint_description'])
        # print("***test_stardardise_create_invalid***", response.status_code)
        assert response.status_code == 400
        assert data[0]['datapoint_description'] == ['Ensure this field has no more than 255 characters.']
        
    #test case for list method(valid case) 
    def test_stardardise_retrieve_valid(self):
        response = self.client.get(self.datahub_stardardise_url)
        data = response.json()
        # print("***test_stardardise_retrieve_valid data***", data)
        # print("***test_stardardise_retrieve_valid status_code***", response.status_code)
        assert response.status_code == 200
        assert data[0]['datapoint_category'] == 'farmers info'
        
    #test case for update method(valid case) 
    def test_stardardise_update_category_valid(self):
        category_id = StandardisationTemplate.objects.get(datapoint_category="farmers 2").id
        category_update_data = [{
            "id": str(category_id),
            "datapoint_category": "farmers 2 updated",
            "datapoint_description": "farmer 2 details is here",
            "datapoint_attributes": []
            }]
        
        response = self.client.put(self.datahub_stardardise_url+f"update_standardisation_template/", json.dumps(category_update_data), content_type="application/json", secure=True)
        # print("***test_stardardise_update_category_valid***", response.status_code)
        assert response.status_code == 201
        # print("***my_updated category***", StandardisationTemplate.objects.get(id=category_id))
    
    #test case for update method(invalid case) 
    def test_stardardise_update_category_invalid(self):
        # category_id = StandardisationTemplate.objects.get(datapoint_category="farmers 2").id
        random_uuid = uuid.uuid4()
        category_update_data = [{
            "id": str(random_uuid),
            "datapoint_category": "farmers 2 updated",
            "datapoint_description": "farmer 2 details is here",
            "datapoint_attributes": []
            }]
        
        response = self.client.put(self.datahub_stardardise_url+f"update_standardisation_template/", json.dumps(category_update_data), content_type="application/json", secure=True)
        # print("***test_stardardise_update_category_invalid***", response.status_code)
        # print("***test_stardardise_update_category_invalid***", response.json())
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #test case for update method(valid case) 
    def test_stardardise_update_datapoint_add_valid(self):
        category_id = StandardisationTemplate.objects.get(datapoint_category="farmers 2").id
        datapoint_update_data = [{
            "id": str(category_id),
            "datapoint_category": "farmers 2",
            "datapoint_description": "farmer 2 details is here",
            "datapoint_attributes": [{
                "data_attribute3": ""
                }]
            }]
        
        response = self.client.put(self.datahub_stardardise_url+f"update_standardisation_template/", json.dumps(datapoint_update_data), content_type="application/json", secure=True)
        # print("***test_stardardise_update_datapoint_add_valid***", response.status_code)
        assert response.status_code == 201
        response = self.client.get(self.datahub_stardardise_url)
        # print("***my_updated datapoint***", StandardisationTemplate.objects.get(id=category_id))
    
    #test case for update method(valid case) 
    def test_stardardise_update_datapoint_deleting_valid(self):
        category_id = StandardisationTemplate.objects.get(datapoint_category="farmers info").id
        datapoint_update_data = [{
            "id": str(category_id),
            "datapoint_category": "farmers info",
            "datapoint_description": "farmer details is here",
            "datapoint_attributes": [{
                "data_attribute1": ""
                }]
            }]
        
        response = self.client.put(self.datahub_stardardise_url+f"update_standardisation_template/", json.dumps(datapoint_update_data), content_type="application/json", secure=True)
        # print("***test_stardardise_update_datapoint_deleting_valid***", response.status_code)
        assert response.status_code == 201
        response = self.client.get(self.datahub_stardardise_url)
        # print("***my_updated datapoint***", StandardisationTemplate.objects.get(id=category_id))
        
    #test case for destroy method(valid case) 
    def test_stardardise_delete_valid_category(self):
        category_id =StandardisationTemplate.objects.get(datapoint_category="farmers info").id
        response = self.client.delete(self.datahub_stardardise_url+f"{category_id}/")
        # print("***test_stardardise_delete_valid_category***", response)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
    #test case for destroy method(invalid case) 
    def test_stardardise_delete_invalid_category(self):
        random_uuid = uuid.uuid4()
        response = self.client.delete(self.datahub_stardardise_url+f"{random_uuid}/")
        # print("***test_stardardise_delete_invalid_category***", response)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    