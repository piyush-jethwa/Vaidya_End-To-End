# Vaidya AI - End-to-End Healthcare Platform

An AI-powered healthcare platform that provides autonomous clinical agents for symptom checking, medical report analysis, doctor recommendations, drug interactions checking, and more.

## Features

- 🤖 **AI-Powered Clinical Agents** - Autonomous clinical workflow driven by AI
- 🏥 **Symptom Checker** - Analyze symptoms and get triage recommendations
- 📊 **Medical Report Analysis** - OCR and summarize medical reports
- 👨‍⚕️ **Doctor Recommender** - Get specialist recommendations based on symptoms
- 💊 **Drug Interaction Checker** - Analyze medications for interactions
- 🔄 **Digital Twin** - Health profile analysis and recommendations
- ✅ **Fact Checker** - Verify medical claims

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Express, Node.js
- **AI**: Google Gemini, Groq
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and add your API keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
4. Deploy!

## License

MIT

