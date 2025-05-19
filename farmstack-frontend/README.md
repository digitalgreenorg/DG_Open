# FarmStack React App

![Image Alt Text](https://farmstack.co/wp-content/uploads/2021/07/FarmStack-logo.png)
Welcome to FarmStack React App! This open-source project allows you to build a powerful web application for managing farm/farmer data. This readme file will guide you through the process of setting up the app and configuring the necessary environment variables. Let's get started!

## Prerequisites

Before you begin, ensure that you have the following dependencies installed:

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository to your local machine:
   bash : git clone https://github.com/digitalgreenorg/datahub-frontend
   Navigate to the project directory:

bash : cd farmstack-react-app
Install the required dependencies using npm:

bash : npm install
Configuration
The FarmStack React App requires some environment variables to be set in order to function properly. These variables are used to configure the app's behavior and access external services. Follow the steps below to set up the environment variables:

1. Create a .env file in the root directory of the project.

2. Open the .env file and add the following variables:

Copy code :
REACT_APP_BASEURL="https://datahubethdev.farmstack.co/be/"
REACT_APP_BASEURL_without_slash="https://datahubethdev.farmstack.co/be"
REACT_APP_BASEURL_without_slash_view_data="http://datahubethdev.farmstack.co:"
REACT_APP_DEV_MODE="true"
Make sure to replace the values with the appropriate URLs and settings for your environment.

Usage
To start the FarmStack React App, run the following command:

bash : npm start

This command will build the app and start a local development server. Open your browser and visit http://localhost:3000 to access the application.

Deployment
To deploy the FarmStack React App to a production environment, follow these steps:

1. Build the app using the following command:
   bash : npm run build

2. This command will create a build directory containing optimized and minified production-ready files.

Serve the app using a static server of your choice. You can use tools like serve, nginx, or Apache to serve the static files located in the build directory.

For example, using serve:
bash : npx serve -s build

The app will be available at the specified server URL.

Contributing
We welcome contributions to the FarmStack React App! If you'd like to contribute, please follow these steps:

1. Fork the repository on GitHub.
2. Create a new branch with a descriptive name for your feature or bug fix:
   bash : git checkout -b feature/my-new-feature

3. Make your changes and commit them with clear and concise messages:

bash : git commit -m "Add feature XYZ" 4. Push your changes to your forked repository:
bash : git push origin feature/my-new-feature

Open a pull request on GitHub and provide a detailed description of your changes.


Backend setup : Visit https://github.com/digitalgreenorg/datahub-api

License
The FarmStack React App is released under the MIT License.
