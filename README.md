# Agri.Chat - An AI-Driven Agricultural Chat Bot

Agri.Chat is a Telegram-based AI chat bot that serves as a digital companion to front line workers, extension workers, farmers, and agronomists. The chat bot leverages AI technologies to answer queries about agricultural practices for different crops, offer farming tips, and provide up-to-date agricultural news.

## Key Features

- **Telegram Integration**: As a Telegram bot, Agri.Chat can be accessed conveniently from anywhere via the popular messaging platform.

- **AI-Powered Chat**: Using OpenAI's powerful GPT-3 model, Agri.Chat can answer complex queries and offer informed farming tips, making it an invaluable resource for anyone in the agriculture sector.

- **Vectorized Document Retrieval**: Powered by LangChain, our system can load and vectorize text from extensive agricultural PDF documents and retrieve relevant information based on vector similarity.

- **Multi-Lingual Support**: Leveraging the power of Google Translate, Agri.Chat can converse and provide information in multiple languages, allowing it to cater to users from diverse linguistic backgrounds.


## Installation

Make sure you have Python 3.7 or later installed on your machine. You can then clone this repository and install the required dependencies.

```bash
git clone https://github.com/digitalgreenorg/agri.chat.git
cd agri-chat
pip install -r requirements.txt
```

Copy example.env to .env for your development environment. 

You need to have an API key from OpenAI for GPT-3.5. Make sure to replace your-openai-api-key with your actual API key in the .env file:

```bash
OPENAI_API_KEY=your-openai-api-key
GOOGLE_APPLICATION_CREDENTIALS=google_application_credentials.json
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

You will also need to specify your PDF documents directory and persistence directory paths in the .env file:

```bash
pdf_path=path_to_your_pdf_file
persist_directory=directory_where_the_vector_db_will_be_stored
```

Run the main Python file to start the Agri.Chat bot:

```bash
python main.py
```
## License

This project is licensed under the MIT License.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Acknowledgements

This project uses Langchain, OpenAI's GPT-3 model, Google Translate API, Google Text to Speech and Speech to Text APIs and PyMuPDF for PDF processing.

## Contact

If you want to contact me you can reach me at gautam@digitalgreen.org.

