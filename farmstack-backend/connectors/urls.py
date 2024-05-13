from posixpath import basename
from sys import settrace

from core import settings
from core.constants import Constants
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from connectors import views
from connectors.views import (
    ConnectorsViewSet,
)

router = DefaultRouter()
router.register(r"", ConnectorsViewSet, basename=Constants.CONNECTORS)



urlpatterns = [
    path("", include(router.urls)),
]
