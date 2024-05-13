class Constants:
    CONTENT = "content"
    USER = "user"
    ORGANIZATION = "organization"
    ID = "id"
    EMAIL = "email"
    ORG_EMAIL = "org_email"
    TO_EMAIL = "to_email"
    SUPPORTTICKET = "supportticket"
    USER_ORGANIZATION_MAP = "userorganizationmap"
    USER_MAP = "user_map"
    USER_MAP_USER = "user_map__user"
    DATASETS = "datasets"
    DATASET = "dataset"
    USER_MAP_ORGANIZATION_ID = "user_map__organization__id"
    USER_MAP_ORGANIZATION = "user_map__organization"
    USER_ID = "user_id"
    UPDATED_AT = "updated_at"
    DESC_UPDATED_AT = "-updated_at"

    CREATED_AT = "created_at"
    EXCLUDE_DATES = ["created_at", "updated_at"]
    ALL = "__all__"
    SUPPORT = "support"
    PARTICIPANT = "participant"
    SUPPORT_TICKETS = "support_tickets"
    THEME = "theme"
    SAVE_DOCUMENTS = "save_documents"
    DROP_DOCUMENT = "drop_document"
    TEAM_MEMBER = "team_member"
    SEND_INVITE = "send_invite"
    USERROLE = "userrole"
    ORG_ID = "org_id"
    DATAHUB_DATASETS = "datahub_datasets"
    SEARCH_PATTERNS = "search_pattern"
    NAME_ICONTAINS = "name__icontains"
    SAMPLE_DATASET = "sample_dataset"
    RECORDS = "records"
    CONTENTS = "contents"
    OTHERS = "others"
    CREATED_AT__RANGE = "created_at__range"
    UPDATED_AT__RANGE = "updated_at__range"
    GEOGRAPHY = "geography"
    CROP_DETAIL = "crop_detail"
    PROJECT = "project"
    PROJECTS = "projects"
    DEPARTMENT = "department"
    DEPARTMENTS = "departments"
    CATEGORY = "category"
    SUBCATEGORY = "subcategory"
    PROVIDER_CORE = "provider_core"
    CONSUMER_CORE = "consumer_core"
    CONSUMER_APP = "consumer_app"
    PROVIDER_APP = "provider_app"
    DATAHUB = "datahub"
    GOVERNING_LAW = "governing_law"
    PRIVACY_POLICY = "privacy_policy"
    TOS = "tos"
    LIMITATIONS_OF_LIABILITIES = "limitations_of_liabilities"
    WARRANTY = "warranty"
    APPROVAL_STATUS = "approval_status"
    APPROVED = "approved"
    AWAITING_REVIEW = "for_review"
    IS_ENABLED = "is_enabled"
    DOCKER_IMAGE_URL = "docker_image_url"
    IMAGES = "images"
    DIGEST = "digest"
    USAGE_POLICY = "usage_policy"
    PROJECT_DEPARTMENT = "project__department"
    CONNECTOR_TYPE = "connector_type"
    CERTIFICATE = "certificate"
    CONSUMER = "consumer"
    CONSUMER_DATASET = "consumer__dataset"
    CONSUMER_PROJECT = "consumer__project"
    CONSUMER_PROJECT_DEPARTMENT = "consumer__project__department"
    CONSUMER_USER_MAP_ORGANIZATION = "consumer__user_map__organization"
    PAIRED = "paired"
    AWAITING_FOR_APPROVAL = "awaiting for approval"
    PROVIDER = "provider"
    PROVIDER_DATASET = "provider__dataset"
    PROVIDER_PROJECT = "provider__project"
    PROVIDER_PROJECT_DEPARTMENT = "provider__project__department"
    PROVIDER_USER_MAP_ORGANIZATION = "provider__user_map__organization"
    RELATION = "relation"
    PROJECT_PROJECT_NAME = "project__project_name"
    DATASET_USER_MAP = "dataset__user_map"
    DEPARTMENT_DEPARTMENT_NAME = "department__department_name"
    DEPARTMENT_ORGANIZATION = "department__organization"
    IS_DATASET_PRESENT = "is_dataset_present"
    DATASET_ID = "dataset_id"
    UNPAIRED = "unpaired"
    PAIRING_REQUEST_RECIEVED = "pairing request received"
    CONNECTOR_PAIR_STATUS = "connector_pair_status"
    REJECTED = "rejected"
    DEFAULT = "Default"
    ACTIVE = "Active"
    NOT_ACTIVE = "Not Active"
    RECENTLY_ACTIVE = "Recently Active"
    PARTICIPANT_INVITATION_SUBJECT = " has invited you to join as a participant"
    PARTICIPANT_ORG_ADDITION_SUBJECT = "Your organization has been added as a participant in "
    PARTICIPANT_ORG_UPDATION_SUBJECT = "Your organization details has been updated in "
    PARTICIPANT_ORG_DELETION_SUBJECT = "Your organization has been deleted as a participant in "
    ADDED_NEW_DATASET_SUBJECT = "A new dataset request has been uploaded in "
    UPDATED_DATASET_SUBJECT = "A dataset has been updated in "
    APPROVED_NEW_DATASET_SUBJECT = "Congratulations, your dataset has been approved on "
    REJECTED_NEW_DATASET_SUBJECT = "Your dataset has been rejected on "
    ENABLE_DATASET_SUBJECT = "Your dataset is now enabled in "
    DISABLE_DATASET_SUBJECT = "Your dataset is disabled in "
    CREATE_CONNECTOR_AND_REQUEST_CERTIFICATE_SUBJECT = "A new certificate request has been received"
    PAIRING_REQUEST_RECIEVED_SUBJECT = "You have recieved a connector pairing request"
    PAIRING_REQUEST_APPROVED_SUBJECT = "Your connector pairing request has been approved on "
    PAIRING_REQUEST_REJECTED_SUBJECT = "Your connector pairing request has been rejected on "
    CONNECTOR_UNPAIRED_SUBJECT = "A connector has been unpaired on "
    CONNECTOR_DELETION = "A connector has been deleted from "
    MAX_FILE_SIZE = 2097152
    FILE_25MB_SIZE = 26214400
    MAX_PUBLIC_FILE_SIZE = 52428800
    MAX_CONNECTOR_FILE = 209715200
    DATAHUB_NAME = "DATAHUB_NAME"
    datahub_name = "datahub_name"
    DATAHUB_SITE = "DATAHUB_SITE"
    datahub_site = "datahub_site"
    NEW_DATASET_UPLOAD_REQUEST_IN_DATAHUB = "new_dataset_upload_request_in_datahub.html"
    DATASET_UPDATE_REQUEST_IN_DATAHUB = "dataset_update_request_in_datahub.html"
    WHEN_DATAHUB_ADMIN_ADDS_PARTICIPANT = "when_datahub_admin_adds_participant.html"
    DATAHUB_ADMIN_UPDATES_PARTICIPANT_ORGANIZATION = "datahub_admin_updates_participant_organization.html"
    DATAHUB_ADMIN_DELETES_PARTICIPANT_ORGANIZATION = "datahub_admin_deletes_participant_organization.html"
    WHEN_CONNECTOR_UNPAIRED = "when_connector_unpaired.html"
    PAIRING_REQUEST_APPROVED = "pairing_request_approved.html"
    PAIRING_REQUEST_REJECTED = "pairing_request_rejected.html"
    REQUEST_CONNECTOR_PAIRING = "request_for_connector_pairing.html"
    CREATE_CONNECTOR_AND_REQUEST_CERTIFICATE = "participant_creates_connector_and_requests_certificate.html"
    PARTICIPANT_INSTALLS_CERTIFICATE = "participant_installs_certificate.html"
    SOURCE_FILE_TYPE = "file"
    SOURCE_MYSQL_FILE_TYPE = "mysql"
    SOURCE_POSTGRESQL_FILE_TYPE = "postgresql"
    SOURCE_FILE = "source_file"
    SOURCE_MYSQL = "source_mysql"
    SOURCE_POSTGRESQL = "source_postgresql"
    SOURCE_API_TYPE = "live_api"
    DATASET_FILE_TYPES = ["xls", "xlsx", "csv", "pdf", "jpeg", "jpg", "png", "tiff"]
    DATASET_MAX_FILE_SIZE = 500
    DATASET_V2_URL = "dataset/v2"
    DATASETS_V2_URL = "datasets/v2"
    DATASET_FILES = "dataset_files"
    CATEGORIES_FILE = "categories.json"
    DATAHUB_CATEGORIES_FILE = "categories.json"
    CONNECTORS = "connectors"
    STANDARDISE = "standardise"
    MAPS = "maps"
    DATASET_NAME = "dataset_name"
    NAME = "name"
    INTEGRATED_FILE = "integrated_file"
    LEFT_DATASET_FILE_PATH = "left_dataset_file_path"
    RIGHT_DATASET_FILE_PATH = "right_dataset_file_path"
    CONDITION = "condition"
    SLASH_MEDIA_SLASH = "/media/"
    LEFT_SELECTED = "left_selected"
    RIGHT_SELECTED = "right_selected"
    LEFT_ON = "left_on"
    RIGHT_ON = "right_on"
    HOW = "how"
    DATA = "data"
    LEFT = "left"
    EDIT = "edit"
    REQUESTED = "requested"
    USAGEPOLICY = "usagepolicy"
    UNAPPROVED = "unapproved"
    REGISTERED = "registered"
    PUBLIC = "public"
    PRIVATE = "private"
    AUTHORIZATION = "Authorization"
    ORGANIZATION_NAME_ICONTAINS = "organization__name__icontains"
    DASHBOARD = "dashboard"
    NEW_DASHBOARD = "new_dashboard"
    RESOURCE_MANAGEMENT = "resource_management"
    RESOURCE_FILE_MANAGEMENT = "resource_file_management"
    GOOGLE_DRIVE_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id"
    GOOGLE_DRIVE_DOMAIN = "drive.google.com"
    SYSTEM_MESSAGE = """

You are Vistaar(nAssistant) , an initiative by the Ministry of Agriculture and Farmer Welfare, India, aimed at providing comprehensive assistance in various farming practices, a highly knowledgeable AI assistant specializing in farming.

You are assisting with the user name: {name_1}, who is a person in the farming community. 

Your role is to:
- Assist the user by answering their queries about farming using the information available in the context. 
- Your responses should be concise and accurate.
- Address the user's name to make the conversation friendly.
- Format all your answers using bullet points, new lines to increase readability.
- Decorate the answer with relevant emojis compatible with Telegram.

chat history:  \n{chat_history}\n

follow up input: \n{input}\n

Remember, Generate the Answer for the 'Current conversation input' only from the information in the below context text:

\n{context}\n

Assist the user {name_1}, with genertated answer and If the provided context contains a YouTube URL, include that URL in your response. Do not include YouTube URLs that are not present in the context.

If the answer isn't in your context or context is empty: 
Avoid the "sorry" route. Instead, cleverly mention the lapse in your training or kindly suggest a rephrasing of their question. 
For example:
- "Seems like that particular topic wasn't in my last update.🤔"
- "Could you reframe that for me?"
- "Ever thought of stumping an AI? You just did! Try another angle?"
"""

    NO_CUNKS_SYSTEM_MESSAGE = """
        
        You are Vistaar, an initiative by the Ministry of Agriculture and Farmer Welfare, India, aimed at providing comprehensive assistance in various farming practices, a highly knowledgeable AI assistant specializing in farming.
        
        You are intreacting with the user, {name_1}, who is a person in the farming community. 
        
        Your role is to:
        - Assist the user by answering their queries about farming using the information available in the context. 
        - Your responses should be concise and accurate.
        - Address the user's name to make the conversation friendly.
        - Format all your answers using bullet points, new lines to increase readability.
        - Decorate the answer with relevant emojis compatible with Telegram.

        Current conversation:
        follow up input: \n{input}\n
        
        Remember, If the current conversation starts with a greeting or wishes, warmly welcome the user and explain your capabilities else you didn't get the context to generate the answer for the input.
        If you didn't get the context: 
        Avoid the "sorry" route. Instead, cleverly mention the lapse in your training or kindly suggest a rephrasing of their question. 
        For example:
        - "Seems like that particular topic wasn't in my last update.🤔"
        - "Could you reframe that for me?"
        # - "Ever thought of stumping an AI? You just did! Try another angle?"
    """

    CONDESED_QUESTION = """
    Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its english language.
    
    Chat History:
    {chat_history}

    Follow Up Input: {current_question}

    """
    TRANSCTION_PROMPT= """Keep this as context: "{transcription}"
                        By using only the above context generate
                        Title: title should be name for the context,
                        Youtube url: {youtube_url}
                        Description: Description should be a very much detailed explanation of the context with good formatiing of text,
                        Keywords: Keywords are important terms in the context,
                        Tags : Tags should be important nouns associated in the transcript,
                        """

class NumericalConstants:
    FILE_NAME_LENGTH = 85
