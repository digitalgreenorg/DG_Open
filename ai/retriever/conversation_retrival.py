import asyncio

from ai.open_ai_utils import load_vector_db
from ai.retriever.chain_builder import ChainBuilder
from ai.utils import chat_history_formated
from core.constants import Constants
from langchain import PromptTemplate


class ConversationRetrival:

    def get_input_embeddings_using_chain(text, user_name=None, resource_id=None, chat_history=None):
        prompt_template = PromptTemplate(input_variables=["name_1", "context",  "input"],
            template=Constants.LATEST_PROMPT,
            )
        complete_history, history_question = chat_history_formated(chat_history)
        complete_history=[] 
        complete_history.append((chat_history.condensed_question, chat_history.query_response))

        qa, retriver = ChainBuilder.create_qa_chain(
                vector_db = load_vector_db(resource_id),
                retriever_count=5,
                model_name=Constants.GPT_3_5_TURBO,
                temperature=Constants.TEMPERATURE,
                max_tokens=Constants.MAX_TOKENS,
                chain_type="stuff",
                prompt_template=prompt_template,
            )

        def sync_async(coroutine):
            try:
                loop = asyncio.get_running_loop()
            except RuntimeError:  # No running event loop
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                result = loop.run_until_complete(coroutine)
                loop.close()
            else:
                result = asyncio.run_coroutine_threadsafe(coroutine, loop).result()
            return result
        task = qa.ainvoke(
                {
                    "question": text,
                    "chat_history": complete_history,
                    "input": text,
                    "name_1": user_name,
                }
            )
        result = sync_async(task)

        return result["answer"], [], result["generated_question"], {}