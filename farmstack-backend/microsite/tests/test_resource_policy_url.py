from django.test import SimpleTestCase
from django.urls import resolve, reverse
from microsite.views import PolicyAPIView,ParticipantMicrositeViewSet

class ResourcePoliciesTestCaseForUrls(SimpleTestCase):  
    def test_microsite_resource_policy_with_Invalid_fun(self):
        url = reverse('microsite_resource-list')
        resolved_func_path = resolve(url)._func_path
        expected_func_path = "microsite.views.ParticipantMicrositeViewSet"
        assert resolved_func_path!= expected_func_path

    def test_microsite_resource_policy_with_valid_func(self):
        url = reverse("microsite_resource-list")
        assert resolve(url)._func_path == "microsite.views.ResourceMicrositeViewSet"