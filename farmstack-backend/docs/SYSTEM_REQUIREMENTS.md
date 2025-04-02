# System Requirements

## Hardware Requirements
Below is a table specifying typical hosting server requirements for FarmStack.

| Requirement Category | Specification Detail      | Notes/Comments                                                                           |
|----------------------|---------------------------|------------------------------------------------------------------------------------------|
| **CPU**              | Octa-Core Processor (8 vCPUs) | For handling moderate traffic and processing requirements.                               |
| **Memory (RAM)**     | 8 GB DDR4/DDR5            | For efficient handling of user requests. Also for running the Docker containers and OS itself. |
| **Storage**          | 500 GB                    | For storage of datasets. Also, Docker images will be pulled.                             |
| **Bandwidth**        | 50 GB/Month               | For handling file uploads/downloads. To handle concurrent requests for uploads/downloads.|
| **Operating System** | Ubuntu 20                 | Compatibility with the application to be hosted.                                         |
| **Security**         | SSL Certificate           | LetsEncrypt - For secured communication between client and server.                       |
| **Network Uptime**   | Always                    | Ensures reliability and availability of the server.                                      |

*As the application continues to evolve, System Requirements are subject to change based on technological advancements and operational needs.*

## Software Requirements
Once the hardware requirements are met, a few prerequisites need to be installed to run the FarmStack application seamlessly.

### Docker

The tech stack of FarmStack is as follows:

| Application Stack | Notes/Comments |
|-------------------|----------------|
| **Nginx**         | Web Server      |
| **Django**        | Backend         |
| **Gunicorn**      | Backend Web Server |
| **Postgres**      | Database        |
| **Redis**         | Cache           |
