import uuid

from django.db import models

from accounts.models import User
from core import settings
from core.base_models import TimeStampMixin
from datahub.models import DatasetV2File

# Create your models here.


def auto_str(cls):
    def __str__(self):
        return "%s" % (", ".join("%s=%s" % item for item in vars(self).items()))

    cls.__str__ = __str__
    return cls

@auto_str
class Connectors(TimeStampMixin):
    """
    Stores a single connectors entry.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=512)
    integrated_file = models.FileField(max_length=255, upload_to=settings.CONNECTOR_FILES_URL, null=True, blank=True)
    status = models.BooleanField(default=True)
    config = models.JSONField(default=dict)


@auto_str
class ConnectorsMap(TimeStampMixin):
    """
    Stores a single connectors entry, related to :model:`datahub_datasetv2file` (DatsetV2File).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    connectors = models.ForeignKey(Connectors, on_delete=models.CASCADE)
    left_dataset_file = models.ForeignKey(DatasetV2File, on_delete=models.CASCADE, related_name="left_dataset_file")
    right_dataset_file = models.ForeignKey(DatasetV2File, on_delete=models.CASCADE, related_name="right_dataset_file")
    condition = models.JSONField(default=dict)
    status = models.BooleanField(default=True)
