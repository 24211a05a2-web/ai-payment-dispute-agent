# DisputeAI — AI Payment Dispute Resolution Agent

An AI-powered payment dispute resolution assistant built for customer support and fintech platforms. It automatically analyzes customer complaints, cross-references transaction and order history in an SQLite database, retrieves relevant payment and refund policies using RAG, determines refund eligibility, recommends automated resolutions, creates dispute tickets, and escalates high-risk cases to human support agents.

---

## 🌟 Key Features

1. **AI Complaint Classification**: Parses customer complaints into categories like `PAYMENT_DEDUCTED_ORDER_FAILED`, `UNAUTHORIZED_TRANSACTION`, `REFUND_NOT_RECEIVED`, `DUPLICATE_PAYMENT`, and `PAYMENT_FAILED`.
2. **Database Verification**: Cross-references transaction logs, payment gateway statuses, and merchant order fulfillment states in real-time.
3. **Policy-Based RAG System**: Vector store indexes policy documents (`refund_policy.txt`, `payment_failure_policy.txt`, etc.) and retrieves exact policy clauses to justify decisions.
4. **Automated Refund Eligibility & Escalation**:
   - Automatically approves refunds for verified order failures or duplicate payments.
   - Mandatorily escalates unrecognized charges (`UNAUTHORIZED_TRANSACTION`) or missing transactions to Human Review.
5. **Interactive Frontend Web App**: Built with React, Tailwind CSS, and Lucide icons. Includes Landing Page, Customer Dispute Form (with quick-test demo scenarios), Ticket Progress Timeline Tracker, and Admin Resolution Dashboard.

---

## 🏗️ Technology Stack

- **Frontend**: React.js, Tailwind CSS, Lucide Icons, React Router DOM
- **Backend**: Python 3, FastAPI, Uvicorn, Pydantic
- **Database**: SQLite, SQLAlchemy ORM
- **AI & RAG**: Google Gemini LLM API (with smart local NLP fallback), ChromaDB Vector Store & Local Semantic Policy Matcher

---

## 🚀 Quick Start Guide

### 1. Backend Setup & Run

1. Open terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. (Optional) Configure Gemini API key in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If no API key is provided, the system automatically uses its built-in smart local classifier and policy RAG engine.*

4. Start the FastAPI backend server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

5. Open your browser and visit:
   - **Full Website**: [http://localhost:8000/](http://localhost:8000/)
   - **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 Demo Scenarios

Try filing a dispute with these preloaded customer & transaction records:

### Scenario 1: Payment Deducted — Order Failed
- **Customer ID**: `C001`
- **Transaction ID**: `TXN1001`
- **Complaint**: `"My money was deducted but my order failed."`
- **Result**: `Payment = SUCCESS`, `Order = FAILED`, `Refund = ELIGIBLE`, `Action = Refund Initiated`

### Scenario 2: Cancelled Order Refund Delay
- **Customer ID**: `C002`
- **Transaction ID**: `TXN1002`
- **Complaint**: `"My order was cancelled but I haven't received my refund."`
- **Result**: `Order = CANCELLED`, `Refund = ELIGIBLE`, `Action = Refund Initiated`

### Scenario 3: Unauthorized Transaction (Fraud Escalation)
- **Customer ID**: `C008`
- **Transaction ID**: `TXN1009`
- **Complaint**: `"I don't recognize this transaction."`
- **Result**: `Category = UNAUTHORIZED_TRANSACTION`, `Action = Human Review Required`, `Status = ESCALATED`

---

## 📁 Project Structure

```
ai-dispute-agent/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app & routing
│   │   ├── config.py            # Environment configuration
│   │   ├── database.py          # SQLAlchemy SQLite connection
│   │   ├── models.py            # Customer, Transaction, Order, Refund, Dispute models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── seed.py              # Dummy dataset seeder
│   │   ├── ai/
│   │   │   ├── classifier.py    # LLM & NLP intent classifier
│   │   │   └── engine.py        # Resolution decision matrix
│   │   ├── rag/
│   │   │   ├── vector_store.py  # ChromaDB & local policy store
│   │   │   └── retriever.py     # Policy retriever
│   │   └── routes/              # API Endpoints
│   ├── knowledge_base/          # Policy document text files
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── index.html               # Web Application Entrypoint
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── services/api.js
│       ├── components/
│       └── pages/
└── README.md
```
