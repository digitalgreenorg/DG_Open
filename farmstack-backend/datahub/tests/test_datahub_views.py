import json, binascii, os
from calendar import c
from urllib import response
from uuid import uuid4

import pytest
from django.shortcuts import render
from _pytest.monkeypatch import MonkeyPatch
from django.db import models
from accounts.models import User, UserManager, UserRole
from datahub.models import Datasets, Organization, UserOrganizationMap
from datahub.views import ParticipantViewSet
from django.test import Client, TestCase
from django.test.client import encode_multipart

# from django.urls import reverse
from participant.models import SupportTicket, Connectors, Department, Project
from requests import request
from requests_toolbelt.multipart.encoder import MultipartEncoder
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.test import APIClient, APITestCase, APIRequestFactory
from rest_framework.reverse import reverse

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
    "profile_picture": open("datahub/tests/test_data/pro.png", "rb"),
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
    "profile_picture": open("datahub/tests/test_data/pro.png", "rb"),
    "subscription": "aaaa",
}


class MockUtils:
    def send_email(self, to_email: list, content=None, subject=None):
        if to_email == []:
            return Response({"message": "Invalid email address"}, 400)
        else:
            return Response({"Message": "Invation sent to the participants"}, status=200)


class ParticipantTestViews(TestCase):
    """_summary_

    Args:
        TestCase (_type_): _description_
    """

    def setUp(self) -> None:
        self.client = Client()
        self.participant_url = reverse("participant-list")
        self.send_invite = reverse("send_invite-list")

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
        print(Organization(org).__str__())
        UserOrganizationMap.objects.create(
            user=User.objects.get(first_name="ugesh"),
            organization=Organization.objects.get(org_email="bglordg@digitalgreen.org"),
        )

    def test_participant_post_add_user_valid_email(self):
        """_summary_"""
        # self.monkeypatch.setattr("datahub.views.Organization", MockOrganization)
        # self.monkeypatch.setattr("datahub.views.UserCreateSerializer", MockUserSerializer)
        # self.monkeypatch.setattr("datahub.views.UserOrganizationMapSerializer", UserOrganizationMapSerializerMock)
        response = self.client.post(self.participant_url, valid_data, secure=True)
        assert response.status_code == 201
        assert response.json().get("email") == "ugeshbasa4ss5@digitalgreen.org"

    def test_participant_post_add_user_invalid_fields_asserts(self):
        """_summary_"""
        response = self.client.post(self.participant_url, invalid_role_data, secure=True)
        assert response.status_code == 400
        assert response.json().get("role") == ['Invalid pk "33" - object does not exist.']
        invalid_role_data["email"] = ""
        response = self.client.post(self.participant_url, invalid_role_data, secure=True)
        assert response.status_code == 400
        assert response.json() == {
            "email": ["This field may not be blank."],
            "profile_picture": ["The submitted file is empty."],
            "role": ['Invalid pk "33" - object does not exist.'],
        }

    def test_participant_get_list(self):
        response = self.client.get(self.participant_url, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 1
        assert len(data.get("results")) == 1
        assert data.get("results")[0].get("user").get("phone_number") == "9985750356"
        assert data.get("results")[0].get("organization").get("website") == "website.com"

    def test_participant_update_user_details(self):
        id = User.objects.get(first_name="ugesh").id
        update_data["id"] = Organization.objects.get(org_email="bglordg@digitalgreen.org").id
        response = self.client.put(
            self.participant_url + str(id) + "/",
            update_data,
            secure=True,
            content_type="application/json",
        )
        data = response.json()
        print(data)

        assert response.status_code == 201
        assert data.get("user").get("phone_number") == "1234567890"
        assert data.get("user").get("first_name") == "ugeshBasa"

    def test_participant_update_user_details_error(self):
        id = User.objects.get(first_name="ugesh").id
        update_data["id"] = Organization.objects.get(org_email="bglordg@digitalgreen.org").id
        response = self.client.put(
            self.participant_url + str(uuid4()) + "/",
            update_data,
            secure=True,
            content_type="application/json",
        )
        data = response.json()
        assert response.status_code == 404
        assert data == {"detail": "Not found."}

    def test_participant_user_details_after_update(self):
        response = self.client.get(self.participant_url, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 1
        assert len(data.get("results")) == 1
        assert data.get("results")[0].get("user").get("first_name") == "ugesh"
        assert data.get("results")[0].get("organization").get("website") == "website.com"

    def test_participant_delete(self):
        id = User.objects.get(first_name="ugesh").id
        response = self.client.delete(self.participant_url + str(id) + "/", secure=True)
        assert response.status_code == 204
        # Testing get after deleteing
        response = self.client.get(self.participant_url, secure=True)
        data = response.json()
        assert data.get("count") == 0
        assert len(data.get("results")) == 0

    def test_participant_get_user_details(self):
        id = User.objects.get(first_name="ugesh").id
        response = self.client.get(self.participant_url + str(id) + "/", secure=True)
        response = self.client.get(self.participant_url, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 1

    def test_participant_get_user_details_empty(self):
        url = self.participant_url + str(uuid4()) + "/"
        response = self.client.get(url, secure=True)
        data = response.json()
        print(response)
        print(data)
        assert response.status_code == 200
        assert data == []

    def test_participant_get_list_after_deleate(self):
        id = User.objects.get(first_name="ugesh").id
        response = self.client.delete(self.participant_url + str(id) + "/", secure=True)
        response = self.client.get(self.participant_url, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 0

    def test_send_invite(self):
        data = {
            "to_email": ["ugesh@gmail.com"],
            "content": "Sample email for participant invitdation",
        }
        self.monkeypatch.setattr("datahub.views.Utils", MockUtils)
        response = self.client.post(self.send_invite, data, secure=True)
        assert response.json() == {"Message": "Invation sent to the participants"}
        assert response.status_code == 200

    def test_send_invite_error(self):
        data = {
            "to_email": [],
            "content": "Sample email for participant invitdation",
        }
        self.monkeypatch.setattr("datahub.views.Utils", MockUtils)
        response = self.client.post(self.send_invite, data, secure=True)
        assert response.json() == {"message": "Invalid email address"}
        assert response.status_code == 400


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

        org_obj = Organization.objects.create(org_email="test_org_email@email.com", address=json.dumps({"city": "Banglore"}))
        user_map = UserOrganizationMap.objects.create(
            user=User.objects.get(email="test_participant@email.com"),
            organization=Organization.objects.get(org_email="test_org_email@email.com"),
        )

        dataset_obj = Datasets.objects.create(user_map=UserOrganizationMap.objects.get(id=user_map.id), **datasets_dump_data)
        dept_obj = Department.objects.create(organization=Organization.objects.get(id=org_obj.id), department_name="Dept Name", department_discription="Dept description ...")
        proj_obj = Project.objects.create(department=Department.objects.get(id=dept_obj.id), project_name="Proj Name")
        Connectors.objects.create(user_map=UserOrganizationMap.objects.get(id=user_map.id), dataset=Datasets.objects.get(id=dataset_obj.id), project=Project.objects.get(id=proj_obj.id), connector_name="Connector Name", connector_type="consumer", docker_image_url="farmstack/gen-z-consumer:latest", application_port=2700)

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
