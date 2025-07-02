#!/bin/bash
touch /app/logs
tail -n 0 -f /app/logs &
cd /app

# Gunicorn run
/opt/venv/bin/gunicorn --workers=3 -k uvicorn.workers.UvicornH11Worker --bind 0.0.0.0:8000 -m 007 --log-level debug --access-logfile /app/logs --error-logfile /app/logs --log-file /app/logs --capture-output django_core.asgi:application &

wait

# Keep the container running
exec "$@"
