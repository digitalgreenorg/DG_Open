from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from rest_framework import serializers, status
from utils.validators import validate_phone_number
from django.core.validators import EmailValidator
from django.core.validators import validate_email

class OrganizationSerializerValidator(serializers.ModelSerializer):
    @staticmethod
    def validate_website(attrs):
        # Use URLValidator to validate the website field
        website = attrs.get("website")
        phone_number = attrs.get('phone_number')  
        org_email= attrs.get('org_email') 
        if website:
            validator = URLValidator(schemes=["https"])
            try:
                validator(website)
            except ValidationError:
                raise serializers.ValidationError({"website": ["Invalid website URL"]})
        if phone_number:
            try:
                valid = validate_phone_number(phone_number=phone_number)
                if valid:
                    pass
                if not valid:
                    raise serializers.ValidationError({"phone_number": ["Invalid phone number format."]})
            except Exception:
                raise serializers.ValidationError({"phone_number": ["Invalid phone number format."]})
        return attrs

    
class UserCreateSerializerValidator:
    @staticmethod
    def validate_phone_number_format(attrs):
        phone_number = attrs.get('phone_number')
        email = attrs.get('email')
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