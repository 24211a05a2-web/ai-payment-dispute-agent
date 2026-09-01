from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Dispute, Refund, Transaction
from app.schemas import DashboardStats
from app.seed import seed_db

router = APIRouter(prefix="/api", tags=["Analytics & Seed"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Returns aggregated metrics for the Admin Dashboard statistics cards.
    """
    total = db.query(Dispute).count()
    resolved = db.query(Dispute).filter(Dispute.status == "RESOLVED").count()
    pending = db.query(Dispute).filter(Dispute.status.in_(["SUBMITTED", "AI_ANALYZED", "UNDER_REVIEW", "REFUND_INITIATED"])).count()
    escalated = db.query(Dispute).filter(Dispute.status == "ESCALATED").count()

    total_refunded = db.query(func.sum(Refund.amount)).filter(Refund.status.in_(["INITIATED", "COMPLETED"])).scalar() or 0.0

    return DashboardStats(
        total_disputes=total,
        resolved_disputes=resolved,
        pending_disputes=pending,
        escalated_disputes=escalated,
        total_refunded_amount=round(float(total_refunded), 2)
    )

@router.post("/seed")
def seed_database(db: Session = Depends(get_db)):
    seed_db()
    return {"message": "Database successfully re-seeded with demo records!"}
