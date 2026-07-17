# InterviewAI

AI-powered mock interview platform where users practice interviews through text or voice conversations with AI, receive detailed feedback, track their progress, and improve over time.

## ✨ Features

- **AI-Powered Interviews** — Practice with an AI interviewer that asks one question at a time, adapting to your role and experience
- **Text & Voice Modes** — Type answers or speak them using voice recognition
- **Smart Memory** — AI remembers your past performance and tailors questions accordingly
- **Detailed Feedback** — Get scored on technical skills and communication with actionable tips
- **Progress Tracking** — Analytics dashboard with charts showing improvement over time
- **Subscription Plans** — Free tier with 5 interviews/month, Pro tier with unlimited access
- **Admin Panel** — Manage users, plans, and monitor system usage
- **Dark/Light Mode** — Premium UI with theme persistence

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | JavaScript |
| Database | MongoDB Atlas + Mongoose |
| Auth | Auth.js v5 (Credentials) |
| Styling | Tailwind CSS v4 |
| Validation | Zod + React Hook Form |
| AI | OpenRouter API |
| Voice STT | Web Speech API / Whisper |
| Voice TTS | SpeechSynthesis / OpenAI TTS |
| Charts | Recharts |
| Payments | Stripe |
| Email | Resend |
| Cache | Upstash Redis |
| Deployment | Vercel / Docker |

## 📦 Installation

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas account
- Upstash Redis account

### Setup

```bash
# Clone the repository
git clone [https://github.com/your-username/interviewai.git](https://github.com/your-username/interviewai.git)
cd interviewai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Fill in your environment variables in .env

# Run development server
npm run dev