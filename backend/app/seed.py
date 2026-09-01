from datetime import datetime, timedelta
from app.database import SessionLocal, engine, Base
from app.models import Customer, Transaction, Order, Refund, Dispute

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if data already exists
    if db.query(Customer).count() > 0:
        db.close()
        return

    now = datetime.utcnow()

    # 10 Customers
    customers = [
        Customer(id="C001", name="Rahul Sharma", email="rahul.sharma@example.com", phone="+91 9876543210"),
        Customer(id="C002", name="Priya Patel", email="priya.patel@example.com", phone="+91 9876543211"),
        Customer(id="C003", name="Amit Verma", email="amit.verma@example.com", phone="+91 9876543212"),
        Customer(id="C004", name="Sneha Gupta", email="sneha.gupta@example.com", phone="+91 9876543213"),
        Customer(id="C005", name="Vikram Singh", email="vikram.singh@example.com", phone="+91 9876543214"),
        Customer(id="C006", name="Ananya Rao", email="ananya.rao@example.com", phone="+91 9876543215"),
        Customer(id="C007", name="Karan Malhotra", email="karan.m@example.com", phone="+91 9876543216"),
        Customer(id="C008", name="Neha Kapoor", email="neha.k@example.com", phone="+91 9876543217"),
        Customer(id="C009", name="Rohan Nair", email="rohan.nair@example.com", phone="+91 9876543218"),
        Customer(id="C010", name="Pooja Joshi", email="pooja.j@example.com", phone="+91 9876543219"),
    ]
    db.add_all(customers)

    # 20 Transactions
    transactions = [
        # Scenario 1: Payment Success + Order Failed
        Transaction(id="TXN1001", customer_id="C001", amount=500.0, status="SUCCESS", payment_method="UPI", date=now - timedelta(days=1)),
        # Scenario 2: Payment Success + Order Cancelled
        Transaction(id="TXN1002", customer_id="C002", amount=1299.0, status="SUCCESS", payment_method="Credit Card", date=now - timedelta(days=2)),
        # Scenario 3: Payment Failed
        Transaction(id="TXN1003", customer_id="C003", amount=750.0, status="FAILED", payment_method="Debit Card", date=now - timedelta(days=3)),
        # Scenario 4: Duplicate Payment
        Transaction(id="TXN1004", customer_id="C004", amount=499.0, status="SUCCESS", payment_method="UPI", date=now - timedelta(hours=5)),
        Transaction(id="TXN1005", customer_id="C004", amount=499.0, status="SUCCESS", payment_method="UPI", date=now - timedelta(hours=5, minutes=2)),
        # Scenario 5 & 6: Refund Pending & Completed
        Transaction(id="TXN1006", customer_id="C005", amount=2499.0, status="SUCCESS", payment_method="NetBanking", date=now - timedelta(days=4)),
        Transaction(id="TXN1007", customer_id="C006", amount=899.0, status="SUCCESS", payment_method="Credit Card", date=now - timedelta(days=6)),
        # Scenario 7: Successful Order
        Transaction(id="TXN1008", customer_id="C007", amount=1500.0, status="SUCCESS", payment_method="UPI", date=now - timedelta(days=1)),
        # Scenario 8: Unauthorized Transaction
        Transaction(id="TXN1009", customer_id="C008", amount=9999.0, status="SUCCESS", payment_method="Credit Card", date=now - timedelta(hours=2)),
        
        # Additional Realistic Transactions
        Transaction(id="TXN1010", customer_id="C009", amount=350.0, status="SUCCESS", payment_method="UPI", date=now - timedelta(hours=10)),
        Transaction(id="TXN1011", customer_id="C010", amount=1800.0, status="FAILED", payment_method="Debit Card", date=now - timedelta(days=5)),
        Transaction(id="TXN1012", customer_id="C001", amount=120.0, status="SUCCESS", payment_method="UPI", date=now - timedelta(days=7)),
        Transaction(id="TXN1013", customer_id="C002", amount=4500.0, status="SUCCESS", payment_method="Credit Card", date=now - timedelta(days=8)),
        Transaction(id="TXN1014", customer_id="C003", amount=300.0, status="SUCCESS", payment_method="NetBanking", date=now - timedelta(days=9)),
        Transaction(id="TXN1015", customer_id="C004", amount=150.0, status="FAILED", payment_method="UPI", date=now - timedelta(days=10)),
        Transaction(id="TXN1016", customer_id="C005", amount=2100.0, status="SUCCESS", payment_method="Credit Card", date=now - timedelta(days=11)),
        Transaction(id="TXN1017", customer_id="C006", amount=650.0, status="SUCCESS", payment_method="UPI", date=now - timedelta(days=12)),
        Transaction(id="TXN1018", customer_id="C007", amount=990.0, status="SUCCESS", payment_method="Debit Card", date=now - timedelta(days=13)),
        Transaction(id="TXN1019", customer_id="C008", amount=3400.0, status="SUCCESS", payment_method="NetBanking", date=now - timedelta(days=14)),
        Transaction(id="TXN1020", customer_id="C009", amount=800.0, status="SUCCESS", payment_method="UPI", date=now - timedelta(days=15)),
    ]
    db.add_all(transactions)

    # 10 Orders
    orders = [
        Order(id="ORD1001", transaction_id="TXN1001", customer_id="C001", status="FAILED", amount=500.0, order_date=now - timedelta(days=1)),
        Order(id="ORD1002", transaction_id="TXN1002", customer_id="C002", status="CANCELLED", amount=1299.0, order_date=now - timedelta(days=2)),
        Order(id="ORD1003", transaction_id="TXN1008", customer_id="C007", status="COMPLETED", amount=1500.0, order_date=now - timedelta(days=1)),
        Order(id="ORD1004", transaction_id="TXN1004", customer_id="C004", status="COMPLETED", amount=499.0, order_date=now - timedelta(hours=5)),
        Order(id="ORD1005", transaction_id="TXN1006", customer_id="C005", status="CANCELLED", amount=2499.0, order_date=now - timedelta(days=4)),
        Order(id="ORD1006", transaction_id="TXN1007", customer_id="C006", status="CANCELLED", amount=899.0, order_date=now - timedelta(days=6)),
        Order(id="ORD1007", transaction_id="TXN1010", customer_id="C009", status="COMPLETED", amount=350.0, order_date=now - timedelta(hours=10)),
        Order(id="ORD1008", transaction_id="TXN1013", customer_id="C002", status="COMPLETED", amount=4500.0, order_date=now - timedelta(days=8)),
        Order(id="ORD1009", transaction_id="TXN1016", customer_id="C005", status="COMPLETED", amount=2100.0, order_date=now - timedelta(days=11)),
        Order(id="ORD1010", transaction_id="TXN1017", customer_id="C006", status="COMPLETED", amount=650.0, order_date=now - timedelta(days=12)),
    ]
    db.add_all(orders)

    # Initial Refunds
    refunds = [
        Refund(id="RFD1001", transaction_id="TXN1007", dispute_id=None, amount=899.0, status="COMPLETED", created_at=now - timedelta(days=5)),
        Refund(id="RFD1002", transaction_id="TXN1006", dispute_id=None, amount=2499.0, status="INITIATED", created_at=now - timedelta(days=3)),
    ]
    db.add_all(refunds)

    # Pre-populated Disputes for Dashboard initial state
    initial_disputes = [
        Dispute(
            ticket_id="DSP-10001",
            customer_id="C006",
            transaction_id="TXN1007",
            complaint_text="My order was cancelled last week but refund was delayed.",
            category="REFUND_NOT_RECEIVED",
            issue_detected="Refund delayed for cancelled order",
            confidence=95.0,
            refund_eligibility="ELIGIBLE",
            ai_recommendation="Refund completed on 5 days ago.",
            relevant_policy="Section 1: Customer-Initiated Cancellation - Orders cancelled before shipment are entitled to 100% refund.",
            resolution_action="Refund Completed",
            status="RESOLVED",
            priority="MEDIUM",
            created_at=now - timedelta(days=5)
        ),
        Dispute(
            ticket_id="DSP-10002",
            customer_id="C005",
            transaction_id="TXN1006",
            complaint_text="Cancelled order ORD1005, waiting for refund.",
            category="REFUND_NOT_RECEIVED",
            issue_detected="Order Cancelled - Refund pending processing",
            confidence=91.0,
            refund_eligibility="ELIGIBLE",
            ai_recommendation="Refund of ₹2499 initiated automatically.",
            relevant_policy="Section 1: Customer-Initiated Cancellation refund timeline.",
            resolution_action="Refund Initiated",
            status="REFUND_INITIATED",
            priority="HIGH",
            created_at=now - timedelta(days=3)
        ),
        Dispute(
            ticket_id="DSP-10003",
            customer_id="C008",
            transaction_id="TXN1009",
            complaint_text="I noticed a charge of ₹9999 on my credit card that I did not authorize.",
            category="UNAUTHORIZED_TRANSACTION",
            issue_detected="Unrecognized transaction report",
            confidence=98.0,
            refund_eligibility="REQUIRES_REVIEW",
            ai_recommendation="Escalate immediately to Security Fraud Team. Freeze transaction.",
            relevant_policy="Section 1: Mandatory Escalation & Freeze Protocol for unauthorized transactions.",
            resolution_action="Human Review Required",
            status="ESCALATED",
            priority="CRITICAL",
            created_at=now - timedelta(hours=2)
        )
    ]
    db.add_all(initial_disputes)

    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
