# AI Interview Practice Platform

A full-stack MERN application that helps users practice job interviews with AI-generated questions, resume-based evaluation, interview history, and a credit-based premium flow. The platform supports both HR and technical interview modes, allows users to upload resume PDFs for role-specific questions, and gives AI-powered feedback for each answer.

## Project Overview

This project combines:

- A React + Vite frontend for the user experience
- An Express.js backend for APIs, auth, interviews, and payments
- MongoDB for storing users, interviews, and payment records
- OpenRouter AI integration for interview question generation and answer evaluation
- Razorpay integration for premium credit purchases
- JWT-based authentication with cookie-based session handling

The application is built for mock interview preparation and is designed to simulate a real interview environment with timed questions, role-based prompting, and performance summaries.

---

## Features

### User Authentication
- Google login flow with backend session creation
- JWT token stored in cookies
- Current user retrieval through authenticated routes
- Logout support

### Resume-Based Interview Setup
- Upload a resume PDF
- Extract text from the uploaded document
- Parse resume details using AI
- Generate role and experience-based interview prompts

### AI Interview Generation
- Interview questions generated using selected role, experience, and mode
- Supports:
  - HR mode
  - Technical mode
- Each question has a time limit and difficulty level
- Minimum credit requirement to generate a new set of questions

### Interview Answer Evaluation
- Real-time answer submission
- AI evaluates communication, correctness, confidence, and overall score
- Feedback is stored with each question
- Interview results can be tracked and reviewed later

### History and Reports
- View previous interviews
- Open detailed interview reports
- Track scoring and feedback history
- PDF export support is included in the frontend for reports

### Credit System and Payments
- Users start with credits
- Credits are deducted when generating interview questions
- Razorpay order creation and signature verification
- Credits are added after successful payment verification

---

## Tech Stack

### Frontend
- React
- Vite
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS
- Framer Motion / motion
- Recharts
- React Icons
- Firebase (used in client-side setup)
- jsPDF / jsPDF AutoTable

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- Cookie Parser
- CORS
- Multer
- PDF.js
- Razorpay SDK
- OpenRouter API integration

---

## Project Structure

```bash
InterviewIQ/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── Pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── public/
│   ├── routes/
│   ├── services/
│   ├── index.js
│   └── package.json
│
├── README.md
└── .env.example (recommended for setup documentation)
```

---

## Backend Modules

### Auth
- Google authentication endpoint
- Logout endpoint
- JWT token generation and cookie handling

### Users
- Current authenticated user retrieval
- User credit tracking

### Interviews
- Resume upload and AI parsing
- Draft interview generation
- Answer submission and evaluation
- Finish interview flow
- Fetch interview history and single report

### Payments
- Create Razorpay order
- Verify Razorpay signature
- Add credits to user after payment success

---

## API Overview

### Authentication
- POST /api/auth/google
  - Logs in or creates a user with Google profile data
- GET /api/auth/logout
  - Clears auth cookie

### User
- GET /api/user/current-user
  - Fetches logged-in user profile

### Interview
- POST /api/interview/resume
  - Upload and parse resume PDF
- POST /api/interview/generate-questions
  - Create AI interview questions with credits deducted
- POST /api/interview/submit-answer
  - Submit an answer for scoring
- POST /api/interview/finish
  - Mark interview as completed
- GET /api/interview/get-interviews
  - Get user interview history
- GET /api/interview/report/:id
  - Fetch interview details and report

### Payments
- POST /api/payment/order
  - Create Razorpay order
- POST /api/payment/verify
  - Verify payment and credit update

---

## Environment Variables

Create a .env file inside the server folder with the following variables:

```env
PORT=6000
MONGODB_URL=mongodb://localhost:27017/your-database-name
JWT_SECRET=your_jwt_secret
ROUTER_API_KEY=your_openrouter_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Note:
- The frontend uses a local backend URL configured as http://localhost:8000 in App.jsx.
- The server itself listens on PORT or defaults to 6000.
- CORS is configured to allow http://localhost:5173, which is the typical Vite frontend port.

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd InterviewIQ
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

### 4. Configure Environment

Create the .env file inside the server directory and add your MongoDB, JWT, OpenRouter, and Razorpay values.

### 5. Run the Server

```bash
cd server
npm run dev
```

### 6. Run the Client

```bash
cd client
npm run dev
```

The frontend should run on:
- http://localhost:5173

The backend should run on:
- http://localhost:6000

---

## App Flow

1. User visits the landing page
2. User signs in with Google or uses the auth flow
3. User selects interview role, experience, and interview mode
4. Resume is uploaded if needed
5. AI extracts structured resume information
6. AI generates 5 interview questions based on profile and resume
7. User answers the questions within the time limit
8. AI evaluates each response and generates a final report
9. User can revisit past interviews and review reports
10. User can purchase additional credits through payment integration

---

## Database Models

### User Model
- name
- email
- credits
- timestamps

### Interview Model
- userId
- role
- experience
- mode
- resumeText
- questions
- finalScore
- status
- timestamps

### Payment Model
- userId
- planId
- amount
- credits
- razorpayOrderId
- razorpayPaymentId
- status

---

## Notes

- The backend uses cookie-based authentication with JWT.
- The app is designed for local development and uses localhost URLs.
- For production, update CORS origin, API URLs, secure cookie settings, and environment variables.
- OpenRouter API key is required for AI question generation and evaluation.
- Razorpay credentials are needed for purchase flows.

---

## Potential Improvements

- Add proper frontend validation and error handling
- Add passwordless or email-based auth alternatives
- Add interview audio recording and speech analysis
- Improve security for production deployment
- Add role-based access control
- Implement admin dashboard for analytics
- Add Docker support for easier deployment

---

## License

This project is currently configured for local development use and does not include a formal production license file unless added later.

---

## Summary

This project is an AI-powered mock interview platform that blends resume analysis, role-based interview generation, answer evaluation, and payment for premium credits. It is a strong full-stack MERN application template for building a modern AI job-preparation product.
