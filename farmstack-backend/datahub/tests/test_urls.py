from datahub.views import ParticipantViewSet
from django.test import SimpleTestCase
from django.urls import resolve, reverse


class TestUrls(SimpleTestCase):
    def test_participant_create_valid(self):
        """_summary_"""
        url = reverse("participant-list")
        print(resolve(url)._func_path)
        assert resolve(url)._func_path == "datahub.views.ParticipantViewSet"

    def test_participant_create_invalid(self):
        """_summary_"""
        url = reverse("participant-list")
        print(resolve(url))
        self.assertNotEqual(resolve(url).func, "ParticipantViewSet")

    # def test_support_ticket_create_valid(self):
    #     """_summary_"""
    #     url = reverse("support_tickets-list")
    #     print(url)
    #     print(resolve(url))
    #     assert resolve(url)._func_path == "datahub.views.SupportViewSet"

    def test_support_ticket_create_invalid(self):
        """_summary_"""
        url = reverse("support_tickets-list")
        print(resolve(url))
        self.assertNotEqual(resolve(url).func, "SupportViewSet")

    def test_datahub_datasets_create_valid(self):
        """_summary_"""
        url = reverse("datahub_datasets-list")
        assert resolve(url)._func_path == "datahub.views.DatahubDatasetsViewSet"

    def test_participant_datasets_create_invalid(self):
        """_summary_"""
        url = reverse("datahub_datasets-list")
        print(resolve(url))
        self.assertNotEqual(resolve(url).func, "DatahubDatasetsViewSet")

    def test_organization_create_valid(self):
        """_summary_"""
        url = reverse("organization-list")
        assert resolve(url)._func_path == "datahub.views.OrganizationViewSet"

    def test_organization_create_invalid(self):
        """_summary_"""
        url = reverse("organization-list")
        print(resolve(url))
        self.assertNotEqual(resolve(url).func, "OrganizationViewSet")

    def test_policy_urls_valid(self):
        url = reverse("policy-list")

        assert resolve(url)._func_path == "datahub.views.PolicyListAPIView"

    def test_policy_urls_invalid(self):
        url = reverse("policy-list")

        assert resolve(url)._func_path != "PolicyListAPIView"

    def test_category_urls_valid(self):
        url = reverse("dataset/v2-list")
        assert resolve(url)._func_path == "datahub.views.DatasetV2ViewSet"

    def test_category_urls_invalid(self):
        url = reverse("dataset/v2-list")
        assert resolve(url)._func_path != "DatasetV2ViewSet"

    def test_dataset_request_valid(self):
        """ dataset views and request api """
        url = reverse("datasets/v2-list")
        print(resolve(url)._func_path)
        assert resolve(url)._func_path == "datahub.views.DatasetV2View"

    def test_dataset_request_invalid(self):
        """ dataset views and request api """
        url = reverse("datasets/v2-list")
        print(resolve(url))
        self.assertNotEqual(resolve(url).func, "DatasetV2View")
        
    def test_dashboard_valid(self):
        """ dashboard """
        url = reverse("new_dashboard-dashboard")
        print(resolve(url)._func_path)
        assert resolve(url)._func_path == "datahub.views.DatahubNewDashboard"

    def test_dashboard_invalid(self):
        """ dashboard """
        url = reverse("new_dashboard-dashboard")
        print(resolve(url))
        self.assertNotEqual(resolve(url).func, "DatahubNewDashboard")

    def test_dataset_v2_endpoint(self):
        url = reverse("datasets/v2-list")

        assert resolve(url)._func_path == "datahub.views.DatasetV2View"

    def test_dataset_v2_endpoint_retrieve_only(self):
        url = reverse("dataset/v2-list")

        assert resolve(url)._func_path == "datahub.views.DatasetV2ViewSet"

    def test_dataset_v2_upload_file_endpoint(self):
        url = reverse("dataset_files-list")

        assert resolve(url)._func_path == "datahub.views.DatasetFileV2View"

    def test_dataset_v2_standardise_file_endpoint(self):
        url = reverse("standardise-list")

        assert resolve(url)._func_path == "datahub.views.StandardisationTemplateView"
