import uuid
from django.test import Client, TestCase
from django.urls import reverse
from accounts.models import User, UserRole
from rest_framework.test import APIClient, APITestCase
from django.test import Client, TestCase
from django.urls import reverse
import json

from accounts.models import UserRole, User


class TestViews(APITestCase):
    # Create your tests here.
    def setUp(self) -> None:
        self.client = APIClient()
        self.account_register_url = reverse("register-list")
        UserRole.objects.create(id = 1, role_name="datahub_admin")

        User.objects.create(
            email="kanhaiyaaa@digitalgreen.org",
            first_name="kanhaiya",
            last_name="suthar",
            role= UserRole.objects.get(id=1),
            phone_number="+91 99876-62188"
        )

    #test case for create method(valid case)
    def test_user_create_valid(self):
        user_valid_data = {
            "email" : "ektakm@digitalgreen.org",
            "first_name": "ekta",
            "last_name": "kumari",
            "role": UserRole.objects.get(role_name="datahub_admin").id,
            "phone_number": "+91 98204-62188"
        }
        response = self.client.post(self.account_register_url, data=user_valid_data, secure=True)
        data = response.json()
        # print("***test_user_create_valid***", data)
        # print("***test_user_create_valid***", response.status_code)
        assert response.status_code == 201
        assert data['message'] == 'Successfully created the account!'
        assert data['response']['last_name'] == user_valid_data.get("last_name")

    #test case for create method(invalid case)
    def test_user_create_invalid_email(self):
        user_invalid_data = {
            "email" : "ektakumarii",
            "first_name": "ekta",
            "last_name": "kumari",
            "role": UserRole.objects.get(role_name="datahub_admin").id,
            "phone_number": "+91 98204-62188"
        }
        response = self.client.post(self.account_register_url, data=user_invalid_data, secure=True)
        data = response.json()
        # print("***test_user_create_invalid***", data)
        # print("***test_user_create_invalid***", response.status_code)
        assert response.status_code == 400
        assert data == {"email": ['Enter a valid email address.']}

    #test case for create method(valid case)
    def test_user_create_valid_fname_null(self):
        user_valid_data = {
            "email" : "dummy_null@dgreen.org",
            "first_name": "",
            "last_name": "kumari",
            "role": UserRole.objects.get(role_name="datahub_admin").id,
            "phone_number": "+91 98204-62188"
        }
        response = self.client.post(self.account_register_url, data=user_valid_data, secure=True)
        data = response.json()
        # print("***test_user_create_valid_fname_null***", data)
        # print("***test_user_create_valid_fname_null***", response.status_code)
        assert response.status_code == 201
        assert data['message'] == 'Successfully created the account!'
        assert data['response']['first_name'] == user_valid_data.get("first_name")

    #test case for create method(invalid case)
    def test_user_create_invalid_fname_length(self):
        user_invalid_length_data = {
            "email" : "dummy@dgreen.org",
            "first_name": "fjnfjnfjnfndejdekjjgjjgdekjefejfekjfejfeknjnfkfnkffjrjknfknjefnjknjfenfefknjefjknenjkfenjkfejnfnjenkjfknjjknjfnkfnkjfenkjfekjfejknfekjnfknjefnkefkefkjnfnjejnfedjhbcfejhfbhjwbfjfjhbwbfjehjfbhjeeehjbhjehbjbhbhjfbehjbcfhejbhejwhfbjfhbjfbhjrhjbfbhjfhbfehjbfknjen",
            "last_name": "kumari",
            "role": UserRole.objects.get(role_name="datahub_admin").id,
            "phone_number": "+91 98204-62188"
        }
        response = self.client.post(self.account_register_url, data=user_invalid_length_data, secure=True)
        data = response.json()
        # print("***test_user_create_invalid_fname_length***", data)
        # print("***test_user_create_invalid_fname_length***", response.status_code)
        assert response.status_code == 400
        assert data['first_name'] == ['Ensure this field has no more than 255 characters.']

    #test case for create method(valid case)
    def test_user_create_valid_lname_null(self):
        user_valid_data = {
            "email" : "dummy_null_last@dgreen.org",
            "first_name": "dummy",
            "last_name": "",
            "role": UserRole.objects.get(role_name="datahub_admin").id,
            "phone_number": "+91 98204-62188"
        }
        response = self.client.post(self.account_register_url, data=user_valid_data, secure=True)
        data = response.json()
        # print("***test_user_create_valid_lname_null***", data)
        # print("***test_user_create_valid_lname_null***", response.status_code)
        assert response.status_code == 201
        assert data['message'] == 'Successfully created the account!'
        assert data['response']['last_name'] == user_valid_data.get("last_name")

    #test case for create method(invalid case)
    def test_user_create_invalid_lname_length(self):
        user_invalid_length_data = {
            "email" : "dummy@dgreen.org",
            "first_name": "dumm_length",
            "last_name": "fjnfjnfjnfndejdekjjgjjgdekjefejfekjfejfeknjnfkfnkffjrjknfknjefnjknjfenfefknjefjknenjkfenjkfejnfnjenkjfknjjknjfnkfnkjfenkjfekjfejknfekjnfknjefnkefkefkjnfnjejnfedjhbcfejhfbhjwbfjfjhbwbfjehjfbhjeeehjbhjehbjbhbhjfbehjbcfhejbhejwhfbjfhbjfbhjrhjbfbhjfhbfehjbfknjen",
            "role": UserRole.objects.get(role_name="datahub_admin").id,
            "phone_number": "+91 98204-62188"
        }
        response = self.client.post(self.account_register_url, data=user_invalid_length_data, secure=True)
        data = response.json()
        # print("***test_user_create_invalid_lname_length***", data)
        # print("***test_user_create_invalid_lname_length***", response.status_code)
        assert response.status_code == 400
        assert data['last_name'] == ['Ensure this field has no more than 255 characters.']

    #test case for create method(invalid case)
    def test_user_create_invalid_phonenumber(self):
        user_invalid_phone_data = {
            "email" : "phone@dgreen.org",
            "first_name": "phone",
            "last_name": "k",
            "role": UserRole.objects.get(role_name="datahub_admin").id,
            "phone_number": "abcde12345"
        }
        response = self.client.post(self.account_register_url, data=user_invalid_phone_data, secure=True)
        data = response.json()
        # print("***test_user_create_invalid_phonenumber***", data)
        # print("***test_user_create_invalid_phonenumber***", response.status_code)
        assert response.status_code == 400
        assert data['phone_number'] == ['Invalid phone number format.']

        #invalid country code
        user_invalid_phone_data = {
            "email" : "phone@dgreen.org",
            "first_name": "phone",
            "last_name": "k",
            "role": UserRole.objects.get(role_name="datahub_admin").id,
            "phone_number": "+99 98204-62188"
        }
        response = self.client.post(self.account_register_url, data=user_invalid_phone_data, secure=True)
        data = response.json()
        assert response.status_code == 400
        assert data['phone_number'] == ['Invalid phone number format.']

        #invalid more length 50
        user_invalid_phone_data = {
            "email" : "phone@dgreen.org",
            "first_name": "phone",
            "last_name": "k",
            "role": UserRole.objects.get(role_name="datahub_admin").id,
            "phone_number": "+91 98999-9621884748347478743647476765474644374734737474434764"
        }
        response = self.client.post(self.account_register_url, data=user_invalid_phone_data, secure=True)
        data = response.json()
        assert response.status_code == 400
        assert data['phone_number'] == ['Invalid phone number format.']

        #invalid too short length
        user_invalid_phone_data = {
            "email" : "phone@dgreen.org",
            "first_name": "phone",
            "last_name": "k",
            "role": UserRole.objects.get(role_name="datahub_admin").id,
            "phone_number": "+91 98999-3"
        }
        response = self.client.post(self.account_register_url, data=user_invalid_phone_data, secure=True)
        data = response.json()
        assert response.status_code == 400
        assert data['phone_number'] == ['Invalid phone number format.']

        #invalid incorrect format
        user_invalid_phone_data = {
            "email" : "phone@dgreen.org",
            "first_name": "phone",
            "last_name": "k",
            "role": UserRole.objects.get(role_name="datahub_admin").id,
            "phone_number": "+91(982)0462188"
        }
        response = self.client.post(self.account_register_url, data=user_invalid_phone_data, secure=True)
        data = response.json()
        assert response.status_code == 400
        assert data['phone_number'] == ['Invalid phone number format.']

        #invalid missing country code
        user_invalid_phone_data = {
            "email" : "phone@dgreen.org",
            "first_name": "phone",
            "last_name": "k",
            "role": UserRole.objects.get(role_name="datahub_admin").id,
            "phone_number": "98204-62188"
        }
        response = self.client.post(self.account_register_url, data=user_invalid_phone_data, secure=True)
        data = response.json()
        assert response.status_code == 400
        assert data['phone_number'] == ['Invalid phone number format.']


    #test case for create method(invalid case)
    # def test_user_create_invalid_email_length(self):
    #     user_invalid_length_data = {
    #         "email" : "fjnfjnfjnfndejdekjjgjjgdekjefejfekjfejfeknjnfkfnkffjrjknfknjefnjknjfenfefknjefjknenjkfenjkfejnfnjenkjfknjjknjfnkfnkjfenkjfekjfejknfekjnfknjefnkefkefkjnfnjejnfejknfknjefjnkenjfnjkfefjnkekjnfnjkjnfjkenfnjkjnfkekjnfejnjnkkjnekjfkjnenjkknjeknjenkneffjnfjnfjnfndejdekjjgjjgdekjefejfekjfejfeknjnfkfnkffjrjknfknjefnjknjfenfefknjefjknenjkfenjkfejnfnjenkjfknjjknjfnkfnkjfenkjfekjfejknfekjnfknjefnkefkefkjnfnjejnfejknfknjefjnkenjfnjkfefjnkekjnfnjkjnfjkenfnjkjnfkekjnfejnjnkkjnekjfkjnenjkknjeknjenknef@digitalgreen.org",
    #         "first_name": "ekta",
    #         "last_name": "kumari",
    #         "role": UserRole.objects.get(role_name="datahub_admin").id,
    #         "phone_number": "+91 98204-62188"
    #     }
    #     response = self.client.post(self.account_register_url, data=user_invalid_length_data, secure=True)
    #     data = response.json()
    #     print("***test_user_create_invalid_email_length***", data)
    #     print("***test_user_create_invalid_email_length***", response.status_code)
        # print("***test_user_create_invalid_email_length created or not***", User.objects.get(email="fjnfjnfjnfndejdekjjgjjgdekjefejfekjfejfeknjnfkfnkffjrjknfknjefnjknjfenfefknjefjknenjkfenjkfejnfnjenkjfknjjknjfnkfnkjfenkjfekjfejknfekjnfknjefnkefkefkjnfnjejnfejknfknjefjnkenjfnjkfefjnkekjnfnjkjnfjkenfnjkjnfkekjnfejnjnkkjnekjfkjnenjkknjeknjenkneffjnfjnfjnfndejdekjjgjjgdekjefejfekjfejfeknjnfkfnkffjrjknfknjefnjknjfenfefknjefjknenjkfenjkfejnfnjenkjfknjjknjfnkfnkjfenkjfekjfejknfekjnfknjefnkefkefkjnfnjejnfejknfknjefjnkenjfnjkfefjnkekjnfnjkjnfjkenfnjkjnfkekjnfejnjnkkjnekjfkjnenjkknjeknjenknef@digitalgreen.org").id)
        # assert response.status_code == 400
        # assert data == {"email": ['Ensure this field has no more than 255 characters.']}

    #test case for create method(invalid case)
    def test_user_create_invalid_role(self):
        user_invalid_role_data = {
            "email" : "dummy@dgreen.org",
            "first_name": "invalid role",
            "last_name": "kum",
            "role": 10,
                # UserRole.objects.get(role_name="datahub_admin").id,
            "phone_number": "+91 98204-62188"
        }
        response = self.client.post(self.account_register_url, data=user_invalid_role_data, secure=True)
        data = response.json()
        # print("***test_user_create_invalid_role***", data)
        # print("***test_user_create_invalid_role***", response.status_code)
        assert response.status_code == 400
        assert data['role'] == ['Invalid pk '+f'"{user_invalid_role_data.get("role")}"'+' - object does not exist.']

    #test case for retrieve method(valid case)
    def test_user_retrieve_valid(self):
        user_id = User.objects.get(email="kanhaiyaaa@digitalgreen.org").id
        response = self.client.get(self.account_register_url+f"{user_id}/", secure=True)
        data = response.json()
        assert response.status_code == 200
        # print("***test_user_retrieve_valid***", data)
        # print("***test_user_retrieve_valid***", response.status_code)
        assert data['id'] == str(user_id)
        assert data['email'] == 'kanhaiyaaa@digitalgreen.org'

    #test case for retrieve method(invalid case)
    def test_user_retrieve_invalid(self):
        random_uuid = uuid.uuid4()
        response = self.client.get(self.account_register_url+f"{random_uuid}/", secure=True)
        data = response.json()
        # print("***test_user_retrieve_invalid***", data)
        # print("***test_user_retrieve_invalid***", response.status_code)
        assert response.status_code == 404
        assert data == {'detail': 'Not found.'}

    #test case for update method(valid case)
    def test_user_update_valid(self):
        user_update_data = {'first_name': 'kanhaiya updated'}
        user_id = User.objects.get(email="kanhaiyaaa@digitalgreen.org").id
        response = self.client.put(self.account_register_url+f"{user_id}/", user_update_data , secure=True)
        data = response.json()
        # print("***test_user_update_valid***", data)
        # print("***test_user_update_valid***", response.status_code)
        assert response.status_code == 201
        assert data['response']['first_name'] == "kanhaiya updated"
        assert data['message'] == "updated user details"

    #test case for update method(invalid case)
    def test_user_update_invalid(self):
        user_update_invalid_data = {
            'email': 'kanhaiya_updated_invalid@digitalgreen.org'
        }
        user_id = User.objects.get(email="kanhaiyaaa@digitalgreen.org").id
        response = self.client.put(self.account_register_url+f"{user_id}/", user_update_invalid_data, secure=True)
        data = response.json()
        # print("***test_user_update_valid***", data)
        # print("***test_user_update_valid***", response.status_code)
        assert response.status_code == 201
        assert data['response'].get("email", '') == ''

    #test case for delete method(valid case)
    def test_user_delete_valid(self):
        user_id = str(User.objects.get(email="kanhaiyaaa@digitalgreen.org").id)
        response = self.client.delete(self.account_register_url+f"{user_id}/", secure=True)
        # print("***test_user_delete_valid***", response)
        assert response.status_code == 204

    #test case for delete method(invalid case)
    def test_user_delete_invalid(self):
        random_uuid = uuid.uuid4()
        response = self.client.delete(self.account_register_url+f"{random_uuid}/")
        data = response.json()
        # print("***test_user_delete_invalid***", data)
        assert response.status_code == 404
        assert data == {'detail': 'Not found.'}

# Create your tests here.
def test_user_can_login():
    """User can successfully login"""
    pass


self_register_valid_data = {
    "email": "jai+999@digitalgreen.org",
    "org_email": "jai+999@digitalgreen.org",
    "first_name": "farmstack",
    "last_name": "farmstack",
    "name": "Self Register Organization",
    "phone_number": "+91 87575-73616",
    "website": "https://datahubethdev.farmstack.co/home/https://datahubethdev.farmstack.co/home/register",
    "address": {"address": "https://datahubethdev.farmstack.co/home/register", "country": "India", "pincode": "302020"},
    "on_boarded_by": ""
}

self_register_invalid_org_email = {
    "email": "jai+999@digitalgreen.org",
    "org_email": "jai999digitalgreenorg",
    "first_name": "farmstack",
    "last_name": "farmstack",
    "name": "Self Register Organization",
    "phone_number": "+91 87575-73616",
    "website": "https://datahubethdev.farmstack.co/home/https://datahubethdev.farmstack.co/home/register",
    "address": {"address": "https://datahubethdev.farmstack.co/home/register", "country": "India", "pincode": "302020"},
    "on_boarded_by": ""
}

self_register_invalid_website = {
    "email": "jai+999@digitalgreen.org",
    "org_email": "jai+999@digitalgreen.org",
    "first_name": "farmstack",
    "last_name": "farmstack",
    "name": "Self Register Organization",
    "phone_number": "+91 87575-73616",
    "website": "https//datahubethdevfarmstackco/home/https://datahubethdev.farmstack.co/home/register",
    "address": {"address": "https://datahubethdev.farmstack.co/home/register", "country": "India", "pincode": "302020"},
    "on_boarded_by": ""
}

self_register_invalid_mobile = {
    "email": "jai+999@digitalgreen.org",
    "org_email": "jai+999@digitalgreen.org",
    "first_name": "farmstack",
    "last_name": "farmstack",
    "name": "Self Register Organization",
    "phone_number": "+91 00000-00000",
    "website": "https://datahubethdev.farmstack.co/home/https://datahubethdev.farmstack.co/home/register",
    "address": {"address": "https://datahubethdev.farmstack.co/home/register", "country": "India", "pincode": "302020"},
    "on_boarded_by": ""
}


class SelfRegisterTestViews(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        self.self_register_url = reverse("self_register-list")
        user_role_admin = UserRole.objects.create(
            id="1",
            role_name="datahub_admin"
        )
        user_role_participant = UserRole.objects.create(
            id="3",
            role_name="datahub_participant_root"
        )

        system_admin = User.objects.create(
            first_name="SYSTEM",
            last_name="ADMIN",
            email="admin@gmail.com",
            role_id=user_role_admin.id,
        )

    def test_self_register_invalid_request_type(self):
        form_data = self_register_valid_data.copy()
        form_data["address"] = json.dumps(form_data["address"])

        api_response = self.client.get(self.self_register_url, data=form_data)
        assert api_response.status_code in [405]
        assert api_response.json().get("detail") == 'Method "GET" not allowed.'

    def test_self_register_valid_data(self):
        form_data = self_register_valid_data.copy()
        form_data["address"] = json.dumps(form_data["address"])

        api_response = self.client.post(self.self_register_url, data=form_data)
        assert api_response.status_code in [201]

    def test_self_register_invalid_org_email(self):
        form_data = self_register_invalid_org_email.copy()
        form_data["address"] = json.dumps(form_data["address"])

        api_response = self.client.post(self.self_register_url, data=form_data)
        assert api_response.status_code in [400]
        assert api_response.json().get("org_email") == ['Enter a valid email address.']

    def test_self_register_invalid_website(self):
        form_data = self_register_invalid_website.copy()
        form_data["address"] = json.dumps(form_data["address"])

        api_response = self.client.post(self.self_register_url, data=form_data)
        assert api_response.status_code in [400]
        assert api_response.json().get("website") == ['Invalid website URL']

    def test_self_register_invalid_phone(self):
        form_data = self_register_invalid_mobile.copy()
        form_data["address"] = json.dumps(form_data["address"])

        api_response = self.client.post(self.self_register_url, data=form_data)
        assert api_response.status_code in [400]
        assert api_response.json().get("phone_number") == ["Invalid phone number format."]
