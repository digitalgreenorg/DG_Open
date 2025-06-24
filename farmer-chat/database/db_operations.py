import logging

from database.database_config import db_conn
from peewee import DoesNotExist

logger = logging.getLogger(__name__)


def get_record_by_field(model_class, field_name, value):
    """Retrieve a record by a specific field."""
    record = None
    try:
        with db_conn:
            query = model_class.select().where(
                getattr(model_class, field_name) == value
            )
            record = query.get()
    except DoesNotExist:
        return record

    return record


def create_record(model_class, data_to_be_inserted):
    """Create a new record in the database."""
    record = None
    try:
        with db_conn.atomic() as current_transaction:
            record = model_class.create(**data_to_be_inserted)

    except Exception as error:
        current_transaction.rollback()
        logger.error(error, exc_info=True)

    return record


def create_multiple_records(model_class, data_to_be_inserted):
    """Create / insert multiple records in to the database."""
    records = None
    try:
        with db_conn.atomic() as current_transaction:
            records = model_class.insert_many(data_to_be_inserted).execute()

    except Exception as error:
        current_transaction.rollback()
        logger.error(error, exc_info=True)

    return records


def update_record(model_class, record_id, data_to_be_updated, **kwargs):
    """Update a record."""
    record = None
    try:
        record = model_class.get_by_id(record_id)
        try:
            with db_conn.atomic() as current_transaction:
                for field, value in data_to_be_updated.items():
                    setattr(record, field, value)
                record.save()
        except IntegrityError as e:
            logger.error(f"Error updating record {e}", exc_info=True)

    except DoesNotExist:
        logger.error(
            f"Record with {record_id} in the model {model_class} does not exist."
        )

    return record
