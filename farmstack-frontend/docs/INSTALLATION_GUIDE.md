---

## FarmStack Frontend Installation

The FarmStack Frontend is a React application designed to interface with the FarmStack backend, providing a robust platform for managing and visualizing agricultural data effectively.

### Installation Steps:

1. **Clone the Repository**:
   
   ```bash
   git clone https://github.com/digitalgreenorg/farmstack-frontend
   ```

2. **Switch to the Development Branch**:
   
   After cloning, switch to the development branch to access the latest features and updates:
   
   ```bash
   cd farmstack-frontend
   git checkout dev
   ```

3. **Install Dependencies**:
   
   Install all the necessary dependencies using npm:
   
   ```bash
   npm install
   ```

4. **Configure Environment Variables**:
   
   The FarmStack React App requires specific environment variables to be set for proper operation. Follow these steps:

   - Create a `.env` file in the root directory of the project.
   - Add the following variables to the `.env` file:

     ```plaintext
     REACT_APP_BASEURL="https://datahubethdev.farmstack.co/be/"
     REACT_APP_BASEURL_without_slash="https://datahubethdev.farmstack.co/be"
     REACT_APP_DEV_MODE="true"
     REACT_APP_INSTANCE="EADP"
     ```

     Ensure you replace the values with the appropriate URLs and settings for your environment. If you are running your own FarmStack backend, adjust the URL accordingly.

5. **Usage**:

   You can start the FarmStack React App using one of the following commands, depending on your setup:

   - General mode:
     ```bash
     npm run start
     ```
     This command builds the app and starts a local development server. Navigate to `http://localhost:3000` to access the application.

   - EADP instance mode:
     ```bash
     npm run start:eadp
     ```
     This command builds the app with configurations tailored to the EADP instance and starts a local development server. Navigate to `http://localhost:3000` to access the application.

---

## FarmStack Backend Setup

To run the FarmStack backend on your system, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/digitalgreenorg/farmstack-backend.git
   ```

2. **Set Up a Database**:

   You have two options:

   - Use Docker:
     ```bash
     docker pull postgres
     docker run -p 5432:5432 postgres:latest
     ```
   - Install Postgres in your local system.

3. **Create Database and User**:

   Create a user and database in the PostgreSQL database installed.

4. **Set Up SendGrid**:

   Create a SendGrid account and generate an API key. Also, verify sender authenticity.

5. **Configure Environment Variables**:

   Create an environment file `.env` in the `farmstack-backend` directory and replace the values appropriately:

   ```plaintext
   PUBLIC_DOMAIN: {BACKEND_URL}
   DATAHUB_NAME: Farmstack
   DATAHUB_SITE: {BACKEND_URL}
   POSTGRES_DB: {DATABASE}
   POSTGRES_USER: {DB_USER}
   POSTGRES_PASSWORD: {DB_PASSWORD}
   POSTGRES_HOST_AUTH_METHOD: trust
   SENDGRID_API_KEY: {SG.SENDGRIDKEY}
   EMAIL_HOST_USER: {authorized_sendgrid@domain.org}
   PORT: {DB_PORT}
   ```

6. **Install Requirements**:

   ```bash
   cd farmstack-backend
   pip install -r requirements.txt
   ```

7. **Run Migrations**:

   ```bash
   python3 manage.py makemigrations
   python3 manage.py migrate
   ```

8. **Run the Server**:

   ```bash
   python3 manage.py runserver 0.0.0.0:8000
   ```

---
