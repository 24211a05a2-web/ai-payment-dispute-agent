from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Transaction, Customer, Order

router = APIRouter(prefix="/api", tags=["Transactions & Customers"])

@router.get("/transactions/{id}")
def get_transaction_details(id: str, db: Session = Depends(get_db)):
    txn = db.query(Transaction).filter(Transaction.id == id.strip().upper()).first()
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction ID not found")

    order = db.query(Order).filter(Order.transaction_id == txn.id).first()
    cust = db.query(Customer).filter(Customer.id == txn.customer_id).first()

    return {
        "transaction": txn,
        "customer": cust,
        "order": order
    }

@router.get("/customers/{customer_id}/transactions")
def get_customer_transactions(customer_id: str, db: Session = Depends(get_db)):
    cust = db.query(Customer).filter(Customer.id == customer_id.strip().upper()).first()
    if not cust:
        raise HTTPException(status_code=404, detail="Customer ID not found")

    txns = db.query(Transaction).filter(Transaction.customer_id == cust.id).all()
    return {
        "customer": cust,
        "transactions": txns
    }
