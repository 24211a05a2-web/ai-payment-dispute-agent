import json
import os
import re
from app.config import GEMINI_API_KEY, OPENAI_API_KEY

VALID_CATEGORIES = [
    "PAYMENT_DEDUCTED_ORDER_FAILED",
    "PAYMENT_FAILED",
    "DUPLICATE_PAYMENT",
    "REFUND_NOT_RECEIVED",
    "WRONG_AMOUNT",
    "UNAUTHORIZED_TRANSACTION",
    "ORDER_CANCELLED"
]

def classify_complaint(complaint_text: str) -> dict:
    """
    Classifies customer complaint into structured intent dictionary.
    Returns:
    {
        "category": str,
        "issue_summary": str,
        "confidence": float
    }
    """
    text_lower = complaint_text.lower()

    # Try Gemini API if API key is provided
    if GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = f"""
            Analyze this customer payment dispute complaint:
            "{complaint_text}"

            Classify into ONE of these categories:
            - PAYMENT_DEDUCTED_ORDER_FAILED
            - PAYMENT_FAILED
            - DUPLICATE_PAYMENT
            - REFUND_NOT_RECEIVED
            - WRONG_AMOUNT
            - UNAUTHORIZED_TRANSACTION
            - ORDER_CANCELLED

            Respond ONLY with a JSON object in this exact format:
            {{
                "category": "CATEGORY_NAME",
                "issue_summary": "Short 1 sentence summary of detected issue",
                "confidence": 95.0
            }}
            """
            response = model.generate_content(prompt)
            match = re.search(r"\{.*\}", response.text, re.DOTALL)
            if match:
                data = json.loads(match.group(0))
                if data.get("category") in VALID_CATEGORIES:
                    return data
        except Exception as e:
            print(f"Gemini API classification failed, using fallback NLP: {e}")

    # Smart Rule-Based NLP Classifier Fallback
    confidence = 94.0
    category = "PAYMENT_DEDUCTED_ORDER_FAILED"
    summary = "Payment deducted but order creation or fulfillment failed"

    if any(w in text_lower for w in ["unauthorized", "fraud", "stolen", "didn't make", "don't recognize", "not recognize"]):
        category = "UNAUTHORIZED_TRANSACTION"
        summary = "Unrecognized transaction reported on account"
        confidence = 98.0
    elif any(w in text_lower for w in ["duplicate", "charged twice", "double charge", "two times"]):
        category = "DUPLICATE_PAYMENT"
        summary = "Duplicate charges detected for single transaction"
        confidence = 93.0
    elif any(w in text_lower for w in ["cancelled", "canceled"]) and any(w in text_lower for w in ["refund", "money"]):
        category = "REFUND_NOT_RECEIVED"
        summary = "Order cancelled but refund not yet received"
        confidence = 92.0
    elif "cancel" in text_lower:
        category = "ORDER_CANCELLED"
        summary = "Customer requested order cancellation refund"
        confidence = 90.0
    elif any(w in text_lower for w in ["failed", "declined"]) and not ("deducted" in text_lower or "debited" in text_lower):
        category = "PAYMENT_FAILED"
        summary = "Payment transaction marked failed by payment gateway"
        confidence = 91.0
    elif any(w in text_lower for w in ["wrong amount", "incorrect amount", "overcharged", "extra charge"]):
        category = "WRONG_AMOUNT"
        summary = "Billed amount differs from order total"
        confidence = 89.0

    return {
        "category": category,
        "issue_summary": summary,
        "confidence": confidence
    }
