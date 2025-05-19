import datetime
import hashlib
import json
import logging
import os
import secrets
import smtplib
import time
import urllib
import csv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from inspect import formatannotationrelativeto
from urllib import parse
from utils import file_operations as file_ops

import pandas as pd
import requests
import sendgrid
from django.conf import settings
from django.db import models
from python_http_client import exceptions
from rest_framework import pagination, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from sendgrid.helpers.mail import Content, Email, Mail

from core.constants import Constants

import json
import requests
from celery import shared_task
from datahub.models import DatasetV2File, DatasetV2
from datetime import datetime, timedelta
from django.core.files.base import ContentFile
from urllib.parse import urlencode, urlparse, parse_qs, urlunparse
LOGGER = logging.getLogger(__name__)

# SG = sendgrid.SendGridAPIClient(settings.SENDGRID_API_KEY)
# FROM_EMAIL = Email(settings.EMAIL_HOST_USER)


class Utils:
    """
    This class will support with the generic functions that can be utilized by the whole procject.
    """

    def send_email(self, to_email: list, content=None, subject=None):
        """
        This function gets the To mails list with content and subject
        and sends the mail to respective recipiants. By default content and subject will be empty.

        Args:
            to_email (list): List of emails to send the Invitation.
            content (None, optional): _description_. Defaults to None.
            # subject (None, optional): _description_. Defaults to None.
        """
        # content = Content("text/html", content)
        # mail = Mail(FROM_EMAIL, to_email, subject, content, is_multiple=True)
        # try:
        #     SG.client.mail.send.post(request_body=mail.get())
        # # except exceptions.BadRequestsError as error:
        # except exceptions.UnauthorizedError as error:
        #     LOGGER.error(
        #         "Failed to send email Subject: %s with ERROR: %s",
        #         subject,
        #         error.body,
        #         exc_info=True,
        #     )
        #     # type: ignore
        #     return Response({"Error": "Failed to send email "}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # except urllib.error.URLError as error:  # type: ignore
        #     LOGGER.error(
        #         "Failed to send email Subject: %s with ERROR: %s",
        #         subject,
        #         error,
        #         exc_info=True,
        #     )
        #     # type: ignore
        #     return Response({"Error": "Failed to send email "}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # return Response({"Message": "Email successfully sent!"}, status=status.HTTP_200_OK)
        
        # Create a MIME object
        msg = MIMEMultipart()
        msg['From'] = settings.SMTP_USER
        msg['To'] = ", ".join(to_email) if isinstance(to_email, list) else to_email
        msg['Subject'] = subject

        # Attach the email content to the MIME object
        msg.attach(MIMEText(content, 'html'))

        try:
            # Connect to the SMTP server
            server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
            server.starttls()  # Secure the connection with TLS
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)

            # Send the email
            server.sendmail(settings.SMTP_USER, to_email, msg.as_string())

            # Close the connection
            server.quit()

            print("Email successfully sent!")

        except smtplib.SMTPException as e:
            print(f"Failed to send email: {e}")

def replace_query_param(url, key, val, req):
    """
    Given a URL and a key/val pair, set or replace an item in the query
    parameters of the URL, and return the new URL.
    """

    (scheme, netloc, path, query, fragment) = parse.urlsplit(str(url))
    netloc = req.META.get("HTTP_HOST", "testserver")
    if netloc != "testserver":
        scheme = "http" if "localhost" in netloc or "127.0.0.1" in netloc else "https"  # type: ignore
        path = path if "localhost" in netloc or "127.0.0.1" in netloc else "/be" + path  # type: ignore

    query_dict = parse.parse_qs(query, keep_blank_values=True)
    query_dict[str(key)] = [str(val)]
    query = parse.urlencode(sorted(list(query_dict.items())), doseq=True)
    return parse.urlunsplit((scheme, netloc, path, query, fragment))


def remove_query_param(url, key, req):
    """
    Given a URL and a key/val pair, remove an item in the query
    parameters of the URL, and return the new URL.
    """
    (scheme, netloc, path, query, fragment) = parse.urlsplit(str(url))
    netloc = req.META.get("HTTP_HOST", "testserver")
    if netloc != "testserver":
        scheme = "http" if "localhost" in netloc or "127.0.0.1" in netloc else "https"  # type: ignore
        path = path if "localhost" in netloc or "127.0.0.1" in netloc else "/be" + path  # type: ignore

    query_dict = parse.parse_qs(query, keep_blank_values=True)
    query_dict.pop(key, None)
    query = parse.urlencode(sorted(list(query_dict.items())), doseq=True)
    return parse.urlunsplit((scheme, netloc, path, query, fragment))


class CustomPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = "per_page"
    max_page_size = 5

    def get_next_link(self):
        if not self.page.has_next():
            return None
        url = self.request.build_absolute_uri()
        req = self.request
        page_number = self.page.next_page_number()
        return replace_query_param(url, self.page_query_param, page_number, req)

    def get_previous_link(self):
        req = self.request
        if not self.page.has_previous():
            return None
        url = self.request.build_absolute_uri()
        page_number = self.page.previous_page_number()
        if page_number == 1:
            return remove_query_param(url, self.page_query_param, req)
        return replace_query_param(url, self.page_query_param, page_number, req)


class DefaultPagination(pagination.PageNumberPagination):
    """
    Configure Pagination
    """

    page_size = 5


def date_formater(date_range: list):
    """This function accepts from date and to date as list and converts into valid date.

    Args:
        date_range (list): _description_
    """
    try:
        start = date_range[0].split("T")[0]
        end = date_range[1].split("T")[0]
        start = (datetime.datetime.strptime(start, "%Y-%m-%d") +
                 datetime.timedelta(1)).strftime("%Y-%m-%d")
        end = (datetime.datetime.strptime(end, "%Y-%m-%d") +
               datetime.timedelta(2)).strftime("%Y-%m-%d")
        return [start, end]
    except Exception as error:
        logging.error("Invalid time formate: %s", error)
        return ["", ""]


def one_day_date_formater(date_range: list):
    """This function accepts from date and to date as list and converts into valid date.

    Args:
        date_range (list): _description_
    """
    try:
        start = date_range[0].split("T")[0]
        end = date_range[1].split("T")[0]
        start = (datetime.datetime.strptime(start, "%Y-%m-%d") +
                 datetime.timedelta(1)).strftime("%Y-%m-%d")
        end = (datetime.datetime.strptime(end, "%Y-%m-%d") +
               datetime.timedelta(1)).strftime("%Y-%m-%d")
        return [start, end]
    except Exception as error:
        logging.error("Invalid time formate: %s", error)
        return ["", ""]


def csv_and_xlsx_file_validatation(file_obj):
    """This function accepts file obj and validates it."""
    try:
        name = file_obj.name
        if name.endswith(".xlsx") or name.endswith(".xls"):
            df = pd.read_excel(file_obj, header=0, nrows=6)
        else:
            df = pd.read_csv(
                file_obj, encoding="unicode_escape", header=0, nrows=6)
        if len(df) < 5:
            return False
    except Exception as error:
        logging.error("Invalid file ERROR: %s", error)
        return False
    return True


def read_contents_from_csv_or_xlsx_file(file_path, standardisation_config={}):
    """This function reads the file and return the contents as dict"""
    dataframe = pd.DataFrame([])
    try:
        if file_path.endswith(".xlsx") or file_path.endswith(".xls"):
            content = pd.read_excel(file_path, index_col=None, nrows=2) if file_path else dataframe
        elif file_path.endswith(".csv"):
            content = pd.read_csv(file_path, index_col=False, nrows=2) if file_path else dataframe
        else:
            return []
        content = content.drop(content.filter(regex='Unnamed').columns, axis=1)
        content = content.fillna("")
        mask_columns = [key for key, value in standardisation_config.items() if value.get('masked', False)]
        if mask_columns:
            content[mask_columns] = "######"
    except Exception as error:
        logging.error("Invalid file ERROR: %s", error)
        return []
    content.columns = content.columns.astype(str)
    return content.to_dict(orient=Constants.RECORDS)


def timer(func):
    def wrapper(*args, **kwargs):
        # start the timer
        start_time = time.time()
        # call the decorated function
        result = func(*args, **kwargs)
        # remeasure the time
        end_time = time.time()
        # compute the elapsed time and print it
        execution_time = end_time - start_time
        LOGGER.info(
            f"Execution time: {execution_time} seconds for the API:{func}")
        # return the result of the decorated function execution
        return result
    # return reference to the wrapper function
    return wrapper

def generate_api_key(length=32):
    api_key = secrets.token_hex(length)
    return api_key

def generate_hash_key_for_dashboard(pk, data, role_id=3, logged=False):
    data["pk"] = pk
    data["role_id"] = role_id
    data["logged"] = logged
    data_string = json.dumps(data)
    # Create a hashlib SHA-256 hash object
    # hash_obj = hashlib.sha256()
    # # Update the hash object with the data as bytes
    # hash_obj.update(data_string.encode('utf-8'))
    # # Get the hexadecimal representation of the hash
    # hash_key = hash_obj.hexdigest()
    hash_key = hash(data_string)
    print(hash_key)
    return hash_key

@shared_task
def fetch_data_for_all_datasets():
    # Get all DatasetV2File records that need to be updated
    try:
        dataset_files = DatasetV2File.objects.filter(source="live_api").all()
        # Iterate through each dataset file and check the frequency and last pull date
        for dataset_file in dataset_files:
            # Get the frequency (weekly/monthly) from the connection details
            frequency = dataset_file.connection_details.get('frequency', None)  # Default to 'weekly' if not set
            last_pull = dataset_file.connection_details.get('last_pull', None)
            LOGGER.info(f"Data fetch checkking for {dataset_file.id}")
            if frequency:
                # If last_pull is None, consider it as never pulled
                if not last_pull:
                    last_pull = datetime(1970, 1, 1)  # Default to an old date, so it will always fetch the first time
                else:
                    last_pull = datetime.strptime(last_pull, '%Y-%m-%d %H:%M:%S')

                # Get the current time
                current_time = datetime.now()
                current_time_str = current_time.strftime('%Y-%m-%d %H:%M:%S')

                # Determine if data should be pulled based on frequency and last pull date
                if frequency == 'weekly' and (current_time - last_pull >= timedelta(weeks=1)):
                    LOGGER.info(f"Data fetching started for {dataset_file.id}")
                    if fetch_data_from_api(dataset_file, last_pull):
                        connection_details = dataset_file.connection_details
                        connection_details["last_pull"] = current_time_str
                        dataset_file.connection_details = connection_details
                        dataset_file.save()
                elif frequency == 'monthly' and (current_time - last_pull >= timedelta(weeks=4)):
                    LOGGER.info(f"Data fetching started for {dataset_file.id}")
                    if fetch_data_from_api(dataset_file, last_pull):
                        connection_details = dataset_file.connection_details
                        connection_details["last_pull"] = current_time_str
                        dataset_file.connection_details = connection_details
                        dataset_file.save()
    except Exception as e:
        LOGGER.error(
            f"Failed to fetch data from api ERROR: {e} and input fields: {e}")

def fetch_data_from_api(dataset_file, last_pull):
    # Get the API details from the connection_details field
    try:
        api_url = dataset_file.connection_details.get('url')
        headers = dataset_file.connection_details.get('headers')
        auth_type = dataset_file.connection_details.get('auth_type')
        file_name = dataset_file.connection_details.get('file_name', "default")
        # Prepare the request headers
        request_headers = {
            "Authorization": headers.get("Authorization")
        }
        parsed_url = urlparse(api_url)
        query_params = parse_qs(parsed_url.query)

        # If 'created_at' is not in the query parameters, add it with today's date
        if 'created_at' in query_params:
            query_params['created_at'] = last_pull

        # Rebuild the URL with the new query parameters
        new_query = urlencode(query_params, doseq=True)
        updated_api_url = parsed_url._replace(query=new_query).geturl()
        LOGGER.info(f"Updated api url {updated_api_url}")
        today_date = datetime.today().strftime(' %Y-%m-%d %H:%M:%S')

        # Fetch the data from the API
        response = requests.get(updated_api_url, headers=headers)
        if response.status_code in [200, 201]:
            try:
                data = response.json()
            except ValueError:
                data = response.text

            file_path = file_ops.create_directory(
                settings.DATASET_FILES_URL, [dataset_file.dataset.name, dataset_file.source])  

            # Write data to CSV or JSON based on its type
            if isinstance(data, list):
                # If data is a list, write to CSV
                file_name = file_name + ".csv" if dataset_file.connection_details.get("file_replace", False) else file_name + today_date + ".csv" 

                with open(file_path + "/" + file_name, "w", newline='', encoding='utf-8') as outfile:
                    writer = csv.DictWriter(outfile, fieldnames=data[0].keys())
                    writer.writeheader()
                    writer.writerows(data)
            else:
                file_name = file_name + ".json" if dataset_file.connection_details.get("file_replace", False) else file_name + today_date + ".json" 
                # If data is not a list, write to JSON
                with open(file_path + "/" + file_name, "w", encoding='utf-8') as outfile:
                    json.dump(data, outfile)

            if not dataset_file.connection_details.get("file_replace", False):
                instance = DatasetV2File.objects.create(
                    dataset=dataset_file.dataset,
                    source=dataset_file.source,
                    file=os.path.join(dataset_file.dataset.name, dataset_file.source, file_name),
                    file_size=os.path.getsize(
                        os.path.join(settings.DATASET_FILES_URL, dataset_file.dataset.name, dataset_file.source, file_name)),
                    standardised_file=os.path.join(dataset_file.dataset.name, dataset_file.source, file_name),
                    standardised_configuration=dataset_file.standardised_configuration,
                    accessibility=dataset_file.accessibility,
                    connection_details={}
                )
                LOGGER.info(f"""Data fetched from the api and saved in file: {file_name} for 
                                the dataset: {dataset_file.dataset.name},
                                dataset_file_id {dataset_file.id}""")
                return True
        else:
            LOGGER.error(f"Failed to fetch data from api with status {response.status_code}")
            return False
    except Exception as e:
        LOGGER.error(
            f"Failed to fetch data from api ERROR: {e} and input fields: {dataset_file}")
        LOGGER.error("Failed to fetch data from api")
        return False

