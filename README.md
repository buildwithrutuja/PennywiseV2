<div align="center">

# 💸 PennyWise

**An AI-powered personal finance OS for students**

*Upload your bank statement. Get brutally honest spending insights. Take back control.*

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Tauri](https://img.shields.io/badge/Tauri-2-ffc131?logo=tauri&logoColor=white)](https://tauri.app)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285f4?logo=google&logoColor=white)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## ✨ What is PennyWise?

PennyWise is a **local-first, AI-powered financial OS** built for students who want real visibility into where their money goes — without handing their data to a cloud service.

- 📄 **Upload** your bank statement (PDF)
- 🤖 **AI Analysis** via Google Gemini 2.5 Flash — spending insights, bad habits, budgeting tips
- 📊 **Dashboard** — interactive charts, health score, smart alerts
- 🎯 **Dream Engine** — set financial goals and track progress visually
- 🔍 **Auditor Panel** — transaction-level breakdown with categories
- ⚙️ **Settings** — personalize your PennyWise experience
- 🚀 **Startup Animation** — cinematic boot sequence

All data stays **on your machine**. No accounts. No subscriptions.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Framer Motion, Recharts |
| Desktop Shell | Tauri 2 (Rust) |
| Backend | FastAPI, pdfplumber |
| AI Engine | Google Gemini 2.5 Flash (`google-genai`) |
| Styling | Vanilla CSS + custom design system |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [Python](https://www.python.org/) ≥ 3.11
- [Rust](https://www.rust-lang.org/tools/install) (for Tauri desktop build)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/pennywise.git
cd pennywise
```

### 2. Frontend setup

```bash
npm install
```

### 3. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure your API key
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here
```

### 4. Run in development mode

**Option A — Web only (Vite + FastAPI)**

```bash
# Terminal 1 — Frontend
npm run dev

# Terminal 2 — Backend
cd backend && uvicorn main:app --reload --port 8000
```

**Option B — Desktop app (Tauri)**

```bash
npm run tauri dev
```

The app opens at `http://localhost:5173` (web) or as a native window (Tauri).

---

## 📁 Project Structure

```
pennywise/
├── src/                    # React frontend
│   ├── components/         # UI components
│   │   ├── Dashboard.jsx
│   │   ├── DreamEngine.jsx
│   │   ├── AuditorPanel.jsx
│   │   ├── Settings.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Onboarding.jsx
│   │   ├── StartupAnimation.jsx
│   │   ├── UploadStatement.jsx
│   │   └── StructuredReport.jsx
│   ├── context/            # React Context (user profile, app state)
│   ├── hooks/              # Custom React hooks
│   ├── App.jsx
│   └── main.jsx
├── backend/                # FastAPI Python backend
│   ├── main.py             # API routes
│   ├── parser.py           # PDF transaction parser
│   ├── ai_engine.py        # Gemini prompt engine
│   ├── requirements.txt
│   └── .env.example        # Environment variable template
├── src-tauri/              # Tauri desktop shell (Rust)
├── public/                 # Static assets
├── index.html
├── vite.config.js
└── package.json
```

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

---

## 🔒 Privacy & Security

- **No cloud sync** — your financial data never leaves your machine during analysis
- **API calls** go directly from your local backend to Google Gemini (the PDF content is sent for analysis; no data is stored by PennyWise)
- **Never commit** real bank statements — `.pdf` files are blocked by `.gitignore`

---

## 📜 License

[MIT](LICENSE) © 2026 PennyWise Contributors
