import uuid

from django.db import models

from core.base_models import TimeStampMixin

# Create your models here.

class FeedBack(TimeStampMixin):
    """
    FeedBack Model- this is feed back table from the bot
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField()
    message_id = models.UUIDField()
    phone_number = models.CharField(max_length=15, null=True)
    user_query = models.TextField()
    translated_query = models.TextField(null=True)
    response = models.TextField(null=True)
    translated_response = models.TextField(null=True)
    message_feedback = models.JSONField(default=dict, null=True)
    video_feedback = models.JSONField(default=dict, null=True)
    video_url = models.CharField(max_length=150, null=True)