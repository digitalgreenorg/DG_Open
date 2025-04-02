"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
    
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import protected_media_view

# schema for swagger API documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Datahub API",
        default_version="v1",
        description="Backend API for datahub",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    re_path(
        r"^doc(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^doc/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^redoc/$",
        schema_view.with_ui("redoc", cache_timeout=0),
        name="schema-redoc",
    ),
    path("admin/", admin.site.urls),
    path("datahub/", include("datahub.urls")),
    path("accounts/", include("accounts.urls")),
    path("participant/", include("participant.urls")),
    path("microsite/", include("microsite.urls")),
    path("connectors/", include("connectors.urls")),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected-media/', protected_media_view),
    path("ai/", include("ai.urls")),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.PROTECTED_MEDIA_URL, document_root=settings.PROTECTED_MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns += [
        path("__debug__/", include("debug_toolbar.urls")),
    ]
    
