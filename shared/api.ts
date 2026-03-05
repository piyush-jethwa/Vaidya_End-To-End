// User types
export interface User {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'doctor' | 'patient';
  created_at: string;
  updated_at: string;
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  license_number?: string;
  years_of_experience?: number;
  available: boolean;
}

export interface Patient extends User {
  role: 'patient';
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  medical_history?: string;
  date_of_birth?: string;
}

// Appointment types
export interface Appointment {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  symptoms: string;
  urgency_level: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentWithDetails extends Appointment {
  patient_name: string;
  patient_email: string;
  patient_phone?: string;
  doctor_name: string;
  doctor_specialization: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
  role: 'doctor' | 'patient';
}

export interface LoginResponse {
  success: boolean;
  user: User | Doctor | Patient;
  token: string;
  message: string;
}

export interface RegisterPatientRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}

export interface RegisterPatientResponse {
  success: boolean;
  user: Patient;
  token: string;
  message: string;
}

// Appointment booking types
export interface BookAppointmentRequest {
  patient_name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  symptoms: string;
  urgency_level: 'low' | 'medium' | 'high' | 'emergency';
  doctor_id: string;
  date: string;
  time: string;
}

export interface BookAppointmentResponse {
  success: boolean;
  appointment: Appointment;
  confirmation_id: string;
  message: string;
}

// Symptom checker types
export interface SymptomAnalysisRequest {
  symptoms: string;
  age?: number;
  gender?: string;
}

export interface SymptomAnalysisResponse {
  condition: {
    name: string;
    confidence: number;
    description: string;
  };
  urgency: {
    level: 'Emergency' | 'Urgent' | 'Low';
    color: 'red' | 'orange' | 'green';
    description: string;
  };
  recommendations: string[];
  related_conditions: string[];
}

// Dashboard types
export interface DoctorDashboardData {
  stats: {
    today_appointments: number;
    total_patients: number;
    pending_appointments: number;
    completed_today: number;
  };
  recent_appointments: AppointmentWithDetails[];
}

export interface PatientDashboardData {
  profile: Patient;
  upcoming_appointments: AppointmentWithDetails[];
  past_appointments: AppointmentWithDetails[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

// Demo response (existing)
export interface DemoResponse {
  message: string;
}

// Contact form types
export interface ContactFormRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
}

// Doctor availability types
export interface DoctorAvailability {
  doctor_id: string;
  date: string;
  available_slots: string[];
}

export interface GetAvailabilityRequest {
  doctor_id: string;
  date: string;
}
