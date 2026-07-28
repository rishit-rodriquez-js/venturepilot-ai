# VenturePilot AI — Enterprise AI Startup Operating System

VenturePilot AI is an enterprise-grade AI Startup Operating System acting as a persistent AI Co-Founder. It transforms raw startup ideas into investor-ready companies through structured AI workflows, vector-driven project memory, audit logs, governance, evaluation (LangSmith), and executive dark UI styling.

## Architecture

- **Frontend**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Zustand, React Query.
- **Backend**: FastAPI, Python 3.12, Uvicorn, Pydantic v2, SQLAlchemy.
- **AI Engine**: OpenAI API, LangGraph agent workflows, LangChain, LangSmith tracing & evaluation.
- **Database & Auth**: Supabase PostgreSQL, pgvector (1536-dimensional embeddings), Row Level Security (RLS) policies.

## Setup Instructions

### 1. Database Schema
Apply `supabase/schema.sql` to your Supabase PostgreSQL database to create tables, indexes, and RLS policies.

### 2. Python FastAPI Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

### 3. Next.js 15 Frontend
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000`.

## Features

- 🔐 Supabase Auth with Role-Based Access Control (Founder, Mentor, Investor, Admin).
- 🚀 Projects Portfolio Dashboard with real-time startup metrics.
- 💡 9-Box Lean & Business Model Canvas Generator.
- 🧭 Market Intelligence Radar (TAM/SAM/SOM calculation & Competitor Matrix).
- 🏗️ Technical Architecture Blueprint & System Topology.
- 💰 Financial Forecasting (MRR, ARR, CAC/LTV ratio, Burn Rate & Runway Calculator).
- 🎯 100-Point Investor Readiness Scorecard & Pitch Deck Outline.
- 📜 Immutable Audit Logs & Governance Snapshot Rollbacks.
