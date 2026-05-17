from google import genai
import json
import os
import sys
from dotenv import load_dotenv

# =========================
# GEMINI CLIENT
# =========================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print(
        "\n[PennyWise] ERROR: GEMINI_API_KEY not found in environment variables.\n"
        "  1. Copy backend/.env.example  →  backend/.env\n"
        "  2. Replace 'your_gemini_api_key_here' with your real key\n"
        "  3. Get a key at: https://aistudio.google.com/app/apikey\n",
        file=sys.stderr
    )
    sys.exit(1)

client = genai.Client(api_key=GEMINI_API_KEY)

# =========================
# PERSONALITY MODE
# =========================

MODE = "roast"
# OPTIONS:
# "coach"
# "roast"

# =========================
# SAMPLE TRANSACTION DATA
# =========================

sample_data = [
    {
        "date": "01/05/2026",
        "merchant": "SWIGGY",
        "amount": "450"
    },
    {
        "date": "02/05/2026",
        "merchant": "UBER",
        "amount": "220"
    },
    {
        "date": "03/05/2026",
        "merchant": "STARBUCKS",
        "amount": "680"
    },
    {
        "date": "04/05/2026",
        "merchant": "AMAZON",
        "amount": "3200"
    }
]

# =========================
# PERSONA SYSTEM
# =========================

if MODE == "coach":

    system_prompt = """
    You are PennyWise in Coach Mode.

    Your personality:
    - supportive
    - educational
    - practical
    - calm
    - financially responsible

    You help students improve money habits positively.

    Avoid sarcasm.
    """

else:

    system_prompt = """
    You are PennyWise in Roast Mode.

    Your personality:
    - sarcastic
    - funny
    - dramatic
    - Gen-Z style humor

    Roast bad spending decisions creatively.

    IMPORTANT:
    - Never be hateful
    - Never insult personally
    - Never use abusive language
    - Keep it entertaining
    """

# =========================
# FINAL AI PROMPT
# =========================

prompt = f"""
{system_prompt}

Analyze the user's spending behavior.

Provide:
1. Spending insights
2. Bad habits
3. Budgeting suggestions

Keep response concise and engaging.

Transaction Data:
{json.dumps(sample_data, indent=2)}
"""

# =========================
# GEMINI REQUEST
# =========================

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt
)

# =========================
# OUTPUT
# =========================

print("\n========= PENNYWISE RESPONSE =========\n")

print(response.text)