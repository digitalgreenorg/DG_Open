from langchain.chains import ConversationalRetrievalChain
from langchain_community.chat_models import ChatOpenAI

from core import settings


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

        llm = ChatOpenAI(
            api_key=settings.OPENAI_API_KEY,
            model_name=model_name,
            temperature=temperature,
            max_tokens=max_tokens,
            verbose=True,
        )
        # vector_db = vector_db.as_retriver(search_args={'k':5})
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
from typing import Any, Dict, List
from langchain.callbacks.manager import CallbackManagerForRetrieverRun
from langchain_core.documents import Document

class MultiRetrieverConversationalRetrievalChain(ConversationalRetrievalChain):
    """Chain for chatting with multiple indexes."""

    retrievers: List[BaseRetriever]
    """Indexes to connect to."""

    def _get_docs(self, question: str, inputs: Dict[str, Any]) -> List[Document]:
        all_docs = []
        for retriever in self.retrievers:
            docs = retriever.get_relevant_documents(question)
            all_docs.extend(docs)
        return self._reduce_tokens_below_limit(all_docs)

    async def _aget_docs(self, question: str, inputs: Dict[str, Any]) -> List[Document]:
        all_docs = []
        for retriever in self.retrievers:
            docs = await retriever.aget_relevant_documents(question)
            all_docs.extend(docs)
        return self._reduce_tokens_below_limit(all_docs)