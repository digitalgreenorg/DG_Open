import io
import json
import uuid

# from django.utils.datastructures import MultiValueDict
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, TestCase
from rest_framework.reverse import reverse
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User, UserRole
from datahub.models import Organization, UserOrganizationMap
from participant.models import Resolution, SupportTicketV2


class PicklableFile(io.BytesIO):
    def __reduce__(self):
        return (self.__class__, (), {"value": self.getvalue()})


auth = {"token": "null"}


class SupportTicketTestCaseForViews(TestCase):
    """Support tickets test cases"""

    def setUp(self) -> None:
        self.client = Client()
        self.support_ticket_url = reverse("support_tickets-list")
        self.support_resolution_url = reverse(
            "support_tickets_resolutions-list")

        self.user_role = UserRole.objects.create(
            id="1", role_name="datahub_admin")
        self_user_role_participant = UserRole.objects.create(
            id=3, role_name="datahub_participant_root")

        self.user = User.objects.create(
            email="admin@gmail.com",
            role_id=self.user_role.id,
        )
        self.user_participant = User.objects.create(
            email="participant@gmail.com",
            role_id=self_user_role_participant.id,
        )
        self.creating_org = Organization.objects.create(
            org_email="akshataNaik@dg.org",
            name="Admin",
            phone_number="5678909876",
            website="htttps://google.com",
            address=({"city": "Banglore"}),
        )
        self.creating_org_participant = Organization.objects.create(
            org_email="participant@dg.org",
            name="Participant One",
            phone_number="5678909876",
            website="htttps://google.com",
            address=({"city": "Banglore"}),
        )
        UserOrganizationMap.objects.create(
            user_id=self.user.id, organization_id=self.creating_org.id)
        self.user_map = UserOrganizationMap.objects.create(
            user_id=self.user_participant.id, organization_id=self.creating_org_participant.id
        )
        # print("self.user_map value",self.user_map)

        self.create_support_ticket_one = SupportTicketV2.objects.create(
            ticket_title="Support ticket 1",
            category="connectors",
            description="description about support ticket 1",
            status="open",
            user_map=self.user_map,
        )

        # support_id = self.create_support_ticket_one.id
        self.create_resolution_one = Resolution.objects.create(
            ticket=self.create_support_ticket_one, user_map=self.user_map, resolution_text="resolution in self"
        )

        # print("value user",self.create_support_ticket_one)
        self.create_support_ticket_two = SupportTicketV2.objects.create(
            ticket_title="Support ticket 2",
            category="certificate",
            description="description about support ticket 2",
            status="closed",
            user_map=UserOrganizationMap.objects.create(
                user_id=self.user_participant.id, organization_id=self.creating_org_participant.id
            ),
        )

        refresh = RefreshToken.for_user(self.user_participant)
        refresh["org_id"] = str(
            self.user_map.organization_id) if self.user_map else None  # type: ignore
        refresh["map_id"] = str(self.user_map.id) if self.user_map else None
        refresh["role"] = str(self.user_participant.role_id)
        refresh["onboarded_by"] = str(self.user_participant.on_boarded_by_id)

        refresh.access_token["org_id"] = str(
            self.user_map.organization_id) if self.user_map else None  # type: ignore
        refresh.access_token["map_id"] = str(
            self.user_map.id) if self.user_map else None
        refresh.access_token["role"] = str(self.user_participant.role_id)
        refresh.access_token["onboarded_by"] = str(
            self.user_participant.on_boarded_by_id)
        auth["token"] = refresh.access_token

        self.client = Client()
        headers = {"Content-Type": "application/json",
                   "Authorization": f'Bearer {auth["token"]}'}
        self.client.defaults["HTTP_AUTHORIZATION"] = headers["Authorization"]
        self.client.defaults["CONTENT_TYPE"] = headers["Content-Type"]

    # test case for get method(valid case)
    def test_suppport_ticket_retrieve_valid(self):
        support_id = self.create_support_ticket_one.id
        response = self.client.get(
            self.support_ticket_url + f"{support_id}/", secure=True)
        data = response.json()
        # print("***test_suppport_ticket_retrieve_valid***", data)
        # print("***test_suppport_ticket_retrieve_valid***", response.status_code)
        assert response.status_code == 200
        assert data["ticket"]["id"] == str(support_id)

    # test case for get method(invalid case)
    def test_suppport_ticket_retrieve_invalid(self):
        random_uuid = uuid.uuid4()
        response = self.client.get(
            self.support_ticket_url + f"{random_uuid}/", secure=True)
        data = response.json()
        # print("***test_suppport_ticket_retrieve_invalid***", data)
        # print("***test_suppport_ticket_retrieve_invalid***", response.status_code)
        assert response.status_code == 404
        assert data["message"] == "No ticket found for this id."

    # test case for get method(valid case)
    def test_suppport_ticket_update_valid(self):
        support_id = self.create_support_ticket_one.id
        support_valid_data = {"status": "closed"}
        response = self.client.put(
            self.support_ticket_url + f"{support_id}/",
            json.dumps(support_valid_data),
            content_type="application/json",
            secure=True,
        )
        data = response.json()
        # print("***test_suppport_ticket_update_valid***", data)
        # print("***test_suppport_ticket_update_valid***", response.status_code)
        assert response.status_code == 200
        assert data["status"] == "closed"

    # test case for get method(invalid case)
    def test_suppport_ticket_update_invalid(self):
        support_id = self.create_support_ticket_one.id

        # ticket_title update invalid
        support_invalid_data = {"ticket_title": "Support ticket 1 updated"}
        response = self.client.put(
            self.support_ticket_url + f"{support_id}/",
            json.dumps(support_invalid_data),
            content_type="application/json",
            secure=True,
        )
        # print("***test_suppport_ticket_update_invalid ticket title***", data)
        # print("***test_suppport_ticket_update_invalid ticket title***", response.status_code)
        assert response.status_code == 200
        assert response.get("ticket_title", "") == ""

        # invalid description update
        support_invalid_data = {"description": "description updated"}
        response = self.client.put(
            self.support_ticket_url + f"{support_id}/",
            json.dumps(support_invalid_data),
            content_type="application/json",
            secure=True,
        )
        data = response.json()
        assert response.status_code == 200
        assert response.get("description", "") == ""

    # test case for create method(invalid case)

    def test_suppport_resolution_create_invalid_with_file(self):
        """Support Resolution test cases"""
        support_id = self.create_support_ticket_one.id

        resolution_invalid_data = {
            "ticket": str(support_id),
            "user_map": str(self.user_map),
            "resolution_text": "this is resolution",
            "solution_attachments": open("participant/tests/test_data/image_5mb.png", "rb"),
        }

        response = self.client.post(
            self.support_resolution_url, data=resolution_invalid_data, secure=True)  # type: ignore
        # data = response.json()
        # print("***test_suppport_resolution_create_invalid_with_file data***", response.json())
        # print("***test_suppport_resolution_create_invalid_with_file status_code***", response.status_code)
        assert response.status_code == 400
        assert response.json() == {"solution_attachments": [
            "You cannot upload file more than 2Mb"]}

    # test case for create method(valid case)
    def test_suppport_resolution_create_valid(self):
        support_id = self.create_support_ticket_one.id
        # Create a simple text file for testing the solution_attachments field
        file_content = b"This is a test file content."
        file = SimpleUploadedFile(
            "test_file.txt", file_content, content_type="text/plain")

        resolution_valid_data = {
            "ticket": str(support_id),
            "user_map": str(self.user_map),
            "resolution_text": "this is resolution",
        }
        response = self.client.post(
            self.support_resolution_url, resolution_valid_data, secure=True)
        data = response.json()
        # print("***test_suppport_resolution_create_valid data***", data)
        # print("***test_suppport_resolution_create_valid status_code***", response.status_code)
        # print("***test_suppport_resolution_create_valid ticket***", (self.client.get(self.support_ticket_url+f"{support_id}/").json))
        assert response.status_code == 201
        assert data["resolution_text"] == resolution_valid_data["resolution_text"]
        assert data["ticket"] == str(support_id)

    # test case for create method(valid case)
    def test_suppport_resolution_create_valid_with_file(self):
        support_id = self.create_support_ticket_one.id

        resolution_valid_data = {
            "ticket": str(support_id),
            "user_map": str(self.user_map),
            "resolution_text": "this is resolution with file",
            "solution_attachments": open("participant/tests/test_data/sample.pdf", "rb"),
        }
        response = self.client.post(
            self.support_resolution_url, resolution_valid_data, secure=True)
        data = response.json()
        # print("***test_suppport_resolution_create_valid_with_file data***", data)
        # print("***test_suppport_resolution_create_valid_with_file status_code***", response.status_code)
        assert response.status_code == 201
        assert data["resolution_text"] == resolution_valid_data["resolution_text"]

    # test case for create method(invalid case)
    def test_suppport_resolution_create_invalid_text(self):
        support_id = self.create_support_ticket_one.id

        # empty resolution text
        resolution_invalid_data = {"ticket": str(support_id), "user_map": str(
            self.user_map), "resolution_text": ""}
        response = self.client.post(
            self.support_resolution_url,
            resolution_invalid_data,
            # content_type="application/json",
            secure=True,
        )
        data = response.json()
        # print("***test_suppport_resolution_create_invalid_text data***", data)
        # print("***test_suppport_resolution_create_invalid_text status_code***",
        #   response.status_code)
        assert response.status_code == 400
        assert data["resolution_text"] == ["This field may not be blank."]

        # length 1000 resolution text
        resolution_invalid_data = {
            "ticket": str(support_id),
            "user_map": str(self.user_map),
            "resolution_text": "gfjfhdhffjhffgbfgjgnrkjnrkvrjvnjrkvjrfvnrvjknerfcjnkfcejf4ebfjendfeeffnkjrnfkrjfnkrjfrrhbvjrvrfvifkvfrkvfrvnrfkfkffnrkfnkjnfrkjhiuerehicnjfrfvkrjfnrkjfnerfjknrejfrbhjfrbhjfdhjkfjkhfrjkhfrjknrfjkngfjgjkngrjfrjhhjgrhjbgrhjhrjrjkrjgrjkrehjdeegjknrgrkkjgfjfhdhffjhffgbfgjgnrkjnrkvrjvnjrkvjrfvnrvjknerfcjnkfcejf4ebfjendfeeffnkjrnfkrjfnkrjfrrhbvjrvrfvifkvfrkvfrvnrfkfkffnrkfnkjnfrkjhiuerehicnjfrfvkrjfnrkjfnerfjknrejfrbhjfrbhjfdhjkfjkhfrjkhfrjknrfjkngfjgjkngrjfrjhhjgrhjbgrhjhrjrjkrjgrjkrehjdeegjknrgrkkjgfjfhdhffjhffgbfgjgnrkjnrkvrjvnjrkvjrfvnrvjknerfcjnkfcejf4ebfjendfeeffnkjrnfkrjfnkrjfrrhbvjrvrfvifkvfrkvfrvnrfkfkffnrkfnkjnfrkjhiuerehicnjfrfvkrjfnrkjfnerfjknrejfrbhjfrbhjfdhjkfjkhfrjkhfrjknrfjkngfjgjkngrjfrjhhjgrhjbgrhjhrjrjkrjgrjkrehjdeegjknrgrkkjeegfjfhdhffjhffgbfgjgnrkjnrkvrjvnjrkvjrfvnrvjknerfcjnkfcejf4ebfjendfeeffnkjrnfkrjfnkrjfrrhbvjrvrfvifkvfrkvfrvnrfkfkffnrkfnkjnfrkjhiuerehicnjfrfvkrjfnrkjfnerfjknrejfrbhjfrbhjfdhjkfjkhfrjkhfrjknrfjkngfjgjkngrjfrjhhjgrhjbgrhjhrjrjkrjgrjkrehjdeegjknrgrkkjhhhh",
        }

        response = self.client.post(
            self.support_resolution_url,
            resolution_invalid_data,
            # content_type="application/json",
            secure=True,
        )
        data = response.json()
        assert response.status_code == 400
        assert data["resolution_text"] == [
            "Ensure this field has no more than 1000 characters."]

    # test case for update method(valid case)
    def test_suppport_resolution_update_valid_text(self):
        resolution_id = self.create_resolution_one.id
        resolution_valid_data = {
            "resolution_text": "resolution in self updated"}

        response = self.client.put(
            self.support_resolution_url + f"{resolution_id}/",
            resolution_valid_data,
            content_type="application/json",
            secure=True,
        )
        data = response.json()
        # print("***test_suppport_resolution_update_valid_text***", response.status_code)
        # print("***test_suppport_resolution_update_valid_text json***", data)
        assert response.status_code == 200
        assert data["resolution_text"] == resolution_valid_data["resolution_text"]

    # test case for update method(invalid case)
    def test_suppport_resolution_update_invalid_text(self):
        resolution_id = self.create_resolution_one.id

        # null resolution text
        resolution_invalid_data = {"resolution_text": ""}

        response = self.client.put(
            self.support_resolution_url + f"{resolution_id}/",
            resolution_invalid_data,
            content_type="application/json",
            secure=True,
        )
        data = response.json()
        # print("***test_suppport_resolution_update_invalid_text***", response.status_code)
        # print("***test_suppport_resolution_update_invalid_text json***", data)
        assert response.status_code == 400
        assert data["resolution_text"] == ["This field may not be blank."]

        # length 1000 resolution text
        resolution_invalid_data = {
            "resolution_text": "gfjfhdhffjhffgbfgjgnrkjnrkvrjvnjrkvjrfvnrvjknerfcjnkfcejf4ebfjendfeeffnkjrnfkrjfnkrjfrrhbvjrvrfvifkvfrkvfrvnrfkfkffnrkfnkjnfrkjhiuerehicnjfrfvkrjfnrkjfnerfjknrejfrbhjfrbhjfdhjkfjkhfrjkhfrjknrfjkngfjgjkngrjfrjhhjgrhjbgrhjhrjrjkrjgrjkrehjdeegjknrgrkkjgfjfhdhffjhffgbfgjgnrkjnrkvrjvnjrkvjrfvnrvjknerfcjnkfcejf4ebfjendfeeffnkjrnfkrjfnkrjfrrhbvjrvrfvifkvfrkvfrvnrfkfkffnrkfnkjnfrkjhiuerehicnjfrfvkrjfnrkjfnerfjknrejfrbhjfrbhjfdhjkfjkhfrjkhfrjknrfjkngfjgjkngrjfrjhhjgrhjbgrhjhrjrjkrjgrjkrehjdeegjknrgrkkjgfjfhdhffjhffgbfgjgnrkjnrkvrjvnjrkvjrfvnrvjknerfcjnkfcejf4ebfjendfeeffnkjrnfkrjfnkrjfrrhbvjrvrfvifkvfrkvfrvnrfkfkffnrkfnkjnfrkjhiuerehicnjfrfvkrjfnrkjfnerfjknrejfrbhjfrbhjfdhjkfjkhfrjkhfrjknrfjkngfjgjkngrjfrjhhjgrhjbgrhjhrjrjkrjgrjkrehjdeegjknrgrkkjeegfjfhdhffjhffgbfgjgnrkjnrkvrjvnjrkvjrfvnrvjknerfcjnkfcejf4ebfjendfeeffnkjrnfkrjfnkrjfrrhbvjrvrfvifkvfrkvfrvnrfkfkffnrkfnkjnfrkjhiuerehicnjfrfvkrjfnrkjfnerfjknrejfrbhjfrbhjfdhjkfjkhfrjkhfrjknrfjkngfjgjkngrjfrjhhjgrhjbgrhjhrjrjkrjgrjkrehjdeegjknrgrkkjhhhh"
        }

        response = self.client.put(
            self.support_resolution_url + f"{resolution_id}/",
            resolution_invalid_data,
            content_type="application/json",
            secure=True,
        )
        data = response.json()
        assert response.status_code == 400
        assert data["resolution_text"] == [
            "Ensure this field has no more than 1000 characters."]
