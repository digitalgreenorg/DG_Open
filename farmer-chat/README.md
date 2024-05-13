
# Farmer.chat documentation

## Introduction
Farmer chat is a multi-modal, multi-language QnA bot intended to assist farmers, extension workers, and agronomists. Powered by cutting-edge technologies like Large Language Models (LLMs), Generative AI and RAG (Retrieval Augmented Generation), Farmer.Chat is your go-to source for agricultural advice, tips, and news. As part of the Digital Green tech stack, Farmer.Chat relies on Farmstack to retrieve the content required for answering user queries. 

## Functionality / Features
 - **Multi-Lingual Support**: Leveraging the power of Google Translate, Farmer.Chat can converse and provide information in multiple languages in both text and audio, allowing it to cater to users from diverse linguistic backgrounds.
 - **Vectorized Document Retrieval**: Retrieves the content required for answering the queries from Farmstack, a multi-tenant content and dataset exchange platform developed by [Digital Green](https://www.digitalgreen.org). Farmstack vectorises text from extensive agricultural PDF & Rich text documents, videos, websites etc. and retrieve relevant information based on vector similarity
 - **AI-Powered Chat**: Backed by RAG (Retrieval Augmented Generation) with a state-of-the-art AI pipeline comprising of below phases to answer user queries.
	* User intent classification
	* Query rephrasing
	* Content Retrieval using Similarity search
	* LLM Re-ranking of the content chunks retrieved
	* Generation of the answer through custom-made prompts
 - **Support for Multi-channel interface**: The chat service is exposed over REST APIs using Django-Rest-Framework (DRF) which can be plugged to multiple chat interfaces like: Telegram, WhatsApp, Mobile app, Website, IVR etc.

## Technology Overview

- **AI Services** :  
	* Google ASR (Automated Speech Recognition), Translation and TTS (Text-To-Speech)
	* Open AI GPT-3.5 turbo for embedding creation, query rephrasing and generation. GPT-4 for Intent classification and LLM reranking
	* QDrant for Vector store and similarity search based retrieval
- **Language**: Python
- **Frameworks**: Peewee ORM for Database interaction and Django-Rest-Framework for exposing APIs

## Reference implementation to access chat services
 - **What is it for**:
		 For the purpose of getting a feel of the working of Farmer.chat, the solution is hosted on a server to access the APIs and a reference User interface is implemented in naive HTML, CSS and Javascript for interacting with Farmer.chat where-in the users can send queries in text and voice and receive answer in text and audio.
- **How to access it**: Run this HTML [file](Link to file) in a browser and send query by typing ⌨️ or recording voice 🎙️ 

## Setup Farmer.chat in your environment

### Requirements
1. Linux or Mac OS
2. Python 3.9 or 3.10
3. VScode or other supporting IDE
4. PostgreSQL database (V 15.x)
5. Google application credentials JSON file for translation services
6. Open AI api key

**Note**:  Sl No. 4, 5 and 6 will be setup for the hackathon day.

# Steps

Clone the [repo](https://github.com/digitalgreenorg/agri.chat/tree/opensource-project) into an empty directory in IDE
`git clone https://github.com/digitalgreenorg/agri.chat`

**Setting up the env file and .config.env file**:
1. Place the .env and .config.env file directly in the project root directory <<Link to templates>>

2. _Variables to configure in .env file to your environment_: 
      * **Database**: 
		      `DB_USER=<Database Username>`
		      `DB_PASSWORD=<Database password>`
		      `DB_HOST=<Database Host IP or domain>`
		      `DB_PORT=<Database port>`
		      `DB_NAME=<Name of the database>`
		      `DB_MAX_CONNECTIONS=<Maximum number of connections that can be present in the pool>`
		      `DB_STALE_TIMEOUT=<Stale temeout for the Database connections>`
		     
      * **Google application credentials**: `GOOGLE_APPLICATION_CREDENTIALS=<Path to Google application credentials file>`
     
      * **Open AI API key**: `OPENAI_API_KEY=<Open-AI API key>`
     
 3. _Variables to configure in .config.env file to your environment_: 
	  * `CONTENT_DOMAIN_URL:<Farmstack Base URL for authentication and content retrieval>`
	  * `LANGUAGE_SHORT_CODE_NATIVE:<Default language code for Farmer-chat>`
	  * `LANGUAGE_CODE_NATIVE:<Default language bcp code for Farmer-chat voice queries and ASR>`
	  *
4. Open a terminal and Set current directory to the project root directory.
5. Run the below commands in sequence      
        - *python3 -m venv myenv* to create a virtual environment.
        - *source myenv/bin/activate* to activate the virtual environment
        - *pip install -r requirements.txt* to install the dependencies.
        - *python3 manage.py runserver* to start the development server. The APIs are accessible at http://localhost:8000/api/chat/
        
		`python3 -m venv myenv`
        `source myenv/bin/activate`
        `pip install -r requirements.txt`
        `python3 manage.py runserver`

**Note:** correct env files will be shared for hackathon

## Database setup steps (will be pre setup for hackathon)

1. Set current directory to project root directory after configuring env files
2. Run command `cd database`
3. Run command `pem migrate`
4. Import the Languages and labels into the database `psql -h hostname -p port -U username -d database_name -f path/to/sql_file.sql`

## API specification

Please refer: 
