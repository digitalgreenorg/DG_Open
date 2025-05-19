# ------------ Stage 1: Build dependencies -------------
    FROM python:3.11-slim as builder

    # Install system build dependencies
    RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential gcc curl libpq-dev libsasl2-dev libldap2-dev python3-dev \
        && apt-get clean && rm -rf /var/lib/apt/lists/*
    
    # Create a virtual environment
    RUN python -m venv /opt/venv
    ENV PATH="/opt/venv/bin:$PATH"
    
    # Copy and install Python dependencies
    COPY requirements.txt .
    RUN pip install --upgrade pip \
        && pip install --no-cache-dir python-ldap==3.3.1 \
        && pip install --no-cache-dir pyopenssl \
        && pip install --no-cache-dir -r requirements.txt
    
    # ------------ Stage 2: Final minimal image -------------
    FROM python:3.11-slim
    
    WORKDIR /app
    
    # Install runtime dependencies only
    RUN apt-get update && apt-get install -y --no-install-recommends \
        ffmpeg libsm6 libxext6 libsasl2-dev libldap2-dev libpq-dev \
        && apt-get clean && rm -rf /var/lib/apt/lists/*
    
    # Copy virtualenv and source code from builder
    COPY --from=builder /opt/venv /opt/venv
    ENV PATH="/opt/venv/bin:$PATH"
    
    # Copy app source code
    COPY . .
    
    ENV PYTHONUNBUFFERED 1
    EXPOSE 8000
    
    CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
    