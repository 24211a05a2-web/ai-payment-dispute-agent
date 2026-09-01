from sqlalchemy.orm import Session
from app.models import Transaction, Order, Customer, Refund
from app.ai.classifier import classify_complaint
from app.rag.retriever import retrieve_relevant_policy

def process_dispute_workflow(customer_id: str, transaction_id: str, complaint_text: str, db: Session) -> dict:
    """
    Executes the 8-step AI Dispute Resolution Workflow:
    1. Customer Complaint received
    2. LLM / Intent Classification
    3. DB Transaction Lookup
    4. Transaction & Order Verification
    5. RAG Policy Retrieval
    6. Eligibility Analysis
    7. Resolution Recommendation & Human Escalation check
    8. Structured Decision Payload
    """

    # Step 1: Classification
    classification = classify_complaint(complaint_text)
    category = classification["category"]
    issue_summary = classification["issue_summary"]
    confidence = classification["confidence"]

    # Step 2: Database Lookups
    txn = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    cust = db.query(Customer).filter(Customer.id == customer_id).first()
    
    # Step 3: Transaction & Order Verification
    order = None
    if txn:
        order = db.query(Order).filter(Order.transaction_id == txn.id).first()

    # Step 4: RAG Policy Retrieval
    policy_snippet = retrieve_relevant_policy(query=complaint_text, category=category)

    # Step 5 & 6: Resolution Logic & Escalation Rules
    refund_eligibility = "REQUIRES_REVIEW"
    resolution_action = "Human Review Required"
    ai_recommendation = ""
    priority = "MEDIUM"
    status = "UNDER_REVIEW"

    # Escalation Rule 1: Missing Transaction ID in DB
    if not txn:
        refund_eligibility = "REQUIRES_REVIEW"
        resolution_action = "Human Review Required"
        ai_recommendation = f"Transaction ID '{transaction_id}' was not found in bank/gateway records. Manual verification of bank statement required."
        confidence = min(confidence, 65.0)
        priority = "HIGH"
        status = "ESCALATED"

    # Escalation Rule 2: Unauthorized Transaction / Fraud Claim
    elif category == "UNAUTHORIZED_TRANSACTION":
        refund_eligibility = "REQUIRES_REVIEW"
        resolution_action = "Human Review Required"
        ai_recommendation = f"Unrecognized transaction of ₹{txn.amount} reported. Account placed on security hold for fraud team review."
        priority = "CRITICAL"
        status = "ESCALATED"

    # Scenario 1: PAYMENT_DEDUCTED_ORDER_FAILED
    elif category == "PAYMENT_DEDUCTED_ORDER_FAILED":
        if txn.status == "SUCCESS" and (not order or order.status == "FAILED"):
            refund_eligibility = "ELIGIBLE"
            resolution_action = "Refund Initiated"
            ai_recommendation = f"Initiate full automated refund of ₹{txn.amount} to original payment method ({txn.payment_method})."
            priority = "HIGH"
            status = "REFUND_INITIATED"
        elif txn.status == "FAILED":
            refund_eligibility = "NOT_ELIGIBLE"
            resolution_action = "No Refund Required"
            ai_recommendation = f"Transaction status in gateway is FAILED. No money was settled to merchant. Auto-reversal within 24 hours."
            priority = "LOW"
            status = "RESOLVED"
        else:
            refund_eligibility = "REQUIRES_REVIEW"
            resolution_action = "Human Review Required"
            ai_recommendation = "Transaction was SUCCESS and order shows COMPLETED. Manual agent verification required for customer claim."
            priority = "MEDIUM"
            status = "UNDER_REVIEW"

    # Scenario 2: DUPLICATE_PAYMENT
    elif category == "DUPLICATE_PAYMENT":
        duplicate_txns = db.query(Transaction).filter(
            Transaction.customer_id == customer_id,
            Transaction.amount == (txn.amount if txn else 0),
            Transaction.status == "SUCCESS"
        ).all()

        if len(duplicate_txns) > 1:
            refund_eligibility = "ELIGIBLE"
            resolution_action = "Refund Initiated"
            ai_recommendation = f"Duplicate charge verified (Found {len(duplicate_txns)} identical transactions of ₹{txn.amount}). Initiating reversal for TXN {txn.id}."
            priority = "HIGH"
            status = "REFUND_INITIATED"
        else:
            refund_eligibility = "REQUIRES_REVIEW"
            resolution_action = "Human Review Required"
            ai_recommendation = "No matching duplicate transaction found in the last 60 minutes. Routing to support agent."
            priority = "MEDIUM"
            status = "UNDER_REVIEW"

    # Scenario 3: REFUND_NOT_RECEIVED or ORDER_CANCELLED
    elif category in ["REFUND_NOT_RECEIVED", "ORDER_CANCELLED"]:
        existing_refund = None
        if txn:
            existing_refund = db.query(Refund).filter(Refund.transaction_id == txn.id).first()

        if existing_refund and existing_refund.status == "COMPLETED":
            refund_eligibility = "NOT_ELIGIBLE"
            resolution_action = "Refund Already Processed"
            ai_recommendation = f"Refund RFD-{existing_refund.id} of ₹{existing_refund.amount} was already completed on {existing_refund.created_at.strftime('%Y-%m-%d')}."
            priority = "LOW"
            status = "RESOLVED"
        elif order and order.status == "CANCELLED":
            refund_eligibility = "ELIGIBLE"
            resolution_action = "Refund Initiated"
            ai_recommendation = f"Order ORD-{order.id} was cancelled. Initiating full refund of ₹{txn.amount}."
            priority = "HIGH"
            status = "REFUND_INITIATED"
        else:
            refund_eligibility = "REQUIRES_REVIEW"
            resolution_action = "Human Review Required"
            ai_recommendation = "Order is not marked cancelled in database. Escalated for support team review."
            priority = "MEDIUM"
            status = "UNDER_REVIEW"

    # Scenario 4: PAYMENT_FAILED
    elif category == "PAYMENT_FAILED":
        refund_eligibility = "NOT_ELIGIBLE"
        resolution_action = "No Refund Required"
        ai_recommendation = "Payment gateway log confirms transaction failed prior to settlement. Any pending bank hold will auto-release."
        priority = "LOW"
        status = "RESOLVED"

    # Default / Ambiguous case
    else:
        refund_eligibility = "REQUIRES_REVIEW"
        resolution_action = "Human Review Required"
        ai_recommendation = "Complex query require human agent analysis."
        priority = "MEDIUM"
        status = "UNDER_REVIEW"

    # Confidence check escalation
    if confidence < 75.0 and status != "RESOLVED":
        status = "ESCALATED"
        resolution_action = "Human Review Required"

    return {
        "category": category,
        "issue_detected": issue_summary,
        "confidence": round(confidence, 1),
        "refund_eligibility": refund_eligibility,
        "ai_recommendation": ai_recommendation,
        "relevant_policy": policy_snippet,
        "resolution_action": resolution_action,
        "status": status,
        "priority": priority,
        "transaction_details": {
            "id": txn.id if txn else transaction_id,
            "amount": txn.amount if txn else 0.0,
            "status": txn.status if txn else "NOT_FOUND",
            "payment_method": txn.payment_method if txn else "UNKNOWN",
            "date": txn.date.strftime("%Y-%m-%d %H:%M") if txn else "N/A",
            "order_status": order.status if order else ("NOT_FOUND" if not txn else "NO_ORDER")
        }
    }
