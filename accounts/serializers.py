from django.db import models
from django.db.models import fields
from rest_framework import serializers
from rest_framework.parsers import MultiPartParser
import phonenumbers
from accounts.models import User, UserRole
from utils.validators import validate_phone_number


class UserRoleSerializer(serializers.ModelSerializer):
    """UserRoleSerializer"""

    class Meta:
        model = UserRole
        # exclude = ("id",)
        fields = "__all__"


class UserCreateSerializer(serializers.ModelSerializer):
    """UserCreateSerializer"""

    # parser_classes = MultiPartParser
    # email = serializers.EmailField()
    # role = serializers.PrimaryKeyRelatedField(
    #     queryset=UserRole.objects.all(),
    #     required=True,
    # )
    # phone_number = serializers.CharField()

    # def validate(self, attrs):
    #     phone_number = attrs.get('phone_number')
    #     if phone_number:
    #         try:
    #             valid = validate_phone_number(phone_number=phone_number)
    #             if valid:
    #                 pass
    #             if not valid:
    #                 raise serializers.ValidationError({"phone_number": "Invalid phone number format."})
    #         except Exception:
    #             raise serializers.ValidationError({"phone_number": "Invalid phone number format."})
    #     return attrs
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "role",
            "subscription",
            "profile_picture",
            "on_boarded",
            "approval_status",
            "on_boarded_by"
        )
        # fields = "__all__"
        # depth = 1


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "role",
            "status",
            "subscription",
            "profile_picture",
            "on_boarded",
            "on_boarded_by",
            "approval_status"
        )


class UserUpdateSerializer(serializers.ModelSerializer):
    """UserUpdateSerializer"""
    # phone_number = serializers.PhoneNumberField()
    role = serializers.PrimaryKeyRelatedField(
        queryset=UserRole.objects.all(),
        required=True,
    )

    phone_number = serializers.CharField()

    def validate(self, attrs):
        phone_number = attrs.get('phone_number')
        if phone_number:
            try:
                valid = validate_phone_number(phone_number=phone_number)
                if valid:
                    pass
                if not valid:
                    raise serializers.ValidationError({"phone_number": "Invalid phone number format."})
            except Exception:
                raise serializers.ValidationError({"phone_number": "Invalid phone number format."})
        return attrs

    class Meta:
        model = User
        fields = (
            # "email",
            "first_name",
            "last_name",
            "phone_number",
            "role",
            "profile_picture",
            "on_boarded",
            "on_boarded_by",
            "approval_status"
        )
        depth = 1


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.CharField()


class OtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.IntegerField()
