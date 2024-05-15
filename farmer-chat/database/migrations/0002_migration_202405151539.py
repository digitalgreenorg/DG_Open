# auto-generated snapshot
from peewee import *
import datetime
import peewee
import uuid


snapshot = Snapshot()


@snapshot.append
class Language(peewee.Model):
    id = IntegerField(primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    name = CharField(max_length=512)
    display_name = CharField(max_length=512)
    code = CharField(max_length=10, null=True)
    latn_code = CharField(max_length=10, null=True, unique=True)
    bcp_code = CharField(max_length=10, null=True, unique=True)
    class Meta:
        table_name = "language"


@snapshot.append
class User(peewee.Model):
    id = CharField(default=uuid.uuid4, max_length=50, primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    phone = CharField(max_length=15, null=True)
    email = CharField(max_length=100, unique=True)
    first_name = CharField(max_length=255, null=True)
    last_name = CharField(max_length=255, null=True)
    last_used = DateTimeField(null=True)
    preferred_language = snapshot.ForeignKeyField(backref='language', index=True, model='language', null=True)
    class Meta:
        table_name = "user"


@snapshot.append
class Conversation(peewee.Model):
    id = CharField(default=uuid.uuid4, max_length=50, primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    user = snapshot.ForeignKeyField(backref='user', index=True, model='user')
    title = CharField(max_length=255, null=True)
    class Meta:
        table_name = "conversation"


@snapshot.append
class FollowUpQuestion(peewee.Model):
    id = CharField(default=uuid.uuid4, max_length=100, primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    ref_id = CharField(max_length=50, null=True)
    message = CharField(max_length=10000, null=True)
    follow_up_question_type = CharField(max_length=50, null=True)
    sequence = IntegerField(null=True)
    class Meta:
        table_name = "follow_up_question"


@snapshot.append
class Messages(peewee.Model):
    id = CharField(default=uuid.uuid4, max_length=50, primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    conversation = snapshot.ForeignKeyField(backref='conversation', index=True, model='conversation')
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
    input_type = CharField(max_length=20, null=True)
    input_language_detected = CharField(max_length=20, null=True)
    retrieved_chunks = CharField(max_length=20000, null=True)
    condensed_question = CharField(max_length=20000, null=True)
    class Meta:
        table_name = "messages"


@snapshot.append
class GenerationMetrics(peewee.Model):
    id = CharField(default=uuid.uuid4, max_length=50, primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    message = snapshot.ForeignKeyField(backref='generation_metrics', index=True, model='messages')
    generation_start_time = DateTimeField(null=True)
    generation_end_time = DateTimeField(null=True)
    completion_tokens = CharField(max_length=10, null=True)
    prompt_tokens = CharField(max_length=10, null=True)
    total_tokens = CharField(max_length=10, null=True)
    response_gen_exception = CharField(max_length=20000, null=True)
    response_gen_retries = CharField(max_length=4, null=True)
    class Meta:
        table_name = "generation_metrics"


@snapshot.append
class MessageMediaFiles(peewee.Model):
    id = CharField(default=uuid.uuid4, max_length=50, primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    message = snapshot.ForeignKeyField(backref='media_files', index=True, model='messages')
    media_type = CharField(max_length=20)
    media_url = CharField(max_length=255)
    class Meta:
        table_name = "media_files"


@snapshot.append
class MultilingualText(peewee.Model):
    id = IntegerField(primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    language = snapshot.ForeignKeyField(backref='language', index=True, model='language')
    text_code = CharField(max_length=512, unique=True)
    text = CharField(max_length=10000)
    class Meta:
        table_name = "multilingual_text"


@snapshot.append
class RephraseMetrics(peewee.Model):
    id = CharField(default=uuid.uuid4, max_length=50, primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    message = snapshot.ForeignKeyField(backref='rephrase_metrics', index=True, model='messages')
    rephrase_start_time = DateTimeField(null=True)
    rephrase_end_time = DateTimeField(null=True)
    completion_tokens = CharField(max_length=10, null=True)
    prompt_tokens = CharField(max_length=10, null=True)
    total_tokens = CharField(max_length=10, null=True)
    is_rerank_response_parsed = BooleanField(default=False)
    rephrase_exception = CharField(max_length=20000, null=True)
    rephrase_retries = CharField(max_length=4, null=True)
    class Meta:
        table_name = "rephrase_metrics"


@snapshot.append
class RerankedChunk(peewee.Model):
    id = CharField(default=uuid.uuid4, max_length=50, primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    chunk_id = CharField(max_length=50)
    message = snapshot.ForeignKeyField(backref='reranked_chunks', index=True, model='messages')
    chunk_text = CharField(max_length=10000, null=True)
    source = CharField(max_length=200, null=True)
    rank = IntegerField(null=True)
    class Meta:
        table_name = "reranked_chunk"


@snapshot.append
class RerankMetrics(peewee.Model):
    id = CharField(default=uuid.uuid4, max_length=50, primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    message = snapshot.ForeignKeyField(backref='rerank_metrics', index=True, model='messages')
    rerank_start_time = DateTimeField(null=True)
    rerank_end_time = DateTimeField(null=True)
    rerank_request_start_time = DateTimeField(null=True)
    rerank_request_end_time = DateTimeField(null=True)
    completion_tokens = CharField(max_length=10, null=True)
    prompt_tokens = CharField(max_length=10, null=True)
    total_tokens = CharField(max_length=10, null=True)
    is_rerank_response_parsed = BooleanField(default=False)
    rerank_exception = CharField(max_length=20000, null=True)
    rerank_retries = CharField(max_length=4, null=True)
    class Meta:
        table_name = "rerank_metrics"


@snapshot.append
class Resource(peewee.Model):
    id = CharField(default=uuid.uuid4, max_length=50, primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    message = snapshot.ForeignKeyField(backref='resources', index=True, model='messages')
    response_text = CharField(max_length=255, null=True)
    translated_text = CharField(max_length=255, null=True)
    resource_string = CharField(max_length=255)
    resource_type = CharField(max_length=20)
    feedback = CharField(max_length=20, null=True)
    class Meta:
        table_name = "resource"


@snapshot.append
class RetrievalMetrics(peewee.Model):
    id = CharField(default=uuid.uuid4, max_length=50, primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    message = snapshot.ForeignKeyField(backref='retrieval_metrics', index=True, model='messages')
    retrieval_start_time = DateTimeField(null=True)
    retrieval_end_time = DateTimeField(null=True)
    class Meta:
        table_name = "retrieval_metrics"


@snapshot.append
class RetrievedChunk(peewee.Model):
    id = CharField(default=uuid.uuid4, max_length=50, primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    chunk_id = CharField(max_length=50)
    message = snapshot.ForeignKeyField(backref='chunks', index=True, model='messages')
    chunk_text = CharField(max_length=10000, null=True)
    source = CharField(max_length=200, null=True)
    repo_link = CharField(max_length=200, null=True)
    cosine_score = FloatField(null=True)
    page_no = IntegerField(null=True)
    rank = IntegerField(null=True)
    class Meta:
        table_name = "retrieved_chunk"


@snapshot.append
class UserActions(peewee.Model):
    id = CharField(default=uuid.uuid4, max_length=50, primary_key=True)
    created_on = DateTimeField(default=datetime.datetime.now)
    updated_on = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_deleted = BooleanField(default=False)
    user = snapshot.ForeignKeyField(backref='user', index=True, model='user')
    action = CharField(max_length=10000, null=True)
    input_time = DateTimeField(null=True)
    response = CharField(max_length=10000, null=True)
    response_time = DateTimeField(null=True)
    class Meta:
        table_name = "user_actions"


def forward(old_orm, new_orm):
    user = new_orm['user']
    return [
        # Apply default value '' to the field user.email,
        user.update({user.email: ''}).where(user.email.is_null(True)),
    ]


def migrate_forward(op, old_orm, new_orm):
    op.run_data_migration()
    op.add_not_null(new_orm.user.email)
    op.add_index(new_orm.user, 'user_email')


def migrate_backward(op, old_orm, new_orm):
    op.drop_index(old_orm.user, 'user_email')
    op.run_data_migration()
    op.drop_not_null(new_orm.user.email)
