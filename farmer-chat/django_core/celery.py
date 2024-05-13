import os
from celery import Celery, signals
from database.database_config import pooled_db_conn


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_core.settings")
app = Celery("django_core")


# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

db_conn = None


# Define Celery signals for Peewee connection handling
@signals.task_prerun.connect
def task_prerun_handler(task_id, task, *args, **kwargs):
    global db_conn
    # Perform setup operations before task execution
    if db_conn is None:
        print("Initializing database connection for task.")
        db_conn = pooled_db_conn
    elif db_conn.is_closed():
        print("Reusing database connection for task.")
        db_conn.connect(reuse_if_open=True)


@signals.task_postrun.connect
def task_postrun_handler(task_id, task, *args, **kwargs):
    if not db_conn.is_closed():
        db_conn.close()
