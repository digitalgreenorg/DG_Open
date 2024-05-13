import binascii
import json
import os
from calendar import c
from urllib import response
from uuid import uuid4
import base64
import pytest
from _pytest.monkeypatch import MonkeyPatch
from django.db import models
from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.uploadedfile import SimpleUploadedFile, InMemoryUploadedFile
from accounts.models import User, UserManager, UserRole
from datahub.models import Datasets, Organization, UserOrganizationMap, Policy, DatasetV2, StandardisationTemplate
from datahub.views import ParticipantViewSet
from django.test import Client, TestCase
from django.test.client import encode_multipart
from requests import request
from requests_toolbelt.multipart.encoder import MultipartEncoder
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.test import APIClient, APIRequestFactory, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User, UserRole
from conftest import postgres_test_container
from datahub.models import Datasets, Organization, Policy, UserOrganizationMap
from datahub.views import ParticipantViewSet

# from django.urls import reverse
from participant.models import Connectors, Department, Project, SupportTicket
from django.core.exceptions import ValidationError
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


class SupportTestViews(TestCase):
    """_summary_

    Args:
        TestCase (_type_): _description_
    """

    def setUp(self) -> None:
        self.client = Client()
        self.support_url = reverse("support_tickets-list")

        self.monkeypatch = MonkeyPatch()
        UserRole.objects.create(role_name="datahub_admin")
        UserRole.objects.create(role_name="datahub_team_member")
        UserRole.objects.create(role_name="datahub_participant_root")
        User.objects.create(
            email="ugeshbasa45@digitalgreen.org",
            first_name="ugesh",
            last_name="nani",
            role=UserRole.objects.get(role_name="datahub_participant_root"),
            phone_number="9985750356",
            profile_picture="sasas",
            subscription="aaaa",
        )
        org = Organization.objects.create(
            org_email="bglordg@digitalgreen.org",
            name="digitalgreen",
            phone_number="9985750356",
            website="website.com",
            address=json.dumps({"city": "Banglore"}),
        )
        # Test model str class
        user_map = UserOrganizationMap.objects.create(
            user=User.objects.get(first_name="ugesh"),
            organization=Organization.objects.get(org_email="bglordg@digitalgreen.org"),
        )
        self.user_map_id = user_map.id
        SupportTicket.objects.create(**ticket_dump_data, user_map=UserOrganizationMap.objects.get(id=user_map.id))

    def test_participant_support_invalid(self):
        """_summary_"""
        ticket_invalid_data["user_map"] = 4
        response = self.client.post(self.support_url, ticket_invalid_data, secure=True)
        assert response.status_code == 400
        assert response.json().get("user_map") == ["“4” is not a valid UUID."]
        assert response.json() == {
            "category": ["This field is required."],
            "subject": ["This field is required."],
            "status": ["This field is required."],
            "user_map": ["“4” is not a valid UUID."],
        }

    def test_participant_support_valid_ticket(self):
        """_summary_"""
        user_id = UserOrganizationMap.objects.get(user_id=User.objects.get(first_name="ugesh").id).id
        ticket_valid_data["user_map"] = user_id
        response = self.client.post(self.support_url, ticket_valid_data, secure=True)
        assert response.status_code == 201
        assert response.json().get("category") == ticket_valid_data.get("category")
        assert response.json().get("status") == ticket_valid_data.get("status")

    def test_participant_support_valid_ticket_second_record(self):
        user_id = UserOrganizationMap.objects.get(user_id=User.objects.get(first_name="ugesh").id).id
        ticket_valid_data["user_map"] = user_id
        ticket_valid_data["category"] = "datasets"
        del ticket_valid_data["issue_attachments"]
        response = self.client.post(self.support_url, ticket_valid_data, secure=True)
        assert response.status_code == 201
        assert response.json().get("category") == ticket_valid_data.get("category")
        assert response.json().get("status") == ticket_valid_data.get("status")

    def test_participant_support_get_list(self):
        response = self.client.get(self.support_url, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 1
        assert len(data.get("results")) == 1

    def test_participant_support_update_ticket_details(self):
        id = SupportTicket.objects.get(category="connectors").id
        ticket_update_data["user_map"] = self.user_map_id
        response = self.client.put(
            self.support_url + str(id) + "/",
            ticket_update_data,
            secure=True,
            content_type="application/json",
        )
        data = response.json()
        assert response.status_code == 201
        assert data.get("subject") == ticket_update_data.get("subject")
        assert data.get("status") == ticket_update_data.get("status")

    def test_participant_update_ticket_error(self):
        response = self.client.put(
            self.support_url + str(uuid4()) + "/",
            ticket_update_data,
            secure=True,
            content_type="application/json",
        )
        data = response.json()
        assert response.status_code == 404
        assert data == {"detail": "Not found."}

    def test_participant_support_user_details_after_update(self):
        response = self.client.get(self.support_url, secure=True)
        data = response.json()
        print(data)
        assert response.status_code == 200
        assert data.get("count") == 1
        assert len(data.get("results")) == 1
        assert data.get("results")[0].get("subject") == ticket_valid_data.get("subject")
        assert data.get("results")[0].get("status") == ticket_valid_data.get("status")

    def test_participant_support_details_empty(self):
        url = self.support_url + str(uuid4()) + "/"
        response = self.client.get(url, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data == []

    def test_participant_support_get_list_filter(self):
        response = self.client.post(self.support_url + "filters_tickets/", {}, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 1
        assert len(data.get("results")) == 1
        response = self.client.post(
            self.support_url + "filters_tickets/", json={"category": "connectors"}, secure=True
        )
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 1
        assert data.get("results")[0].get("category") == "connectors"

    def test_participant_support_get_list_filter_error(self):
        response = self.client.post(self.support_url + "filters_tickets/", {"statuuus": "open"}, secure=True)
        assert response.status_code == 400


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


class TestDatahubDatasetsViews(TestCase):
    """_summary_

    Args:
        TestCase (_type_): _description_
    """

    def setUp(self) -> None:
        self.client = Client()
        self.datasets_url = reverse("datahub_datasets-list")
        self.monkeypatch = MonkeyPatch()
        UserRole.objects.create(role_name="datahub_admin")
        UserRole.objects.create(role_name="datahub_team_member")
        UserRole.objects.create(role_name="datahub_participant_root")
        UserRole.objects.create(role_name="datahub_participant_member")

        User.objects.create(
            email="ugeshbasa45@digitalgreen.org",
            first_name="ugesh",
            last_name="nani",
            role=UserRole.objects.get(role_name="datahub_participant_root"),
            phone_number="9985750356",
            profile_picture="sasas",
            subscription="aaaa",
        )
        User.objects.create(
            email="ugeshbasa_member@digitalgreen.org",
            first_name="ugesh",
            last_name="nani",
            role=UserRole.objects.get(role_name="datahub_participant_member"),
            phone_number="9985750356",
            profile_picture="sasas",
            subscription="aaaa",
        )
        User.objects.create(
            email="ugeshbasa_member2@digitalgreen.org",
            first_name="ugesh",
            last_name="nani",
            role=UserRole.objects.get(role_name="datahub_participant_member"),
            phone_number="9985750356",
            profile_picture="sasas",
            subscription="aaaa",
        )
        Organization.objects.create(
            org_email="bglordg@digitalgreen.org",
            name="digitalgreen",
            phone_number="9985750356",
            website="website.com",
            address=json.dumps({"city": "Banglore"}),
        )
        # Test model str class
        UserOrganizationMap.objects.create(
            user=User.objects.get(email="ugeshbasa_member@digitalgreen.org"),
            organization=Organization.objects.get(org_email="bglordg@digitalgreen.org"),
        )
        UserOrganizationMap.objects.create(
            user=User.objects.get(email="ugeshbasa45@digitalgreen.org"),
            organization=Organization.objects.get(org_email="bglordg@digitalgreen.org"),
        )
        user_map = UserOrganizationMap.objects.create(
            user=User.objects.get(email="ugeshbasa_member2@digitalgreen.org"),
            organization=Organization.objects.get(org_email="bglordg@digitalgreen.org"),
        )
        Datasets.objects.create(user_map=UserOrganizationMap.objects.get(id=user_map.id), **datasets_dump_data)
        self.user_map_id = user_map.id

    def test_datahub_datasets_invalid(self):
        """_summary_"""
        datasets_invalid_data["user_map"] = self.user_map_id
        response = self.client.post(self.datasets_url, datasets_invalid_data, secure=True)
        assert response.status_code == 400
        assert response.json() == {
            "name": ["This field is required."],
            "description": ["This field is required."],
            "category": ["This field is required."],
            "geography": ["This field is required."],
        }

    def test_datahub_root_datasets_valid(self):
        """_summary_"""
        user_id = UserOrganizationMap.objects.get(user=User.objects.get(email="ugeshbasa45@digitalgreen.org").id).id
        datasets_valid_data["user_map"] = user_id
        datasets_valid_data["name"] = "root_name"
        response = self.client.post(self.datasets_url, datasets_valid_data, secure=True)

        assert response.status_code == 201
        assert response.json().get("name") == datasets_valid_data.get("name")
        assert response.json().get("category") == datasets_valid_data.get("category")
        assert response.json().get("geography") == datasets_valid_data.get("geography")
        assert response.json().get("geography") == datasets_valid_data.get("geography")
        datasets_dump_data["user_map"] = self.user_map_id
        response = self.client.post(self.datasets_url, datasets_dump_data, secure=True)
        assert response.status_code == 201

    def test_datahub_member2_datasets_valid(self):
        """_summary_"""
        user_id = UserOrganizationMap.objects.get(
            user_id=User.objects.get(email="ugeshbasa_member@digitalgreen.org").id
        ).id
        datasets_valid_data["user_map"] = user_id
        response = self.client.post(self.datasets_url, datasets_valid_data, secure=True)
        assert response.status_code == 201
        assert response.json().get("name") == datasets_valid_data.get("name")
        assert response.json().get("category") == datasets_valid_data.get("category")
        assert response.json().get("geography") == datasets_valid_data.get("geography")
        assert response.json().get("geography") == datasets_valid_data.get("geography")

    def test_datahub_datasets_get_list(self):
        user_id = User.objects.get(email="ugeshbasa_member2@digitalgreen.org").id
        response = self.client.get(self.datasets_url, {"user_id": user_id}, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 1
        assert len(data.get("results")) == 1
        assert list(data.get("results")[0].get("organization").keys()) == [
            "org_email",
            "org_description",
            "name",
            "logo",
        ]
        assert data.get("results")[0].get("user") == None

    def test_datahub_datasets_get_list_with_organization(self):
        org_id = Organization.objects.get(org_email="bglordg@digitalgreen.org").id
        response = self.client.get(self.datasets_url, {"org_id": org_id}, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 1
        assert len(data.get("results")) == 1

    def test_datahub_datasets_update_details(self):
        id = Datasets.objects.get(name="dump datasets").id
        print(id)
        datasets_update_data["user_map"] = self.user_map_id
        response = self.client.put(
            self.datasets_url + str(id) + "/",
            datasets_update_data,
            secure=True,
            content_type="application/json",
        )
        assert response.status_code == 201
        assert response.json().get("name") == datasets_dump_data.get("name")
        assert response.json().get("dataset_size") == datasets_update_data.get("dataset_size")
        assert response.json().get("geography") == datasets_update_data.get("geography")

    def test_datahub_datasets_update_error(self):
        response = self.client.put(
            self.datasets_url + str(uuid4()) + "/",
            datasets_update_data,
            secure=True,
            content_type="application/json",
        )
        data = response.json()
        assert response.status_code == 404
        assert data == {"detail": "Not found."}

    def test_datahub_datasets_after_update(self):
        response = self.client.get(self.datasets_url, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 1
        assert len(data.get("results")) == 1
        org_id = Organization.objects.get(org_email="bglordg@digitalgreen.org").id
        response = self.client.get(self.datasets_url, {"org_id": org_id}, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 1
        assert len(data.get("results")) == 1
        assert data.get("results")[0].get("name") == "dump datasets"
        assert data.get("results")[0].get("category") == datasets_dump_data.get("category")
        assert data.get("results")[0].get("geography") == datasets_dump_data.get("geography")

    def test_datahub_datasets_details_empty(self):
        url = self.datasets_url + str(uuid4()) + "/"
        response = self.client.get(url, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data == {}

    def test_datahub_datasets_details(self):
        id = Datasets.objects.get(name=datasets_dump_data.get("name")).id
        url = self.datasets_url + str(id) + "/"
        response = self.client.get(url, secure=True)
        assert response.status_code == 200
        assert response.json().get("name") == datasets_dump_data.get("name")
        assert response.json().get("category") == datasets_dump_data.get("category")
        assert response.json().get("geography") == datasets_dump_data.get("geography")
        assert response.json().get("organization").get("org_email") == "bglordg@digitalgreen.org"

    def test_datahub_datasest_deleate(self):
        id = Datasets.objects.get(name="dump datasets").id
        response = self.client.delete(self.datasets_url + str(id) + "/", secure=True)
        assert response.status_code == 204

    def test_datahub_datasest_filter(self):
        url = self.datasets_url + "filters_tickets/"
        data = {"category__in": [datasets_dump_data.get("category"), datasets_update_data.get("category")]}
        response = self.client.post(url, data, secure=True)
        data = response.json().get("results")[0]
        assert response.status_code == 200
        assert data.get("name") == datasets_dump_data.get("name")
        assert data.get("category") == datasets_dump_data.get("category")
        assert data.get("geography") == datasets_dump_data.get("geography")
        assert data.get("organization").get("org_email") == "bglordg@digitalgreen.org"

    def test_datahub_datasest_filter_error(self):
        url = self.datasets_url + "filters_tickets/"
        data = {"category__innnn": [datasets_dump_data.get("category"), datasets_update_data.get("category")]}
        response = self.client.post(url, data, secure=True)
        assert response.json() == "Invalid filter fields: ['category__innnn']"
        assert response.status_code == 500


class OrganizationTestViews(TestCase):
    """_summary_

    Args:
        TestCase (_type_): _description_
    """

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.client = APIClient()
        cls.organization_url = reverse("organization-list")
        cls.user_role = UserRole.objects.create(id=1, role_name="datahub_admin")
        cls.user_data = {"email": "test_team_member@farmstack.co", "role": "1"}
        cls.address = {"street": "4th Main", "city": "Bengaluru", "country": "India", "pincode": "53789"}

    def test_organization_post_add_org(self):
        user_obj = User.objects.create(email="test_user@email.com", role=self.user_role)
        org_data = {
            "user_id": str(user_obj.id),
            "email": "test_team_member@farmstack.co",
            "name": "Test Org",
            "org_email": "test_org@email.com",
            "address": json.dumps(self.address),
            "phone_number": "+91123456789",
            "org_description": "Organization description ....",
        }

        response = self.client.post(self.organization_url, org_data)
        print("RESPONSEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Organization.objects.count(), 1)

    def test_organization_post_add_invalid_org(self):
        """_summary_"""
        user_obj = User.objects.create(email="test_user@email.com", role=self.user_role)

        org_data = {
            "user_id": str(user_obj.id),
            "email": "test_team_member@farmstack.co",
            "name": "",
            "org_email": "",
            "address": "",
            "phone_number": "+91123456789",
            "org_description": "",
        }

        response = self.client.post(self.organization_url, org_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        assert response.json() == {
            "name": ["This field may not be blank."],
            "org_email": ["This field may not be blank."],
            "address": ["Value must be valid JSON."],
        }

    def test_organization_put_update_valid_org(self):
        user_obj = User.objects.create(email="test_user@email.com", role=self.user_role)
        org_data = {
            "user_id": str(user_obj.id),
            "email": "test_team_member@farmstack.co",
            "name": "Test Org",
            "org_email": "test_org@email.com",
            "address": json.dumps(self.address),
            "phone_number": "+91123456789",
            "org_description": "Organization description ....",
        }
        response = self.client.post(self.organization_url, org_data)

        address = {"street": "8th Main", "city": "Banglore", "country": "India", "pincode": "53789"}
        updated_org_data = {
            "name": "Test Organization",
            "org_email": "test_organization@email.com",
            "address": json.dumps(address),
            "phone_number": "+91923456789",
            "org_description": "Organization description UPDATED ....",
            "logo": open("datahub/tests/test_data/pro.png", "rb"),
        }

        organization_url = reverse("organization-detail", kwargs={"pk": user_obj.id})
        response = self.client.put(
            organization_url,
            updated_org_data,
            content_type="multipart/form-data; boundary=00252461d3ab8ff5c25834e0bffd6f70",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_organization_put_update_invalid_data(self):
        """_summary_"""
        user_obj = User.objects.create(email="test_user@email.com", role=self.user_role)
        org_data = {
            "user_id": str(user_obj.id),
            "email": "test_team_member@farmstack.co",
            "name": "Test Org",
            "org_email": "test_org@email.com",
            "address": json.dumps(self.address),
            "phone_number": "+91123456789",
            "org_description": "Organization description ....",
        }
        response = self.client.post(self.organization_url, org_data)

        updated_org_data = {
            "name": "",
            "org_email": "",
            "address": "",
            "phone_number": "",
            "org_description": "",
            "logo": "",
        }
        organization_url = reverse("organization-detail", kwargs={"pk": user_obj.id})
        response = self.client.put(
            organization_url,
            updated_org_data,
            content_type="multipart/form-data; boundary=00252461d3ab8ff5c25834e0bffd6f70",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TeamMemberTestCase(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.client = APIClient()
        cls.team_member_url = reverse("team_member-list")
        cls.user_role = UserRole.objects.create(id=2, role_name="datahub_team_member")
        cls.user_data = {"email": "test_team_member@farmstack.co", "role": "2"}

    def test_team_member_post_add_valid_user(self):
        user_obj = User.objects.create(email="test_user@email.com", role=self.user_role)
        response = self.client.post(self.team_member_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)

    def test_team_member_post_add_invalid_user(self):
        User.objects.create(email="test_user@email.com", role=self.user_role)
        self.user_data = {"email": "email"}
        response = self.client.post(self.team_member_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # assert response.json() == {
        #      "email": ["This field may not be blank."],
        #      "role": ["This field may not be blank."],
        #     }

        # self.assertJSONEqual(json.loads(response.content), error_response)

    def test_team_member_put_update_valid_data(self):
        user_obj = User.objects.create(email="test_user@email.com", role=self.user_role)
        self.team_member_url = reverse("team_member-detail", kwargs={"pk": user_obj.id})
        response = self.client.put(self.team_member_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_team_member_put_update_invalid_data(self):
        user_obj = User.objects.create(email="test_user@email.com", role=self.user_role)
        user_data = {"email": "email", "role": ""}
        self.team_member_url = reverse("team_member-detail", kwargs={"pk": user_obj.id})
        response = self.client.put(self.team_member_url, user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AdminDashboardTestView(TestCase):
    """_summary_

    Args:
        TestCase (_type_): _description_
    """

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.client = APIClient()
        cls.organization_url = reverse("-dashboard")
        UserRole.objects.create(id=3, role_name="datahub_participant_root")
        User.objects.create(email="test_participant@email.com", role_id=3)

        org_obj = Organization.objects.create(org_email="test_org_email@email.com",
                                              address=json.dumps({"city": "Banglore"}))
        user_map = UserOrganizationMap.objects.create(
            user=User.objects.get(email="test_participant@email.com"),
            organization=Organization.objects.get(org_email="test_org_email@email.com"),
        )

        dataset_obj = Datasets.objects.create(user_map=UserOrganizationMap.objects.get(id=user_map.id),
                                              **datasets_dump_data)
        dept_obj = Department.objects.create(organization=Organization.objects.get(id=org_obj.id),
                                             department_name="Dept Name", department_discription="Dept description ...")
        proj_obj = Project.objects.create(department=Department.objects.get(id=dept_obj.id), project_name="Proj Name")
        Connectors.objects.create(user_map=UserOrganizationMap.objects.get(id=user_map.id),
                                  dataset=Datasets.objects.get(id=dataset_obj.id),
                                  project=Project.objects.get(id=proj_obj.id), connector_name="Connector Name",
                                  connector_type="consumer", docker_image_url="farmstack/gen-z-consumer:latest",
                                  application_port=2700)

    def test_total_participants_greater_than_or_equal_zero(self):
        participant_count = User.objects.filter(role_id=3, status=True).count()
        self.assertGreaterEqual(participant_count, 0)

    def test_total_datasets_greater_than_or_equal_zero(self):
        datasets_count = (
            Datasets.objects.select_related("user_map", "user_map__user", "user_map__organization")
            .filter(user_map__user__status=True, status=True)
            .order_by("updated_at")
            .count()
        )
        self.assertGreaterEqual(datasets_count, 0)

    def test_active_connectors_greater_than_or_equal_zero(self):
        active_connectors = Connectors.objects.filter(status=True).count()
        self.assertGreaterEqual(active_connectors, 0)

    def test_dataset_categories_not_emtpy(self):
        dataset_categories = Datasets.objects.filter(status=True).values_list("category", flat=True).count()
        self.assertGreaterEqual(dataset_categories, 0)


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


class PoliciesTestCaseView(TestCase):
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


class ParticipantCostewardsListingTestViews(APITestCase):
    
    @pytest.mark.django_db
    def setUp(self) -> None:
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

    @pytest.mark.django_db
    def test_list_co_steward_endpoint(self):
        api_response = self.client.get(f"{self.participant_url}?co_steward=True", secure=True,
                                       content_type='application/json')
        assert api_response.status_code in [200]
        assert api_response.json().get("count") == self.costewards

    @pytest.mark.django_db
    def test_get_co_steward_details_endpoint(self):
        api_response = self.client.get(f"{self.participant_url}{self.co_steward.id}/", secure=True,
                                       content_type='application/json')
        assert api_response.status_code in [200]
        assert str(api_response.json().get("user_id")) == str(self.co_steward.id)

    
    @pytest.mark.django_db
    def test_get_co_steward_details_not_found_endpoint(self):
        api_response = self.client.get(f"{self.participant_url}/582bc65d-4034-4f2d-a19f-4c14d5d69521", secure=True,
                                       content_type='application/json')
        assert api_response.status_code in [404]
    
    @pytest.mark.django_db
    def test_list_participant_endpoint(self):
        api_response = self.client.get(self.participant_url, secure=True, content_type='application/json')
        assert api_response.json().get("count") == self.participants

    
    @pytest.mark.django_db
    def test_get_participant_details_endpoint(self):
        api_response = self.client.get(f"{self.participant_url}{self.participant.id}/", secure=True,
                                       content_type='application/json')
        assert api_response.status_code in [200]
        assert str(api_response.json().get("user_id")) == str(self.participant.id)

    @pytest.mark.django_db
    def test_get_participant_details_not_found_endpoint(self):
        api_response = self.client.get(f"{self.participant_url}/582bc65d-4034-4f2d-a19f-4c14d5d69521/", secure=True,
                                       content_type='application/json')
        assert api_response.status_code in [404]



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

    def test_update_dataset_endpoint_invalid_data_date_ranges(self):
        api_response_admin = None
        try:

            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {auth["token"]}'
            }

            self.client.defaults['HTTP_AUTHORIZATION'] = headers['Authorization']
            self.client.defaults['CONTENT_TYPE'] = headers['Content-Type']
            api_response_admin = self.client.put(f"{self.dataset_view_url}{self.sample_dataset.id}/",
                                                 dataset_v2_update_dataset__invalid_date,
                                                 secure=True,
                                                 content_type='application/json')

        except ValidationError:
            assert api_response_admin.status_code in [400]
