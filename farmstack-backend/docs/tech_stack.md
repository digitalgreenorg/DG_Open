# FS TechStack

## Overview
This document outlines the technical stack for the Farmstack application, which uses React for the frontend and Django for the backend.  
React is a JavaScript library for building user interfaces, while Django is a high-level Python web framework.

## Frontend - React

### Description:
React is a widely-used JavaScript library for building user interfaces and frontend components. It follows a component-based architecture, facilitating the creation of reusable UI elements. React also provides a virtual DOM for efficient rendering and updating of the user interface.

### Key Technologies and Libraries:
- **React**: JavaScript library for UI components.
- **React Router**: For handling client-side routing.
- **Redux**: For managing the application state (optional but recommended for larger apps).
- **Axios**: For making HTTP requests to the backend APIs.
- **Material-UI**: Optional, for pre-built UI components and styles.
- **Webpack**: For bundling and building the frontend code.

### Folder Structure:
- `src/`: Contains the main application source code.
  - `components/`: Reusable UI components.
  - `views/`: Higher-level views for each role.
  - `src/utils/`: Utility functions.
  - `src/tests/`: Unit test cases using Jest.

## Backend - Django

### Description:
Django is a high-level Python web framework that simplifies web application development. It follows the Model-View-Template (MVT) architecture, similar to the Model-View-Controller (MVC) pattern. Django includes built-in features such as an ORM (Object-Relational Mapping), authentication, and an admin interface.

### Key Technologies and Libraries:
- **Django**: Python web framework.
- **Django REST framework**: For building RESTful APIs.
- **Django ORM**: For database interactions.
- **PostgreSQL**: Or any other database of choice.
- **JWT Token**: For token-based authentication.
- **Django Cache**: Cache support for OTP.
- **Celery**: For handling asynchronous tasks and background jobs.

### Folder Structure:
- `farmstack_backend/`: The project root directory.
  - `microsite/`: Handles APIs for all requests of Microsite.
  - `accounts/`: Manages all authentication-related requests.
  - `core/`: Project-level configuration.
  - `participant/`: Manages participant APIs.
  - `datahub/`: Handles steward role APIs.
  - `utils/`: Utility functions.
  - `tasks/`: Defines and manages Celery tasks for asynchronous processing.

## Communication and Integration
- The React frontend communicates with the Django backend through RESTful APIs.
- The frontend uses Axios or Fetch API to make HTTP requests to the backend endpoints.
- Django serves the frontend as static files or uses Django templates for server-side rendering, if required.

## Deployment
- The application can be deployed on platforms like AWS, Heroku, or DigitalOcean.
- Docker containers can be used to containerize the application for easy deployment and scaling.
- Nginx or Apache can be used as reverse proxies to serve the application and handle static files.

## Conclusion
This technical stack document outlines the use of React for the frontend and Django for the backend, along with Celery for asynchronous tasks, to build a scalable and efficient web application. This setup allows for the creation of a robust application that provides a seamless user experience and supports various use cases.
