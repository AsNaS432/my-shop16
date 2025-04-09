from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_community.llms import Ollama
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from pathlib import Path
from typing import List, Dict, Optional

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Конфигурация модели
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "deepseek-r1")

# Инициализация модели Ollama
llm = Ollama(
    model=OLLAMA_MODEL,
    temperature=0.3,
    top_p=0.9,
    repeat_penalty=1.1
)

def load_knowledge_base(file_path: Optional[str] = None) -> Optional[Chroma]:
    try:
        # Определяем путь к данным
        base_dir = Path(__file__).parent
        file_path = str(base_dir / "data.txt") if file_path is None else str(Path(file_path))
        chroma_dir = base_dir / "chroma_db"
        
        print(f"Загрузка базы знаний из: {file_path}")

        # Проверка существования файла данных
        if not Path(file_path).exists():
            raise FileNotFoundError(f"Файл данных не найден: {file_path}")

        # Очистка старой базы Chroma
        if chroma_dir.exists():
            print("Удаление старой базы векторов...")
            shutil.rmtree(chroma_dir)

        # Загрузка и обработка документов
        loader = TextLoader(file_path, encoding='utf-8')
        documents = loader.load()
        
        if not documents:
            raise ValueError("Загруженный файл не содержит данных")

        # Разделение текста на чанки
        text_splitter = CharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separator="\n"
        )
        texts = text_splitter.split_documents(documents)
        
        # Создание векторного хранилища
        embeddings = OllamaEmbeddings(model=OLLAMA_MODEL)
        vectorstore = Chroma.from_documents(
            documents=texts,
            embedding=embeddings,
    persist_directory=str(chroma_dir)
)
        
        print("База знаний успешно инициализирована")
        return vectorstore
        
    except Exception as e:
        print(f"Критическая ошибка при загрузке базы знаний: {str(e)}")
        return None

# Инициализация базы знаний при старте
vectorstore = load_knowledge_base()

# Модели запросов
class ChatRequest(BaseModel):
    message: str
    conversation: List[Dict[str, str]]

class StatusResponse(BaseModel):
    status: str
    model: str

# Проверка статуса
@app.get("/api/ai/status", response_model=StatusResponse)
async def status():
    return {
        "status": "online" if vectorstore else "offline",
        "model": OLLAMA_MODEL
    }

# Обработчик чата
@app.post("/api/ai/chat")
async def chat(request: ChatRequest):
    try:
        if not vectorstore:
            raise HTTPException(
                status_code=503,
                detail="База знаний не доступна"
            )

        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectorstore.as_retriever(),
            return_source_documents=True
        )

        # Формирование контекста
        context = "\n".join(
            [f"{msg['sender']}: {msg['text']}" 
             for msg in request.conversation[-6:]]
        )

        prompt = f"""
        Контекст разговора:
        {context}

        Текущий вопрос:
        {request.message}

        Ответь, используя информацию о магазине запчастей для техники Apple.
        Если ответа нет в базе знаний, вежливо сообщи об этом.
        Будь кратким и полезным.
        """

        result = qa_chain({"query": prompt})
        
        return {
            "reply": result["result"],
            "source_documents": [
                doc.page_content for doc in result["source_documents"]
            ]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка обработки запроса: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)