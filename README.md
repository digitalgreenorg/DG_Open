# FarmStack Monorepo

## Overview
Welcome to the FarmStack Monorepo, a consolidated repository for managing the frontend, backend, and installer modules of the FarmStack project. This approach facilitates streamlined development, testing, and deployment processes by housing all related code and resources under a single repository umbrella.

## Components
The monorepo includes the following components:

- **FarmStackFrontend**: The user interface for the FarmStack application, built with modern web technologies(ReactJS).
- **Backend**: The server-side components handling business logic, database interactions, and API services(Django).
- **Installer**: Scripts and utilities to facilitate the installation and setup of the FarmStack application on linux environment.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
Before you begin, ensure you have the following software installed on your system:

- [Node.js](https://nodejs.org/en/download/)
- [Python 3](https://www.python.org/downloads/)
- [Docker](https://docs.docker.com/get-docker/)

### Installation
Follow these steps to set up your development environment:

1. **Clone the Repository**
    ```bash
    git clone https://github.com/digitalgreenorg/monorepo.git
    cd monorepo
    ```

2. **Frontend Setup**
    ```bash
    cd frontend
    npm install --force
    npm run start
    ```

3. **Backend Setup**
    ```bash
    cd ../backend
    pip3 install -r requirements.txt
    python3 manage.py runserver 0.0.0.0:8000
    ```

4. **Installer Setup**
    ```bash
    cd ../installer
    sudo python3 run.py
    ```

## Usage
Here is how you can use the application once installed:

- Access the frontend at `http://localhost:3000`.
- Make API calls to the backend at `http://localhost:8000`.

## Contributing
We encourage public contributions! Please review our `CONTRIBUTING.md` for the contribution guidelines.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.

## Contact Information
For more information on this project, please contact:

- Email: farmstack@digitalgreen.org

