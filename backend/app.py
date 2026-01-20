# backend/app.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from rag_utils import answer_with_rag

app = FastAPI(title="AI Cyber RAG - Log Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/query")
async def query(q: str = Query(..., description="Log line or security question")):
    try:
        answer, chunks = answer_with_rag(q)
        return {
            "question": q,
            "answer": answer,
            "sources": chunks
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}