from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("register", views.RegisterViewset, basename="register")
router.register("login", views.LoginViewset, basename="login")
router.register("otp", views.VerifyLoginOTPViewset, basename="otp")
router.register("resend_otp", views.ResendOTPViewset, basename="resend_otp")
router.register("self_register",views.SelfRegisterParticipantViewSet,basename="self_register")


urlpatterns = [
    path("", include(router.urls)),
]
