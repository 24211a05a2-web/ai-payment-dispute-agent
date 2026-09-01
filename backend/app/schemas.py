from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DisputeCreate(BaseModel):
    customer_id: str
    transaction_id: str
    complaint_text: str

class DisputeStatusUpdate(BaseModel):
    status: str
    priority: Optional[str] = None

class CustomerSchema(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None

    class Config:
        from_attributes = True

class TransactionSchema(BaseModel):
    id: str
    customer_id: str
    amount: float
    currency: str
    status: str
    payment_method: str
    date: datetime

    class Config:
        from_attributes = True

class OrderSchema(BaseModel):
    id: str
    transaction_id: Optional[str]
    customer_id: str
    status: str
    amount: float
    order_date: datetime

    class Config:
        from_attributes = True

class RefundSchema(BaseModel):
    id: str
    transaction_id: str
    dispute_id: Optional[int]
    amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class DisputeResponse(BaseModel):
    id: int
    ticket_id: str
    customer_id: str
    transaction_id: Optional[str]
    complaint_text: str
    category: str
    issue_detected: str
    confidence: float
    refund_eligibility: str
    ai_recommendation: str
    relevant_policy: Optional[str]
    resolution_action: str
    status: str
    priority: str
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_disputes: int
    resolved_disputes: int
    pending_disputes: int
    escalated_disputes: int
    total_refunded_amount: float
