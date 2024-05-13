FROM python:3.10

COPY . /app
WORKDIR /app

RUN \
    apt-get update && \
    apt-get install -y vim uvicorn && \
    apt-get clean

RUN python3 -m venv /opt/venv

RUN /opt/venv/bin/pip install pip --upgrade && \
    /opt/venv/bin/pip install -r requirements.txt && \
    chmod +x entrypoint.sh

EXPOSE 8000

CMD ["/app/entrypoint.sh"]

# Run the Uvicorn server with the specified number of workers
# CMD ["uvicorn", "django_core.asgi:application", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
