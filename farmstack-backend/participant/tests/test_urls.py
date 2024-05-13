from django.test import SimpleTestCase
from django.urls import resolve, reverse


class TestUrls(SimpleTestCase):
    def test_participant_support_valid(self):
        """_summary_"""
        url = reverse("support-list")
        assert resolve(url)._func_path == "participant.views.ParticipantSupportViewSet"

    def test_participant_support_valid_func(self):
        """_summary_"""
        url = reverse("support-list")
        self.assertNotEqual(resolve(url).func, "ParticipantSupportViewSet")

    def test_participant_datasets_create_valid(self):
        """_summary_"""
        url = reverse("participant_datasets-list")
        assert resolve(url)._func_path == "participant.views.ParticipantDatasetsViewSet"

    def test_participant_datasets_create_valid_func(self):
        """_summary_"""
        url = reverse("participant_datasets-list")
        print(resolve(url))
        self.assertNotEqual(resolve(url).func, "ParticipantDatasetsViewSet")

    def test_participant_connectors_create_valid(self):
        """_summary_"""
        url = reverse("participant_connectors-list")
        assert resolve(url)._func_path == "participant.views.ParticipantConnectorsViewSet"

    def test_participant_connectors_create_valid_func(self):
        """_summary_"""
        url = reverse("participant_connectors")
        print(resolve(url))
        self.assertNotEqual(resolve(url).func, "ParticipantConnectorsViewSet")
