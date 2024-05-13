The purpose of this script is to provide the installation for FarmStack Steward in minutes without messing up the configuration files and source code.

### Introduction

Farmstack steward is a web application which can be installed on any linux instance. As a part of steward setup, one would be receiving a python script which would install or setup the complete farmstack steward system.

For more information on farmstack-steward, kindly refer to the [FS Steward](https://digitalgreenorg.atlassian.net/wiki/spaces/FSB/pages/200474625/FS+Steward) document.

### System Requirements

| Requirement                        | Minimum       |
| ---------------------------------- | ------------- |
| vCPUs                              | 2             |
| RAM(GiB)                           | 4.0           |
| Persistent Memory(GiB)             | 16            |
| Operating System                   | Linux         |

### Prerequisites

We use **docker** as a platform-as-a-service to run farmstack-steward. Hence, docker is a pre-requisite. In case, you have trouble installing docker on your instance, run [_**install-docker script.**_](helpers/install-docker.sh)


Once docker is installed, we have a couple of more pre-requisites to run farmstack-steward flawlessly which are as follows

*   SendGrid API Key and Verified Email with SendGrid - To configure e-mail service for steward.
    
*   Domain Name - For your domain to be public and configure https for the installation.
    
*   Google Client ID - For OAUTH Based Authentication(Google Sign in)
    

### Installation overview

Once you have everything ready. You need to run the [_**setup.py**_](run.py) python script - . While the script is executing, it will ask information about the environment variables you would like to set.

Do provide all the details(including sendgrid, google clientId, and domain).

To verify if the entire setup, run the following command which should show 4 docker services running. In case of any issues, feel free to contact Team Farmstack.

_**docker ps**_

### Frequent Error Messages or TroubleShooting
