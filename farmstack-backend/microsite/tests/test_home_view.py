from rest_framework.reverse import reverse
from django.test import Client, TestCase
from rest_framework import status
import json
from datahub.models import Organization, UserOrganizationMap
from accounts.models import User, UserRole

org_for_participant = {
    "user_id": "None",
    "org_email": "singleParticipant@gmaail.com",
    "name": "New participant",
    "phone_number": "5678909876",
    "website": "htttps://google.com",
    "address": {"city": "Banglore"},
}
participant = {
    "user_id": "fghjk",
    "org_email": "Participant@gmaail.com",
    "name": "ABCDE", 
    "phone_number": "5678909876",
    "website": "htttps://google.com",
    "address": {"city": "Manglore"},
}


class MicrositeHomeTestCaseForViews(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        self.participant_url = reverse("participant_microsite-list")
        self.user_role = UserRole.objects.create(
            id="6",
            role_name="datahub_co_steward"
        )
        self.user_role_participant = UserRole.objects.create(
            id="3",
            role_name="datahub_co_steward"
        )
        self.user = User.objects.create(
            email="co_steward@gmail.com",
            role_id=self.user_role.id,
        )
        self.user_with_no_org = User.objects.create(
            email="noorg@gmail.com",
            role_id=self.user_role_participant.id,
        )
        self.user_participant = User.objects.create(
            email="partcipant@gmail.com",
            role_id=self.user_role_participant.id,
        )
        self.another_participant = User.objects.create(
            email="other@gmail.com",
            role_id=self.user_role_participant.id,
        )
        self.creating_org = Organization.objects.create(
            org_email="akshataNaik@dg.org",
            name="costewardOne",
            phone_number="5678909876",
            website="htttps://google.com",
            address=json.dumps({"city": "Banglore"}),
        )
        self.creating_org_for_participant = Organization.objects.create(
            org_email="Aman@dg.org",
            name="participantone",
            phone_number="5678909876",
            website="htttps://google.com",
            address=json.dumps({"city": "Banglore"}),
        )
        self.creating_org_for_other_participant = Organization.objects.create(
            org_email="Amogh@dg.org",
            name="participantTwo",
            phone_number="5678909876",
            website="htttps://google.com",
            address=json.dumps({"city": "Banglore"}),
        )
        UserOrganizationMap.objects.create(user_id=self.another_participant.id, organization_id=self.creating_org_for_other_participant.id)
        UserOrganizationMap.objects.create(user_id=self.user.id, organization_id=self.creating_org.id)
        UserOrganizationMap.objects.create(user_id=self.user_participant.id, organization_id=self.creating_org_for_participant.id)
        org_for_participant["user_id"] = self.another_participant.id,

    # test for invalid url 
    def test_get_participant_list_with_invalid_url(self):
        response = self.client.get(self.participant_url+self.participant_url)
        assert response.status_code == 404


    # GET participant_data_list
    def test_get_participant_list(self):
        response = self.client.get(self.participant_url)
        assert response.status_code == 200
        assert response.json()['results'][0]['organization']['name'] == self.creating_org_for_other_participant.name
        assert response.json()['results'][1]['organization']['name'] == self.creating_org_for_participant.name


    # Get single participant
    def test_get_participant_data(self):
        response = self.client.get(self.participant_url + f"{str(self.another_participant.id,)}/")
        assert response.status_code == 200
        assert response.json().get("organization").get("name") == self.creating_org_for_other_participant.name


    # Return [] array when there is no organization for the user
    def test_get_participant_data_with_no_org(self):
        response = self.client.get(self.participant_url + f"{str(self.user_with_no_org.id)}/")
        assert response.status_code == 200
        assert response.json() == []


    # GET costeward_data_list
    def test_get_co_steward_data_list(self):
        response = self.client.get(self.participant_url + "?co_steward=True")
        assert response.status_code == 200
        assert response.json()['results'][0]['organization']['name'] == self.creating_org.name


    # GET costeward_data
    def test_get_co_steward_data_on_boarded_by(self):
        params = {"on_boarded_by": self.user.id}
        response = self.client.get(self.participant_url, data=params)
        assert response.status_code == 200
        assert response.json()['results'] == []


    # GET costeward_data
    def test_get_participant_data_on_boarded_by(self):
        params = {"on_boarded_by": participant.get("user_id")}
        response = self.client.get(self.participant_url, data=params)
        assert response.status_code == 500
        assert response.json() == 'badly formed hexadecimal UUID string'


    # test for invalid onboarded parameter
    def test_get_co_steward_data_with_invalid_on_boarded_by(self):
        params = {"on_boarded_by": "self.user.id"}
        response = self.client.get(self.participant_url, data=params)
        assert response.status_code == 500
        assert response.json() == 'badly formed hexadecimal UUID string'


    # test for invalid integer onboarded parameter
    def test_get_co_steward_data_with_empty_on_boarded_by(self):
        params = {"on_boarded_by": 12345}
        response = self.client.get(self.participant_url, data=params)
        assert response.status_code == 500
        assert response.json() == 'badly formed hexadecimal UUID string'


