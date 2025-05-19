
import logging
import os
import re

import boto3
import pytube
import requests
import yt_dlp
from yt_dlp import YoutubeDL

from ai.open_ai_utils import generate_response, transcribe_audio
from core import settings
from core.constants import Constants

s3_client = boto3.client('s3')
# Set custom headers
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

# Create custom session
session = requests.Session()
session.headers.update(headers)

# Override pytube's default request session
pytube.request.Request.session = session
LOGGING = logging.getLogger(__name__)

class LoadAudioAndVideo:

    def upload_to_s3(self, local_file_path, s3_bucket, s3_key):
        try:
            s3_client.upload_file(local_file_path, s3_bucket, s3_key)
            LOGGING.info(f"File uploaded to S3: s3://{s3_bucket}/{s3_key}")
            return f"https://{s3_bucket}.s3.amazonaws.com/{s3_key}"
        except Exception as e:
            LOGGING.error(f"Failed to upload to S3: {e}")
            raise

    def check_s3_file_exists(self, s3_bucket, s3_key):
        """Check if the file exists in the S3 bucket."""
        s3_client = boto3.client('s3')
        try:
            s3_client.head_object(Bucket=s3_bucket, Key=s3_key)
            return True  # File exists
        except Exception as e:
            return False  # Propagate other errors

    def generate_transcriptions_summary(self, url):
        regex_patterns = [
        r"(?<=v=)[^&#]+",      # Pattern for "watch" URLs
        r"(?<=be/)[^&#]+",     # Pattern for "youtu.be" short URLs
        r"(?<=embed/)[^&#]+"   # Pattern for "embed" URLs
        ]
        
        for pattern in regex_patterns:
            match = re.search(pattern, url)
            if match:
                file_id =  match.group(0)
        local_temp_path = f"/tmp/{file_id}.mp3"  # Temporary local path
        s3_key = f"users/resources/audios/{file_id}.mp3"  # S3 key
        s3_bucket = settings.AWS_STORAGE_BUCKET_NAME  # Replace with your S3 bucket name
        s3_url= f"https://{s3_bucket}.s3.amazonaws.com/{s3_key}"
        LOGGING.info(f"Audio file not available locally for URL: {url}")
        # Configure yt-dlp options

        # Check if file already exists in S3
        if self.check_s3_file_exists(s3_bucket, s3_key):
            LOGGING.info(f"File already exists in S3: {s3_url}")
            LOGGING.info(f"Audio transcription started for S3 URL: {s3_url}")
            s3_client.download_file(s3_bucket, s3_key, local_temp_path)
            # Use the S3 URL for further processing
            LOGGING.info(f"Audio transcription started for S3 URL: {s3_url}")
            transcription = transcribe_audio(open(local_temp_path, "rb"))
        else:
            ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': local_temp_path,
            'quiet': False,
            'cookiefile': "ai/vector_db_builder/youtube_cookies.txt",  # Path to your exported cookies
        }
            try:
                # Download the audio
                with YoutubeDL(ydl_opts) as ydl:
                    ydl.download([url])
                    LOGGING.info("Download completed.")
            except Exception as e:
                LOGGING.error(f"An error occurred while downloading: {e}")
                return

        
            LOGGING.info(f"Audio file uploaded to S3: {s3_url}")

            # Use the S3 URL for further processing
            LOGGING.info(f"Audio transcription started for S3 URL: {s3_url}")
            transcription = transcribe_audio(open(local_temp_path, "rb"))
            # Upload to S3
            if os.path.exists(local_temp_path):
                s3_url =self.upload_to_s3(local_temp_path, s3_bucket, s3_key)
                
                # Optionally, remove the local file after upload
                os.remove(local_temp_path)
                LOGGING.info("Local file deleted after upload.")

            LOGGING.info("Transcription completed.")
        return transcription.text



