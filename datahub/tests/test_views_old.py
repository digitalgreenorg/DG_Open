import base64
import binascii
import json
import os
from calendar import c
from urllib import response
from uuid import uuid4

import pytest
from _pytest.monkeypatch import MonkeyPatch
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import InMemoryUploadedFile, SimpleUploadedFile
from django.db import models
from django.shortcuts import render
from django.test import Client, TestCase
from django.test.client import encode_multipart
from requests import request
from requests_toolbelt.multipart.encoder import MultipartEncoder
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.test import APIClient, APIRequestFactory, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User, UserManager, UserRole
from datahub.models import (
    Datasets,
    DatasetV2,
    Organization,
    Policy,
    StandardisationTemplate,
    UserOrganizationMap,
)
from datahub.views import ParticipantViewSet

# from django.urls import reverse
from participant.models import Connectors, Department, Project, SupportTicket
from utils.jwt_services import JWTServices

valid_data = {
    "email": "ugeshbasa4ss5@digitalgreen.org",
    "org_email": "bglordg1@digitalgreen.org",
    "first_name": "ugesh",
    "last_name": "nani",
    "role": 3,
    "name": "digitalgreen",
    "phone_number": "9985750356",
    "website": "website.com",
    "address": json.dumps({"city": "Banglore"}),
    # "profile_picture": open("datahub/tests/test_data/pro.png", "rb"),
    "subscription": "aaaa",
}
update_data = {
    "email": "ugeshbasa4ss5@digitalgreen.org",
    "org_email": "bglordg@digitalgreen.org",
    "first_name": "ugeshBasa",
    "last_name": "nani",
    "role": 3,
    "name": "digitalgreen",
    "phone_number": "1234567890",
    "website": "website.com",
    "address": json.dumps({"city": "Banglore"}),
    "subscription": "aaaa",
    # "profile_picture": open("datahub/tests/test_data/pro.png", "rb"),
}

invalid_role_data = {
    "email": "ugeshbasa44@digitalgreen.org",
    "org_email": "bglordg@digitalgreen.org",
    "first_name": "ugesh",
    "last_name": "nani",
    "role": "33",
    "name": "digitalgreen",
    "phone_number": "9985750356",
    "website": "website.com",
    "address": json.dumps({"address": "Banglore", "country": "India", "pincode": "501011"}),
    # "profile_picture": open("datahub/tests/test_data/pro.png", "rb"),
    "subscription": "aaaa",
}


class MockUtils:
    def send_email(self, to_email: list, content=None, subject=None):
        if to_email == []:
            return Response({"message": "Invalid email address"}, 400)
        else:
            return Response({"Message": "Invation sent to the participants"}, status=200)

ticket_valid_data = {
    "subject": "Not Able to Install",
    "issue_message": "Issue description",
    "issue_attachments": open("datahub/tests/test_data/pro.png", "rb"),
    "status": "open",
    "category": "connectors",
}
ticket_dump_data = {
    "subject": "Not Able to Install",
    "issue_message": "Issue description",
    "status": "open",
    "category": "connectors",
}
ticket_invalid_data = {
    "issue_message": "Issue description",
    "issue_attachments": open("datahub/tests/test_data/pro.png", "rb"),
}
ticket_update_data = {
    "subject": "Not Able to Install",
    "issue_message": "Issue description",
    "status": "closed",
    "category": "connectors",
    "solution_message": "Issue description",
}


datasets_valid_data = {
    "name": "chilli datasets",
    "description": "description",
    "category": "soil_data",
    "geography": "tpt",
    "crop_detail": "chilli",
    "constantly_update": False,
    "age_of_date": "3",
    "dataset_size": "155K",
    "connector_availability": "available",
    # "sample_dataset": open("datasets/tests/test_data/pro.csv", "rb"),
}
datasets_dump_data = {
    "name": "dump datasets",
    "description": "dump description",
    "category": "soil_data",
    "geography": "tpt",
    "crop_detail": "chilli",
    "constantly_update": False,
    "age_of_date": "3",
    "dataset_size": "155K",
    "connector_availability": "available",
    # "sample_dataset": open("datasets/tests/test_data/pro.csv", "rb"),
}
datasets_invalid_data = {
    "constantly_update": False,
    "age_of_date": "3",
    "dataset_size": "155K",
    "connector_availability": "available",
    # "sample_dataset": open("datasets/tests/test_data/pro.csv", "rb"),
}
datasets_update_data = {
    "geography": "bglor",
    "crop_detail": "green chilli",
    "constantly_update": False,
    "age_of_date": "12",
    "dataset_size": "255k",
}

##############################################################################################################################################################################################################
auth = {
    "token": "null"
}


policy_valid_data = {
    "name": "Some Policy Name",
    "description": "Some Policy Description"
}

policy_incomplete_data_no_description = {
    "name": "Some Policy Name",
    # "description": "Some Policy Description"
}

policy_incomplete_data_no_name = {
    # "name": "Some Policy Name",
    "description": "Some Policy Description"
}

policy_update_valid_data_update_name_only = {
    "name": "New Updated Policy Name",
}

policy_update_valid_data_update_description_only = {
    "description": "Some New Policy Description"
}


dataset_v2_valid_data = {
    "user_map": None,
    "name": "Sample_Dataset",
    "description": "Sample_Dataset",
    "constantly_update": True,
    "data_capture_start": None,
    "data_capture_end": None
}

dataset_v2_update_dataset__invalid_date = {
    "description": "Some New Description",
    "data_capture_end": "skldjflsekjnfl",
    "data_capture_start": "2023-07-06T00:00:00.000Z"
}

dataset_v2_update_dataset__valid_date = {
    "description": "Some New Description",
    "data_capture_end": "2023-07-21T00:00:00.000Z",
    "data_capture_start": "2023-07-06T00:00:00.000Z"
}

dataset_v2_invalid_data = {
    "user_map": None,
    "name": "Sample_Dataset",
    "description": "Sample_Dataset",
    "constantly_update": True,
    "data_capture_start": None,
    "data_capture_end": None
}

dataset_v2_create_dataset__invalid_date = {
    "name": "Something Something",
    "description": "Some New Description",
    "data_capture_end": "skldjflsekjnfl",
    "data_capture_start": "2023-07-06T00:00:00.000Z"
}

dataset_v2_create_dataset_no_name = {
    "description": "Some New Description",
    "data_capture_end": "2023-07-21T00:00:00.000Z",
    "data_capture_start": "2023-07-06T00:00:00.000Z"
}

dataset_v2_update_dataset_description = {
    "description": "Some New Description"
}


class DatasetV2TestViews(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        client = APIClient()
        cls.dataset_view_url = reverse("datasets/v2-list")
        cls.retrieve_only_dataset_view_url = reverse("dataset/v2-list")
        cls.upload_dataset = reverse("dataset_files-list")
        cls.standardize = reverse("standardise-list")


        user_role_admin = UserRole.objects.create(
            id="1",
            role_name="datahub_admin"
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
            user=user,
            organization=organization
        )
        cls.user_map = user_map

        cls.standard_template = StandardisationTemplate.objects.create(
            datapoint_category="something",
            datapoint_description="datapoint_description",
            datapoint_attributes={
                "test": "test"
            }
        )

        cls.sample_dataset = DatasetV2.objects.create(
            name="System_Default_Dataset_Name",
            user_map=user_map,
            description="System_Default_Dataset_Description",
        )

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

        cls.dataset_object = {}

    def test_create_dataset(self):
        dataset_v2_valid_data_ = {
            "user_map": self.user_map.id,
            "name": "Sample_Dataset",
            "description": "Sample_Dataset",
            "constantly_update": True,
            "data_capture_start": None,
            "data_capture_end": None
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {auth["token"]}'
        self.client.defaults['CONTENT_TYPE'] = 'application/json'
        api_response_admin = self.client.post(f"{self.dataset_view_url}", dataset_v2_valid_data_, secure=True,
                                              content_type='application/json')

        assert api_response_admin.status_code in [201]

    def test_upload_file_for_dataset(self):
        DatasetV2_Upload_Data = {
            "dataset": self.sample_dataset.id,
            "source": "file",
            "file": open("datahub/tests/test_data/File.csv",
                         'rb'),
        }

        DatasetV2_Upload_Data_R = {
            "dataset": self.sample_dataset.id,
            "source": "file",
            "file": open("datahub/tests/test_data/File_R.csv",
                         'rb'),
        }

        DatasetV2_Upload_Data_Private = {
            "dataset": self.sample_dataset.id,
            "source": "file",
            "file": open("datahub/tests/test_data/File_Private.csv",
                         'rb'),
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {auth["token"]}'
        self.client.defaults['CONTENT_TYPE'] = 'application/json'

        api_response_admin = self.client.post(self.upload_dataset, DatasetV2_Upload_Data, secure=True)
        api_response_admin_R = self.client.post(self.upload_dataset, DatasetV2_Upload_Data_R, secure=True)
        api_response_admin_Private = self.client.post(self.upload_dataset, DatasetV2_Upload_Data_Private, secure=True)

        assert api_response_admin.status_code in [201]
        assert api_response_admin_R.status_code in [201]
        assert api_response_admin_Private.status_code in [201]

        api_response_upload = self.client.get(f"{self.upload_dataset}?dataset={self.sample_dataset.id}", secure=True)
        assert api_response_upload.status_code in [201, 200]
        file_id = api_response_upload.json()[0].get("id")
        payload = {
            "id": file_id
        }
        get_file_columns = self.client.post(f"{self.retrieve_only_dataset_view_url}get_dataset_file_columns/", payload,
                                            secure=True)

        first_column = get_file_columns.json()[0]
        assert get_file_columns.status_code in [200]

        standardize_payload = {
            "config": {
                first_column: {
                    "mapped_category": self.standard_template.datapoint_category,
                    "mapped_to": self.standard_template.datapoint_attributes.get("test"),
                    "masked": False,
                }
            },
            "mask_columns": [],
            "standardised_configuration": {
                first_column: self.standard_template.datapoint_attributes.get("test")
            }
        }

        standardize = self.client.put(f"{self.upload_dataset}{file_id}/", standardize_payload, secure=True,
                                      content_type='application/json')
        assert standardize.status_code in [201, 200]

        categories = self.client.get(f"{self.retrieve_only_dataset_view_url}category/", secure=True)

        category = {
            categories.json().get("e"): categories.json().get("e")
        }

        accessibility_public = {
            "accessibility": "public"
        }

        accessibility_registered = {
            "accessibility": "registered"
        }

        accessibility_private = {
            "accessibility": "private"
        }

        apply_policy_Pub = self.client.patch(f"{self.upload_dataset}{file_id}/", accessibility_public,
                                             content_type='application/json', secure=True)

        apply_policy_Reg = self.client.patch(f"{self.upload_dataset}{file_id}/", accessibility_registered,
                                             content_type='application/json', secure=True)

        apply_policy_Pri = self.client.patch(f"{self.upload_dataset}{file_id}/", accessibility_private,
                                             content_type='application/json', secure=True)
        assert apply_policy_Pub.status_code in [200]
        assert apply_policy_Reg.status_code in [200]
        assert apply_policy_Pri.status_code in [200]

        final_payload = {
            "category": category,
            "constantly_update": True,
            "data_capture_end": None,
            "data_capture_start": None,
            "description": "System_Default_Dataset_Description",
            "geography": {},
            "name": "System_Default_Dataset_Name",
            "user_map": self.user_map.id
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {auth["token"]}'
        final_submission = self.client.put(f"{self.dataset_view_url}{self.sample_dataset.id}/", final_payload,
                                           content_type='application/json', secure=True)
        assert final_submission.status_code in [200]

    def test_get_categories(self):

        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {auth["token"]}'
        self.client.defaults['CONTENT_TYPE'] = 'application/json'
        api_response_admin = self.client.get(f"{self.retrieve_only_dataset_view_url}category/", secure=True)
        assert api_response_admin.status_code in [404, 200]

    def test_create_new_dataset_endpoint_duplicate_dataset_name(self):
        dataset_v2_valid_data["name"] = "System_Default_Dataset_Name"

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']

        api_response_admin = self.client.post(f"{self.dataset_view_url}", dataset_v2_valid_data, secure=True,
                                              content_type='application/json')

        assert api_response_admin.status_code in [400]
        assert api_response_admin.json().get("name")[0] == 'dataset v2 with this name already exists.'

    def test_create_new_dataset_endpoint_invalid_data(self):
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        api_response_admin = self.client.post(f"{self.dataset_view_url}", dataset_v2_invalid_data, secure=True,
                                              content_type='application/json')

        assert api_response_admin.status_code in [400]
        assert api_response_admin.json().get("user_map") == ["This field may not be null."]

    def test_create_new_dataset_endpoint_no_name(self):
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        api_response_admin = self.client.post(f"{self.dataset_view_url}", dataset_v2_create_dataset_no_name,
                                              secure=True,
                                              content_type='application/json')

        assert api_response_admin.status_code in [400]
        assert api_response_admin.json().get("name")[0] == 'This field is required.'

    def test_create_new_dataset_endpoint_invalid_dates(self):
        api_response_admin = None

        try:
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {auth["token"]}'
            }

            self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
            self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
            api_response_admin = self.client.post(f"{self.dataset_view_url}", dataset_v2_create_dataset__invalid_date,
                                                  secure=True,
                                                  content_type='application/json')

        except ValidationError:
            assert api_response_admin.status_code in [400]

    def test_create_new_dataset_endpoint_no_data(self):
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        api_response_admin = self.client.post(f"{self.dataset_view_url}", secure=True,
                                              content_type='application/json')

        assert api_response_admin.status_code in [400]
        assert api_response_admin.json().get("name") == ['This field is required.']
        assert api_response_admin.json().get("user_map") == ['This field is required.']

    def test_create_new_dataset_endpoint_empty_data(self):
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        api_response_admin = self.client.post(f"{self.dataset_view_url}", {}, secure=True,
                                              content_type='application/json')

        assert api_response_admin.status_code in [400]
        assert api_response_admin.json().get("name") == ['This field is required.']
        assert api_response_admin.json().get("user_map") == ['This field is required.']

    def test_get_dataset_details_endpoint_valid_id(self):
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        api_response_admin = self.client.get(f"{self.dataset_view_url}{self.sample_dataset.id}/", secure=True,
                                             content_type='application/json')

        assert api_response_admin.status_code in [200]
        assert str(api_response_admin.json().get("id")) == str(self.sample_dataset.id)

    def test_get_dataset_details_endpoint_invalid_id(self):
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        api_response = self.client.get(f"{self.dataset_view_url}311d3644-ec02-462f-8868-8896567ef8ac/",
                                       secure=True,
                                       content_type='application/json')

        assert api_response.status_code in [404]

    def test_delete_dataset_valid_id(self):
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        api_response_admin = self.client.delete(f"{self.dataset_view_url}{self.sample_dataset.id}/", secure=True,
                                                content_type='application/json')

        # headers = {
        #     'Content-Type': 'application/json',
        #     'Authorization': f'Bearer {self.participant_auth["token"]}'
        # }
        # 
        # self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        # self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        # api_response_participant = self.client.delete(f"{self.dataset_view_url}{self.sample_dataset.id}/",
        #                                               secure=True,
        #                                               content_type='application/json')
        # 
        # headers = {
        #     'Content-Type': 'application/json',
        #     'Authorization': f'Bearer {self.steward_auth["token"]}'
        # }
        # 
        # self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        # self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        # api_response_steward = self.client.delete(f"{self.dataset_view_url}{self.sample_dataset.id}/", secure=True,
        #                                           content_type='application/json')

        assert api_response_admin.status_code in [204]
        # assert api_response_participant.status_code in [403]
        # assert api_response_steward.status_code in [403]

    def test_delete_dataset_invalid_id(self):
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        api_response_admin = self.client.delete(f"{self.dataset_view_url}311d3644-ec02-462f-8868-8896567ef8ac/",
                                                secure=True,
                                                content_type='application/json')

        # headers = {
        #     'Content-Type': 'application/json',
        #     'Authorization': f'Bearer {self.participant_auth["token"]}'
        # }
        #
        # self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        # self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        # api_response_participant = self.client.delete(f"{self.dataset_view_url}311d3644-ec02-462f-8868-8896567ef8ac/",
        #                                               secure=True,
        #                                               content_type='application/json')
        #
        # headers = {
        #     'Content-Type': 'application/json',
        #     'Authorization': f'Bearer {self.steward_auth["token"]}'
        # }
        #
        # self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        # self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        # api_response_steward = self.client.delete(f"{self.dataset_view_url}311d3644-ec02-462f-8868-8896567ef8ac/",
        #                                           secure=True,
        #                                           content_type='application/json')
        #
        assert api_response_admin.status_code in [403]
        # assert api_response_participant.status_code in [403]
        # assert api_response_steward.status_code in [403]

    def test_update_dataset_endpoint_valid_data_description(self):
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        api_response_admin = self.client.put(f"{self.dataset_view_url}{self.sample_dataset.id}/",
                                             dataset_v2_update_dataset_description,
                                             secure=True,
                                             content_type='application/json')

        # headers = {
        #     'Content-Type': 'application/json',
        #     'Authorization': f'Bearer {self.participant_auth["token"]}'
        # }
        #
        # self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        # self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        # api_response_participant = self.client.put(f"{self.dataset_view_url}{self.sample_dataset_id}/",
        #                                            dataset_v2_update_dataset_description,
        #                                            secure=True,
        #                                            content_type='application/json')
        #
        # headers = {
        #     'Content-Type': 'application/json',
        #     'Authorization': f'Bearer {self.steward_auth["token"]}'
        # }
        #
        # self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        # self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        # api_response_steward = self.client.put(f"{self.dataset_view_url}{self.sample_dataset_id}/",
        #                                        dataset_v2_update_dataset_description,
        #                                        secure=True,
        #                                        content_type='application/json')
        #
        assert api_response_admin.status_code in [200]
        # assert api_response_participant.status_code in [403]
        # assert api_response_steward.status_code in [403]

    def test_update_dataset_endpoint_valid_data_invalid_id(self):
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        api_response_admin = self.client.put(f"{self.dataset_view_url}311d3644-ec02-462f-8868-8896567ef8ac/",
                                             dataset_v2_update_dataset_description,
                                             secure=True,
                                             content_type='application/json')

        # headers = {
        #     'Content-Type': 'application/json',
        #     'Authorization': f'Bearer {self.participant_auth["token"]}'
        # }
        #
        # self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        # self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        # api_response_participant = self.client.put(f"{self.dataset_view_url}311d3644-ec02-462f-8868-8896567ef8ac/",
        #                                            dataset_v2_update_dataset_description,
        #                                            secure=True,
        #                                            content_type='application/json')
        #
        # headers = {
        #     'Content-Type': 'application/json',
        #     'Authorization': f'Bearer {self.steward_auth["token"]}'
        # }
        #
        # self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        # self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        # api_response_steward = self.client.put(f"{self.dataset_view_url}311d3644-ec02-462f-8868-8896567ef8ac/",
        #                                        dataset_v2_update_dataset_description,
        #                                        secure=True,
        #                                        content_type='application/json')
        #
        assert api_response_admin.status_code in [403]
        # assert api_response_participant.status_code in [403]
        # assert api_response_steward.status_code in [403]

    ###################################################################################

    def test_update_dataset_endpoint_valid_data_date_ranges(self):
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }

        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        api_response_admin = self.client.put(f"{self.dataset_view_url}{self.sample_dataset.id}/",
                                             dataset_v2_update_dataset__valid_date,
                                             secure=True,
                                             content_type='application/json')


        assert api_response_admin.status_code in [200]

    # def test_update_dataset_endpoint_invalid_data_date_ranges(self):
    #     api_response_admin = None
    #     try:

    #         headers = {
    #             'Content-Type': 'application/json',
    #             'Authorization': f'Bearer {auth["token"]}'
    #         }

    #         self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
    #         self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
    #         api_response_admin = self.client.put(f"{self.dataset_view_url}{self.sample_dataset.id}/",
    #                                              dataset_v2_update_dataset__invalid_date,
    #                                              secure=True,
    #                                              content_type='application/json')

    #     except ValidationError:
    #         assert api_response_admin.status_code in [400]
    # 

class PoliciesTestCaseView(APITestCase):
    def setUp(self) -> None:

        super().setUpClass()
        # cls.client = Client()
        self.policies_url = reverse("policy-list")

        user_role = UserRole.objects.create(
            id="1",
            role_name="datahub_admin"
        )

        user_role_lower = UserRole.objects.create(
            id="6",
            role_name="datahub_co_steward"
        )

        user = User.objects.create(
            email="chandani@gmail.com",
            role_id=user_role.id,
        )

        unauthorized_user = User.objects.create(
            email="chandan_invalid@gmail.com",
            role_id=user_role_lower.id,
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

        policy = Policy.objects.create(
            name="Some Random Policy",
            description="Some Random Description",
            file=None,
        )

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

        self.client = Client()
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }
        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        self.policy_id = policy.id

    def test_admin_create_policy(self):
        api_response = self.client.post(self.policies_url, policy_valid_data, secure=True,
                                        content_type='application/json')
        assert api_response.status_code in [201, 200]

    def test_admin_create_incomplete_data_description(self):
        api_response = self.client.post(self.policies_url, policy_incomplete_data_no_description, secure=True,
                                        content_type='application/json')
        assert api_response.status_code in [400]
        if api_response.status_code == 400:
            if api_response.json().get("description"):
                assert api_response.json().get("description")[0] == 'This field is required.'

    def test_admin_create_incomplete_data_name(self):
        api_response = self.client.post(self.policies_url, policy_incomplete_data_no_name, secure=True,
                                        content_type='application/json')
        assert api_response.status_code in [400]
        if api_response.status_code == 400:
            if api_response.json().get("name"):
                assert api_response.json().get("name")[0] == 'This field is required.'

    def test_admin_update_policy_only_name(self):
        put_url = f"{self.policies_url}{self.policy_id}/"
        api_response = self.client.patch(put_url, policy_update_valid_data_update_name_only, secure=True,
                                         content_type='application/json')
        assert api_response.status_code in [201, 200]

    def test_admin_update_policy_only_description(self):
        put_url = f"{self.policies_url}{self.policy_id}/"
        api_response = self.client.patch(put_url, policy_update_valid_data_update_description_only, secure=True,
                                         content_type='application/json')
        assert api_response.status_code in [201, 200]

    def test_admin_update_policy_invalid_policy_id(self):
        self.policy_id = "129a8c35-e31d-408f-8d0a-73f64a7af0f1"

        delete_url = f"{self.policies_url}{self.policy_id}/"
        api_response = self.client.patch(delete_url, secure=True,
                                         content_type='application/json')

        assert api_response.status_code in [404]
        assert api_response.json().get("detail") == "Not found."

    def test_admin_delete_policy_policy_id(self):
        delete_url = f"{self.policies_url}{self.policy_id}/"
        api_response = self.client.patch(delete_url, secure=True,
                                         content_type='application/json')

        assert api_response.status_code in [200]

    def test_admin_delete_policy_invalid_policy_id(self):
        self.policy_id = "129a8c35-e31d-408f-8d0a-73f64a7af0f1"
        delete_url = f"{self.policies_url}{self.policy_id}/"
        api_response = self.client.patch(delete_url, secure=True,
                                         content_type='application/json')

        assert api_response.status_code in [404]
        assert api_response.json().get("detail") == "Not found."


valid_data_for_categories = {
    "some_key": "some_value",
    "some_key_array": "[]"
}

class ParticipantCostewardsListingTestViews(APITestCase):

    def setUp(self) -> None:

        super().setUpClass()
        self.client = Client()
        self.participant_url = reverse("participant-list")

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

        self.costewards = 10
        for item in range(0, self.costewards):
            self.co_steward = User.objects.create(
                first_name="Costeward",
                last_name=f"Number{item}",
                email=f"csteward{item}@gmail.com",
                role_id=user_role_co_steward.id,
                on_boarded_by_id=user.id
            )

            co_steward_user_map = UserOrganizationMap.objects.create(
                user_id=self.co_steward.id,
                organization_id=organization.id
            )

        self.participants = 10
        for item in range(0, self.participants):
            self.participant = User.objects.create(
                first_name="Participant",
                last_name=f"Number{item}",
                email=f"Participant{item}@gmail.com",
                role_id=user_role_participant.id,
                # on_boarded_by_id=user.id
            )
            print(self.participant)
            participant_user_map = UserOrganizationMap.objects.create(
                user_id=self.participant.id,
                organization_id=organization.id
            )

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

    def test_list_co_steward_endpoint(self):
        api_response = self.client.get(f"{self.participant_url}?co_steward=True", secure=True,
                                       content_type='application/json')
        assert api_response.status_code in [200]
        assert api_response.json().get("count") == self.costewards

    def test_get_co_steward_details_endpoint(self):
        api_response = self.client.get(f"{self.participant_url}{self.co_steward.id}/", secure=True,
                                       content_type='application/json')
        assert api_response.status_code in [200]
        assert str(api_response.json().get("user_id")) == str(self.co_steward.id)
    
    def test_get_co_steward_details_not_found_endpoint(self):
        api_response = self.client.get(f"{self.participant_url}/582bc65d-4034-4f2d-a19f-4c14d5d69521", secure=True,
                                       content_type='application/json')
        assert api_response.status_code in [404]
    
    def test_list_participant_endpoint(self):
        api_response = self.client.get(self.participant_url, secure=True, content_type='application/json')
        assert api_response.json().get("count") == self.participants
 
    def test_get_participant_details_endpoint(self):
        api_response = self.client.get(f"{self.participant_url}{self.participant.id}/", secure=True,
                                       content_type='application/json')
        assert api_response.status_code in [200]
        assert str(api_response.json().get("user_id")) == str(self.participant.id)

    def test_get_participant_details_not_found_endpoint(self):
        api_response = self.client.get(f"{self.participant_url}/582bc65d-4034-4f2d-a19f-4c14d5d69521/", secure=True,
                                       content_type='application/json')
        assert api_response.status_code in [404]



class CategoriesTestCaseView(APITestCase):

    def setUp(self) -> None:

        super().setUpClass()
        # cls.client = Client()
        self.categories_url = reverse("dataset/v2-list")
        user_role = UserRole.objects.create(
            id="1",
            role_name="datahub_admin"
        )

        user_role_lower = UserRole.objects.create(
            id="6",
            role_name="datahub_co_steward"
        )

        user = User.objects.create(
            email="chandani@gmail.com",
            role_id=user_role.id,
        )

        unauthorized_user = User.objects.create(
            email="chandan_invalid@gmail.com",
            role_id=user_role_lower.id,
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

        policy = Policy.objects.create(
            name="Some Random Policy",
            description="Some Random Description",
            file=None,
        )

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

        self.client = Client()
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth["token"]}'
        }
        self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
        self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
        self.policy_id = policy.id

    def test_get_categories_data(self):
        api_response = self.client.get(f"{self.categories_url}category/", secure=True,
                                       content_type='application/json')
        if api_response.status_code in [404]:
            assert api_response.json().get("detail") == 'Categories not found'
        elif api_response.status_code in [200]:
            assert type(api_response.json()) == dict
            assert len(api_response.json()) > 0

    def test_post_categories_data(self):
        api_response = self.client.post(f"{self.categories_url}category/", valid_data_for_categories, secure=True,
                                        content_type='application/json')

        assert api_response.status_code in [201]

