from django.urls import include, path
from rest_framework.routers import DefaultRouter

from core.constants import Constants
from participant.views import (
    ParticipantConnectorsMapViewSet,
    ParticipantConnectorsViewSet,
    ParticipantDatasetsViewSet,
    ParticipantDepatrmentViewSet,
    ParticipantProjectViewSet,
    ParticipantSupportViewSet,
    DataBaseViewSet,
    SupportTicketV2ModelViewSet,
    SupportTicketResolutionsViewset

)

router = DefaultRouter()
router.register(r"support", ParticipantSupportViewSet, basename=Constants.SUPPORT)
router.register(r"datasets", ParticipantDatasetsViewSet, basename="participant_datasets")
router.register(r"connectors", ParticipantConnectorsViewSet, basename="participant_connectors")
router.register(r"connectors_map", ParticipantConnectorsMapViewSet, basename="participant_connectors_map")
router.register(r"department", ParticipantDepatrmentViewSet, basename="participant_department")
router.register(r"project", ParticipantProjectViewSet, basename="participant_project")
router.register(r"database", DataBaseViewSet,basename="database")
router.register(r"support_ticket", SupportTicketV2ModelViewSet,basename="support_tickets")
router.register(r"ticket_resolution", SupportTicketResolutionsViewset,basename="support_tickets_resolutions")


urlpatterns = [
    path("", include(router.urls)),
]

# from django.urls import path

# from . import views

# urlpatterns = [
#     path('database-config/', views.test_database_config, name='test_database_config'),
# ]









