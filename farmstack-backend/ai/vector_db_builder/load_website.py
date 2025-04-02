from asyncio import as_completed
from concurrent.futures import ThreadPoolExecutor
import logging
import requests
from bs4 import BeautifulSoup
LOGGING = logging.getLogger(__name__)

class WebsiteLoader:
    
    def process_website_content(self, url):
        try:
            response = requests.get(url, verify=False)
            response.raise_for_status()  # Raises a HTTPError for bad responses
            soup = BeautifulSoup(response.text, 'html.parser')
            main_content = soup.get_text(separator="\n", strip=True)
            web_links = set([a['href'] for a in soup.find_all('a', href=True)])
            return main_content, web_links
        except Exception as e:
            logging.error(f"Failed to retrieve website content: {url} - {e}")
            return "", ""

    def aggregate_links_content(self, links, doc_text):
        def fetch_content(link):
            main_content, web_links = self.process_website_content(link)
            return main_content, link

        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(fetch_content, link) for link in set(links)]
            for future in as_completed(futures):
                main_content, link = future.result()
                doc_text +=  f" Below content related to link: {link} \n"+ main_content
        return doc_text