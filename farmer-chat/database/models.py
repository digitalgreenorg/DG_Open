import datetime
import uuid
from peewee import *
import os, sys
from pathlib import Path

DB_CONN_DIR = Path(__file__).resolve().parent
sys.path.append(str(DB_CONN_DIR))
from database_config import db_conn


class BaseModel(Model):
    """
    Base model to be inherited by other models which stores basic attributes such as object created time, status, etc.,

    Attributes
    ----------
        created_on : `peewee.DateTimeField`
           datetime at which the object was created on (default: datetime.datetime.now)
        updated_on : `peewee.DateTimeField`
           datetime at which the object was updated on (default: datetime.datetime.now)
        is_active : `peewee.BooleanField`
           status of the object (default: True)
        is_deleted : `peewee.BooleanField`
            to maintain soft deletion of the object (default: False)
    """

    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)

    class Meta:
        database = db_conn


class Language(BaseModel):
    """
    Represents a model to store human (spoken) Language data.

    Attributes
    ----------
        id : `peewee.IntegerField`
            primary key of an object / entry
        name : `peewee.CharField`
            name of the spoken language
        display_name : `peewee.CharField`
            readable name of the spoken language
        code : `peewee.CharField`
            language short code (example: en)
        latn_code : `peewee.CharField`
            latin codes for native language in latin script (example: hi-Latn, hindi written in English script)
        bcp_code : `peewee.CharField`
            Internet recognisable language tag for human (spoken) language.
            For more info refer the below URL.
            `https://en.wikipedia.org/wiki/IETF_language_tag`_

    """

    id = IntegerField(primary_key=True)
    name = CharField(max_length=512, null=False)
    display_name = CharField(max_length=512, null=False)
    code = CharField(max_length=10, null=True)
    latn_code = CharField(max_length=10, unique=True, null=True)
    bcp_code = CharField(max_length=10, unique=True, null=True)

    class Meta:
        table_name = "language"


class User(BaseModel):
    """
    Stores a single entry of the app user with basic profile info

    Attributes
    ----------
        id : `peewee.CharField`
            String datatype based UUID embedded primary key of an object
        phone : `peewee.CharField`
            mobile / phone number of the user
        first_name : `peewee.CharField`
            first name of the user profile
        last_name : `peewee.CharField`
            last name of the user profile
        last_used : `peewee.DateTimeField`
            date and time at which the user accessed the app last time
        preferred_language : `database.models.Language` (ForeignKey)
            user preferred language
    """

    id = CharField(primary_key=True, default=uuid.uuid4, max_length=50)
    phone = CharField(max_length=15, null=True)
    email = CharField(max_length=100, unique=True)
    first_name = CharField(max_length=255, null=True)
    last_name = CharField(max_length=255, null=True)
    last_used = DateTimeField(null=True)
    preferred_language = ForeignKeyField(Language, backref="language", null=True)

    class Meta:
        table_name = "user"


class Conversation(BaseModel):
    """
    Stores a single entry of user initiated conversation with the app

    Attributes
    ----------
        id : `peewee.CharField`
            String datatype based UUID embedded primary key of an object
        user : `database.models.User` (ForeignKey)
            User ID to which the current Conversation isntance belongs to
        title : `peewee.CharField`
            title / name of the conversation initiated
    """

    id = CharField(primary_key=True, default=uuid.uuid4, max_length=50)
    user = ForeignKeyField(User, backref="user")
    title = CharField(max_length=255, null=True)

    class Meta:
        table_name = "conversation"


class Messages(BaseModel):
    """
    Stores a single entry of user the message (query) or the response for previous user query

    Attributes
    ----------
        id : `peewee.CharField`
            String datatype based UUID embedded primary key of an object
        conversation : `database.models.Conversation` (ForeignKey)
            Conversation ID for which the current Messages instance is mapped to
        original_message : `peewee.CharField`
            Original user message or query in any language the user has submitted it
        translated_message : `peewee.CharField`
            Translated message of the original_message (primarily in English) which will be submitted further for response generation
        message_input_time : `peewee.DateTimeField`
            datetime of the user message or query submitted
        input_speech_to_text_start_time : `peewee.DateTimeField`
            datetime at which speech-to-text conversion started for input query
        input_speech_to_text_end_time : `peewee.DateTimeField`
            datetime at which speech-to-text conversion ended for input query
        input_translation_start_time : `peewee.DateTimeField`
            start datetime for translation of input query
        input_translation_end_time : `peewee.DateTimeField`
            end datetime for translation of input query
        message_response : `peewee.CharField`
            original message response generated (primarily in English)
        message_translated_response : `peewee.CharField`
            Translated message of the message_response to user's original_message language or to user preferred language
        response_translation_start_time : `peewee.DateTimeField`
            start datetime for translation of message_response to message_translated_response
        response_translation_end_time : `peewee.DateTimeField`
            end datetime for translation of message_response to message_translated_response
        main_bot_logic_start_time : `peewee.DateTimeField`
            datetime at which processing the response generation started
        main_bot_logic_end_time : `peewee.DateTimeField`
            datetime at which processing the response generation ended
        video_retrieval_start_time : `peewee.DateTimeField`
            start datetime for video retrieval related to user query
        video_retrieval_end_time : `peewee.DateTimeField`
            end datetime for video retrieval related to user query
        feedback : `peewee.CharField`
            feedback for the generated response
        input_type : `peewee.CharField`
            type of user query (text or voice)
        input_language_detected : `peewee.CharField`
            detected language of the input user query or message
        retrieved_chunks : `peewee.CharField`
            Relevant content chunks retrieved from content retrieval process
        condensed_question : `peewee.CharField`
            Condensed or rephrased query of the user query (translated_message)
    """

    INPUT_TYPES = (
        ("text", "text"),
        ("voice", "voice"),
    )

    id = CharField(primary_key=True, default=uuid.uuid4, max_length=50)
    conversation = ForeignKeyField(Conversation, backref="conversation")
    original_message = CharField(max_length=10000, null=True)
    translated_message = CharField(max_length=10000, null=True)
    message_input_time = DateTimeField(null=True)
    input_speech_to_text_start_time = DateTimeField(null=True)
    input_speech_to_text_end_time = DateTimeField(null=True)
    input_translation_start_time = DateTimeField(null=True)
    input_translation_end_time = DateTimeField(null=True)
    message_response = CharField(max_length=10000, null=True)
    message_translated_response = CharField(max_length=10000, null=True)
    response_translation_start_time = DateTimeField(null=True)
    response_translation_end_time = DateTimeField(null=True)
    response_text_to_speech_start_time = DateTimeField(null=True)
    response_text_to_speech_end_time = DateTimeField(null=True)
    message_response_time = DateTimeField(null=True)
    main_bot_logic_start_time = DateTimeField(null=True)
    main_bot_logic_end_time = DateTimeField(null=True)
    video_retrieval_start_time = DateTimeField(null=True)
    video_retrieval_end_time = DateTimeField(null=True)
    feedback = CharField(max_length=4096, null=True)
    input_type = CharField(max_length=20, choices=INPUT_TYPES, null=True)
    input_language_detected = CharField(max_length=20, null=True)
    retrieved_chunks = CharField(max_length=20000, null=True)
    condensed_question = CharField(max_length=20000, null=True)

    class Meta:
        table_name = "messages"


class MessageMediaFiles(BaseModel):
    """
    Stores the metadata of Media files' associated with each Messages instance

    Attributes
    ----------
        id : `peewee.CharField`
            String datatype based UUID embedded primary key of an object
        message : `database.models.Messages` (ForeignKey)
            Messages ID for which the current MessageMediaFiles instance is associated with
        media_type : `peewee.CharField`
            Media message type (input query audio or generated response audio)
        media_url : `peewee.CharField`
            URL of the current media file stored at

    """

    MEDIA_TYPES = (
        ("audio_input", "audio_input"),
        ("audio_response", "audio_response"),
    )
    id = CharField(primary_key=True, default=uuid.uuid4, max_length=50)
    message = ForeignKeyField(Messages, backref="media_files")
    media_type = CharField(max_length=20, choices=MEDIA_TYPES)
    media_url = CharField(max_length=255, null=False)

    class Meta:
        table_name = "media_files"


class Resource(BaseModel):
    """
    Stores the metadata of Videos relevant to the content

    Attributes
    ----------
        id : `peewee.CharField`
            String datatype based UUID embedded primary key of an object
        message : `database.models.Messages` (ForeignKey)
            Messages ID for which the current MessageMediaFiles instance is associated with

    """

    RESOURCE_TYPES = (("video_link", "video_link"),)

    id = CharField(primary_key=True, default=uuid.uuid4, max_length=50)
    message = ForeignKeyField(Messages, backref="resources")
    response_text = CharField(max_length=255, null=True)
    translated_text = CharField(max_length=255, null=True)
    resource_string = CharField(max_length=255, null=False)
    resource_type = CharField(max_length=20, choices=RESOURCE_TYPES)
    feedback = CharField(max_length=20, null=True)


class UserActions(BaseModel):
    """
    Logs user action

    Attributes
    ----------
        id : `peewee.CharField`
            String datatype based UUID embedded primary key of an object
        user : `database.models.User` (ForeignKey)
            UserActions instance mapped to User
        action : `peewee.CharField`
            description or the type of action
        input_time : `peewee.DateTimeField`
            datetime at which the action logged at
        response : `peewee.CharField`
            description of the response for corresponding action
        response_time : `peewee.DateTimeField`
            datetime at which the response logged at
    """

    id = CharField(primary_key=True, default=uuid.uuid4, max_length=50)
    user = ForeignKeyField(User, backref="user")
    action = CharField(max_length=10000, null=True)
    input_time = DateTimeField(null=True)
    response = CharField(max_length=10000, null=True)
    response_time = DateTimeField(null=True)

    class Meta:
        table_name = "user_actions"


class MultilingualText(BaseModel):
    """
    Model to store multilingual static text messages
    :model: `multilingual_text` (MultilingualText)

    **Fields**
        `id`: Unique ID of record
        `language`: language_id REFERENCE TO language.id
        `text`: Text to display
        `text_code`: code to access the specific Text
    """

    id = IntegerField(primary_key=True)
    language = ForeignKeyField(Language, backref="language")
    text_code = CharField(max_length=512, unique=True, null=False)
    text = CharField(max_length=10000, null=False)

    class Meta:
        table_name = "multilingual_text"


class FollowUpQuestion(BaseModel):
    """
    Model to store the Follow Up Questions

    **Fields**
        `id`: Unique ID of record
        `ref_id`:  REFERENCE TO Messages.id or UserNudge.id
        `message`: Follow up text message for the user
        `follow_up_question_type`: follow up question type - nudge / message
    """

    FOLLOW_UP_QUESTION_TYPES = (
        ("nudge", "nudge"),
        ("message", "message"),
    )

    id = CharField(primary_key=True, max_length=100, default=uuid.uuid4)
    ref_id = CharField(max_length=50, null=True)
    message = CharField(max_length=10000, null=True)
    follow_up_question_type = CharField(max_length=50, choices=FOLLOW_UP_QUESTION_TYPES, null=True)
    sequence = IntegerField(null=True)

    class Meta:
        table_name = "follow_up_question"


# New Model For BOT V2


class RetrievedChunk(BaseModel):
    """
    Stores an entry of RetrievedChunk retrieved via content retrieval process associated with a message
    """

    id = CharField(primary_key=True, default=uuid.uuid4, max_length=50)
    chunk_id = CharField(max_length=50)
    message = ForeignKeyField(Messages, backref="chunks")
    chunk_text = CharField(max_length=10000, null=True)
    source = CharField(max_length=200, null=True)
    repo_link = CharField(max_length=200, null=True)
    cosine_score = FloatField(null=True)
    page_no = IntegerField(null=True)
    rank = IntegerField(null=True)

    class Meta:
        table_name = "retrieved_chunk"


class RetrievalMetrics(BaseModel):
    """
    Stores an entry of RetrievalMetrics while retrieving content for a given user query or message
    """

    id = CharField(primary_key=True, default=uuid.uuid4, max_length=50)
    message = ForeignKeyField(Messages, backref="retrieval_metrics")
    retrieval_start_time = DateTimeField(null=True)
    retrieval_end_time = DateTimeField(null=True)

    class Meta:
        table_name = "retrieval_metrics"


class RerankedChunk(BaseModel):
    """
    Stores an entry of RerankedChunk of content retrieved associated with a message
    """

    id = CharField(primary_key=True, default=uuid.uuid4, max_length=50)
    chunk_id = CharField(max_length=50)
    message = ForeignKeyField(Messages, backref="reranked_chunks")
    chunk_text = CharField(max_length=10000, null=True)
    source = CharField(max_length=200, null=True)
    rank = IntegerField(null=True)

    class Meta:
        table_name = "reranked_chunk"


class RerankMetrics(BaseModel):
    """
    Stores an entry of RerankMetrics while reranking the user query or message
    """

    id = CharField(primary_key=True, default=uuid.uuid4, max_length=50)
    message = ForeignKeyField(Messages, backref="rerank_metrics")
    rerank_start_time = DateTimeField(null=True)
    rerank_end_time = DateTimeField(null=True)
    rerank_request_start_time = DateTimeField(null=True)
    rerank_request_end_time = DateTimeField(null=True)
    completion_tokens = CharField(null=True, max_length=10)
    prompt_tokens = CharField(null=True, max_length=10)
    total_tokens = CharField(null=True, max_length=10)
    is_rerank_response_parsed = BooleanField(default=False)
    rerank_exception = CharField(null=True, max_length=20000)
    rerank_retries = CharField(null=True, max_length=4)

    class Meta:
        table_name = "rerank_metrics"


class GenerationMetrics(BaseModel):
    """
    Stores an entry of GenerationMetrics while generating the response for a given user query or message
    """

    id = CharField(primary_key=True, default=uuid.uuid4, max_length=50)
    message = ForeignKeyField(Messages, backref="generation_metrics")
    generation_start_time = DateTimeField(null=True)
    generation_end_time = DateTimeField(null=True)
    completion_tokens = CharField(null=True, max_length=10)
    prompt_tokens = CharField(null=True, max_length=10)
    total_tokens = CharField(null=True, max_length=10)
    response_gen_exception = CharField(null=True, max_length=20000)
    response_gen_retries = CharField(null=True, max_length=4)

    class Meta:
        table_name = "generation_metrics"


class RephraseMetrics(BaseModel):
    """
    Stores an entry of RephraseMetrics while rephrasing the user query or message
    """

    id = CharField(primary_key=True, default=uuid.uuid4, max_length=50)
    message = ForeignKeyField(Messages, backref="rephrase_metrics")
    rephrase_start_time = DateTimeField(null=True)
    rephrase_end_time = DateTimeField(null=True)
    completion_tokens = CharField(null=True, max_length=10)
    prompt_tokens = CharField(null=True, max_length=10)
    total_tokens = CharField(null=True, max_length=10)
    is_rerank_response_parsed = BooleanField(default=False)
    rephrase_exception = CharField(null=True, max_length=20000)
    rephrase_retries = CharField(null=True, max_length=4)

    class Meta:
        table_name = "rephrase_metrics"
