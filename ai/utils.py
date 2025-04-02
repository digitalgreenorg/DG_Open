import logging
import os
import re

import requests
from core.constants import Constants
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, SimpleDocTemplate
LOGGING = logging.getLogger(__name__)

def download_file(file_url, local_file_path):
    try:
        with open(local_file_path, 'w'):
            pass 
        if re.match(r"(https?://|www\.)", file_url) is None:
            Constants.HTTPS + file_url

        if Constants.GOOGLE_DRIVE_DOMAIN in file_url:
            # remove the trailing "/"
            ends_with_slash = r"/$"
            re.search(ends_with_slash, file_url)
            if "/file/d/" in file_url:
                # identify file & build only the required URL
                pattern = r"/file/d/([^/]+)"
                match = re.search(pattern, file_url)
                file_id = match.group(1) if match else None
                file_url = f"{Constants.GOOGLE_DRIVE_DOWNLOAD_URL}={file_id}" if file_id else file_url
        response = requests.get(file_url)
        if response and response.status_code == 200:
            with open(local_file_path, "wb") as local_file:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        local_file.write(chunk)

            LOGGING.info(f"Download file response_status: {response.status_code} file_path: {local_file_path}")
            return local_file_path

        else:
            LOGGING.info(f"Download file response_status: {response.status_code} file_path: {local_file_path}")

    except requests.exceptions.RequestException as request_error:
        LOGGING.info(f"Download file error: {request_error}")
        LOGGING.error(request_error, exc_info=True)

    return None

def build_pdf( transcript, local_file_path):
    try:
        with open(local_file_path, 'w'):
            pass 
        doc = SimpleDocTemplate(local_file_path, pagesize=letter)
        story = []

        # Split the transcript into paragraphs based on line breaks
        paragraphs = transcript.split("\n")
        styles = getSampleStyleSheet()
        style = styles[Constants.NORMAL]
        style.textColor = colors.black

        # Create a Paragraph object for each paragraph and add them to the story
        for paragraph_text in paragraphs:
            story.append(Paragraph(paragraph_text, style=style))

        if doc and len(story) > 0:
            doc.build(story)
            LOGGING.info(f"function: build_pdf, status: created, file_path: {local_file_path}")
            return local_file_path
        else:
            LOGGING.info(f"function: build_pdf, status: transcript is empty or null, file_path: {local_file_path}")

    except Exception as error:
        LOGGING.info(f"function: build_pdf, status: Failed to create, file_path: {local_file_path}")
        LOGGING.error(error, exc_info=True)

    return None

def resolve_file_path(file):
    # domain = os.environ.get(Constants.DATAHUB_SITE, Constants.DATAHUB_DOMAIN)
    # return file.replace("http://127.0.0.1:8000", domain) if file.startswith(domain) or file.startswith("http://127.0.0.1:8000") else domain + file
    return file
    
def chat_history_formated(chat_history):
    complete_chat_history =(f""" 
    Human: {chat_history.query or ''} 
    Assistant: {chat_history.query_response or 'No response'}""" 
    ) if chat_history else ""

    questions_chat_history = (f"""
    Human: {chat_history.query or ''}\n 
    """ 
    ) if chat_history else ""
    return complete_chat_history, questions_chat_history

def condensed_question_prompt(chat_history, current_question):
    # greetings = ["hello", "hi", "greetings", "hey"]
    # if any(greeting in current_question.lower() for greeting in greetings):
    #     return current_question, False
    return Constants.CONDESED_QUESTION.format(chat_history=chat_history, current_question=current_question), True

def format_prompt(user_name, context_chunks, user_input, chat_history):
    # if context_chunks:
    #     LOGGING.info("chunks availabe")
    return Constants.LATEST_PROMPT.format(name_1=user_name, input=user_input, context=context_chunks, chat_history=chat_history)
    # else:
    #     LOGGING.info("chunks not availabe")
    #     return Constants.NO_CUNKS_SYSTEM_MESSAGE.format(name_1=user_name, input=user_input)
