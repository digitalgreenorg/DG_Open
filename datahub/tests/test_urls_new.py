from django.test import SimpleTestCase
from django.urls import resolve, reverse
from datahub.views import StandardisationTemplateView

class TestUrls(SimpleTestCase):
    def test_standardise_create_invalid(self):
        url = reverse("standardise-list")
        print(resolve(url))
        self.assertNotEqual(resolve(url).func, StandardisationTemplateView)
        
    def test_standardise_create_valid(self):
        url = reverse("standardise-list")
        assert resolve(url)._func_path == "datahub.views.StandardisationTemplateView" # type: ignore