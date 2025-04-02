# STEWARD ONBOARDING

## Background

This document describes the process of installing the FarmStack steward on the steward's infrastructure. Once the setup is complete, it also provides a brief on how the admin can onboard participants or add datasets.

## Infrastructure Requirements

An installer file is used to set up the Steward application. The following table outlines the prerequisites in terms of infrastructure and utility software.

### Hardware Requirements

| Requirement           | Recommended      |
|-----------------------|------------------|
| **vCPUs**             | 2-4              |
| **RAM (GB)**          | 8*               |
| **Persistent Memory (GB)** | 100***      |
| **Operating System**  | Ubuntu           |

\* RAM is directly proportional to the number of connectors.  
\*** Persistent Memory is directly proportional to the number of datasets that are uploaded.

For the Steward application to work flawlessly as expected, we require the steward administrator to configure email service on SendGrid.

## How to Configure SendGrid

1. Visit the SendGrid website and complete the signup process.
2. Verify your email address by clicking on the link shared by SendGrid.
3. You can verify the identity in two ways: single sender identity or verifying your domain.
4. In this document, we create a single sender identity. Click on **Single Sender Identity**.
5. Configure an email address from which emails will be triggered to various participants of the organization.
6. Once you click on "OK", the sender email is created.
7. Create an API Key by navigating to the **Settings** tab.
8. Copy the generated API key and verified sender email to configure your steward.

## Map Domain or Subdomain Name to Instance

To set up the steward, you can map a domain or subdomain to the instance on which the Steward application will be hosted.

## Configure Installer for Steward Setup

Follow these steps to configure the Steward application on the infrastructure:

1. SSH into the instance where you would like to set up the Steward.

    ```bash
    SSH -i *.pem user@IP
    ```

2. Clone the Installer repository (FarmStack Installer).

    ```bash
    git clone https://github.com/digitalgreenorg/fs-install
    ```

3. Change/move to the `fs-install` directory.

    ```bash
    cd fs-install
    ```

4. Checkout to the current version branch of the datahub/steward application.

    ```bash
    git checkout datahub-v1.1
    ```

5. Run the following command to initiate the installer process:

    ```bash
    sudo python3 run.py
    ```

6. Configure the Steward application by providing the inputs to the questions:

    - **Enter the datahub-admin email address to gain access to the Steward application.**

        ```bash
        Enter datahub-admin email: admin@organization.domain
        Enter name: Admin
        ```

    - **Enter the domain mapped to the instance.** We would be creating a Let's Encrypt certificate for SSL. It may request your email address to notify you if the certificate expires.

        ```bash
        Enter domain: example.domain.com
        ```

    - **Input the SendGrid API key and verified email sender that we generated earlier.**

        ```bash
        Enter SendGrid API: **** randomString (API Key) ****
        Enter email: **** verifiedSenderEmail@Sendgrid.com *****
        ```

    - **Enter the database details to create your own database user.**

        ```bash
        Enter database user: example
        Enter database password: password
        ```

7. Once configuration is complete, the installer will set up the Steward application with the details provided.
8. The email address entered while configuring the Steward application will be the administrator, and no other user will have access to it.

## Steward Admin Onboarding

With the email configured as the administrator, follow these steps to complete the onboarding process for the Steward application:

1. Navigate to the domain you configured while setting up the Steward application.
2. Select **"Login as Admin"**.
3. Enter the email address configured.
4. Enter the valid OTP.
5. Complete the details of the organization which will act as a steward or nodal agency:

    - Edit the admin profile details.
    - Add the organization details.
    - Add the privacy policy documents, warranties, limitations of use, and terms of use. Provide a brief description of each in the description box provided.
    - Select a hero or banner image to be displayed on the microsite of the application.

## Inviting Participants

To add participants to the Steward application, navigate to the **Participant** tab in the navigation bar.

In the participant creation form, there are two sections:

1. The first section is related to the information of the participant organization.
2. The second section is related to the root user of the participant organization, who will have access to the Steward application.

Once the participant is added, an email is triggered to the root email of the participant. The participant can then log in to the Steward application by following these steps:

1. Visit the microsite of the Steward and click on **"Login as Participant"**.
2. Enter the email address provided by the admin during participant creation.
3. Enter the valid OTP.
4. The participant will be onboarded after completing the following steps:

    - Edit the participant profile details.
    - Edit and confirm the participant organization details.
    - The participant can add a dataset or skip dataset creation.

## Adding Datasets

Admins and participants can create a dataset. To create a dataset, the user needs to be logged in. The detailed steps are as follows:

1. **Select the dataset type:**
   - **Public:** These types of datasets can be explored by other participants and directly consumed by downloading. The maximum file size limit is 50 MB.
   - **Private:** For private datasets, the user will upload a sample dataset in CSV/XLS format, which can be viewed by other participants.

2. Provide a dataset name for reference.
3. Provide a description for the dataset so that other participants can understand it better.
4. Select the data category to which the dataset belongs.
5. Enter the geography and the value chain of the dataset.
6. Enable the **"constantly updating"** field if the dataset is being constantly updated at the source, or select the data collection interval.
7. Select **"Number of Rows"**, which denotes the number of rows in the actual source dataset.
8. Select **Connector Availability**, which indicates whether a connector is created for the source or not.
9. Upload the complete dataset (if public) or upload a sample dataset for data exploration.
10. Once the dataset is submitted, it will be reflected on the microsite\*\*.

\*\* If the participant is trusted, the uploaded dataset is visible on the microsite; otherwise, the dataset requires approval from the datahub admin.

## Conclusion

With this exercise, the steward should be able to complete the following checkpoints:

1. Setting up the Steward on their infrastructure.
2. Configuring the Steward application.
3. Inviting participants.
4. Adding datasets under respective participant accounts.
