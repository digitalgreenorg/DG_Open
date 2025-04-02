from posixpath import basename
from sys import settrace

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from core import settings
from core.constants import Constants
from datahub import views
from datahub.views import (
    CategoryViewSet,
    DatahubDashboard,
    DatahubDatasetsViewSet,
    DatahubNewDashboard,
    DatahubThemeView,
    DatasetFileV2View,
    DatasetV2View,
    DatasetV2ViewSet,
    DatasetV2ViewSetOps,
    DocumentSaveView,
    DropDocumentView,
    EmbeddingsViewSet,
    FetchFiles,
    MailInvitationViewSet,
    MessagesCreateViewSet,
    MessagesViewSet,
    OrganizationViewSet,
    ParticipantViewSet,
    PolicyDetailAPIView,
    PolicyListAPIView,
    ResourceFileManagementViewSet,
    ResourceManagementViewSet,
    ResourceManagementAutoCategorizationViewSet, # Added for Auto categorization
    ResourceUsagePolicyListCreateView,
    ResourceUsagePolicyRetrieveUpdateDestroyView,
    StandardisationTemplateView,
    SubCategoryViewSet,
    SupportViewSet,
    TeamMemberViewSet,
    UsagePolicyListCreateView,
    UsagePolicyRetrieveUpdateDestroyView,
    telegram_dashboard,
    coco_dashboard,
    farmer_registry_dashboard,
    da_registry_dashboard
)

router = DefaultRouter()
router.register(r"participant", ParticipantViewSet, basename=Constants.PARTICIPANT)
router.register(r"send_invite", MailInvitationViewSet, basename=Constants.SEND_INVITE)
router.register(r"organization", OrganizationViewSet, basename=Constants.ORGANIZATION)
router.register(r"team_member", TeamMemberViewSet, basename=Constants.TEAM_MEMBER)
router.register("drop_document", DropDocumentView, basename=Constants.DROP_DOCUMENT)
router.register("save_documents", DocumentSaveView, basename=Constants.SAVE_DOCUMENTS)
router.register("theme", DatahubThemeView, basename=Constants.THEME)
router.register(r"support", SupportViewSet, basename=Constants.SUPPORT_TICKETS)
router.register(r"datasets", DatahubDatasetsViewSet, basename=Constants.DATAHUB_DATASETS)
router.register(r"", DatahubDashboard, basename="")
router.register(r"dataset/v2", DatasetV2ViewSet, basename=Constants.DATASET_V2_URL)
router.register(r"new_dataset_v2", DatasetV2View, basename=Constants.DATASETS_V2_URL)
router.register(r"dataset_files", DatasetFileV2View, basename=Constants.DATASET_FILES)
router.register(r"dataset_ops", DatasetV2ViewSetOps, basename="")
router.register(r"standardise", StandardisationTemplateView, basename=Constants.STANDARDISE)
router.register(r"newdashboard", DatahubNewDashboard, basename=Constants.NEW_DASHBOARD)
router.register(r"resource_management", ResourceManagementViewSet, basename=Constants.RESOURCE_MANAGEMENT)
# New updated V2 route for Auto Categorization
router.register(r"v2/resource_management", ResourceManagementAutoCategorizationViewSet, basename=Constants.RESOURCE_MANAGEMENT_V2)
router.register(r"resource_file", ResourceFileManagementViewSet, basename=Constants.RESOURCE_FILE_MANAGEMENT)
router.register(r'categories', CategoryViewSet, basename=Constants.CATEGORY)
router.register(r'subcategories', SubCategoryViewSet, basename=Constants.SUBCATEGORY)
router.register(r'embeddings', EmbeddingsViewSet, basename='embeddings')
router.register(r'files', FetchFiles, basename='embeddings')

urlpatterns = [
    path("", include(router.urls)),
    path('policy/', PolicyListAPIView.as_view(), name='policy-list'),
    path('policy/<uuid:pk>/', PolicyDetailAPIView.as_view(), name='policy-detail'),
    path('usage_policies/', UsagePolicyListCreateView.as_view(), name='usage-policy-list-create'),
    path('usage_policies/<uuid:pk>/', UsagePolicyRetrieveUpdateDestroyView.as_view(), name='usage-policy-retrieve-update-destroy'),
    path('resource_usage_policies/', ResourceUsagePolicyListCreateView.as_view(), name='resource_usage-policy-list-create'),
    path('resource_usage_policies/<uuid:pk>/', ResourceUsagePolicyRetrieveUpdateDestroyView.as_view(), name='resource_usage-policy-retrieve-update-destroy'),
    path('messages/<uuid:pk>/', MessagesViewSet.as_view(), name='messages-retrieve-update-destroy'),
    path('messages/', MessagesCreateViewSet.as_view(), name='messages_create'),
    path('streamlit/telegram_bot_dashboard/', telegram_dashboard, name='streamlit_telegram_dashboard'),
    path('streamlit/coco_dashboard/', coco_dashboard, name='streamlit_coco_dashboard'),
    path('streamlit/farmer_registry_dashboard/', farmer_registry_dashboard, name='streamlit_farmer_registry_dashboard'),
    path('streamlit/da_registry_dashboard/', da_registry_dashboard, name='streamlit_da_registry_dashboard'),

]
