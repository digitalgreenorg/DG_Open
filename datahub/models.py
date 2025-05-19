import os
import uuid
from datetime import timedelta
from email.mime import application

from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.core.files.storage import Storage
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.utils import timezone
from django.utils.text import Truncator
from pgvector.django import VectorField

from accounts.models import User
from core.base_models import TimeStampMixin
from core.constants import Constants
from utils.validators import (
    validate_25MB_file_size,
    validate_file_size,
    validate_image_type,
)


def auto_str(cls):
    def __str__(self):
        return "%s" % (", ".join("%s=%s" % item for item in vars(self).items()))

    cls.__str__ = __str__
    return cls


@auto_str
class Organization(TimeStampMixin):
    """Organization model

    status:
        active = 1
        inactive = 0
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    org_email = models.EmailField(max_length=255, unique=True)
    address = models.JSONField()
    phone_number = models.CharField(max_length=50, null=True, blank=True)
    logo = models.ImageField(
        upload_to=settings.ORGANIZATION_IMAGES_URL,
        null=True,
        blank=True,
        validators=[validate_file_size, validate_image_type],
    )
    hero_image = models.ImageField(
        upload_to=settings.ORGANIZATION_IMAGES_URL,
        null=True,
        blank=True,
        validators=[validate_file_size, validate_image_type],
    )
    org_description = models.TextField(max_length=512, null=True, blank=True)
    website = models.CharField(max_length=255, null=True, blank=True)
    status = models.BooleanField(default=True)
    country = models.JSONField(default=dict)
    state = models.JSONField(default=dict)
    district = models.JSONField(default=dict)
    village = models.JSONField(default=dict)

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)


@auto_str
class DatahubDocuments(models.Model):
    """OrganizationDocuments model"""

    governing_law = models.TextField()
    warranty = models.TextField()
    limitations_of_liabilities = models.TextField()
    privacy_policy = models.TextField()
    tos = models.TextField()


@auto_str
class UserOrganizationMap(TimeStampMixin):
    """UserOrganizationMap model for mapping User and Organization model"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)


CATEGORY = (
    ("crop_data", "crop_data"),
    ("partice_data", "partice_data"),
    ("farmer_profile", "farmer_profile"),
    ("land_records", "land_records"),
    ("research_data", "research_data"),
    ("cultivation_data", "cultivation_data"),
    ("soil_data", "soil_data"),
    ("weather_data", "weather_data"),
)

CONNECTOR_TYPE = (("MYSQL", "MYSQL"), ("MONGODB", "MONDODB"), ("CSV", "CSV"))
APPROVAL_STATUS = (
    ("approved", "approved"),
    ("rejected", "rejected"),
    ("for_review", "for_review"),
)
USAGE_POLICY_REQUEST_STATUS = (
    ("approved", "approved"),
    ("rejected", "rejected"),
    ("requested", "requested"),
    ("recalled", "recalled"),
)
USAGE_POLICY_API_TYPE = (
    ("dataset_file", "dataset_file"),
    ("api", "api")
)

RESOURCE_USAGE_POLICY_API_TYPE = (
    ("resource", "resource"),
    ("embeddings", "embeddings")
)
RESOURCE_URL_TYPE = (
    ("youtube", "youtube"),
    ("pdf", "pdf"),
    ("file", "file"),
    ("website", "website"),
    ("api", "api"),
    ("s3", "s3"),
    ("google_drive", "google_drive"),
    ("dropbox", "dropbox"),
    ("azure_blob", "azure_blob")


)

USAGE_POLICY_APPROVAL_STATUS = (
    ("public", "public"),
    ("registered", "registered"),
    ("private", "private"),
)
EMBEDDINGS_STATUS = (
    ("completed", "completed"),
    ("in-progress", "in-progress"),
    ("failed", "failed"),
)

@auto_str
class Datasets(TimeStampMixin):
    """Datasets model of all the users"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_map = models.ForeignKey(UserOrganizationMap, on_delete=models.PROTECT)
    name = models.CharField(max_length=255, unique=True)
    description = models.CharField(max_length=500)
    category = models.JSONField()
    geography = models.CharField(max_length=255, blank=True)
    crop_detail = models.CharField(max_length=255, null=True, blank=True)  # field should update
    constantly_update = models.BooleanField(default=False)
    age_of_date = models.CharField(max_length=255, null=True, blank=True)
    data_capture_start = models.DateTimeField(null=True, blank=True)
    data_capture_end = models.DateTimeField(null=True, blank=True)
    dataset_size = models.CharField(max_length=255, null=True, blank=True)
    connector_availability = models.CharField(max_length=255, null=True, blank=True)
    sample_dataset = models.FileField(
        upload_to=settings.SAMPLE_DATASETS_URL,
        blank=True,
    )
    status = models.BooleanField(default=True)
    approval_status = models.CharField(max_length=255, null=True, choices=APPROVAL_STATUS, default="for_review")
    is_enabled = models.BooleanField(default=True)
    is_public = models.BooleanField(default=True)
    remarks = models.CharField(max_length=1000, null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["name"])]




@auto_str
class StandardisationTemplate(TimeStampMixin):
    """
    Data Standardisation Model.
    datapoint category - Name of the category for a group of attributes
    datapoint attribute - datapoints for each attribute (JSON)
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    datapoint_category = models.CharField(max_length=50, unique=True)
    datapoint_description = models.TextField(max_length=255)
    datapoint_attributes = models.JSONField(default = dict)

class Policy(TimeStampMixin):
    """
    Policy documentation Model.
    name - Name of the Policy.
    description - datapoints of each Policy.
    file - file of each policy.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=2048, unique=False)
    file = models.FileField(
        upload_to=settings.POLICY_FILES_URL,
        validators=[validate_25MB_file_size],
        null=True
    )


class CustomStorage(Storage):
    def __init__(self, dataset_name, source):
        self.dataset_name = dataset_name
        self.source = source

    # def size(self, name):
    #     path = self.path(name)
    #     return os.path.getsize(path)
        
    def exists(self, name):
        """
        Check if a file with the given name already exists in the storage.
        """
        return os.path.exists(name)
    
    def url(self, url):
        return url

    def _save(self, name, content): 
        # Save file to a directory outside MEDIA_ROOT
        full_path = os.path.join(settings.DATASET_FILES_URL, name)
        directory = os.path.dirname(full_path)
        if not self.exists(directory):
            os.makedirs(directory)
        with open(full_path, 'wb') as f:
            f.write(content.read())
        return name


@auto_str
class DatasetV2(TimeStampMixin):
    """
    Stores a single dataset entry, related to :model:`datahub_userorganizationmap` (UserOrganizationMap).
    New version of model for dataset - DatasetV2 to store Meta data of Datasets.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    user_map = models.ForeignKey(UserOrganizationMap, on_delete=models.PROTECT, related_name="user_org_map")
    description = models.TextField(max_length=512, null=True, blank=True)
    category = models.JSONField(default=dict)
    geography = models.JSONField(default=dict)
    data_capture_start = models.DateTimeField(null=True, blank=True)
    data_capture_end = models.DateTimeField(null=True, blank=True)
    constantly_update = models.BooleanField(default=False)
    is_temp = models.BooleanField(default=True)

    class Meta:
        indexes = [models.Index(fields=["name", "category"])]

@auto_str
class DatasetV2File(TimeStampMixin):
    """
    Stores a single file (file paths/urls) entry for datasets with a reference to DatasetV2 instance.
    related to :model:`datahub_datasetv2` (DatasetV2)

    `Source` (enum): Enum to store file type
        `file`: dataset of file type
        `mysql`: dataset of mysql connection
        `postgresql`: dataset of postgresql connection
    """

    def dataset_directory_path(instance, filename):
        # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
        return f"{settings.DATASET_FILES_URL}/{instance.dataset.name}/{instance.source}/{filename}"
    
    def get_upload_path(instance, filename):
        return f"{instance.dataset.name}/{instance.source}/{filename}"

    def save(self, *args, **kwargs):
        # set the user_id before saving
        storage = CustomStorage(self.dataset.name, self.source)
        self.file.storage = storage # type: ignore
        
        # if self.file:
        #     # Get the file size
        #     size = self.file.size
        #     self.file_size = size
        
        super().save(*args, **kwargs)

    SOURCES = [
        (Constants.SOURCE_FILE_TYPE, Constants.SOURCE_FILE_TYPE),
        (Constants.SOURCE_MYSQL_FILE_TYPE, Constants.SOURCE_MYSQL_FILE_TYPE),
        (Constants.SOURCE_POSTGRESQL_FILE_TYPE, Constants.SOURCE_POSTGRESQL_FILE_TYPE),
        (Constants.SOURCE_API_TYPE, Constants.SOURCE_API_TYPE),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    dataset = models.ForeignKey(DatasetV2, on_delete=models.CASCADE, related_name="datasets")
    file = models.FileField(upload_to=get_upload_path, null=True, blank=True)
    file_size = models.PositiveIntegerField(null=True, blank=True)
    source = models.CharField(max_length=50, choices=SOURCES)
    standardised_file = models.FileField(upload_to=get_upload_path, null=True, blank=True)
    standardised_configuration = models.JSONField(default = dict)
    accessibility = models.CharField(max_length=255, null=True, choices=USAGE_POLICY_APPROVAL_STATUS, default="public")
    connection_details = models.JSONField(default=dict, null=True)
    
class UsagePolicy(TimeStampMixin):
    """
    Policy documentation Model.
    datapoint category - Name of the category for a group of attributes
    datapoint attribute - datapoints for each attribute (JSON)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_organization_map = models.ForeignKey(UserOrganizationMap, on_delete=models.PROTECT, related_name="org")
    dataset_file = models.ForeignKey(DatasetV2File, on_delete=models.CASCADE, related_name="dataset_v2_file")
    approval_status = models.CharField(max_length=255, null=True, choices=USAGE_POLICY_REQUEST_STATUS, default="requested")
    accessibility_time = models.DateField(null=True)
    type = models.CharField(max_length=20, null=True, choices=USAGE_POLICY_API_TYPE, default="dataset_file")
    api_key = models.CharField(max_length=64, null=True, unique=True)
    configs = models.JSONField(default=dict, null=True)


class Resource(TimeStampMixin):
    """
    Resource Module -- Any user can create resource.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=1000)
    description = models.TextField(max_length=2500)
    country = models.JSONField(default=dict)
    state = models.JSONField(default=dict)
    district = models.JSONField(default=dict)
    village = models.JSONField(default=dict)
    user_map = models.ForeignKey(UserOrganizationMap, on_delete=models.CASCADE)
    category = models.JSONField(default=dict)
    accessibility = models.CharField(max_length=255, null=True, choices=USAGE_POLICY_APPROVAL_STATUS, default="public")
    countries = ArrayField( models.CharField(max_length=100),  # base_field: CharField with max length
        null=True,  # allow null values
        default=list,  # default value as an empty list
    )
    sub_categories = ArrayField(  models.CharField(max_length=100),  # base_field: CharField with max length
        null=True,  # allow null values
        default=list,  # default value as an empty list
    )
    def __str__(self) -> str:
        return self.title

class ResourceFile(TimeStampMixin):
    """
    Resource Files Model -- Has a one to many relation 
    -- 1 resource can have multiple resource files.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="resources")
    file = models.FileField(upload_to=settings.RESOURCES_URL, null=True, blank=True, max_length=2000)
    file_size = models.PositiveIntegerField(null=True, blank=True)
    type = models.CharField(max_length=20, null=True, choices=RESOURCE_URL_TYPE, default="file")
    url = models.CharField(max_length=2000, null=True)
    transcription = models.CharField(max_length=20000,null=True, blank=True)
    embeddings_status = models.CharField(max_length=20, null=True, choices=EMBEDDINGS_STATUS, default="in-progress")
    embeddings_status_reason = models.CharField(max_length=1000, null=True)
    def __str__(self) -> str:
        return self.file.name
    
    def delete(self, *args, **kwargs):
        self.file.delete(save=False)  # Delete the file from the file system
        super().delete(*args, **kwargs)  # Call the superclass delete method

# Signal to ensure file deletion
@receiver(post_delete, sender=ResourceFile)
def delete_file_on_resourcefile_delete(sender, instance, **kwargs):
    if instance.file:
        instance.file.delete(save=False)

class DatasetV2FileReload(TimeStampMixin):
    dataset_file = models.ForeignKey(DatasetV2File, on_delete=models.CASCADE, related_name="dataset_file")

class Category(TimeStampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=500)

class SubCategory(TimeStampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategory_category")
    description = models.CharField(max_length=200, null=True)  # Adjust max_length as needed

    def save(self, *args, **kwargs):
        if not self.description:
            self.description = Truncator(self.name).chars(80)
        super().save(*args, **kwargs)

class ResourceSubCategoryMap(TimeStampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sub_category = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name="resource_sub_category_map")
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="resource_cat_map")
    


class DatasetSubCategoryMap(TimeStampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sub_category = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name="dataset_sub_category_map")
    dataset = models.ForeignKey(DatasetV2, on_delete=models.CASCADE, related_name="dataset_cat_map")


class ResourceUsagePolicy(TimeStampMixin):
    """
    Resource Policy Model.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_organization_map = models.ForeignKey(UserOrganizationMap, on_delete=models.PROTECT, related_name="org_usage_policy")
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="resource_usage_policy")
    type = models.CharField(max_length=200, null=True, choices=RESOURCE_USAGE_POLICY_API_TYPE, default="resource")
    approval_status = models.CharField(max_length=255, null=True, choices=USAGE_POLICY_REQUEST_STATUS, default="requested")
    accessibility_time = models.DateField(null=True)
    api_key = models.CharField(max_length=64, null=True, unique=True)
    configs = models.JSONField(default=dict, null=True)


class LangchainPgCollection(models.Model):
    name = models.CharField(max_length=50)
    cmetadata = models.JSONField()
    uuid = models.UUIDField(primary_key=True)
    # resource_file = models.ForeignKey(ResourceFile, on_delete=models.PROTECT, related_name="resource_file_collections")

    class Meta:
        db_table = 'langchain_pg_collection'


class LangchainPgEmbedding(models.Model):
    collection = models.ForeignKey(LangchainPgCollection, on_delete=models.CASCADE)
    embedding = VectorField(1563)  # Assuming 'vector' is a custom PostgreSQL data type
    document = models.TextField()
    cmetadata = models.JSONField()
    custom_id = models.CharField(max_length=255)
    uuid = models.UUIDField(primary_key=True)
    __table_args__ = {'extend_existing': True}

    class Meta:
        db_table = 'langchain_pg_embedding'

    def __str__(self):
        return f"LangchainPgEmbedding(uuid={self.uuid}, collection_id={self.custom_id})"

# class Conversation(TimeStampMixin):
#     BOT_CHOICES = (
#         ("whatsapp", "whatsapp"),
#         ("telegram", "telegram"),
#         ("vistaar", "vistaar"),

#     )
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, max_length=50)
#     user = models.ForeignKey(UserOrganizationMap, on_delete=models.CASCADE, related_name="conversation_map")
#     bot_type = models.CharField(max_length=10, choices=BOT_CHOICES, default="vistaar")
#     bot_reference = models.CharField(max_length=50, null=True)
#     # language = models.ForeignKeyField(Language, backref="language", null=True)
#     # country = models.ForeignKeyField(Country, backref="country", null=True)
#     # state = models.ForeignKeyField(State, backref="state", null=True)
#     # crop = models.ForeignKeyField(Crop, backref="crop", null=True)

#     # class Meta:
#     #     table_name = "conversation"

class Messages(TimeStampMixin):
    INPUT_TYPES = (
        ("text", "text"),
        ("voice", "voice"),
    )
    BOT_CHOICES = (
        ("whatsapp", "whatsapp"),
        ("telegram", "telegram"),
        ("vistaar", "vistaar"),
        ("vistaar_api", "vistaar_api"),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, max_length=50)
    user_map = models.ForeignKey(UserOrganizationMap, on_delete=models.CASCADE, related_name="conversation_user_map")
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="messages_resource", null=True)
    bot_type = models.CharField(max_length=20, choices=BOT_CHOICES, default="vistaar")
    bot_reference = models.CharField(max_length=50, null=True)
    query = models.CharField(max_length=10000, null=True)
    translated_message = models.CharField(max_length=10000, null=True)
    query_response = models.CharField(max_length=10000, null=True)
    feedback = models.CharField(max_length=4096, null=True)
    input_type = models.CharField(max_length=20, choices=INPUT_TYPES, null=True)
    input_language_detected = models.CharField(max_length=20, null=True)
    retrieved_chunks = models.ManyToManyField(LangchainPgEmbedding, null=True)
    condensed_question = models.CharField(max_length=20000, null=True)
    prompt_usage = models.JSONField(default={}, null=True)
    output = models.JSONField(default={}, null=True)
    # class Meta:
    #     table_name = "messages"

# class MessageEmbedding(models.Model):
#     message = models.ForeignKey(Messages, on_delete=models.CASCADE)
#     embedding = models.ForeignKey(LangchainPgEmbedding, on_delete=models.CASCADE)
#     similarity = models.FloatField()
    
#     class Meta:
#         db_table = 'datahub_messages_retrieved_chunks'

from langchain_core.pydantic_v1 import BaseModel, Field


class OutputParser(BaseModel):
    response: str = Field(description="AI Assistant Response")
    follw_up_questions: list = Field(description="Follow-up questions, give users examples of at least list of 3 questions which they can ask as a follow-up. Remember Build those questions from the provided context only other wise give empty")

def load_category_and_sub_category():
    import pandas as pd
    df = pd.read_csv("Restructured_Agricultural_Data_with_Descriptions.csv")

    # Iterate through each row in the DataFrame
    for index, row in df.iterrows():
        category_name = row['Category']
        category_description = row['Category']+" Description"
        subcategory_name = row['Subcategory']
        subcategory_description = row['title']
        
        # Get or create the Category
        category, created = Category.objects.get_or_create(
            name=category_name,
            defaults={'description': category_description}
        )
        
        # Create the SubCategory
        subcategory, created = SubCategory.objects.get_or_create(
            name=subcategory_name,
            defaults={'category': category, 'description': subcategory_description},
        )
        print(f"{index} completed out of 250")

    print("Data has been successfully saved to the database.")
