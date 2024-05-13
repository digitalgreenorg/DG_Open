import logging

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler

LOGGER = logging.getLogger(__name__)

class NotFoundException(APIException):
    def __init__(
            self,
            code=None,
            detail=None,
            status_code=None,
            ):

        if code is None:
            self.code = 'message'
        else:
            self.code = code
        if detail is None:
            self.detail = 'Not found'
        else:
            self.detail = detail
        if status_code is None:
            self.status_code = status.HTTP_404_NOT_FOUND
        else:
            self.status_code = status_code

def custom_exception_handler(exc, context):
    if isinstance(exc, NotFoundException):
        LOGGER.error(exc, exc_info=True)
        # return Response(data=exc.data, status=exc.status)
        return Response(data={exc.code: exc.detail}, status=exc.status_code)

    response = exception_handler(exc, context)
    return response
