
# Farmer.chat - an AI powered agricultural assistant by Digital Green

## Introduction
Farmer chat is a multi-modal, multi-language QnA bot intended to assist farmers, extension workers, and agronomists. Powered by cutting-edge technologies like Large Language Models (LLMs), Generative AI and RAG (Retrieval Augmented Generation), Farmer.Chat is your go-to source for agricultural advice, tips, and news. As part of the Digital Green tech stack, Farmer.Chat relies on Farmstack to retrieve the content required for answering user queries. 

## Features
 - **Multi-Lingual Support**: Leveraging the power of Google Translate, Farmer.Chat can converse and provide information in multiple languages in both text and audio, allowing it to cater to users from diverse linguistic backgrounds.
   
 - **Vectorized Document Retrieval**: Retrieves the content required for answering the queries from Farmstack, a multi-tenant content and dataset exchange platform developed by [Digital Green](https://www.digitalgreen.org). Farmstack vectorises text from extensive agricultural PDF & Rich text documents, videos, websites etc. and retrieve relevant information based on vector similarity.
   
 - **AI-Powered Chat**: Backed by RAG (Retrieval Augmented Generation) with a state-of-the-art AI pipeline comprising of below phases to answer user queries.
	* User intent classification
	* Query rephrasing
	* Content Retrieval using Similarity search
	* LLM Re-ranking of the content chunks retrieved
	* Generation of the answer through custom-made prompts

 - **Support for Multi-channel interface**: The chat service is exposed over REST APIs using Django-Rest-Framework (DRF) which can be plugged to multiple chat interfaces like: Telegram, WhatsApp, Mobile app, Website, IVR etc.

## Farmstack/Farmer.chat solution overview:
Farmstack is a a multi-tenant content and dataset exchange platform developed by [Digital Green](https://www.digitalgreen.org). The Tenants/Organizations can upload data in various formats like PDFs, videos, RTF documents, websites etc. Farmstack vectorises text from these documents and retrieve relevant information based on vector similarity.

The below diagram shows Farmer.Chat/FarmStack’s process, flow of information and control. 

**![](https://lh7-us.googleusercontent.com/lXKKRJbuvt7iXUhDqpumR0bqhtcWELxiRhMRnwgigV0pPIHrwFTEH4r4h6fP4Sf_9fnHjXLhLskRlkKeAjTMK7OUvc_50O3lwoE068e-gs0SWF56ehhG8iSjfuyLZPPBfjdTR52OWSFyF404wWjuVMw)**

### Users:
The setup primarily will have two kinds of Users. They are, 

1. Content curator/ Administrator
	* They login to FarmStack Web Application. 
	* Information flow happens through the steps (a), (b), (c) etc,.


2. Farmer/ Front Line Extension Worker
	* Information flow happens through the steps (1), (2), (3) etc,.
	* The farmers/ frontline extension workers can access the services through a messenger or an app.

**Administrator/Content Curator side**:
- Uploading of the content(or content source) into FarmStack to create a knowledge base.
- FarmStack converts the knowledge base to a vector store.
- View analytics and conversation logs


**Farmers/Frontline Extension Workers side**:
- Routed from front end to application backend (for eg, messenger application like telegram and whatsapp)
- The queries can be listened using API integration and passed to the backend Bot logic
- The bot logic invokes retrieval from the vector store create on the knowledge base
- It uses the LLM calls to generate the answer which is sent back to the user
- The query and responses are logged in the DB

## Technology Overview

- **AI Services** :  
	* Google ASR (Automated Speech Recognition), Translation and TTS (Text-To-Speech)
	* Open AI GPT-3.5 turbo for embedding creation, query rephrasing and generation. GPT-4 for Intent classification and LLM reranking
- **Language**: Python
- **Frameworks**: Peewee ORM for Database interaction and Django-Rest-Framework for exposing REST APIs

## API specification

REST APIs are implemented in Farmer.Chat to retrieve the answers for text and voice based user queries in both text and voice. Please refer [API specification](openapi.yaml) for full specification of APIs documented in OpenAPI V 3.0.0 format.

## Access Farmer.Chat services from a pre-hosted environment

 - The Farmer.chat solution is hosted on Digital Green server which is accessible through
   * A Web-based User interface at [https://farmerchat.farmstack.co/opensource-ui/](https://farmerchat.farmstack.co/opensource-ui/)
   * APIs at [https://farmerchat.farmstack.co/opensource-be/api](https://farmerchat.farmstack.co/opensource-be/api)
     
 - This solution uses the content from the Farmstack instance hosted at [https://datahubtest.farmstack.co/](https://datahubtest.farmstack.co/)

 ### How to use the web-based interface ###
   - Register and upload the content in [Farmstack](https://datahubtest.farmstack.co). Please refer [Farmstack User guide](https://docs.google.com/document/d/1gygByBqdv1ZaVn8MgcyTJ76vhRrtMZh3tBzC83DtEcc/edit?usp=sharing)

   - Click on the [link](https://farmerchat.farmstack.co/opensource-ui/) to open the User Interface in a web browser
   
   - Enter the email-id registered in Farmstack and click on _Save Email_ 
     **![](https://lh7-us.googleusercontent.com/SyQ6wOlU8v-Ee-C5BOPeXOrJsodVibY_-tFdvP1QGxaFvb94Ge8DtfCvGlAkVPnllnMlTytwmzeeM4GLUZP6GMlHopBlwiwLeSiHR5gwSZSGG06q_i3psZDoRQ0iShGPRkDBs2cBixE6sMO3VmKy-gw)**
   
   - Ask queries in text (Language will be auto-detected for text based queries and response will be received in the detected language, hence language selection is not required.)
     
     **![](https://lh7-us.googleusercontent.com/5KMTVf1pQ9J9Jt-JQ6PFWgSN1GeQ9TS3zVeRYkyQd6olNDs2WeJ6CqcQmRxTonDRTb0ANwqOS_Z5Uuy1O4oM2JQRs7GIJTyODw0__9ATWWRsRxnpweSH5mt3fSARcnWkxP1r0aIi_vImQIIPganJ0YE)**
   
   - Tap on <img width="25" alt="image" src="https://lh7-us.googleusercontent.com/0cooSWX0oh_CX_z-OnRG27jM3qDFigD4d1cqml90CBLFflj_Tg62DzK-6l6LzDoM9-pqWykbm48BL6zuUQtsKo-n8qNHxGI2ryOYEqaMGwF3l2VqUHACKXiQByZImOFbKONMfcwtffGNpAn26pNRQ54"> to start recording the voice query and once recording is done, tap <img width="25" alt="image" src="https://lh7-us.googleusercontent.com/0cooSWX0oh_CX_z-OnRG27jM3qDFigD4d1cqml90CBLFflj_Tg62DzK-6l6LzDoM9-pqWykbm48BL6zuUQtsKo-n8qNHxGI2ryOYEqaMGwF3l2VqUHACKXiQByZImOFbKONMfcwtffGNpAn26pNRQ54"> again to stop recording and send the voice query. Language selection is a must before asking the voice queries for the ASR models to work best. Choose the required langauge from the options in left pane. If no langauge is selected, it will default to English in US accent. Ensure to click on _Set Language_ to set the language.
     
     **![](https://lh7-us.googleusercontent.com/CoUACf4GEk1zqhpHfzlQRJUIyA3zqW9eCs6pqbQiWHTlc0EY5t6jgkct9hjjR-AL0d5JvyvszyUQ_HUovAxY3XhAWaTnhRGcEOCyuSf3kfkG7FTECgpmauN0HphhzahyKmeIUdJKWZh2b9oHyg1uaPw)**

   - After the query response is received, to listen to the audio of the response, click on <img width="25" alt="image" src="https://lh7-us.googleusercontent.com/Ot-VMHe1zrgHNGluL1YKCv5qXR6EbD-4wP2e3EPYYOV8Sywop8Nmfk4O5ZW0EJSZc3_-Oy_piqF5sBnV_dOXIUlqxon-k7EbAppV8YLYN2PV65RPDWrHB49nkFo5LSgSwdNPO-AULuU40T0QN2m2l30"> just below the response. 

**![](https://lh7-us.googleusercontent.com/DB2KMFSLPPizaJI1BUGdISEH10Kh59sLUroWr02rhAmuhoU2wwMLxnrZdvtzPCj-_fNTilHzGXGNASQg8YyGDwNz13SxCA6l5wASZ7OVdG7_kC6hmf8dLu_R4pt14SPVhKM2eetfI8fxjlsZev2YHEg)**
  
 - **Note**:
   1. The user interface is a reference implementation ONLY, built using naive HTML, CSS and Javascript for interacting with Farmer.chat and is part of the repo [index.html](index.html)
   2. For the voice query to work, Please ensure that the browser permission is enabled to access the Microphone when it is prompted. This is tested on Chrome and Safari.
   3. The chat history will be lost once the page is refreshed.

## Setup Farmer.Chat in your environment
Farmer.Chat can be setup to run in your own environment. The following can be customised:

1. Prompts at various stages in pipeline (Intent classification, Rephrasing, Reranking and Generation)
2. Choice of whether to log the transactions in Database
3. Open AI model parameters like GPT-3 and GPT-4 model versions, temperature, MAX_TOKENS
4. Languages that bot support and the default language for ASR
5. Farmstack instance from where the content should be retrieved
6. Chat history window to be considered during question rephrasing

Please refer the section on configuration: [Setting up the .env file and .config.env file](#setting-up-the-env-file-and-configenv-file)

### Requirements
1. Linux or Mac OS
2. Python 3.9 or 3.10
3. VScode or other supporting IDE
4. PostgreSQL database (V 15.x)
5. Google application credentials JSON file for translation services
6. Open AI api key

### Steps

1. **Clone the repo**: 

	Clone the [repo](https://github.com/digitalgreenorg/monorepo) into an empty directory in IDE
   ```bash 
	 git clone https://github.com/digitalgreenorg/monorepo
	```
	(If you are using VSCode, follow the steps  _Open VSCode -> File -> Open Folder -> Create a New Folder in desired directory -> Open -> Terminal -> New Terminal and then execute above git command_)
   
   Please install git command line for your OS from [here](https://git-scm.com/downloads)

3. Open a new terminal in your IDE and switch to the farmer-chat directory<br>
   ```bash 
   cd monorepo/farmer-chat
   ```

4. #### Setting up the .env file and .config.env file:

      Farmer.chat uses 2 environment files, one for setting up secrets (.env) and the other one for setting up other optional configurations (.config.env). Ensure both the files are directly under the farmer-chat directory. [.config.env](.config.env) is part of the repo and can readily be used. For .env, an example file [example.env](example_dot_env) file is added to the repo. User should create a file with name .env directly under the farmer-chat directory.

      - Following Variables to be configured in **.env** file as per your environment:<br>
         * **Google application credentials**: `GOOGLE_APPLICATION_CREDENTIALS=<Path to Google application credentials file>`
         * **Open AI API key**: `OPENAI_API_KEY=<Open-AI API key>`
         * **Database (required only if WITH_DB_CONFIG=True in .config.env file)**: <br>
		       `DB_USER=<Database Username>`<br>
		       `DB_PASSWORD=<Database password>`<br>
		       `DB_HOST=<Database Host IP or domain>`<br>
		       `DB_PORT=<Database port>`<br>
		       `DB_NAME=<Name of the database>`<br>
		       `DB_MAX_CONNECTIONS=<Maximum number of connections that can be present in the pool>`<br>
		       `DB_STALE_TIMEOUT=<Stale timeout for the Database connections>`<br><br>
	 Please contact [techsupport@digitalgreen.org](mailto:techsupport@digitalgreen.org) for a pre-configured environment file.
           
      - Following Variables can be configured in [.config.env](.config.env) file as per your environment:
        * `CONTENT_DOMAIN_URL:<Farmstack Base URL for authentication and content retrieval>. ex: https://datahubtest.farmstack.co/be/`<br>
        * `LANGUAGE_SHORT_CODE_NATIVE:<Default language code for Farmer-chat> ex: en`<br>
        * `LANGUAGE_CODE_NATIVE:<Default language bcp code for Farmer-chat voice queries and ASR> ex: en-US`<br>
 
 	**Additional configuration**: The following variables can be configured if required:
   	* `WITH_DB_CONFIG=<True/False> based on whether conversations should be logged in Database`
   	* `DJANGO_DEBUG_MODE=<True/False> based on whether Django should be started in debug mode`
	* `INTENT_CLASSIFICATION_PROMPT_TEMPLATE=<Multi-line prompt to be used for classification of the user intent>`
	* `CONVERSATION_PROMPT=<Multi-line prompt to be used to drive the conversation with the user>`
	* `UNCLEAR_QN_PROMPT=<Multi-line prompt to be used to seek clarity from the user>`
	* `EXIT_PROMPT=<Multi-line prompt to be used to exit the conversation>`
	* `OUT_OF_CONTEXT_PROMPT=<Multi-line prompt to be used to convey that the question is out of context>`
	* `REPHRASE_QUESTION_PROMPT=<Multi-line prompt to be used during question rephrasing>`
	* `RERANKING_PROMPT_SINGLE_TEMPLATE=<Multi-line prompt to be used during reranking>`
	* `RESPONSE_GEN_PROMPT=<Multi-line prompt to be used generate response>`
	* `GPT_3_MODEL=<GPT-3 model version to be used.>`
	* `GPT_4_MODEL=<GPT-4 model version to be used.>`
	* `TEMPERATURE=<temperature setting of the LLM.>`
	* `MAX_TOKENS=<Maximum number of tokens in output of LLM>`
     
6. Run the below commands in sequence (to create and activate the virtual environment and install required dependencies)
	```bash
	 python3 -m venv myenv
	 source myenv/bin/activate
	 pip install -r requirements.txt
	 ```
 
 5. Start the Django development server
	```bash
	 python3 manage.py runserver
	 ```

 6. Once the development server is started, the APIs are accessible at http://localhost:8000/api
 7. Edit the [index.html](index.html) to point the baseUrl to http://localhost:8000 instead of https://farmerchat.farmstack.co/opensource-be and the index.html can be used as explained in section [above](#how-to-use-the-web-based-interface).

## Database setup steps (required only if Database config is enabled)

1. Set current directory to project root directory after configuring env files
2. Run command 
	```bash
	cd database
	```
3. Run command 
	```bash
	pem migrate
	```
4. Import the Languages and labels into the database 
	```bash
	psql -h hostname -p port -U username -d database_name -f multilingual_text_data.sql
	```

## Limitations
1. The retrieved answers may be incomplete if the asnwer to queries does not exist in a running text (paragraph mode) in the content documents. For example, the answer lies in tables, images, table of contents, embedded links etc.
2. Sometimes, the Google-translate may detect a language which is absurd and bot answers back in the same language. This happens especially in cases where the query is incomplete
3. Some browsers may have problem with accessing microphone which leads to issues while sending voice queries.

## Contact
Please contact [techsupport@digitalgreen.org](mailto:techsupport@digitalgreen.org) for any queries.
