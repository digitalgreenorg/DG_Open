from django.test import TestCase
from model_bakery import baker
from accounts.models import User
from pprint import pprint
from rest_framework.response import Response

class UserTestModel(TestCase):
    """
    Class to test the model User
    """
    def setUp(self):
        self.user = baker.make(User)
        pprint(self.user.__dict__)

    def test_participant_post_add_user_valid_email(self):
        assert Response().status_code == 200
