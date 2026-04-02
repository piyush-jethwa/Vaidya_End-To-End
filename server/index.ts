// Only load dotenv if not in production (Vercel provides env vars directly)
if (process.env.NODE_ENV !== 'production') {
  try {
    import("dotenv/config");
  } catch (e) {
    // dotenv not available or no .env file - that's ok for Vercel
  }
}

import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

// Import new route handlers
import { 
  getDoctors, 
  loginDoctor, 
  loginPatient, 
  registerPatient, 
  getPatientProfile, 
  getDoctorProfile 
} from "./routes/users";

import { 
  bookAppointment, 
  getDoctorDashboard, 
  getPatientDashboard, 
  updateAppointmentStatus, 
  getAppointment, 
  getAllAppointments 
} from "./routes/appointments";

import { 
  analyzeSymptoms, 
  handleContactForm, 
  getHealthTips 
} from "./routes/symptom-checker";

// Import Groq routes only (user has Groq API key)
import { 
  sendChatMessage,
  analyzeMedicalCase,
  getDoctorRecommendation,
  summarizeMedicalReport,
  checkDrugInteractions,
  analyzeDigitalTwin,
  verifyMedicalClaims
} from "./routes/groq";

import { validateKey } from "./routes/validate-key";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // User management routes
  app.get("/api/doctors", getDoctors);
  app.post("/api/auth/login/doctor", loginDoctor);
  app.post("/api/auth/login/patient", loginPatient);
  app.post("/api/auth/register/patient", registerPatient);
  app.get("/api/patients/:patientId", getPatientProfile);
  app.get("/api/doctors/:doctorId", getDoctorProfile);

  // Appointment management routes
  app.post("/api/appointments", bookAppointment);
  app.get("/api/appointments", getAllAppointments);
  app.get("/api/appointments/:appointmentId", getAppointment);
  app.put("/api/appointments/:appointmentId/status", updateAppointmentStatus);
  
  // Dashboard routes
  app.get("/api/dashboard/doctor/:doctorId", getDoctorDashboard);
  app.get("/api/dashboard/patient/:patientId", getPatientDashboard);

  // Symptom checker and AI routes
  app.post("/api/symptom-checker/analyze", analyzeSymptoms);
  app.get("/api/health-tips", getHealthTips);

  // Groq AI routes (server-side to avoid CORS)
  app.post("/api/groq/chat", sendChatMessage);
  app.post("/api/groq/analyze", analyzeMedicalCase);
  app.post("/api/groq/doctor-recommendation", getDoctorRecommendation);
  app.post("/api/groq/summarize-report", summarizeMedicalReport);
  app.post("/api/groq/drug-interactions", checkDrugInteractions);
  app.post("/api/groq/digital-twin", analyzeDigitalTwin);
  app.post("/api/groq/fact-check", verifyMedicalClaims);

  // Contact and utility routes
  app.post("/api/contact", handleContactForm);

  // API key validation
  app.post("/api/validate-key", validateKey);

  // 404 handler - only for unmatched API routes
  // For non-API routes, let Vite handle them (SPA routing)
  app.use((req, res, next) => {
    // Only handle API routes here, let Vite handle frontend routes
    if (req.path.startsWith("/api/")) {
      res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.path}`,
        error: "The requested API endpoint does not exist",
      });
    } else {
      // Let Vite dev server handle frontend routes
      next();
    }
  });

  return app;
}

