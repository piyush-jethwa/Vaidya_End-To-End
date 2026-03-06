// Vercel API handler with Express
// This uses the bundled server code

import express, { Request, Response } from "express";
import cors from "cors";

// Lazy load the route handlers to avoid build issues
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
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

// Groq Chat
app.post("/api/groq/chat", async (req: Request, res: Response) => {
  const handlers = await getRouteHandlers();
  return handlers.sendChatMessage(req, res);
});

// Groq Analyze
app.post("/api/groq/analyze", async (req: Request, res: Response) => {
  const handlers = await getRouteHandlers();
  return handlers.analyzeMedicalCase(req, res);
});

// Groq Doctor Recommendation
app.post("/api/groq/doctor-recommendation", async (req: Request, res: Response) => {
  const handlers = await getRouteHandlers();
  return handlers.getDoctorRecommendation(req, res);
});

// Groq Summarize Report
app.post("/api/groq/summarize-report", async (req: Request, res: Response) => {
  const handlers = await getRouteHandlers();
  return handlers.summarizeMedicalReport(req, res);
});

// Groq Drug Interactions
app.post("/api/groq/drug-interactions", async (req: Request, res: Response) => {
  const handlers = await getRouteHandlers();
  return handlers.checkDrugInteractions(req, res);
});

// Groq Digital Twin
app.post("/api/groq/digital-twin", async (req: Request, res: Response) => {
  const handlers = await getRouteHandlers();
  return handlers.analyzeDigitalTwin(req, res);
});

// Groq Fact Check
app.post("/api/groq/fact-check", async (req: Request, res: Response) => {
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

// Export as Vercel handler
export default async function handler(req: any, res: any) {
  // Let Express handle the request
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

