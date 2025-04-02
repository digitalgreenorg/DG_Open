import uuid

from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models

# from utils.validators import validate_file_size
from core.base_models import TimeStampMixin
from utils.validators import validate_file_size


class UserManager(BaseUserManager):
    """UserManager to manage creation of users"""

    use_in_migrations = True

    def _create_user(self, email, **extra_fields):
        """Save an admin or super user"""
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.save()
        return user

    def create_superuser(self, email, **extra_fields):
        """Save an admin or super user with role_id set to admin datahub user"""
        extra_fields.setdefault("status", False)
        extra_fields.setdefault("role_id", int(1))
        return self._create_user(email, **extra_fields)


def auto_str(cls):
    def __str__(self):
        return "%s(%s)" % (
            type(self).__name__,
            ", ".join("%s=%s" % item for item in vars(self).items()),
        )

    cls.__str__ = __str__
    return cls

class UserRole(models.Model):
    """UserRole model for user roles of the datahub users
    User role mapping with id:
        datahub_admin: 1
        datahub_team_member: 2
        datahub_participant_root: 3
        datahub_participant_team: 4
        datahub_guest_user: 5
        datahub_co_steward: 6
    """

    ROLES = (
        ("datahub_admin", "datahub_admin"),
        ("datahub_team_member", "datahub_team_member"),
        ("datahub_participant_root", "datahub_participant_root"),
        ("datahub_participant_team", "datahub_participant_team"),
        ("datahub_guest_user", "datahub_guest_user"),
        ("datahub_co_steward", "datahub_co_steward"),
    )

    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id = models.IntegerField(primary_key=True)
    role_name = models.CharField(max_length=255, choices=ROLES)

    def __str__(self):
        return self.role_name



@auto_str
class User(AbstractBaseUser, PermissionsMixin, TimeStampMixin):
    """User model of all the datahub users

    status:
        true (active) = 1
        false (inactive) = 0
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=50, null=True, blank=True)
    role = models.ForeignKey(
        UserRole,
        max_length=255,
        on_delete=models.PROTECT,
    )
    profile_picture = models.ImageField(
        upload_to=settings.PROFILE_PICTURES_URL,
        null=True,
        blank=True,
        validators=[validate_file_size],
    )
    status = models.BooleanField(default=True)
    on_boarded = models.BooleanField(default=False)
    on_boarded_by = models.ForeignKey('self', null=True, blank=True, on_delete=models.PROTECT)
    approval_status = models.BooleanField(default=True)
    subscription = models.CharField(max_length=50, null=True, blank=True)
    
    # The following fields are provided by AbstractBaseUser and PermissionsMixin
    password = models.CharField(max_length=128)  # Default password field
    last_login = models.DateTimeField(null=True, blank=True)
    is_superuser = models.BooleanField(default=False, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # Email is the only required field for creating a user

    def get_full_name(self):
        """
        Helper function to return the user's full name.
        """
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        """
        Helper function to return the user's short name (first name).
        """
        return self.first_name

    def __str__(self):
        return self.email