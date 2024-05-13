import uuid
from sre_constants import CATEGORY
from unicodedata import category

# import black
from django.db import models

from accounts.models import User
from core import settings
from core.base_models import TimeStampMixin
from datahub.models import Datasets, Organization, UserOrganizationMap
from utils.validators import validate_file_size

CATEGORY = (
    ("connectors", "connectors"),
    ("datasets", "datasets"),
    ("others", "others"),
    ("user_accounts", "user_accounts"),
    ("usage_policy", "usage_policy"),
    ("certificate", "certificate"),
)

STATUS = (("open", "open"), ("hold", "hold"), ("closed", "closed"))


def auto_str(cls):
    def __str__(self):
        return "%s(%s)" % (
            type(self).__name__,
            ", ".join("%s=%s" % item for item in vars(self).items()),
        )

    cls.__str__ = __str__
    return cls


@auto_str
class SupportTicket(TimeStampMixin):
    """SupportTicket model of all the participant users"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_map = models.ForeignKey(UserOrganizationMap, on_delete=models.PROTECT)
    category = models.CharField(max_length=255, null=False, choices=CATEGORY)
    subject = models.CharField(
        max_length=255,
        null=False,
    )
    issue_message = models.CharField(max_length=1000, null=True)
    issue_attachments = models.FileField(
        upload_to=settings.ISSUE_ATTACHEMENT_URL,
        null=True,
        blank=True,
        validators=[validate_file_size],
    )
    solution_message = models.CharField(max_length=1000, null=True)
    solution_attachments = models.FileField(
        upload_to=settings.SOLUCTION_ATTACHEMENT_URL,
        null=True,
        blank=True,
        validators=[validate_file_size],
    )
    status = models.CharField(max_length=255, null=False, choices=STATUS)


@auto_str
class Department(TimeStampMixin):
    """Department model of all the users"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True)
    department_name = models.CharField(max_length=255, unique=True)
    department_discription = models.CharField(max_length=255)
    status = models.BooleanField(default=True)


@auto_str
class Project(TimeStampMixin):
    """Project model of all the users"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True)
    project_name = models.CharField(max_length=255, unique=True)
    project_discription = models.CharField(max_length=255)
    status = models.BooleanField(default=True)


@auto_str
class Connectors(TimeStampMixin):
    """Connectors model of all the users"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_map = models.ForeignKey(UserOrganizationMap, on_delete=models.PROTECT, blank=True, default="")
    project = models.ForeignKey(Project, on_delete=models.PROTECT, null=True)
    department = models.ForeignKey(
        Department, on_delete=models.PROTECT, default="e459f452-2b4b-4129-ba8b-1e1180c87888"
    )
    dataset = models.ForeignKey(Datasets, on_delete=models.PROTECT)
    connector_name = models.CharField(max_length=255, unique=True)
    connector_type = models.CharField(max_length=255)
    connector_description = models.CharField(max_length=500, null=True, blank=True)
    docker_image_url = models.CharField(max_length=255)
    application_port = models.IntegerField()
    certificate = models.FileField(
        upload_to=settings.CONNECTORS_CERTIFICATE_URL,
        blank=True,
        validators=[validate_file_size],
    )
    usage_policy = models.CharField(max_length=255)
    status = models.BooleanField(default=True)
    connector_status = models.CharField(max_length=255, default="install certificate")


@auto_str
class ConnectorsMap(TimeStampMixin):
    """ConnectorsMap model of all the users"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(Connectors, on_delete=models.PROTECT, related_name="provider")
    consumer = models.ForeignKey(Connectors, on_delete=models.PROTECT, related_name="consumer", null=True)
    connector_pair_status = models.CharField(max_length=255, default="awaiting for approval")
    ports = models.JSONField(default={})
    status = models.BooleanField(default=True)


@auto_str
class SupportTicketV2(TimeStampMixin):
    """SupportTicket model of all the participant users"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_title = models.CharField(max_length=255)
    user_map = models.ForeignKey(UserOrganizationMap, on_delete=models.CASCADE)
    description = models.CharField(max_length=1000, null=True)
    category = models.CharField(max_length=255, null=False, choices=CATEGORY)
    ticket_attachment = models.FileField(
        upload_to=settings.SUPPORT_TICKET_FILES_URL,
        null=True,
        blank=True,
        validators=[validate_file_size],
    )
    status = models.CharField(max_length=255, null=False, default="open", choices=STATUS)

    class Meta:
        db_table = "support_ticket_v2"


@auto_str
class Resolution(TimeStampMixin):
    """SupportTicket model of all the participant users"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(SupportTicketV2, on_delete=models.CASCADE)
    # reference FK to the resolution providing authority
    user_map = models.ForeignKey(UserOrganizationMap, on_delete=models.CASCADE,null=True)
    resolution_text = models.CharField(max_length=1000)
    solution_attachments = models.FileField(
        upload_to=settings.RESOLUTIONS_ATTACHMENT_URL,
        null=True,
        blank=True,
        validators=[validate_file_size],
    )

    class Meta:
        db_table = "resolution"
