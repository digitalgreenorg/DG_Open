import logging

import phonenumbers
from django.conf import settings
from django.core.exceptions import ValidationError

from core.constants import Constants

LOGGER = logging.getLogger(__name__)

def validate_file_size(value):
    """
    Validator function to check the file size limit.
    """
    filesize = value.size
    print("file_size", filesize)
    if filesize > Constants.MAX_FILE_SIZE:
        raise ValidationError("You cannot upload file more than 2Mb")
    else:
        return value


def validate_25MB_file_size(value):
    """
    Validator function to check the file size limit.
    """
    filesize = value.size
    print("file_size", filesize)
    if filesize > Constants.FILE_25MB_SIZE:
        raise ValidationError("You cannot upload file more than 25Mb")
    else:
        return value


def validate_image_type(file):
    """
    Validator function to check check for image types
    """
    file_extension = str(file).split(".")[-1]
    # if file_type not in settings.IMAGE_TYPES_ALLOWED and file_extension not in settings.IMAGE_TYPES_ALLOWED:
    if file_extension not in settings.IMAGE_TYPES_ALLOWED:
        raise ValidationError(
            "Image type not supported. Image type allowed: png, jpg, jpeg"
        )
    return file_extension


def validate_document_type(file):
    """
    Validator function to check check for document types
    """
    file_extension = str(file).split(".")[-1]
    # if file_type not in settings.FILE_TYPES_ALLOWED and file_extension not in settings.FILE_TYPES_ALLOWED:
    if file_extension not in settings.FILE_TYPES_ALLOWED:
        raise ValidationError(
            "Document type not supported. Document type allowed: pdf, doc, docx"
        )
    return file


def validate_dataset_type(file, extensions):
    """
    Validator function to check check for dataset types

    """
    file_extension = str(file).split(".")[-1]
    if file_extension not in extensions:
        return False
    return True


def validate_dataset_size(file, size):
    """
    Validator function to check check for dataset types

    """
    if file.size > size * 1024 * 1024:
        return False
    return True


def validate_phone_number(phone_number: str):
    valid = False

    try:
        code, number = phone_number.replace("-", "").split(" ")
        region = phonenumbers.region_code_for_country_code(int(code.replace("+", "")))
        parsed_number = phonenumbers.parse(number=number, region=region)

        is_valid_number = phonenumbers.is_valid_number(parsed_number)
        is_valid_country_number = phonenumbers.is_possible_number(parsed_number)

        if is_valid_number and is_valid_country_number:
            valid = True
        else:
            valid = False

    except Exception as e:
        valid = False

    return valid


def format_category_name(category:str)-> str:
    try:
        new_category = category.lower().strip().replace(" ", "_")
        return new_category
    except:
        return category