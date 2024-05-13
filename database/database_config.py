import os, sys
from pathlib import Path
from peewee import PostgresqlDatabase
from playhouse.pool import PooledPostgresqlExtDatabase

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_DIR = os.path.join(BASE_DIR, "django_core")
sys.path.append(str(CONFIG_DIR))
from config import Config

# normal DB connection
db_conn = PostgresqlDatabase(
    Config.DB_NAME, user=Config.DB_USER, password=Config.DB_PASSWORD, host=Config.DB_HOST, port=Config.DB_PORT
)

# Pooled DB connection
pooled_db_conn = PooledPostgresqlExtDatabase(
    Config.DB_NAME, user=Config.DB_USER, password=Config.DB_PASSWORD, host=Config.DB_HOST, port=Config.DB_PORT
)
