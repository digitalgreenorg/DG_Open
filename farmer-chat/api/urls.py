from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import ChatAPIViewSet, LanguageViewSet

router = DefaultRouter()
router.register(r"chat", ChatAPIViewSet, basename="chat")
router.register(r"language", LanguageViewSet, basename="language")

urlpatterns = [
    path("", include(router.urls)),
]
