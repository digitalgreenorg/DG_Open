import json
from calendar import c
from unicodedata import category
from urllib import response
from uuid import uuid4

from _pytest.monkeypatch import MonkeyPatch
from accounts.models import User, UserRole
from datahub.models import Datasets, Organization, UserOrganizationMap
from django.test import Client, TestCase
from django.urls import reverse
from participant.models import Connectors, SupportTicket
from requests import request
from requests_toolbelt.multipart.encoder import MultipartEncoder
from rest_framework import serializers

valid_data = {
    "subject": "Not Able to Install",
    "issue_message": "Issue description",
    "issue_attachments": open("datahub/tests/test_data/pro.png", "rb"),
    "status": "open",
    "category": "connectors",
}
dump_data = {
    "subject": "Not Able to Install",
    "issue_message": "Issue description",
    "status": "open",
    "category": "connectors",
}
invalid_data = {
    "issue_message": "Issue description",
    "issue_attachments": open("datahub/tests/test_data/pro.png", "rb"),
}
update_data = {
    "subject": "Not Able to Install",
    "issue_message": "Issue description",
    "status": "closed",
    "category": "connectors",
    "solution_message": "Issue description",
}


class TestViews(TestCase):
    """_summary_

    Args:
        TestCase (_type_): _description_
    """

    def setUp(self) -> None:
        self.client = Client()
        self.support_url = reverse("support-list")

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
        # print(UserOrganizationMap.objects.get(id=user_map.id))
        sup_ticket = SupportTicket.objects.create(
            user_map=UserOrganizationMap.objects.get(id=user_map.id), **dump_data
        )
        print(sup_ticket)

    def test_participant_support_invalid(self):
        """_summary_"""
        invalid_data["user_map"] = 4
        response = self.client.post(self.support_url, invalid_data, secure=True)
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
        valid_data["user_map"] = user_id
        response = self.client.post(self.support_url, valid_data, secure=True)
        assert response.status_code == 201
        assert response.json().get("category") == valid_data.get("category")
        assert response.json().get("status") == valid_data.get("status")

    def test_participant_support_get_list(self):
        user_id = User.objects.get(first_name="ugesh").id
        response = self.client.get(self.support_url, args={"user_id": user_id}, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 0
        assert len(data.get("results")) == 0

    def test_participant_support_update_ticket_details(self):

        id = SupportTicket.objects.get(category="connectors").id
        update_data["user_map"] = self.user_map_id
        response = self.client.put(
            self.support_url + str(id) + "/",
            update_data,
            secure=True,
            content_type="application/json",
        )
        data = response.json()
        assert response.status_code == 201
        assert data.get("subject") == update_data.get("subject")
        assert data.get("status") == update_data.get("status")

    def test_participant_update_ticket_error(self):
        response = self.client.put(
            self.support_url + str(uuid4()) + "/",
            update_data,
            secure=True,
            content_type="application/json",
        )
        data = response.json()
        assert response.status_code == 404
        assert data == {"detail": "Not found."}

    def test_participant_user_details_after_update(self):
        response = self.client.get(self.support_url, secure=True)
        data = response.json()
        assert response.status_code == 200
        # assert data.get("count") == 1
        assert len(data.get("results")) == 0
        # assert data.get("results")[0].get("subject") == update_data.get("subject")
        # assert data.get("results")[0].get("status") == update_data.get("status")

    def test_participant_support_details_empty(self):
        url = self.support_url + str(uuid4()) + "/"
        response = self.client.get(url, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data == []

    def test_participant_support_details(self):
        id = SupportTicket.objects.get(subject="Not Able to Install").id
        url = self.support_url + str(id) + "/"
        response = self.client.get(url, secure=True)
        data = response.json()
        print(data)
        assert response.status_code == 200
        assert data.get("subject") == "Not Able to Install"
        assert data.get("user").get("email") == "ugeshbasa45@digitalgreen.org"


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


class TestParticipantDatasetsViews(TestCase):
    """_summary_

    Args:
        TestCase (_type_): _description_
    """

    def setUp(self) -> None:
        self.client = Client()
        self.datasets_url = reverse("participant_datasets-list")
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

    def test_participant_datasets_invalid(self):
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

    def test_participant_root_datasets_valid(self):
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

    def test_participant_member2_datasets_valid(self):
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

    def test_participant_datasets_get_list(self):
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

    def test_participant_datasets_get_list_with_organization(self):
        org_id = Organization.objects.get(org_email="bglordg@digitalgreen.org").id
        response = self.client.get(self.datasets_url, {"org_id": org_id}, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 1
        assert len(data.get("results")) == 1

    def test_participant_datasets_update_details(self):
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

    def test_participant_datasets_update_error(self):
        response = self.client.put(
            self.datasets_url + str(uuid4()) + "/",
            datasets_update_data,
            secure=True,
            content_type="application/json",
        )
        data = response.json()
        assert response.status_code == 404
        assert data == {"detail": "Not found."}

    def test_participant_datasets_after_update(self):
        response = self.client.get(self.datasets_url, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 0
        assert len(data.get("results")) == 0
        org_id = Organization.objects.get(org_email="bglordg@digitalgreen.org").id
        response = self.client.get(self.datasets_url, {"org_id": org_id}, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 1
        assert len(data.get("results")) == 1
        assert data.get("results")[0].get("name") == "dump datasets"
        assert data.get("results")[0].get("category") == datasets_dump_data.get("category")
        assert data.get("results")[0].get("geography") == datasets_dump_data.get("geography")

    def test_participant_datasets_details_empty(self):
        url = self.datasets_url + str(uuid4()) + "/"
        response = self.client.get(url, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data == {}

    def test_participant_datasets_details(self):
        id = Datasets.objects.get(name=datasets_dump_data.get("name")).id
        url = self.datasets_url + str(id) + "/"
        response = self.client.get(url, secure=True)
        assert response.status_code == 200
        assert response.json().get("name") == datasets_dump_data.get("name")
        assert response.json().get("category") == datasets_dump_data.get("category")
        assert response.json().get("geography") == datasets_dump_data.get("geography")
        assert response.json().get("user").get("email") == "ugeshbasa_member2@digitalgreen.org"
        assert response.json().get("organization").get("org_email") == "bglordg@digitalgreen.org"

    def test_participant_datasest_deleate(self):
        id = Datasets.objects.get(name="dump datasets").id
        response = self.client.delete(self.datasets_url + str(id) + "/", secure=True)
        assert response.status_code == 204

    def test_participant_datasest_filter(self):
        url = self.datasets_url + "filters_tickets/"
        data = {"category__in": [datasets_dump_data.get("category"), datasets_update_data.get("category")]}
        response = self.client.post(url, data, secure=True)
        data = response.json().get("results")[0]
        assert response.status_code == 200
        assert data.get("name") == datasets_dump_data.get("name")
        assert data.get("category") == datasets_dump_data.get("category")
        assert data.get("geography") == datasets_dump_data.get("geography")
        assert data.get("organization").get("org_email") == "bglordg@digitalgreen.org"

    def test_participant_datasest_filter_error(self):
        url = self.datasets_url + "filters_tickets/"
        data = {"category__innnn": [datasets_dump_data.get("category"), datasets_update_data.get("category")]}
        response = self.client.post(url, data, secure=True)
        assert response.json() == "Invalid filter fields: ['category__innnn']"
        assert response.status_code == 500


connectors_dump_data = {
    "connector_name": "chilli datasets",
    "connector_type": "provider",
    "connector_description": "soil_data",
    "application_port": 2000,
    "usage_policy": "hash",
}
connectors_update_data = {
    "connector_name": "chilli",
    "connector_type": "provider",
    "connector_description": "ch_datillia",
    "application_port": 2000,
    "usage_policy": "hash",
}

connectors_valid_data = {
    "connector_name": "chilli datasets",
    "connector_type": "provider",
    "connector_description": "soil_data",
    "application_port": 2000,
    "usage_policy": "hash",
}

connectors_invalid_data = {
    "connector_type": "provider",
    "connector_description": "soil_data",
    "application_port": 2000,
    "usage_policy": "hash",
}


class TestParticipantConnectorsViews(TestCase):
    """_summary_

    Args:
        TestCase (_type_): _description_
    """

    def setUp(self) -> None:
        self.client = Client()
        self.connectors_url = reverse("participant_connectors-list")
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
        dataset = Datasets.objects.create(
            user_map=UserOrganizationMap.objects.get(id=user_map.id), **datasets_dump_data
        )
        self.user_map_id = user_map.id
        con = Connectors.objects.create(dataset=dataset.id, **connectors_dump_data)
        print(con)
        self.dataset = dataset.id

    def test_participant_connectors_invalid(self):
        """_summary_"""
        connectors_invalid_data["dataset"] = self.dataset
        response = self.client.post(self.connectors_url, connectors_invalid_data, secure=True)
        assert response.status_code == 400
        assert response.json() == {"connector_name": ["This field is required."]}

    def test_participant_root_connectors_valid(self):
        """_summary_"""
        connectors_valid_data["dataset"] = self.dataset
        connectors_valid_data["name"] = "connector 1"
        response = self.client.post(self.connectors_url, connectors_valid_data, secure=True)
        assert response.status_code == 201
        assert response.json().get("connector_name") == connectors_valid_data.get("connector_name")
        assert response.json().get("connector_type") == connectors_valid_data.get("connector_type")
        assert response.json().get("application_port") == connectors_valid_data.get("application_port")
        assert response.json().get("usage_policy") == connectors_valid_data.get("usage_policy")

    def test_participant_connectors_get_list(self):
        user_id = User.objects.get(email="ugeshbasa_member2@digitalgreen.org").id
        response = self.client.get(self.connectors_url, {"user_id": user_id}, secure=True)
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
        assert response.json().get("results")[0].get("connector_name") == connectors_valid_data.get("connector_name")
        assert response.json().get("results")[0].get("connector_type") == connectors_valid_data.get("connector_type")
        assert response.json().get("results")[0].get("application_port") == connectors_valid_data.get(
            "application_port"
        )
        assert response.json().get("results")[0].get("usage_policy") == connectors_valid_data.get("usage_policy")


    def test_participant_connectors_update_details(self):
        id = Connectors.objects.get(connector_name="chilli datasets").id
        print(id)
        connectors_update_data["user_map"] = self.user_map_id
        response = self.client.put(
            self.connectors_url + str(id) + "/",
            connectors_update_data,
            secure=True,
            content_type="application/json",
        )
        assert response.status_code == 201
        assert response.json().get("connector_name") == connectors_update_data.get("connector_name")
        assert response.json().get("connector_type") == connectors_update_data.get("connector_type")
        assert response.json().get("application_port") == connectors_update_data.get("application_port")
        assert response.json().get("usage_policy") == connectors_update_data.get("usage_policy")

    def test_participant_connectors_update_error(self):
        response = self.client.put(
            self.connectors_url + str(uuid4()) + "/",
            datasets_update_data,
            secure=True,
            content_type="application/json",
        )
        data = response.json()
        assert response.status_code == 404
        assert data == {"detail": "Not found."}

    def test_participant_connectors_after_update(self):
        response = self.client.get(self.connectors_url, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 0
        assert len(data.get("results")) == 0
        user_id = User.objects.get(email="ugeshbasa_member2@digitalgreen.org").id
        response = self.client.get(self.connectors_url, {"user_id": user_id}, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 1
        assert len(data.get("results")) == 1
        assert response.json().get("results")[0].get("connector_name") == connectors_update_data.get("connctor_name")
        assert response.json().get("results")[0].get("connector_type") == connectors_update_data.get("connector_type")
        assert response.json().get("results")[0].get("application_port") == connectors_update_data.get(
            "application_port"
        )
        assert response.json().get("results")[0].get("usage_policy") == connectors_update_data.get("usage_policy")

    def test_participant_connectors_details_empty(self):
        url = self.connectors_url + str(uuid4()) + "/"
        response = self.client.get(url, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data == {}

    def test_participant_connectors_details(self):
        id = Connectors.objects.get(connector_name="chilli datasets").id
        url = self.connectors_url + str(id) + "/"
        response = self.client.get(url, secure=True)
        assert response.status_code == 200
        assert response.json().get("connector_name") == connectors_update_data.get("connector_name")
        assert response.json().get("connector_type") == connectors_update_data.get("connector_type")
        assert response.json().get("application_port") == connectors_update_data.get("application_port")
        assert response.json().get("usage_policy") == connectors_update_data.get("usage_policy")

    def test_participant_connectors_deleate(self):
        id = Connectors.objects.get(connector_name="chilli datasets").id
        response = self.client.delete(self.connectors_url + str(id) + "/", secure=True)
        assert response.status_code == 204
        user_id = User.objects.get(email="ugeshbasa_member2@digitalgreen.org").id
        response = self.client.get(self.connectors_url, {"user_id": user_id}, secure=True)
        data = response.json()
        assert response.status_code == 200
        assert data.get("count") == 0
        assert len(data.get("results")) == 0

    def test_participant_connectors_filter(self):
        url = self.connectors_url + "filter_connectors/"
        data = {"connector_name__in": [connectors_dump_data.get("connector_name"), connectors_update_data.get("connector_name")]}
        response = self.client.post(url, data, secure=True)
        data = response.json().get("results")[0]
        assert response.status_code == 200
        assert data.get("connector_name") == connectors_dump_data.get("connector_name")
        assert data.get("connector_type") == connectors_dump_data.get("connector_type")
        assert data.get("application_port") == connectors_dump_data.get("application_port")
        assert data.get("usage_policy") == connectors_dump_data.get("usage_policy")


    def test_participant_connectors_filter_error(self):
        url = self.connectors_url + "filter_connectors/"
        data = {"connector_name__innnn": [connectors_dump_data.get("connector_name"), connectors_update_data.get("connector_name")]}
        response = self.client.post(url, data, secure=True)
        assert response.json() == "Invalid filter fields: ['connector_name__innnn']"
        assert response.status_code == 500
