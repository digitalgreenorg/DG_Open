from rest_framework.reverse import reverse
from django.test import Client, TestCase
from rest_framework import status
import json
from datahub.models import Organization, UserOrganizationMap
from accounts.models import User, UserRole
from participant.models import SupportTicketV2
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.uploadedfile import SimpleUploadedFile
from test_util import TestUtils

auth_co_steward= {
    "token": "null"
}

auth_participant={
   "token": "null" 
}



class  SupportTicketNewRequestTestCaseForViews(TestCase):

    def setUp(self) -> None:
        self.client = Client()
        self.client_participant = Client()
        self.support_ticket_url = reverse("support_tickets-list")
        self.user_role_participant = UserRole.objects.create(id=3, role_name="datahub_participant_root")
        self.user_costeward_role = UserRole.objects.create(id=6, role_name="datahub_co_steward")
        self.user_participant = User.objects.create(
            email="akshata@digitalgreen.org",
            role_id=self.user_role_participant.id,
        )
        self.user_co_steward = User.objects.create(
            email="costeward@digitalgreen.org",
            role_id=self.user_costeward_role.id,
        )
        self.creating_org_participant = Organization.objects.create(
            org_email="participant@digitalgreen.org",
            name="Participant One",
            phone_number="5678909876",
            website="htttps://google.com",
            address=({"city": "Banglore"}),
        )
        self.creating_co_steward = Organization.objects.create(
            org_email="costewdardorg@digitalgreen.org",
            name="Co-steward",
            phone_number="1234567890",
            website="htttps://google.com",
            address=({"city": "Banglore"}),
        )
        self.user_co_steward_map=UserOrganizationMap.objects.create(user_id=self.user_co_steward.id, organization_id=self.creating_co_steward.id)
        self.user_map_participant=UserOrganizationMap.objects.create(user_id=self.user_participant.id, organization_id=self.creating_org_participant.id)


        # Access token for Co-steward
        auth_co_steward["token"] =  TestUtils.create_token_for_user(self.user_co_steward, self.user_co_steward_map)
        co_steward_header=self.set_auth_headers(co_steward=True)
        self.client.defaults['HTTP_AUTHORIZATION'] = co_steward_header[0]
        self.client.defaults['CONTENT_TYPE'] = co_steward_header[1]


        # Access token for Participant
        auth_participant["token"] = TestUtils.create_token_for_user(self.user_participant, self.user_map_participant)
        participant_header=self.set_auth_headers(participant=True)
        self.client_participant.defaults['HTTP_AUTHORIZATION'] = participant_header[0]
        self.client_participant.defaults['CONTENT_TYPE'] = participant_header[1]


    #Generic function to return headers 
    def set_auth_headers(self,participant=False, co_steward=True):  
        auth_data = auth_participant if participant else auth_co_steward 
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_data["token"]}'
        }
        return headers['Authorization'],headers['Content-Type']
    
    # Positive test cases
    def test_ticket_creation_with_participant(self):
        data={
            "ticket_title":"Support ticket by participant",
            "category":"connectors",
            "description":"description about support ticket 1........",
            "status": "open",
            "user_map":str(self.user_map_participant.id)
          }
        response = self.client_participant.post(self.support_ticket_url, json.dumps(data), content_type='application/json')
        assert response.status_code == 201
        assert response.json()['ticket_title']==data["ticket_title"]
        assert response.json()['description']==data["description"]
        assert response.json()['category']==data["category"]
        

    def test_ticket_creation_with_co_steward(self):
        data={
            "ticket_title":"Support ticket by co-steward",
            "category":"connectors",
            "description":"description about support ticket..........",
            "status": "open",
            "user_map":str(self.user_co_steward_map.id) 
            }
        response = self.client.post(self.support_ticket_url, json.dumps(data), content_type='application/json')
        assert response.status_code == 201
        assert response.json()['ticket_title']==data["ticket_title"]
        assert response.json()['description']==data["description"]
        assert response.json()['category']==data["category"]

    def test_ticket_creation_with_valid_data(self):
        with open("participant/tests/image/png_cactus_5662.png", "rb") as file:
            ticket_attachment_file_obj = file.read()
        ticket_attachment_file = SimpleUploadedFile("png_cactus_5662.png", ticket_attachment_file_obj, content_type="image/png")     
        data={
            "ticket_title":"Support ticket by participant",
            "category":"connectors",
            "description":"description about support ticket 1........",
            "status": "open",
            "ticket_attachment": ticket_attachment_file,
            "user_map":str(self.user_map_participant.id)
          }

        response = self.client_participant.post(self.support_ticket_url, data,format="multipart")
        assert response.status_code == 201
        assert response.json()['ticket_title']==data["ticket_title"]
        assert response.json()['description']==data["description"]
        assert response.json()['category']==data["category"]

    # Negative test cases
    def test_ticket_creation_with_file_gt_2_mb(self):
        with open("participant/tests/image/image_5mb.png", 'rb') as file:
            ticket_attachment_file_obj = file.read()
        ticket_attachment_file = SimpleUploadedFile("image_5mb.png", ticket_attachment_file_obj, content_type="image/png")
        data={
                    "ticket_title":"Support ticket 1",
                    "category":"connectors",
                    "description":"description about support ticket 1",
                    "status": "open",
                    "ticket_attachment": ticket_attachment_file,
                    "user_map":str(self.user_map_participant.id)
                }
        response = self.client_participant.post(self.support_ticket_url, data, format="multipart")
        assert response.status_code == 400
        assert response.json()=={'ticket_attachment': ['You cannot upload file more than 2Mb']}


    def test_ticket_creation_with_empty_data(self):
        data={" "}
        response = self.client_participant.post(self.support_ticket_url, data, content_type='application/json')
        assert response.status_code == 500
        assert response.json()=="JSON parse error - Expecting property name enclosed in double quotes: line 1 column 2 (char 1)"


    def test_ticket_creation_with_empty_title(self):
        data={
            "ticket_title":"",
            "category":"connectors",
            "status": "open",
            "user_map":str(self.user_map_participant.id)
          }
        response = self.client_participant.post(self.support_ticket_url, data)
        assert response.status_code == 400
        assert response.json()=={'ticket_title': ['This field may not be blank.']}

    def test_ticket_creation_without_category(self):
        data={
            "ticket_title":"title",    
            "status": "open",
            "user_map":str(self.user_map_participant.id)
          }
        response = self.client_participant.post(self.support_ticket_url, data)
        assert response.status_code == 400
        assert response.json()=={'category': ['This field is required.']}


    


    
 