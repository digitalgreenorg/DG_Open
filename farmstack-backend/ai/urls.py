from django.urls import include, path
from rest_framework.routers import DefaultRouter

from ai.views import EmbeddingsViewSet
from core import settings
from core.constants import Constants

router = DefaultRouter()
router.register(r'embeddings', EmbeddingsViewSet, basename='embeddings')

urlpatterns = [    
    path("", include(router.urls)),
]