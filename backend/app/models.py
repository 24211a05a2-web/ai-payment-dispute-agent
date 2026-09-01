from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True, index=True) # e.g. C001
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)

    transactions = relationship("Transaction", back_populates="customer")
    orders = relationship("Order", back_populates="customer")
    disputes = relationship("Dispute", back_populates="customer")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True) # e.g. TXN1001
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="INR")
    status = Column(String, nullable=False) # SUCCESS, FAILED, CANCELLED, PENDING
    payment_method = Column(String, nullable=False) # UPI, Credit Card, Debit Card, NetBanking
    date = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="transactions")
    orders = relationship("Order", back_populates="transaction")
    disputes = relationship("Dispute", back_populates="transaction")
    refunds = relationship("Refund", back_populates="transaction")


class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True) # e.g. ORD1001
    transaction_id = Column(String, ForeignKey("transactions.id"), nullable=True)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    status = Column(String, nullable=False) # COMPLETED, FAILED, CANCELLED, PENDING
    amount = Column(Float, nullable=False)
    order_date = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="orders")
    transaction = relationship("Transaction", back_populates="orders")


class Refund(Base):
    __tablename__ = "refunds"

    id = Column(String, primary_key=True, index=True) # e.g. RFD1001
    transaction_id = Column(String, ForeignKey("transactions.id"), nullable=False)
    dispute_id = Column(Integer, ForeignKey("disputes.id"), nullable=True)
    amount = Column(Float, nullable=False)
    status = Column(String, nullable=False) # NOT_INITIATED, INITIATED, COMPLETED, FAILED
    created_at = Column(DateTime, default=datetime.utcnow)

    transaction = relationship("Transaction", back_populates="refunds")
    dispute = relationship("Dispute", back_populates="refunds")


class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ticket_id = Column(String, unique=True, index=True, nullable=False) # e.g. DSP-1001
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    transaction_id = Column(String, ForeignKey("transactions.id"), nullable=True)
    complaint_text = Column(Text, nullable=False)
    
    category = Column(String, nullable=False) # PAYMENT_DEDUCTED_ORDER_FAILED, etc.
    issue_detected = Column(String, nullable=False)
    confidence = Column(Float, nullable=False) # 0 to 100
    refund_eligibility = Column(String, nullable=False) # ELIGIBLE, NOT_ELIGIBLE, REQUIRES_REVIEW
    ai_recommendation = Column(Text, nullable=False)
    relevant_policy = Column(Text, nullable=True)
    resolution_action = Column(String, nullable=False) # Refund Initiated, Human Review Required, etc.
    
    status = Column(String, default="SUBMITTED") # SUBMITTED, AI_ANALYZED, UNDER_REVIEW, REFUND_INITIATED, ESCALATED, RESOLVED, REJECTED
    priority = Column(String, default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="disputes")
    transaction = relationship("Transaction", back_populates="disputes")
    refunds = relationship("Refund", back_populates="dispute")
