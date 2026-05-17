import pdfplumber
import re
import json


NAME_REGEX = r'\b[A-Z][a-z]+\s[A-Z][a-z]+\b'
ACCOUNT_REGEX = r'\b\d{10,16}\b'


def mask_pii(text):

    token_map = {}

    # Mask names
    names = re.findall(NAME_REGEX, text)

    for i, name in enumerate(set(names)):
        token = f"USER_{i+1}"

        text = text.replace(name, token)

        token_map[token] = name

    # Mask account numbers
    accounts = re.findall(ACCOUNT_REGEX, text)

    for i, acc in enumerate(set(accounts)):
        token = f"ACCT_{i+1}"

        text = text.replace(acc, token)

        token_map[token] = acc

    return text, token_map


def extract_transactions(pdf_path):

    transactions = []

    with pdfplumber.open(pdf_path) as pdf:

        full_text = ""

        for page in pdf.pages:

            extracted = page.extract_text()

            if extracted:
                full_text += extracted + "\n"

    print("\n========= ORIGINAL TEXT =========\n")
    print(full_text)

    sanitized_text, token_map = mask_pii(full_text)

    print("\n========= SANITIZED TEXT =========\n")
    print(sanitized_text)

    print("\n========= TOKEN MAP =========\n")
    print(json.dumps(token_map, indent=2))

    lines = sanitized_text.split("\n")

    for line in lines:

        match = re.search(
            r'(\d{2}/\d{2}/\d{4})\s+(.*?)\s+(\d+\.\d{2})',
            line
        )

        if match:

            transactions.append({
                "date": match.group(1),
                "merchant": match.group(2),
                "amount": match.group(3)
            })

    return transactions


if __name__ == "__main__":

    data = extract_transactions("statement.pdf")

    print("\n========= FINAL TRANSACTIONS =========\n")

    print(json.dumps(data, indent=2))