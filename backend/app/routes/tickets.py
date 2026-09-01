from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Dispute, Transaction, Customer, Refund
from app.schemas import DisputeStatusUpdate

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])

@router.get("/{ticket_id}")
def track_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """
    Public lookup for ticket status timeline and summary.
    """
    formatted_ticket = ticket_id.strip().upper()
    dispute = db.query(Dispute).filter(Dispute.ticket_id == formatted_ticket).first()
    
    if not dispute:
        raise HTTPException(status_code=404, detail=f"Ticket '{ticket_id}' not found.")

    txn = db.query(Transaction).filter(Transaction.id == dispute.transaction_id).first()

    # Timeline status mapping
    timeline = [
        {"step": "Submitted", "label": "Dispute Submitted", "completed": True, "date": dispute.created_at.strftime("%b %d, %H:%M")},
        {"step": "AI Analysis", "label": "AI Automated Policy Check", "completed": True, "date": dispute.created_at.strftime("%b %d, %H:%M")},
        {"step": "Under Review", "label": "Under Review", "completed": dispute.status in ["UNDER_REVIEW", "REFUND_INITIATED", "ESCALATED", "RESOLVED", "REJECTED"]},
        {"step": "Refund Initiated", "label": "Refund Initiated", "completed": dispute.status in ["REFUND_INITIATED", "RESOLVED"]},
        {"step": "Resolved", "label": "Dispute Resolved", "completed": dispute.status == "RESOLVED"}
    ]

    return {
        "ticket_id": dispute.ticket_id,
        "status": dispute.status,
        "priority": dispute.priority,
        "created_at": dispute.created_at.isoformat(),
        "complaint": dispute.complaint_text,
        "issue_detected": dispute.issue_detected,
        "category": dispute.category,
        "confidence": dispute.confidence,
        "refund_eligibility": dispute.refund_eligibility,
        "ai_recommendation": dispute.ai_recommendation,
        "resolution_action": dispute.resolution_action,
        "relevant_policy": dispute.relevant_policy,
        "transaction": {
            "id": txn.id if txn else dispute.transaction_id,
            "amount": txn.amount if txn else 0.0,
            "status": txn.status if txn else "UNKNOWN",
            "payment_method": txn.payment_method if txn else "UNKNOWN"
        },
        "timeline": timeline
    }

@router.put("/{ticket_id}/status")
def update_ticket_status(ticket_id: str, payload: DisputeStatusUpdate, db: Session = Depends(get_db)):
    """
    Admin action to manually update ticket status (e.g. RESOLVED, REJECTED, ESCALATED, REFUND_INITIATED).
    """
    formatted_ticket = ticket_id.strip().upper()
    dispute = db.query(Dispute).filter(Dispute.ticket_id == formatted_ticket).first()

    if not dispute:
        raise HTTPException(status_code=404, detail="Ticket not found")

    dispute.status = payload.status.upper()
    if payload.priority:
        dispute.priority = payload.priority.upper()

    # If admin marks as RESOLVED and refund was pending/initiated, update refund table if present
    if payload.status.upper() == "RESOLVED" and dispute.transaction_id:
        refund = db.query(Refund).filter(Refund.transaction_id == dispute.transaction_id).first()
        if refund:
            refund.status = "COMPLETED"

    db.commit()
    db.refresh(dispute)

    return {
        "message": f"Ticket {formatted_ticket} updated successfully",
        "ticket_id": dispute.ticket_id,
        "status": dispute.status,
        "priority": dispute.priority
    }
