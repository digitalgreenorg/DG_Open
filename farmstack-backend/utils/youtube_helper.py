 
import logging
from urllib.parse import parse_qs, unquote, urlparse

import requests
from googleapiclient.discovery import build
from pytube import Channel, Playlist, YouTube
from rest_framework.response import Response

from core import settings

youtube = build('youtube', 'v3', developerKey=settings.YOUTUBE_API_KEY)
LOGGER = logging.getLogger(__name__)
import logging
from urllib.parse import parse_qs, urlparse

import requests
from bs4 import BeautifulSoup
from django.http import JsonResponse as Response
from googleapiclient.discovery import build
from pytube import YouTube

LOGGER = logging.getLogger(__name__)

import logging

# Assuming you have already initialized the YouTube API client as `youtube`
# youtube = build('youtube', 'v3', developerKey='YOUR_API_KEY')
from urllib.parse import parse_qs, urlparse

import requests
from bs4 import BeautifulSoup
from django.http import JsonResponse as Response
from googleapiclient.discovery import build
from pytube import YouTube

LOGGER = logging.getLogger(__name__)

# Assuming you have already initialized the YouTube API client as `youtube`
# youtube = build('youtube', 'v3', developerKey='YOUR_API_KEY')

def get_youtube_url(url):
    # Parse the URL
    if 'youtu.be' in url:
        url = expand_shortened_url(url)
    parsed_url = urlparse(url)
    query_string = parse_qs(parsed_url.query)

    # Determine the type based on path and parameters
    if parsed_url.path.startswith('/playlist') and 'list' in query_string:
        LOGGER.info(f"This is a YouTube playlist URL: {url}")
        return fetch_playlist_videos(query_string['list'][0])
    elif parsed_url.path == '/watch' and 'v' in query_string:
        video_id = query_string['v'][0]
        LOGGER.info(f"This is a YouTube video URL: {url}")
        return fetch_video_details(video_id)
    elif '/channel/' in parsed_url.path or '/user/' in parsed_url.path or '/c/' in parsed_url.path or '@' in parsed_url.path:
        channel_id = extract_channel_id(parsed_url)
        if channel_id:
            LOGGER.info(f"This is a YouTube channel URL: {url}")
            return fetch_channel_videos(channel_id)
        else:
            return Response("Could not extract a valid channel ID from the URL.", 400)
    else:
        return Response("Invalid YouTube URL or URL is not a channel, playlist, or video.", 400)

def extract_channel_id(parsed_url):
    path_parts = parsed_url.path.split('/')
    
    if '/channel/' in parsed_url.path:
        return path_parts[path_parts.index('channel') + 1]
    elif '/user/' in parsed_url.path:
        # Fetch the channel ID from username
        return fetch_channel_id_by_username(path_parts[path_parts.index('user') + 1])
    elif '/c/' in parsed_url.path:
        # Fetch the channel ID from custom URL
        return fetch_channel_id_by_custom_url(path_parts[path_parts.index('c') + 1])
    elif '@' in path_parts[1]:  # Handle URLs using YouTube handle
        handle = path_parts[1]  # The handle should be in the second position after splitting by '/'
        return fetch_channel_id_by_handle(handle)
    else:
        return None

def fetch_channel_id_by_handle(handle):
    try:
        url = f"https://www.youtube.com/{handle}"
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            for link in soup.find_all('link', {'rel': 'canonical'}):
                if '/channel/' in link['href']:
                    return link['href'].split('/')[-1]
        else:
            LOGGER.error(f"Failed to retrieve channel page for handle {handle}")
            return None
    except Exception as e:
        LOGGER.error(f"Error fetching channel ID by handle: {e}")
        return None

def fetch_video_details(video_id):
    try:
        video_response = youtube.videos().list(
            part='snippet',
            id=video_id
        ).execute()

        if not video_response['items']:
            return Response(f"No video found for ID {video_id}", status=404, safe=False)

        video_title = video_response['items'][0]['snippet']['title']
        video_url = f"https://www.youtube.com/watch?v={video_id}"

        return Response([{"url": video_url, "title": video_title}], safe=False)
    except Exception as e:
        LOGGER.error(f"Error fetching video details: {e}")
        return Response(f"Error fetching video details: {str(e)}", status=500, safe=False)

def fetch_channel_id_by_username(username):
    try:
        response = youtube.channels().list(
            part="id",
            forUsername=username
        ).execute()
        return response['items'][0]['id']
    except Exception as e:
        LOGGER.error(f"Error fetching channel ID by username: {e}")
        return None

def fetch_channel_id_by_custom_url(custom_url):
    # Custom URLs are not directly supported by the API, so this function might require additional logic
    return None

def fetch_channel_videos(channel_id):
    # Fetch channel's uploads playlist ID
    try:
        channel_response = youtube.channels().list(
            part='contentDetails',
            id=channel_id
        ).execute()

        uploads_playlist_id = channel_response['items'][0]['contentDetails']['relatedPlaylists']['uploads']
        return fetch_playlist_videos(uploads_playlist_id)
    except Exception as e:
        LOGGER.error(f"Error fetching channel videos: {e}")
        return Response(f"Error fetching channel videos: {str(e)}", 500)
def fetch_playlist_videos(playlist_id):
    videos = []
    next_page_token = None
    try:
        while True:
            pl_response = youtube.playlistItems().list(
                part='snippet',
                playlistId=playlist_id,
                maxResults=50,  # Adjust based on your needs
                pageToken=next_page_token
            ).execute()

            for item in pl_response['items']:
                video_id = item['snippet']['resourceId']['videoId']
                video_title = item['snippet']['title']
                video_url = f"https://www.youtube.com/watch?v={video_id}"

                videos.append({'url': video_url, 'title': video_title})

            next_page_token = pl_response.get('nextPageToken')
            if not next_page_token:
                break

        return Response(videos, safe=False)  # Return the list of videos with safe=False
    except Exception as e:
        LOGGER.error(f"Error fetching playlist videos: {e}")
        return Response(f"Error fetching playlist videos: {str(e)}", status=500, safe=False)  # Set safe=False

def expand_shortened_url(url):
    response = requests.head(url, allow_redirects=True)
    return response.url

# def get_youtube_url(url):
#     # Parse the URL
#     if 'youtu.be' in url:
#         url = expand_shortened_url(url)
#     parsed_url = urlparse(url)
#     query_string = parse_qs(parsed_url.query)
#     # Determine the type based on path and parameters
#     if parsed_url.path.startswith('/playlist') and 'list' in query_string:
#         LOGGER.info(f"This is youtube playlist url: {url}")
#         return fetch_playlist_videos(query_string['list'][0])
#     elif parsed_url.path == '/watch' and 'v' in query_string:
#         yt = YouTube(url)
#         LOGGER.info(f"This is youtube video url: {url}")

#         return Response([{"url": url, "title": yt.title}])
#     elif '/channel/' in parsed_url.path:
#         LOGGER.info(f"This is youtube channel url: {url}")
#         return fetch_channel_videos(parsed_url.path.split('/channel/')[-1])
#     else:
#         return Response("Invaild youtube url or Url is not channel or playlist or video", 400)
    
# def fetch_channel_videos(channel_id):
#     # Fetch channel's uploads playlist ID
#     channel_response = youtube.channels().list(
#         part='contentDetails',
#         id=channel_id
#     ).execute()

#     uploads_playlist_id = channel_response['items'][0]['contentDetails']['relatedPlaylists']['uploads']
#     return fetch_playlist_videos(uploads_playlist_id)

# def fetch_playlist_videos(playlist_id):
#     videos = []
#     next_page_token = None
#     try:
#         while True:
#             pl_response = youtube.playlistItems().list(
#                 part='snippet',
#                 playlistId=playlist_id,
#                 maxResults=50,  # Adjust based on your needs
#                 pageToken=next_page_token
#             ).execute()

#             for item in pl_response['items']:
#                 video_id = item['snippet']['resourceId']['videoId']
#                 video_title = item['snippet']['title']
#                 video_url = f"https://www.youtube.com/watch?v={video_id}"

#                 videos.append({'url': video_url, 'title': video_title})

#             next_page_token = pl_response.get('nextPageToken')
#             if not next_page_token:
#                 break

#         return Response(videos)
#     except Exception as e:
#         return Response(str(e), 500)
