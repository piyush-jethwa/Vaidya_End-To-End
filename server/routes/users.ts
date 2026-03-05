import { RequestHandler } from "express";
import {
  LoginRequest,
  LoginResponse,
  RegisterPatientRequest,
  RegisterPatientResponse,
  Doctor,
  Patient,
  ApiResponse,
} from "@shared/api";

// In-memory database (replace with real database in production)
const doctors: Doctor[] = [
  {
    user_id: "doc1",
    name: "Dr. Sarah",
    email: "sarah.johnson@vaidyaai.com",
    phone: "+1 (555) 101-1001",
    role: "doctor",
    specialization: "Cardiology",
    license_number: "MD12345",
    years_of_experience: 15,
    available: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "doc2",
    name: "Dr. Michael",
    email: "michael.chen@vaidyaai.com",
    phone: "+1 (555) 101-1002",
    role: "doctor",
    specialization: "Dermatology",
    license_number: "MD12346",
    years_of_experience: 12,
    available: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "doc3",
    name: "Dr. Emily",
    email: "emily.davis@vaidyaai.com",
    phone: "+1 (555) 101-1003",
    role: "doctor",
    specialization: "General Medicine",
    license_number: "MD12347",
    years_of_experience: 8,
    available: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "doc4",
    name: "Dr. Robert",
    email: "robert.kim@vaidyaai.com",
    phone: "+1 (555) 101-1004",
    role: "doctor",
    specialization: "Pediatrics",
    license_number: "MD12348",
    years_of_experience: 20,
    available: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "doc5",
    name: "Dr. Lisa",
    email: "lisa.wilson@vaidyaai.com",
    phone: "+1 (555) 101-1005",
    role: "doctor",
    specialization: "Neurology",
    license_number: "MD12349",
    years_of_experience: 18,
    available: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "doc6",
    name: "Dr. James",
    email: "james.miller@vaidyaai.com",
    phone: "+1 (555) 101-1006",
    role: "doctor",
    specialization: "Orthopedics",
    license_number: "MD12350",
    years_of_experience: 22,
    available: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

const patients: Patient[] = [
  {
    user_id: "patient1",
    name: "Ritesh Kakade",
    email: "r.kakade@email.com",
    phone: "+91 9182736455",
    role: "patient",
    age: 32,
    gender: "male",
    medical_history: "No significant medical history",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

// Utility functions
const generateId = () => Math.random().toString(36).substring(2, 11);
const generateToken = () => Math.random().toString(36).substring(2, 22);

// Get all doctors
export const getDoctors: RequestHandler = (req, res) => {
  try {
    const availableDoctors = doctors.filter((doc) => doc.available);
    res.json({
      success: true,
      data: availableDoctors,
      message: "Doctors retrieved successfully",
    } as ApiResponse<Doctor[]>);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve doctors",
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse);
  }
};

// Doctor login
export const loginDoctor: RequestHandler = (req, res) => {
  try {
    console.log("Doctor login request:", { email: req.body?.email, hasPassword: !!req.body?.password });
    const { email, password } = req.body as LoginRequest;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      } as LoginResponse);
    }

    // Simple validation (in production, use proper password hashing)
    const doctor = doctors.find((d) => d.email === email);

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      } as LoginResponse);
    }

    // For demo: accept any non-empty password (in production, use proper password hashing)
    if (!password || password.trim().length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      } as LoginResponse);
    }

    // Generate token (in production, use JWT)
    const token = generateToken();

    res.json({
      success: true,
      user: doctor,
      token,
      message: "Login successful",
    } as LoginResponse);
  } catch (error) {
    console.error("Doctor login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse);
  }
};

// Patient login
export const loginPatient: RequestHandler = (req, res) => {
  try {
    console.log("Patient login request:", { email: req.body?.email, hasPassword: !!req.body?.password });
    const { email, password } = req.body as LoginRequest;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      } as LoginResponse);
    }

    // Simple validation (in production, use proper password hashing)
    const patient = patients.find((p) => p.email === email);

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      } as LoginResponse);
    }

    // For demo: accept any non-empty password (in production, use proper password hashing)
    if (!password || password.trim().length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      } as LoginResponse);
    }

    // Generate token (in production, use JWT)
    const token = generateToken();

    res.json({
      success: true,
      user: patient,
      token,
      message: "Login successful",
    } as LoginResponse);
  } catch (error) {
    console.error("Patient login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse);
  }
};

// Register patient
export const registerPatient: RequestHandler = (req, res) => {
  try {
    console.log("Patient registration request:", { email: req.body?.email, name: req.body?.name });
    const { name, email, phone, password, age, gender } =
      req.body as RegisterPatientRequest;

    // Validate required fields
    if (!name || !email || !phone || !password || !age || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      } as RegisterPatientResponse);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      } as RegisterPatientResponse);
    }

    // Validate age
    if (typeof age !== 'number' || age < 1 || age > 120) {
      return res.status(400).json({
        success: false,
        message: "Age must be between 1 and 120",
      } as RegisterPatientResponse);
    }

    // Validate gender
    const validGenders = ['male', 'female', 'other', 'prefer-not-to-say'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender selection",
      } as RegisterPatientResponse);
    }

    // Check if email already exists
    const existingPatient = patients.find((p) => p.email === email);
    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      } as RegisterPatientResponse);
    }

    // Create new patient
    const newPatient: Patient = {
      user_id: generateId(),
      name,
      email,
      phone,
      role: "patient",
      age,
      gender,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    patients.push(newPatient);

    // Generate token
    const token = generateToken();

    res.status(201).json({
      success: true,
      user: newPatient,
      token,
      message: "Registration successful",
    } as RegisterPatientResponse);
  } catch (error) {
    console.error("Patient registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse);
  }
};

// Get patient profile
export const getPatientProfile: RequestHandler = (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = patients.find((p) => p.user_id === patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: patient,
      message: "Patient profile retrieved successfully",
    } as ApiResponse<Patient>);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve patient profile",
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse);
  }
};

// Get doctor profile
export const getDoctorProfile: RequestHandler = (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = doctors.find((d) => d.user_id === doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: doctor,
      message: "Doctor profile retrieved successfully",
    } as ApiResponse<Doctor>);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve doctor profile",
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse);
  }
};
