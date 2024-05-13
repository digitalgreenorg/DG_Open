### Overview
This document outlines the technical stack for Farmstack application. We are currently using React for the frontend and Django for the backend.

React is a JavaScript library for building user interfaces, while Django is a high-level Python web framework.


### Frontend - React

#### Description

React is a popular JavaScript library used for building user interfaces and frontend components. It follows a component-based architecture, making it easy to create reusable UI elements.

React provides a virtual DOM for efficient rendering and updating of the user interface.
Key Technologies and Libraries
* React (JavaScript library for UI components)
* React Router (for handling client-side routing)
* Redux (for managing the application state, optional but recommended for larger apps)
* Axios (for making HTTP requests to the backend APIs)
* Material-UI (optional, for pre-built UI components and styles)

* Webpack (for bundling and building the frontend code)

Folder Structure
* src/: Contains the main application source code

* components/: Reusable UI components

* views/: Higher level views for each role.

* src/utils/: Utility functions
* src/tests/: Unit Test cases using Jest.

### Backend - Django

#### Description

Django is a high-level Python web framework that simplifies the development of web applications.
It follows the Model-View-Template (MVT) architecture, which is similar to the Model-View-Controller (MVC) pattern.

Django comes with built-in features like an ORM (Object-Relational Mapping), authentication, and an admin interface.

#### Key Technologies and Libraries

* Django (Python web framework)
* Django REST framework (for building RESTful APIs)
* Django ORM (for database interactions)
* PostgreSQL (or any other database of choice)
* JWT Token(for token-based authentication)
* Django Cache (Cache Support for OTP)

#### Folder Structure

* farmstack_backend/: The project root directory

* microsite/: handles APIs for all requests of Microsite.

* accounts/: handles all requests with respect to authentication.

* core/: project level configuration.

* participant/: The participant APIs are managed.

* datahub/: The steward role APIs are handled.
* utils/: Utility functions


### Communication and Integration

Communication between React frontend and Django backend will be through RESTful APIs.

The frontend will use Axios or Fetch API to make HTTP requests to the backend endpoints.

Django will serve the frontend as static files or use Django templates for server-side rendering (if required).

Deployment
The application can be deployed on platforms like AWS, Heroku, or DigitalOcean.

Docker containers can be used to containerize the application for easy deployment and scaling.

Nginx or Apache can be used as reverse proxies to serve the application and handle static files.


### Conclusion

This technical stack document outlines the use of React for the frontend and Django for the backend to build a scalable and efficient web application. With this setup, you can create a robust application that provides a seamless user experience and supports various use cases.
