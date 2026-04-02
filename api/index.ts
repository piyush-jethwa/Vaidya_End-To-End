// Vercel API handler - Full routes from server
import express from 'express';
import cors from 'cors';

// Import ALL handlers from server/routes
const usersHandlers = await import('../server/routes/users.js');
const appointmentsHandlers = await import('../server/routes/appointments.js');
const groqHandlers = await import('../server/routes/groq.js');
const symptomCheckerHandlers = await import('../server/routes/symptom-checker.js');
const demoHandlers = await import('../server/routes/demo.js');
const validateKeyHandlers = await import('../server/routes/validate-key.js');

// Create app
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Users routes
app.get("/api/doctors", usersHandlers.getDoctors);
app.post("/api/auth/login/doctor", usersHandlers.loginDoctor);
app.post("/api/auth/login/patient", usersHandlers.loginPatient);
app.post("/api/auth/register/patient", usersHandlers.registerPatient);
app.get("/api/patients/:patientId", usersHandlers.getPatientProfile);
app.get("/api/doctors/:doctorId", usersHandlers.getDoctorProfile);

// Appointments routes
app.post("/api/appointments", appointmentsHandlers.bookAppointment);
app.get("/api/appointments", appointmentsHandlers.getAllAppointments);
app.get("/api/appointments/:appointmentId", appointmentsHandlers.getAppointment);
app.put("/api/appointments/:appointmentId/status", appointmentsHandlers.updateAppointmentStatus);

// Dashboard routes
app.get("/api/dashboard/doctor/:doctorId", appointmentsHandlers.getDoctorDashboard);
app.get("/api/dashboard/patient/:patientId", appointmentsHandlers.getPatientDashboard);

// AI routes
app.post("/api/groq/chat", groqHandlers.sendChatMessage);
app.post("/api/groq/analyze", groqHandlers.analyzeMedicalCase);
app.post("/api/groq/doctor-recommendation", groqHandlers.getDoctorRecommendation);
app.post("/api/groq/summarize-report", groqHandlers.summarizeMedicalReport);
app.post("/api/groq/drug-interactions", groqHandlers.checkDrugInteractions);
app.post("/api/groq/digital-twin", groqHandlers.analyzeDigitalTwin);
app.post("/api/groq/fact-check", groqHandlers.verifyMedicalClaims);

// Key validation
app.post("/api/validate-key", validateKeyHandlers.validateKey);

// Symptom checker
app.post("/api/symptom-checker/analyze", symptomCheckerHandlers.analyzeSymptoms);

// Demo
app.get("/api/demo", demoHandlers.handleDemo);

// Health check
app.get("/api/ping", (req, res) => res.json({ message: "pong" }));

// 404
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

export default async (req: any, res: any) => {
  return new Promise((resolve, reject) => {
    app(req, res, (err: any) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
};

