import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        from langsmith import Client
        if settings.LANGCHAIN_API_KEY:
            client = Client(api_key=settings.LANGCHAIN_API_KEY)
            client.create_project(project_name=settings.LANGCHAIN_PROJECT, upsert=True)
            print(f"[LangSmith Initialized] Project '{settings.LANGCHAIN_PROJECT}' active in LangSmith workspace.")
    except Exception as e:
        print(f"[LangSmith Warning] Project init deferred: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="VenturePilot AI - Enterprise AI Startup Operating System Backend Engine",
    lifespan=lifespan
)

# Enable CORS for Next.js 15 frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
        "tracing": settings.LANGCHAIN_TRACING_V2,
        "langsmith_project": settings.LANGCHAIN_PROJECT
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
