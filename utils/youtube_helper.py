 
import logging
from googleapiclient.discovery import build
from urllib.parse import parse_qs, unquote, urlparse

from pytube import Channel, Playlist, YouTube

from rest_framework.response import Response

from core import settings
youtube = build('youtube', 'v3', developerKey=settings.YOUTUBE_API_KEY)
LOGGER = logging.getLogger(__name__)


def get_youtube_url(url):
    # Parse the URL
    parsed_url = urlparse(url)
    query_string = parse_qs(parsed_url.query)
    # Determine the type based on path and parameters
    if parsed_url.path.startswith('/playlist') and 'list' in query_string:
        LOGGER.info(f"This is youtube playlist url: {url}")
        return fetch_playlist_videos(query_string['list'][0])
    elif parsed_url.path == '/watch' and 'v' in query_string:
        yt = YouTube(url)
        LOGGER.info(f"This is youtube video url: {url}")

        return Response([{"url": url, "title": yt.title}])
    elif '/channel/' in parsed_url.path:
        LOGGER.info(f"This is youtube channel url: {url}")
        return fetch_channel_videos(parsed_url.path.split('/channel/')[-1])
    else:
        return Response("Invaild youtube url or Url is not channel or playlist or video", 400)
    
def fetch_channel_videos(channel_id):
    # Fetch channel's uploads playlist ID
    channel_response = youtube.channels().list(
        part='contentDetails',
        id=channel_id
    ).execute()

    uploads_playlist_id = channel_response['items'][0]['contentDetails']['relatedPlaylists']['uploads']
    return fetch_playlist_videos(uploads_playlist_id)

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

        return Response(videos)
    except Exception as e:
        return Response(str(e), 500)
