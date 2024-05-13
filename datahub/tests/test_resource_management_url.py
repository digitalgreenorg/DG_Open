from django.test import SimpleTestCase
from django.urls import resolve, reverse
from datahub.views import ResourceUsagePolicyListCreateView,UsagePolicyRetrieveUpdateDestroyView,ResourceManagementViewSet

class ResourceManagementUrls(SimpleTestCase):
    def test_datahub_resource_management_with_Invalid_fun(self):
        url = reverse('resource_usage-policy-list-create')
        resolved_func_path = resolve(url)._func_path
        expected_func_path = "microsite.views.ParticipantMicrositeViewSet"
        assert resolved_func_path!= expected_func_path

    def test_datahub_resource_management_with_valid_func(self):
        url = reverse("resource_management-list")
        assert resolve(url)._func_path == "datahub.views.ResourceManagementViewSet"