<div align="center">

# 🎯 InterviewIQ.AI

### India's AI-Powered Mock Interview Platform

**Practice real interviews with a voice-to-voice AI interviewer, conquer company-specific rounds, and walk into placements fully prepared.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![OpenRouter](https://img.shields.io/badge/OpenRouter_AI-8E5CF6?style=for-the-badge&logo=openai&logoColor=white)](https://openrouter.ai)
[![Deepgram](https://img.shields.io/badge/Deepgram-13EF93?style=for-the-badge&logo=deepgram&logoColor=white)](https://deepgram.com)

</div>

---

## ✨ What is InterviewIQ?

InterviewIQ is a full-stack **MERN** platform that simulates real job interviews end-to-end — from resume parsing to the final AI-graded report. Talk to a **voice-to-voice AI interviewer**, face a **multi-persona panel**, crack **company-specific rounds** (Google, Amazon, Infosys, TCS…), solve **SQL** and **aptitude** rounds, and get **AI coaching** on every answer.

Built for one goal: **cracking 8+ LPA placements in India.** 🇮🇳

---

## 🚀 Features

### 🎙️ Voice-to-Voice AI Interviewer
- Real-time speech recognition with instant **skip / repeat / wait** voice commands (barge-in supported)
- **Deepgram Aura** neural text-to-speech with per-persona voices
- Pure voice mode UI with manual typing fallback

### 👥 Panel Interviews
- Multi-persona AI panel (e.g. DSA expert, system design lead, HR) with rapid-fire cross-questioning
- Broadcast-style **Live Room** video-call stage — Meet-like dark room, speaking indicators, captions

### 🏢 Company Mode — 16 Companies
- **Product:** Google, Amazon, Meta, Microsoft — with real hiring rubrics (HIRE / LEAN HIRE / NO HIRE), bar-raiser rounds & committee-style verdicts
- **Service:** Infosys, TCS, Wipro, HCLTech, Tech Mahindra, LTIMindtree, Cognizant, Capgemini, Deloitte, Accenture, IBM, Oracle

### 🧠 Adaptive Interview Engine
- No fixed question count — ends early on strong (≥7.5) or weak (≤4.5) performance
- Probes your weakest dimension, ramps coding difficulty (easy → medium → hard) for strong candidates

### 💻 SQL Round
- Real in-browser SQL via **sql.js** (SQLite WASM) — zero server load
- Adaptive extension for strong candidates, AI-graded queries + optimization feedback

### 📝 Aptitude Round
- **90 questions** — Quantitative / Logical / Verbal (30 each), tagged by company pattern (TCS NQT, Infosys, Wipro, HCL…)
- TCS NQT-style palette, per-section timers, mark-for-review
- **On-demand AI step-by-step solutions** with calculations (cached, with offline fallback)

### 📚 Practice Hub
- Topic-wise practice questions with instant AI evaluation

### 🔥 Rapid-Fire Grilling
- Sharp counter-questions grounded in *your own words* after every substantive answer

### 👁️ Body Language Monitor
- Real-time eye-contact, confidence score, filler-word and pace (WPM) tracking via `face-api.js`

### 🛡️ Proctoring
- Fullscreen enforcement with spoken warnings, tab-switch & location tracking, proctoring summary in reports

### 🤖 AI Coach
- Per-question coaching + full conversational coach chat about your finished interview

### 📊 Reports & Analytics
- Cinematic interview reports, analytics dashboard (recharts), **PDF export** (jsPDF)

### 📄 Resume Intelligence
- PDF resume upload → AI-extracted skills, projects & role-matched question generation

### 💳 Credits & Payments
- Credit-based interview generation with **Razorpay** integration

---

<!--
## 🖼️ Screenshots

> Add screenshots to `docs/screenshots/` and uncomment this section.

| Home | Live Interview |
|---|---|
| ![Home](docs/screenshots/home.png) | ![Interview](docs/screenshots/interview.png) |

| Aptitude Round | Report |
|---|---|
| ![Aptitude](docs/screenshots/aptitude.png) | ![Report](docs/screenshots/report.png) |
-->

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios, Motion, Recharts, React Icons, Monaco Editor, sql.js, face-api.js, jsPDF, Firebase |
| **Backend** | Node.js, Express.js, MongoDB + Mongoose, JWT (cookie sessions), Multer, pdf.js, Razorpay SDK, Firebase Admin |
| **AI & Voice** | OpenRouter (`openai/gpt-4o-mini`) for questions/grading/coaching, Deepgram Nova (STT) + Deepgram Aura (neural TTS) |

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18+
- **MongoDB** (local or Atlas)
- API keys: OpenRouter, Deepgram, Razorpay, Firebase

### 1. Clone
```bash
git clone https://github.com/Vikashsingh03/InterviewIQ.git
cd InterviewIQ
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=6000
MONGODB_URL=mongodb://localhost:27017/interviewiq
JWT_SECRET=your_jwt_secret

ROUTER_API_KEY=your_openrouter_api_key

DEEPGRAM_API_KEY=your_deepgram_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

FIREBASE_SERVICE_ACCOUNT_BASE=your_firebase_service_account_base64
```

```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../client
npm install
npm run dev
```

Open **http://localhost:5173** — the backend runs on **http://localhost:6000**.

> The frontend API base URL is configured as `ServerUrl` in `client/src/App.jsx`. Point it at your deployed backend URL for production.

---

## 🔑 Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | No (default `6000`) | Server port |
| `MONGODB_URL` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | JWT signing secret |
| `ROUTER_API_KEY` | ✅ | OpenRouter key — questions, grading, coaching, aptitude solutions |
| `DEEPGRAM_API_KEY` | ✅ | Speech-to-text + neural TTS |
| `DEEPGRAM_MODEL` / `DEEPGRAM_LANGUAGE` | No | STT model & language tuning |
| `DEEPGRAM_TTS_VOICE_FEMALE` / `DEEPGRAM_TTS_VOICE_MALE` | No | Persona voices |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | ✅ (for payments) | Credit purchases |
| `FIREBASE_SERVICE_ACCOUNT_BASE` | ✅ | Google auth (admin SDK) |
| `AI_RETRY_BASE_MS` | No | AI retry backoff base |

---

## 📁 Project Structure

```
InterviewIQ/
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/          # Step1Setup, Step2Interview, Step2PanelInterview,
│   │   │                        # VideoCallStage, AptitudeRound, SqlWorkbench, ...
│   │   ├── Pages/               # Home, InterviewPage, InterviewReport, AptitudePage,
│   │   │                        # PracticeHub, Analytics, Pricing, ...
│   │   ├── redux/               # Auth & app state
│   │   ├── utils/               # neuralTts, voiceCommands, sqlRunner, ...
│   │   └── App.jsx              # Routes + ServerUrl
│   └── package.json
├── server/                      # Express API
│   ├── controllers/             # interview, aptitude, tts, stt, transcribe,
│   │                            # auth, payment, user, confidence, coachChat
│   ├── data/                    # companyModes, sqlQuestions, practiceQuestions, ...
│   ├── models/                  # User, Interview, Payment
│   ├── routes/                  # auth, user, interview, practice, payment
│   ├── services/                # openRouter (AI), razorpay, codeExecution
│   ├── middlewares/             # isAuth, multer
│   └── index.js
└── README.md
```

---

## 🔌 API Overview

| Method & Route | Auth | Description |
|---|---|---|
| `POST /api/auth/google` | — | Google login / signup |
| `GET /api/auth/logout` | — | Clear session cookie |
| `GET /api/user/current-user` | ✅ | Logged-in profile + credits |
| `POST /api/interview/resume` | ✅ | Upload & AI-parse resume PDF |
| `POST /api/interview/generate-questions` | ✅ | Generate interview (credits deducted) |
| `POST /api/interview/submit-answer` | ✅ | Submit answer → AI scoring |
| `POST /api/interview/finish` | ✅ | Finish & finalize report |
| `GET /api/interview/report/:id` | ✅ | Full interview report |
| `POST /api/interview/aptitude-solution` | ✅ | On-demand AI aptitude solution |
| `POST /api/interview/coaching/:questionId` | ✅ | AI coaching for a question |
| `GET/POST /api/interview/coach/:id` | ✅ | Conversational AI coach |
| `POST /api/interview/tts` | ✅ | Deepgram neural speech synthesis |
| `POST /api/interview/transcribe` | ✅ | Voice-answer transcription |
| `POST /api/payment/order` · `/verify` | ✅ | Razorpay credit purchase |

---

## 🌐 Deployment

### Frontend (Vercel / Netlify)
```bash
cd client
npm run build        # outputs dist/
```
- Deploy the `dist/` folder as a static site
- Set `ServerUrl` in `client/src/App.jsx` to your deployed backend URL **before** building

### Backend (Render / Railway / VPS)
```bash
cd server
npm install
node index.js
```
> `npm run dev` uses nodemon (dev only). For production use `node index.js` or add `"start": "node index.js"`.

### Production checklist
- [ ] `ServerUrl` in the client points to the live backend
- [ ] CORS `origin` in `server/index.js` allows your frontend domain
- [ ] All `server/.env` variables set on the host (never commit `.env`)
- [ ] Secure cookies + HTTPS enabled
- [ ] MongoDB Atlas IP allowlist configured

---

## 🗺️ Roadmap
- [ ] Docker support
- [ ] Admin analytics dashboard
- [ ] Group-discussion simulator
- [ ] Real asked-questions bank per company

---

## 🤝 Contributing

Pull requests are welcome! Fork the repo, create a feature branch, and open a PR with a clear description.

---

## 📄 License

MIT License — Copyright (c) 2026 Ujjwal Maurya. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for every student preparing for placements.**

*If InterviewIQ helped you, give it a ⭐!*

</div>
