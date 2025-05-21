#!/bin/bash

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Load data
python manage.py loaddata db_scripts/userrole_fixture.yaml
# python manage.py loaddata admin.yaml
# Run Django development server
python manage.py runserver 0.0.0.0:8000 >> /datahub/farmstack_logs.txt 2>&1 &

# Run Celery worker
celery -A core worker --loglevel=info >> /datahub/celery_logs.txt 2>&1 &


# Run Celery beat
celery -A core beat --loglevel=info >> /datahub/celery_beat_logs.txt 2>&1 &
# Run Celery flower
celery -A core flower --loglevel=info