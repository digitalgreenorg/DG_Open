from django.test import SimpleTestCase
from django.urls import resolve, reverse
from microsite.views import PolicyAPIView,ParticipantMicrositeViewSet



class LegalPoliciesTestCaseForUrls(SimpleTestCase):
    
    def test_microsite_legal_policy_with_Invalid_fun(self):
        url = reverse('policy_microsite-list')
        resolved_func_path = resolve(url)._func_path
        expected_func_path = "microsite.views.ParticipantMicrositeViewSet"
        assert resolved_func_path!= expected_func_path

    def test_microsite_legal_policy_with_valid_func(self):
        url = reverse("policy_microsite-list")
        assert resolve(url)._func_path == "microsite.views.PolicyAPIView"