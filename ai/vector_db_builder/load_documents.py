import logging
import os
import tempfile

import requests
from docx import Document
from langchain.document_loaders import (
    CSVLoader,
    PyMuPDFLoader,
    TextLoader,
    UnstructuredHTMLLoader,
    UnstructuredWordDocumentLoader,
)

from core.constants import Constants

LOGGING = logging.getLogger(__name__)
from contextlib import contextmanager


@contextmanager
def temporary_file(suffix=""):
    """Context manager for creating and automatically deleting a temporary file."""
    """Context manager for creating and automatically deleting a temporary file."""
    fd, path = tempfile.mkstemp(suffix=suffix)
    try:
        os.close(fd)  # Close file descriptor
        LOGGING.info(f"Temporary file created at {path}")
        yield path
    finally:
        # Check if the file still exists before attempting to delete
        if os.path.exists(path):
            os.remove(path)
            LOGGING.info(f"Temporary file {path} deleted.")


class LoadDocuments:

    def _get_full_url(self, file):
        """Construct full URL for media files using DATAHUB_SITE environment variable."""
        if file.startswith('/media'):
            base_url = os.environ.get("DATAHUB_SITE", "http://localhost:8000")
            return base_url + file
        return file

    def load_by_file_extension(self, file):
        if file.endswith(".pdf"):
            LOGGING.info(f"pdf file loader started for file: {file}")
            # Handle media files with DATAHUB_SITE environment variable
            if file.startswith('/media'):
                full_url = self._get_full_url(file)
                return PyMuPDFLoader(full_url).load(), 'pdf'
            else:
                return PyMuPDFLoader(file).load(), 'pdf'
        elif file.endswith(".csv"):
            with temporary_file(suffix=".csv") as temp_pdf_path:
                response = requests.get(file)
                if response.status_code == 200:
                    with open(temp_pdf_path, 'wb') as f:
                        f.write(response.content)
                    local_file = temp_pdf_path
                LOGGING.info(f"CSV file loader started for file: {file}")
                return CSVLoader(file_path=local_file, source_column="Title").load(), 'csv'
        elif file.endswith(".html"):
             with temporary_file(suffix=".html") as temp_pdf_path:
                response = requests.get(file)
                if response.status_code == 200:
                    with open(temp_pdf_path, 'wb') as f:
                        f.write(response.content)
                    local_file = temp_pdf_path
                LOGGING.info(f"html file loader started for file: {file}")

                return UnstructuredHTMLLoader(local_file).load(), 'html'
        elif file.endswith(".docx"):
            with temporary_file(suffix=".docx") as temp_pdf_path:
                response = requests.get(file)
                if response.status_code == 200:
                    with open(temp_pdf_path, 'wb') as f:
                        f.write(response.content)
                    local_file = temp_pdf_path
                LOGGING.info(f"docx file loader started for file: {file}")
                return UnstructuredWordDocumentLoader(local_file).load(), 'pdf'
        elif file.endswith(".txt"):
            with temporary_file(suffix=".txt") as temp_pdf_path:
                response = requests.get(file)
                if response.status_code == 200:
                    with open(temp_pdf_path, 'wb') as f:
                        f.write(response.content)
                    local_file = temp_pdf_path
                LOGGING.info(f"txt file loader started for file: {file}")
                return TextLoader(local_file).load(), 'txt'

 
    def handle_text_file(self, file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
        return text

    def handle_docx_file(self, file_path):
        # Load the .docx file
        doc = Document(file_path)
        # Extract text from each paragraph in the document
        text = '\n'.join(paragraph.text for paragraph in doc.paragraphs)
        return text

    def handle_html_file(self, file, temp_pdf):
        text = ""
        loader = UnstructuredHTMLLoader(file)  # Assuming this loader is preferred for HTML
        for paragraph in loader.load():
            text += paragraph.page_content + "\n"
        self.build_pdf(text, temp_pdf)
        return PyMuPDFLoader(temp_pdf)
