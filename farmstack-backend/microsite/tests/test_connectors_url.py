from django.test import SimpleTestCase
from django.urls import resolve, reverse


class TestUrls(SimpleTestCase):
    def test_microsite_homepage_with_Invalid_fun(self):
        url = reverse('microsite_connectors-list')
        self.assertNotEqual(resolve(url).func, ConnectorsMicrositeViewSet)

    def test_microsite_homepage_with_valid_func(self):
        url = reverse("microsite_connectors-list")
        assert resolve(url)._func_path == "microsite.views.ConnectorsMicrositeViewSet"