import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.database import engine, Base
from app.seed import seed_db
from app.routes import disputes, tickets, transactions, stats

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DisputeAI - Payment Dispute Resolution API",
    description="Backend API powering AI Payment Dispute Resolution Agent",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router endpoints
app.include_router(disputes.router)
app.include_router(tickets.router)
app.include_router(transactions.router)
app.include_router(stats.router)

# Locate Frontend directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), "frontend")

@app.on_event("startup")
def startup_event():
    print("Application starting up... Seeding database if empty.")
    try:
        seed_db()
    except Exception as e:
        print(f"Seed exception: {e}")

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "dispute-resolution-api"}

# Serve frontend index.html for root and any non-api paths
@app.get("/")
def read_root():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(
            index_path,
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )
    return {"app": "DisputeAI Engine", "status": "Online", "docs": "/docs"}

if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")
