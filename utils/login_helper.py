# utils module for accounts app
import datetime
import logging

import pyotp
from django.conf import settings
from django.core.cache import cache

LOGGER = logging.getLogger(__name__)

class generateKey:
    """Generates OTP"""

    @staticmethod
    def returnValue():
        secret = pyotp.random_base32()
        totp = pyotp.TOTP(secret, interval=86400)
        OTP = totp.now()
        return {"totp": secret, "OTP": OTP}


def set_user_otp(
    email,
    otp,
    otp_duration,
    otp_attempt=1,
    updation_time=datetime.datetime.now(),
):
    """
    Creates a user OTP for login or account verification

    Manages user OTPs in django cache
    # Example: creating cache
    cache.set_many({'a': 1, 'b': 2, 'c': 3})
    cache.get_many(['a', 'b', 'c'])

    # Check for expiry of cache
    sentinel = object()
    cache.get('my_key', sentinel) is sentinel
    False

    # Wait 30 seconds for 'my_key' to expire...
    cache.get('my_key', sentinel) is sentinel
    True

    # Delete cache
    cache.delete_many(['a', 'b', 'c'])
    """

    return cache.set(
        email,
        {
            "email": email,
            "user_otp": otp,
            "otp_attempt": otp_attempt,
            "updation_time": updation_time,
        },
        otp_duration,
    )


def user_suspension(
    user_id,
    email,
    cache_type="user_suspension",
    creation_time=datetime.datetime.now(),
    suspension_duration=settings.USER_SUSPENSION_DURATION,
):
    cache.set(
        user_id,
        {
            "email": email,
            "cache_type": cache_type,
            "creation_time": creation_time,
        },
        suspension_duration,
    )
    LOGGER.critical(f"User suspended for invalid otp attempts user_email: {email}")

