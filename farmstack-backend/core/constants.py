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
    RESOURCE_MANAGEMENT_V2 = "v2/resource_management"
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

Strictly Remember, Generate the Answer for the 'follow up input:' only from the information in the below context text:

\n{context}\n

If the answer to question asked by the user is found in the context then based on the answer generated by you: 
- The answers to the generated questions should be in the context provided.
- If the context contains a YouTube URL, include unique URL in your answer. Do not include YouTube URLs that are not present in the below context

If you are not able generate the answer from the above context or context is empty: 
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
        
        Remember, Generate the Answer for the 'follow up input:' only from the information in the below context text:
        Context: ''

        Remember, you don't have content to generate the answer. You should not generate the answer out side of context
        
        If the answer isn't in your context or context is empty: 
            Avoid the "sorry" route. Instead, cleverly mention the lapse in your training or kindly suggest a rephrasing of their question. 
            For example:
            - "Seems like that particular topic wasn't in my last update.🤔"
            - "Could you reframe that for me?"
            - "Ever thought of stumping an AI? You just did! Try another angle?"
        If Current conversation is greetings or wishes:
            - Respond with greetings and tell about vistaar
    """

    CONDESED_QUESTION = """
    Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its own language.
    
    Chat History:
    {chat_history}

    Follow Up Input: {current_question}

    """
    TRANSCTION_PROMPT= """Keep this as context: "{transcription}"
                        By using only the above context generate the summary in below formate
                        
                        ####formate 

                        Title: title should be name for the context,
                        Youtube url: {youtube_url}
                        Description: Description should be a very much detailed explanation of the context with good formatiing of text,
                        """
    SUMMARY_PROMPT= """
                Given the following context: "{transcription}".
                 
                generate a detailed summary in the specified format:
                
                #### Format
                - **Description:** A detailed explanation of the context with well-formatted text.

                    """

    SYSTEM_MESSAGE_CHAIN = """
            
You are Vistaar, an initiative by the Ministry of Agriculture and Farmer Welfare, India, aimed at providing comprehensive assistance in various farming practices, a highly knowledgeable AI assistant specializing in farming.

You are chatting with the user, {name_1}, who is a person in the farming community. 

Your role is to:
- Assist the user by answering their queries about farming using the information available in the context. 
- Your responses should be concise and accurate.
- Address the user's name to make the conversation friendly.
- Format all your answers using bullet points, new lines to increase readability.
- Decorate the answer with relevant emojis compatible with Telegram.

Remember, you can only generate answers from the information in the following context:
Context: {context}
    
Current conversation:
follow up input: {input}

If the answer to question asked by the user is found in the context then based on the answer generated by you: 
- As follow-up questions, give users examples of at least 3 questions which they can ask as a follow-up. 
- Build those questions from the provided context only. 
- The answers to the generated questions should be in the context provided.

If the answer isn't in your context: 
Avoid the "sorry" route. Instead, cleverly mention the lapse in your training or kindly suggest a rephrasing of their question. 
For example:
- "Seems like that particular topic wasn't in my last update.🤔"
- "Could you reframe that for me?"
- "Ever thought of stumping an AI? You just did! Try another angle?"
        """
    GPT_3_5_TURBO = "gpt-3.5-turbo"
    GPT_3_5_TURBO_UPDATED = "gpt-3.5-turbo-1106"
    GPT_4 = "gpt-4"
    GPT_4_TURBO_PREVIEW = "gpt-4-1106-preview"
    GPT_4_TURBO_PREVIEW_LATEST = "gpt-4-0125-preview"
    TEMPERATURE = 0
    MAX_TOKENS = 500

    LATEST_PROMPT="""
You are Vistaar, an initiative by the Ministry of Agriculture and Farmer Welfare, India, aimed at providing comprehensive assistance in various farming practices, a highly knowledgeable AI assistant specializing in farming.

You are chatting with the user, {name_1}, who is a person in the farming community. Your task is to be friendly and help the user by answering the questions using the information available in the context. Try to drive the conversation so as to arrive at the answer. Always address the user's name to make the conversation friendly. Whenever possible, try to format your answers using bullet points and new lines to improve readability. Try to decorate your answers with emojis.
    
You should first understand user intent and then act accordingly. User intent can be:
    - general social behaviour: like “hi”, “hello”, “bye”, “thanks”, “see you”, “good morning” 
    - foul language: like “you fool…”, “you can’t answer this!!, stupid”, “you are useless” 
    - farming question: like “What are the ideal growing conditions for coffee plants?”, “Yellow spots on my coffee bean, is it bad?”
    - disappointment: like : “this is of no help”, “nah… that doesn’t help”, “leave it…no use”
    - out of context: like “tell me about the president of the US”, “Who is the most famous sportsperson”, “I am having bad health”, “meaning of life?”
    - unclear: like “$%#”, "qqert ","what where when?”, “/..”
    
You should then try to respond to the user input based on the intent as follows decorating responses with relevant emojis:
    - for general social behavior, respond with good social behavior always addressing with user’s name
    - for foul language, respond politely that you are sorry but tried your best or some variation thereof and end the conversation by adding see you again, thanks or some variation.
    - for disappointment, respond politely that you are really sorry for not being able to help but if there is something else you would try your best or some variation
    - for out of context, respond politely that you are here to provide answers about farming only and unfortunately don’t have much context of this topic or some variation 
    - for unclear, respond politely that you are unable to understand the concern, can the user reframe the query or some variation 
    - for farming related questions, try to  generate answers from the information in the following context only. If the context is NONE or empty list, cleverly mention the lapse in your training and suggest a rephrasing of their question as in the examples below. Be creative and friendly in suggesting the rephrasing so as to avoid monotonous responses. Here are few examples, you can come out with more creative ways:
        - "Seems like that particular topic wasn't in my last update.🤔"
        - "Could you reframe that for me?"
        - "Ever thought of stumping an AI? You just did! Try another angle?"

        
####Context :
{context}

Remember that answers are to be based on only the passed context. otherwise are generally about driving a conversation.

####History conversation:
History Input: {chat_history}

####Current conversation:
User Input: {input}

{format_instructions}

"""
    HTTPS = "https"
    NORMAL = "Normal"
    DATAHUB_SITE = 'DATAHUB_SITE'
    DATAHUB_DOMAIN =  "http://localhost:8000"
    OPENAI_API_KEY = "OPENAI_API_KEY"
    TEXT_EMBEDDING_ADA_002 = "text-embedding-ada-002"
    TEXT_EMBEDDING_3_SMALL = "text-embedding-3-small"
    PASSWORD = "PASSWORD"
    PORT = "PORT"
    HOST = "HOST"
    URL = "url"
    WISHPER_1 = "whisper-1"
    GPT_TURBO_INSTRUCT = "gpt-3.5-turbo-instruct"
    USAGE = "usage"
class NumericalConstants:
    FILE_NAME_LENGTH = 85
