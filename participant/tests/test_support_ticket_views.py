from rest_framework.reverse import reverse
from django.test import Client, TestCase
from rest_framework import status
import json
from datahub.models import Organization, UserOrganizationMap
from accounts.models import User, UserRole
from participant.models import SupportTicketV2
from rest_framework_simplejwt.tokens import RefreshToken
from test_util import TestUtils

auth = {
    "token": "null"
}

auth_co_steward = {
    "token": "null"
}

auth_participant= {
    "token": "null"
}


class  SupportTicketTestCaseForViews(TestCase):
    def setUp(self) -> None:
        self.client_admin = Client()
        self.client_participant = Client()
        self.client_co_steward = Client()
        self.support_ticket_url = reverse("support_tickets-list")
        self.user_role = UserRole.objects.create(
            id="1",
            role_name="datahub_admin"
        )
        self.user_role_participant = UserRole.objects.create(id=3, role_name="datahub_participant_root")
        self.user_role_co_steward = UserRole.objects.create(id=6, role_name="datahub_co_steward")
         
        self.user = User.objects.create(
            email="akshata@digitaltyugreen.org",
            role_id=self.user_role.id,
        )
    
        self.user_co_steward = User.objects.create(
            email="costeward@digitalgreen.org",
            role_id=self.user_role_co_steward.id,
            on_boarded_by=None
        )
        self.user_participant = User.objects.create(
            email="akshata@digitalgreen.org",
            role_id=self.user_role_participant.id,
            on_boarded_by=self.user_co_steward
        )
        self.user_participant_two = User.objects.create(
            email="shruthi@digitalgreen.org",
            role_id=self.user_role_participant.id,
            on_boarded_by=None

        )
        self.creating_org = Organization.objects.create(
            org_email="akshata@digitalfghjgreen.org",
            name="Admin",
            phone_number="5678909876",
            website="htttps://google.com",
            address=({"city": "Banglore"}),
        )
        self.creating_org_participant = Organization.objects.create(
            org_email="akshata@digitalgreen.org",
            name="Participant One",
            phone_number="5678909876",
            website="htttps://google.com",
            address=({"city": "Banglore"}),
        )
        self.creating_co_steward_participant_org = Organization.objects.create(
            org_email="imcosteward@digitalgreen.org",
            name="Co-steward One",
            phone_number="5678909876",
            website="htttps://google.com",
            address=({"city": "Banglore"}),
        )
        self.user_admin_map=UserOrganizationMap.objects.create(user_id=self.user.id, organization_id=self.creating_org.id)
        self.user_map=UserOrganizationMap.objects.create(user_id=self.user_participant.id, organization_id=self.creating_org_participant.id)
        self.user_map_participant_two=UserOrganizationMap.objects.create(user_id=self.user_participant_two.id, organization_id=self.creating_org_participant.id)
        self.user_map_for_costeward=UserOrganizationMap.objects.create(user_id=self.user_co_steward.id, organization_id=self.creating_co_steward_participant_org.id)
        
        self.create_support_ticket_one=SupportTicketV2.objects.create(
            ticket_title="Support ticket 1",
            category="connectors",
            description="description about support ticket 1",
            status="open",
            user_map=self.user_map
        )
        self.create_support_ticket_two=SupportTicketV2.objects.create(
            ticket_title="Support ticket 2",
            category="connectors",
            description="description about support ticket 2",
            status="open",
            user_map=self.user_map_for_costeward
        )
        self.create_support_ticket_raised_by_co_steward=SupportTicketV2.objects.create(
            ticket_title="Support ticket co-steward",
            category="connectors",
            description="description about support ticket raised by co-steward",
            status="open",
            user_map=self.user_map_for_costeward

        )
        self.create_support_ticket_three=SupportTicketV2.objects.create(
            ticket_title="Support ticket 3",
            category="certificate",
            description="description about support ticket 3",
            status="open",
            user_map=self.user_map_participant_two
        )

        # Admin token
        auth["token"] = TestUtils.create_token_for_user(self.user, self.user_admin_map)
        admin_header=self.set_auth_headers()
        self.client_admin.defaults['HTTP_AUTHORIZATION'] = admin_header[0]
        self.client_admin.defaults['CONTENT_TYPE'] = admin_header[1]


        # Participant Token
        auth_participant["token"] = TestUtils.create_token_for_user(self.user_participant, self.user_map)
        participant_header=self.set_auth_headers(participant=True)
        self.client_participant.defaults['HTTP_AUTHORIZATION'] = participant_header[0]
        self.client_participant.defaults['CONTENT_TYPE'] = participant_header[1]


        #Co-steward Token   
        auth_co_steward["token"] = TestUtils.create_token_for_user(self.user_co_steward, self.user_map_for_costeward)
        co_steward_header=self.set_auth_headers(co_steward=True)
        self.client_co_steward.defaults['HTTP_AUTHORIZATION'] = co_steward_header[0]
        self.client_co_steward.defaults['CONTENT_TYPE'] = co_steward_header[1]


    #Generic function to return headers 
    def set_auth_headers(self,participant=False, co_steward=False):  
        auth_data = auth_participant if participant else (auth_co_steward if co_steward else auth)
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_data["token"]}'
        }
        return headers['Authorization'],headers['Content-Type']

    # Test cases +ve cases  
    def test_support_ticket_filter_by_status(self):
        data = {"others": True,"status":"open"}
        response = self.client_participant.post(self.support_ticket_url+"list_tickets/", data=json.dumps(data), content_type='application/json')
        assert response.status_code == 200
        assert response.json()['count']==1
        assert response.json()['results'][0]['ticket_title']==self.create_support_ticket_one.ticket_title
        assert response.json()['results'][0]['description']==self.create_support_ticket_one.description
        assert response.json()['results'][0]['category']==self.create_support_ticket_one.category


    def test_support_ticket_filter_by_status_open(self):
        data = {"others": False,"status":"closed"}
        response = self.client_participant.post(self.support_ticket_url+"list_tickets/", data=json.dumps(data), content_type='application/json')
        assert response.status_code == 200
        assert response.json()['results']==[]


    def test_support_ticket_filter_by_category(self):
        data = {"others": True,"category":"connectors"}
        response = self.client_participant.post(self.support_ticket_url+"list_tickets/", data=json.dumps(data), content_type='application/json')
        assert response.status_code == 200
        assert response.json()['count']==1
        assert response.json()['results'][0]['ticket_title']==self.create_support_ticket_one.ticket_title
        assert response.json()['results'][0]['description']==self.create_support_ticket_one.description
        assert response.json()['results'][0]['category']==self.create_support_ticket_one.category


    def test_support_ticket_by_co_stewards_filter_by_status(self):
        data = {"others": False,"status":"open"}
        response = self.client_co_steward.post(self.support_ticket_url+"list_tickets/", data=json.dumps(data), content_type='application/json')
        assert response.status_code == 200
        assert response.json()['count']==2
        assert response.json()['results'][0]['ticket_title']==self.create_support_ticket_raised_by_co_steward.ticket_title
        assert response.json()['results'][0]['description']==self.create_support_ticket_raised_by_co_steward.description
        assert response.json()['results'][0]['category']==self.create_support_ticket_raised_by_co_steward.category


    def test_support_ticket_by_co_stewards_filter_by_status_open(self):
        data = {"others": True,"status":"closed"}
        response = self.client_co_steward.post(self.support_ticket_url+"list_tickets/", data=json.dumps(data), content_type='application/json')
        assert response.status_code == 200
        assert response.json()['results']==[]


    # participant under co-steward
    def test_support_ticket_under_co_steward(self):
        data = {"others": True,"status":"open"}
        response = self.client_co_steward.post(self.support_ticket_url+"list_tickets/", data=json.dumps(data), content_type='application/json')
        assert response.status_code == 200
        assert response.json()['count']==1

    # participant under admin
    def test_support_ticket_under_admin(self):
        data = {"others": True,"status":"open"}
        response = self.client_admin.post(self.support_ticket_url+"list_tickets/", data=json.dumps(data), content_type='application/json')
        assert response.status_code == 200
        assert response.json()['results'][0]['description']==self.create_support_ticket_three.description


    def test_support_ticket_admin_filter_by_status(self):
        data = {"others": False,"status":"open"}
        response = self.client_admin.post(self.support_ticket_url+"list_tickets/", data=json.dumps(data), content_type='application/json')
        assert response.status_code == 200
        assert response.json()['count']==2
        assert response.json()['results'][0]['ticket_title']==self.create_support_ticket_raised_by_co_steward.ticket_title
        assert response.json()['results'][0]['description']==self.create_support_ticket_raised_by_co_steward.description
        assert response.json()['results'][0]['category']==self.create_support_ticket_raised_by_co_steward.category
        assert response.json()['results'][1]['ticket_title']==self.create_support_ticket_two.ticket_title
        assert response.json()['results'][1]['description']==self.create_support_ticket_two.description
        assert response.json()['results'][1]['category']==self.create_support_ticket_two.category

    # Negative test cases
    def test_support_ticket_with_invalid_param_key_category(self):
        data = {"others": True,"category1":"invalid category"}
        response = self.client_participant.post(self.support_ticket_url+"list_tickets/", data=json.dumps(data), content_type='application/json')
        assert response.status_code == 401
        assert response.json()=={'message': 'Invalid auth credentials provided.'}


    def test_support_ticket_with_invalid_param_keys(self):
        data = {"id":"1234","name":'abc'}
        response = self.client_participant.post(self.support_ticket_url+"list_tickets/", data=json.dumps(data), content_type='application/json')
        assert response.status_code == 401
        assert response.json()=={'message': 'Invalid auth credentials provided.'}


    def test_support_ticket_with_invalid_type_data(self):
        response = self.client_participant.post(self.support_ticket_url+"list_tickets/",{})
        assert response.status_code == 401
        assert response.json()=={'message': 'Invalid auth credentials provided.'}