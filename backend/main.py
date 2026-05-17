from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import tempfile
import re
import json
import os

from google import genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not set. "
        "Copy .env.example to .env and add your key."
    )

client = genai.Client(api_key=GEMINI_API_KEY)

app = FastAPI(title="PennyWise API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_transactions(pdf_path):

    transactions = []

    with pdfplumber.open(pdf_path) as pdf:

        text = ""

        for page in pdf.pages:

            extracted = page.extract_text()

            if extracted:
                text += extracted + "\n"

    lines = text.split("\n")

    print("\n========= RAW PDF LINES =========\n")

    for line in lines:
        print(line)

    current_transaction = None

    for line in lines:

        line = line.strip()

        # Detect SBI transaction start
        date_match = re.match(
            r'(\d{2}/\d{2}/\d{2})\s+(\d{2}/\d{2}/\d{2})\s+(.*)',
            line
        )

        if date_match:

            # Save previous transaction
            if current_transaction:
                transactions.append(current_transaction)

            date = date_match.group(1)

            remaining = date_match.group(3)

            # Find all monetary values
            amounts = re.findall(r'(\d+\.\d{2})', remaining)

            debit = None
            credit = None
            balance = None

            if len(amounts) >= 1:
                balance = amounts[-1]

            if len(amounts) >= 2:
                debit_or_credit = amounts[-2]

                if "BY TRANSFER" in remaining or "SALARY" in remaining or "CR/" in remaining:
                    credit = debit_or_credit
                else:
                    debit = debit_or_credit

            current_transaction = {
                "date": date,
                "details": remaining,
                "debit": debit,
                "credit": credit,
                "balance": balance
            }

        else:

            # Append multiline continuation
            if current_transaction and line:

                current_transaction["details"] += " " + line

    # Append final transaction
    if current_transaction:
        transactions.append(current_transaction)

    print("\n========= FINAL TRANSACTIONS =========\n")

    print(json.dumps(transactions[:10], indent=2))

    return transactions

@app.post("/analyze")

async def analyze_pdf(file: UploadFile = File(...)):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:

        temp_pdf.write(await file.read())

        pdf_path = temp_pdf.name

    transactions = extract_transactions(pdf_path)

    prompt = f"""
    You are PennyWise.

    Analyze the user's spending behavior.

    Give:
    - spending insights
    - bad habits
    - budgeting suggestions

    Keep response concise.

    Transaction Data:
    {json.dumps(transactions, indent=2)}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {
        "transactions": transactions,
        "analysis": response.text
    }