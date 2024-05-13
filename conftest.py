
import os
import time
import unittest
import uuid

import django
import pytest
from django.conf import settings
from django.test.runner import DiscoverRunner
from testcontainers.postgres import PostgresContainer

from core import settings

# class DockerizedTestRunner(unittest.TestCase):
#     @classmethod
#     def setUpClass(cls):
#         # Start PostgreSQL container using testcontainers
#         cls.postgres_container = PostgresContainer()
#         cls.postgres_container.start()
#         time.sleep(10)
#         # Set up Django
#         os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
#         django.setup()

#         # Dynamically update the database settings to use the PostgreSQL container
#         db_host = cls.postgres_container.get_container_host_ip()
#         db_port = cls.postgres_container.get_exposed_port(5432)
#         db_name = 'test'  # Replace with your desired database name
#         db_user = 'test'      # Replace with your desired database username
#         db_password = 'test'  # Replace with your desired database password

#         settings.DATABASES['default']['ENGINE'] = 'django.db.backends.postgresql'
#         settings.DATABASES['default']['HOST'] = db_host
#         settings.DATABASES['default']['PORT'] = db_port
#         settings.DATABASES['default']['NAME'] = db_name
#         settings.DATABASES['default']['USER'] = db_user
#         settings.DATABASES['default']['PASSWORD'] = db_password



@pytest.fixture(scope="session", autouse=True)
def postgres_test_container():
    """
    Fixture to set up and tear down a PostgreSQL test container.
    """
    postgres_container = PostgresContainer()
    postgres_container.start()
     # Update the DATABASES setting to use the test container's configuration
   # Dynamically update the database settings to use the PostgreSQL container
    db_host = postgres_container.get_container_host_ip()
    db_port = postgres_container.get_exposed_port(5432)
    db_name = 'test'  # Replace with your desired database name
    db_user = 'test'      # Replace with your desired database username
    db_password = 'test'  # Replace with your desired database password

    settings.DATABASES['default']['ENGINE'] = 'django.db.backends.postgresql'
    settings.DATABASES['default']['HOST'] = db_host
    settings.DATABASES['default']['PORT'] = db_port
    settings.DATABASES['default']['NAME'] = db_name
    settings.DATABASES['default']['USER'] = db_user
    settings.DATABASES['default']['PASSWORD'] = db_password

    yield postgres_container

    postgres_container.stop()