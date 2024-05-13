from django.test import SimpleTestCase
from django.urls import resolve, reverse
from accounts.views import RegisterViewset
from datahub.views import ParticipantViewSet
from django.test import SimpleTestCase
from django.urls import resolve, reverse


class TestUrls(SimpleTestCase):
    def test_register_invalid(self):
        url = reverse('register-list')
        self.assertNotEqual(resolve(url).func, RegisterViewset)

    def test_register_valid_func(self):
        url = reverse("register-list")
        assert resolve(url)._func_path == "accounts.views.RegisterViewset" # type: ignore

    def test_self_register_endpoint_exists(self):
        """_summary_"""
        url = reverse("self_register-list")
        assert resolve(url)._func_path == "accounts.views.SelfRegisterParticipantViewSet"

    def test_self_register_endpoint_does_not_exist(self):
        """_summary_"""
        url = reverse("self_register-list")
        assert resolve(url)._func_path != "SelfRegisterParticipantViewSet"
