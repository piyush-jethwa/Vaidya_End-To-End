// Vercel API handler with Express
// Supports both environment-based and user-provided API keys

import express, { Request, Response } from "express";
import cors from "cors";

// Lazy load the route handlers
let routeHandlers: any = null;

async function getRouteHandlers() {
  if (!routeHandlers) {
    const groqModule = await import('../server/routes/groq.js');
    routeHandlers = {
      sendChatMessage: groqModule.sendChatMessage,
      analyzeMedicalCase: groqModule.analyzeMedicalCase,
      getDoctorRecommendation: groqModule.getDoctorRecommendation,
      summarizeMedicalReport: groqModule.summarizeMedicalReport,
      checkDrugInteractions: groqModule.checkDrugInteractions,
      analyzeDigitalTwin: groqModule.analyzeDigitalTwin,
      verifyMedicalClaims: groqModule.verifyMedicalClaims,
    };
  }
  return routeHandlers;
}

// Create Express app
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check - shows if env keys are available
app.get("/api/ping", (_req: Request, res: Response) => {
  res.json({ 
    message: process.env.PING_MESSAGE || "pong",
    env: {
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      nodeEnv: process.env.NODE_ENV
    }
  });
});

// Validate API key endpoint
app.post("/api/validate-key", async (req: Request, res: Response) => {
  const { apiKey, provider } = req.body;
  
  if (!apiKey) {
    return res.status(400).json({ error: "API key is required" });
  }

  if (!provider || !['groq', 'gemini'].includes(provider)) {
    return res.status(400).json({ error: "Provider must be 'groq' or 'gemini'" });
  }

  try {
    // Test the API key by making a minimal request
    if (provider === 'groq') {
      const response = await fetch("https://api.groq.com/openai/v1/models", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        return res.json({ valid: true, message: "Groq API key is valid" });
      } else {
        const error = await response.json();
        return res.status(401).json({ valid: false, error: error.error?.message || "Invalid API key" });
      }
    } else if (provider === 'gemini') {
      // Test Gemini key - just check it's not empty and has expected format
      if (apiKey.length > 20) {
        return res.json({ valid: true, message: "Gemini API key format looks valid" });
      } else {
        return res.status(401).json({ valid: false, error: "API key seems too short" });
      }
    }
  } catch (error: any) {
    return res.status(500).json({ valid: false, error: error.message });
  }
});

// Groq Chat - accepts user-provided API key
app.post("/api/groq/chat", async (req: Request, res: Response) => {
  // If user provides their own key, use it; otherwise fall back to env
  const userApiKey = req.body.userApiKey;
  if (userApiKey) {
    req.body.apiKey = userApiKey;
  }
  
  const handlers = await getRouteHandlers();
  return handlers.sendChatMessage(req, res);
});

// Groq Analyze
app.post("/api/groq/analyze", async (req: Request, res: Response) => {
  const userApiKey = req.body.userApiKey;
  if (userApiKey) {
    req.body.apiKey = userApiKey;
  }
  
  const handlers = await getRouteHandlers();
  return handlers.analyzeMedicalCase(req, res);
});

// Groq Doctor Recommendation
app.post("/api/groq/doctor-recommendation", async (req: Request, res: Response) => {
  const userApiKey = req.body.userApiKey;
  if (userApiKey) {
    req.body.apiKey = userApiKey;
  }
  
  const handlers = await getRouteHandlers();
  return handlers.getDoctorRecommendation(req, res);
});

// Groq Summarize Report
app.post("/api/groq/summarize-report", async (req: Request, res: Response) => {
  const userApiKey = req.body.userApiKey;
  if (userApiKey) {
    req.body.apiKey = userApiKey;
  }
  
  const handlers = await getRouteHandlers();
  return handlers.summarizeMedicalReport(req, res);
});

// Groq Drug Interactions
app.post("/api/groq/drug-interactions", async (req: Request, res: Response) => {
  const userApiKey = req.body.userApiKey;
  if (userApiKey) {
    req.body.apiKey = userApiKey;
  }
  
  const handlers = await getRouteHandlers();
  return handlers.checkDrugInteractions(req, res);
});

// Groq Digital Twin
app.post("/api/groq/digital-twin", async (req: Request, res: Response) => {
  const userApiKey = req.body.userApiKey;
  if (userApiKey) {
    req.body.apiKey = userApiKey;
  }
  
  const handlers = await getRouteHandlers();
  return handlers.analyzeDigitalTwin(req, res);
});

// Groq Fact Check
app.post("/api/groq/fact-check", async (req: Request, res: Response) => {
  const userApiKey = req.body.userApiKey;
  if (userApiKey) {
    req.body.apiKey = userApiKey;
  }
  
  const handlers = await getRouteHandlers();
  return handlers.verifyMedicalClaims(req, res);
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error("Express error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// Export as Vercel handler
export default async function handler(req: any, res: any) {
  return new Promise((resolve, reject) => {
    app(req, res, (err?: any) => {
      if (err) {
        console.error("Handler error:", err);
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
}


