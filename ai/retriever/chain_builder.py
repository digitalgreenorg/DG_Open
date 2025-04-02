import logging
from langchain.chains import ConversationalRetrievalChain
from langchain_community.chat_models import ChatOpenAI
from langchain.retrievers import MergerRetriever
from core import settings

LOGGING = logging.getLogger(__name__)


class ChainBuilder:
    def create_qa_chain(
        vector_db,
        retriever_count,
        model_name,
        temperature,
        max_tokens,
        chain_type,
        prompt_template,
    ):
        import pdb; pdb.set_trace()
        llm = ChatOpenAI(
            api_key=settings.OPENAI_API_KEY,
            model_name=model_name,
            temperature=temperature,
            max_tokens=max_tokens,
            verbose=True,
        )
        qa = ConversationalRetrievalChain.from_llm(
            llm=llm,
            chain_type=chain_type,
            retriever=vector_db,
            verbose=True,
            combine_docs_chain_kwargs={"prompt": prompt_template},
        )
        qa.return_source_documents = True
        qa.return_generated_question = True
        # qa.return_source
        return qa, vector_db

from langchain.schema.retriever import BaseRetriever
from typing import List
from langchain.callbacks.manager import CallbackManagerForRetrieverRun
from langchain_core.documents import Document

class CustomRetriever(BaseRetriever):
    def __init__(self, retrievers):
        super().__init__()  # Call the __init__ method of BaseRetriever
        self.retrievers = retrievers

    def _get_relevant_documents(
        self, query: str, *, run_manager: CallbackManagerForRetrieverRun
    ) -> List[Document]:
        # Use your existing retrievers to get the documents
        documents = []
        for i, retriever in enumerate(self.retrievers):
            documents.extend(retriever.get_relevant_documents(query, callbacks=run_manager.get_child(f"retriever_{i+1}")))
        
        return documents