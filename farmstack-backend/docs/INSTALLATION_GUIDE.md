## Installation

### Farmstack Frontend

Clone the repository to your local machine: 
```
bash : git clone https://github.com/digitalgreenorg/farmstack-frontend 
```

Navigate to the project directory:

```
bash : cd farmstack-frontend 
```

Install the required dependencies using npm:

```
bash : npm install
```

Configuration The FarmStack React App requires some environment variables to be set in order to function properly. These variables are used to configure the app's behavior and access external services. 

Follow the steps below to set up the environment variables:

Create a .env file in the root directory of the project.

Open the .env file and add the following variables:

Copy code : 

```
REACT_APP_BASEURL="https://datahubethdev.farmstack.co/be/"

REACT_APP_BASEURL_without_slash="https://datahubethdev.farmstack.co/be"

REACT_APP_BASEURL_without_slash_view_data="http://datahubethdev.farmstack.co:"

REACT_APP_DEV_MODE="true"
```

If you are running your own farmstack backend,then replace the url appropriately.

Make sure to replace the values with the appropriate URLs and settings for your environment.

Usage To start the FarmStack React App, run the following command:

```
bash : npm start
```

This command will build the app and start a local development server. Open your browser and visit http://localhost:3000 to access the application.


### Backend Repository

To run Farmstack backend on your system; you need few pre-requisites to be ticked.

1. Clone the farmstack-backend repository using the following command.

```
git clone https://github.com/digitalgreenorg/farmstack-backend.git
```

2. Set up a postgres/ mysql database on your local.
```
docker pull postgres

docker run -p 5432:5432 postgres:latest

(or)

Install postgres in your local system.
```

3. Create a user and database in the postgres database installed.

4. Create a sendgrid account and create a sendgrid key and verify sender authenticity.

5. Create an environment file(.env) in the farmstack-frontend, replace the values appropriately and place it in the environmental file.

```
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

6. Install the requirements.

```
cd farmstack-backend
pip install -r requirements
```

7. Run the migrations to database.

```
python3 manage.py makemigrations
python3 manage.py migrate
```

8. Run the server

```
python3 manage.py runserver 0.0.0.0:8000
```