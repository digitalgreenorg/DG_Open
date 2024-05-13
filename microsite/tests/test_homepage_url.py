from django.test import SimpleTestCase
from django.urls import resolve, reverse
from microsite.views import ParticipantMicrositeViewSet


class TestUrls(SimpleTestCase):
    def test_microsite_homepage_with_Invalid_fun(self):
        url = reverse('participant_microsite-list')
        self.assertNotEqual(resolve(url).func, ParticipantMicrositeViewSet)

    def test_microsite_homepage_with_valid_func(self):
        url = reverse("participant_microsite-list")
        assert resolve(url)._func_path == "microsite.views.ParticipantMicrositeViewSet"