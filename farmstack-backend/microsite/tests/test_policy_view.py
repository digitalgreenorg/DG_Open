from datahub.models import Policy
from rest_framework.reverse import reverse
from django.test import Client, TestCase
import json


first_policy={
    "id":"None",
    "name":"First Policy",
    "description":"First policy description"
}

class LegalPoliciesTestCaseForViews(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        self.legal_policies_url = reverse("policy_microsite-list")
        self.policy_one = Policy.objects.create(
            description="description about legal policy 1.....",
            name="Legal policy 1",
        )
        self.policy_two = Policy.objects.create(
            description="description about legal policy 2.....",
            name="Legal policy 2",
        )
        self.policy_three = Policy.objects.create(
            description="description about legal policy 3.....",
            name="Legal policy 3",
        )
        self.policy_four = Policy.objects.create(
            description="description about legal policy 4.....",
            name="Legal policy 4",
        )
        self.policy_five = Policy.objects.create(
            description="description about legal policy 5.....",
            name="Legal policy 5",
        )
        self.policy_six = Policy.objects.create(
            description="description about legal policy 6.....",
            name="Legal policy 6",
        )
        self.policy_seven = Policy.objects.create(
            description="description about legal policy 7.....",
            name="Legal policy 7",
        )
        self.policy_eight = Policy.objects.create(
            description="description about legal policy 8.....",
            name="Legal policy 8",
        )
        self.policy_nine = Policy.objects.create(
            description="description about legal policy 9.....",
            name="Legal policy 9",
        )
        self.policy_ten = Policy.objects.create(
            description="description about legal policy 10.....",
            name="Legal policy 10",
        )
        first_policy["id"]=str(self.policy_two.id)


    #Positive test cases (list and retrieve method legal policy )

    def test_get_policies_when_count_greater_than_5(self):
        response = self.client.get(self.legal_policies_url)
        assert response.status_code == 200
        assert response.json()[0]['name']==self.policy_one.name
        assert response.json()[0]['description']==self.policy_one.description
        assert response.json()[1]['name']==self.policy_two.name
        assert response.json()[1]['description']==self.policy_two.description

    def test_get_policies_when_count_less_than_5(self):
        self.policy_one.delete()
        self.policy_two.delete()
        self.policy_three.delete()
        self.policy_four.delete()
        self.policy_five.delete()
        self.policy_six.delete()
        self.policy_seven.delete()
        self.policy_eight.delete()
        response = self.client.get(self.legal_policies_url)
        assert response.status_code == 200
        assert response.json()[0]['name']==self.policy_nine.name
        assert response.json()[0]['description']==self.policy_nine.description
        assert response.json()[1]['name']==self.policy_ten.name
        assert response.json()[1]['description']==self.policy_ten.description

    def test_policy_get_single_policy(self):
        response = self.client.get(self.legal_policies_url+f"{str(self.policy_two.id)}/")
        assert response.status_code == 200
        assert response.json()['description']==self.policy_two.description
        assert response.json()['name']==self.policy_two.name

    # Negative test cases with Invalid id
    def test_get_policy_with_invalid_id(self):
        invalid_id='b2e115be-9d9e-4dfe-a422-937e981d708dk'
        response = self.client.get(self.legal_policies_url+f"{str(invalid_id)}/")
        assert response.status_code == 404
        assert response.json()['detail']=='Not found.'

    def test_get_policy_with_invalid_string_id(self):
        invalid_id='tyuijkjikjok'
        response = self.client.get(self.legal_policies_url+f"{str(invalid_id)}/")
        assert response.status_code == 404
        assert response.json()=={'detail': 'Not found.'}

    def test_get_policy_with_empty_string_id(self):
        invalid_id='   '
        response = self.client.get(self.legal_policies_url+f"{str(invalid_id)}/")
        assert response.status_code == 404
        assert response.json()=={'detail': 'Not found.'}