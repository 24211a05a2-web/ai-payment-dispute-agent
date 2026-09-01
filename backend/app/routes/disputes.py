import random
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Dispute, Refund, Transaction, Customer
from app.schemas import DisputeCreate, DisputeResponse
from app.ai.engine import process_dispute_workflow

router = APIRouter(prefix="/api/disputes", tags=["Disputes"])

def generate_ticket_id(db: Session) -> str:
    """Generates a clean ticket ID like DSP-10025"""
    count = db.query(Dispute).count()
    return f"DSP-100{count + 25}"

@router.post("", response_model=dict)
def create_dispute(payload: DisputeCreate, db: Session = Depends(get_db)):
    """
    Submits customer complaint, runs AI workflow + RAG policy check,
    persists dispute ticket into database, and creates refund record if eligible.
    """
    # 1. Run AI Dispute Workflow
    workflow_result = process_dispute_workflow(
        customer_id=payload.customer_id,
        transaction_id=payload.transaction_id,
        complaint_text=payload.complaint_text,
        db=db
    )

    # 2. Generate unique Ticket ID
    ticket_id = generate_ticket_id(db)

    # 3. Create Dispute DB Record
    dispute = Dispute(
        ticket_id=ticket_id,
        customer_id=payload.customer_id,
        transaction_id=payload.transaction_id,
        complaint_text=payload.complaint_text,
        category=workflow_result["category"],
        issue_detected=workflow_result["issue_detected"],
        confidence=workflow_result["confidence"],
        refund_eligibility=workflow_result["refund_eligibility"],
        ai_recommendation=workflow_result["ai_recommendation"],
        relevant_policy=workflow_result["relevant_policy"],
        resolution_action=workflow_result["resolution_action"],
        status=workflow_result["status"],
        priority=workflow_result["priority"]
    )
    db.add(dispute)
    db.flush()

    # 4. If refund initiated, create Refund DB Record
    refund_details = None
    if workflow_result["refund_eligibility"] == "ELIGIBLE" and workflow_result["status"] == "REFUND_INITIATED":
        txn = db.query(Transaction).filter(Transaction.id == payload.transaction_id).first()
        refund_amount = txn.amount if txn else 0.0
        rfd_count = db.query(Refund).count() + 1003
        
        refund = Refund(
            id=f"RFD{rfd_count}",
            transaction_id=payload.transaction_id,
            dispute_id=dispute.id,
            amount=refund_amount,
            status="INITIATED"
        )
        db.add(refund)
        refund_details = {
            "id": refund.id,
            "amount": refund.amount,
            "status": refund.status
        }

    db.commit()
    db.refresh(dispute)

    return {
        "dispute": {
            "id": dispute.id,
            "ticket_id": dispute.ticket_id,
            "customer_id": dispute.customer_id,
            "transaction_id": dispute.transaction_id,
            "complaint_text": dispute.complaint_text,
            "category": dispute.category,
            "issue_detected": dispute.issue_detected,
            "confidence": dispute.confidence,
            "refund_eligibility": dispute.refund_eligibility,
            "ai_recommendation": dispute.ai_recommendation,
            "relevant_policy": dispute.relevant_policy,
            "resolution_action": dispute.resolution_action,
            "status": dispute.status,
            "priority": dispute.priority,
            "created_at": dispute.created_at.isoformat()
        },
        "transaction_details": workflow_result["transaction_details"],
        "refund_details": refund_details
    }

@router.get("", response_model=List[DisputeResponse])
def get_all_disputes(
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns list of disputes for the Admin Dashboard with filter capabilities.
    """
    query = db.query(Dispute)
    if status and status.upper() != "ALL":
        query = query.filter(Dispute.status == status.upper())
    if category and category.upper() != "ALL":
        query = query.filter(Dispute.category == category.upper())
    if priority and priority.upper() != "ALL":
        query = query.filter(Dispute.priority == priority.upper())

    disputes = query.order_by(Dispute.created_at.desc()).all()
    return disputes

@router.get("/{id_or_ticket}", response_model=dict)
def get_dispute_by_id(id_or_ticket: str, db: Session = Depends(get_db)):
    """
    Get detailed dispute record including Customer & Transaction objects.
    """
    if id_or_ticket.isdigit():
        dispute = db.query(Dispute).filter(Dispute.id == int(id_or_ticket)).first()
    else:
        dispute = db.query(Dispute).filter(Dispute.ticket_id == id_or_ticket.upper()).first()

    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute record not found")

    txn = db.query(Transaction).filter(Transaction.id == dispute.transaction_id).first()
    cust = db.query(Customer).filter(Customer.id == dispute.customer_id).first()

    return {
        "dispute": dispute,
        "customer": cust,
        "transaction": txn
    }
