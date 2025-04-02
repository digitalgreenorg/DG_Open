FROM python:3.11-slim

# Install dependencies
RUN apt-get update && apt-get install -y ffmpeg libsm6 libxext6 libsasl2-dev curl gcc libldap2-dev libpq-dev python3-dev\

    && DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker} \
    && mkdir -p $DOCKER_CONFIG/cli-plugins \
    && curl -SL https://github.com/docker/compose/releases/download/v2.2.3/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose \
    && chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

# Set the working directory and copy the application files
WORKDIR /datahub
COPY . /datahub

# Upgrade pip and install required Python packages
RUN python -m pip install --upgrade pip \
    && pip install python-ldap==3.3.1 \
    && pip install --upgrade pyopenssl \
    && pip install -r requirements.txt

# Set environment variables
ENV PYTHONUNBUFFERED 1

# Expose port 8000 for the Django app
EXPOSE 8000

# Command to run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

