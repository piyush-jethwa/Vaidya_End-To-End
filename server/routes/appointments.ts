import { RequestHandler } from "express";
import {
  Appointment,
  AppointmentWithDetails,
  BookAppointmentRequest,
  BookAppointmentResponse,
  DoctorDashboardData,
  PatientDashboardData,
  ApiResponse,
} from "@shared/api";

// In-memory appointments database
const appointments: Appointment[] = [
  {
    appointment_id: "appt1",
    patient_id: "patient1",
    doctor_id: "doc1",
    date: "2024-12-25",
    time: "10:00 AM",
    symptoms: "Regular checkup and blood pressure monitoring",
    urgency_level: "low",
    status: "confirmed",
    notes: "Annual health checkup",
    created_at: "2024-12-20T00:00:00Z",
    updated_at: "2024-12-20T00:00:00Z",
  },
  {
    appointment_id: "appt2",
    patient_id: "patient1",
    doctor_id: "doc2",
    date: "2024-12-27",
    time: "2:30 PM",
    symptoms: "Skin consultation for mole examination",
    urgency_level: "medium",
    status: "pending",
    notes: "Follow-up for skin concerns",
    created_at: "2024-12-20T00:00:00Z",
    updated_at: "2024-12-20T00:00:00Z",
  },
];

// Sample data for realistic appointments
const mockPatients = [
  {
    id: "patient1",
    name: "Ritesh Kakade",
    email: "r.kakade@email.com",
    phone: "+91 9182736455",
  },
  {
    id: "patient2",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 201-2002",
  },
  {
    id: "patient3",
    name: "Michael Johnson",
    email: "michael.j@email.com",
    phone: "+1 (555) 201-2003",
  },
  {
    id: "patient4",
    name: "Emily Brown",
    email: "emily.brown@email.com",
    phone: "+1 (555) 201-2004",
  },
  {
    id: "patient5",
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1 (555) 201-2005",
  },
];

const mockDoctors = [
  { id: "doc1", name: "Dr. Sarah", specialization: "Cardiology" },
  { id: "doc2", name: "Dr. Michael", specialization: "Dermatology" },
  { id: "doc3", name: "Dr. Emily", specialization: "General Medicine" },
  { id: "doc4", name: "Dr. Robert", specialization: "Pediatrics" },
  { id: "doc5", name: "Dr. Lisa", specialization: "Neurology" },
  { id: "doc6", name: "Dr. James", specialization: "Orthopedics" },
];

// Utility functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const getAppointmentWithDetails = (
  appointment: Appointment,
): AppointmentWithDetails => {
  const patient = mockPatients.find((p) => p.id === appointment.patient_id);
  const doctor = mockDoctors.find((d) => d.id === appointment.doctor_id);

  return {
    ...appointment,
    patient_name: patient?.name || "Unknown Patient",
    patient_email: patient?.email || "",
    patient_phone: patient?.phone || "",
    doctor_name: doctor?.name || "Unknown Doctor",
    doctor_specialization: doctor?.specialization || "",
  };
};

// Book appointment
export const bookAppointment: RequestHandler = (req, res) => {
  try {
    const {
      patient_name,
      email,
      phone,
      age,
      gender,
      symptoms,
      urgency_level,
      doctor_id,
      date,
      time,
    } = req.body as BookAppointmentRequest;

    // Generate patient ID if new patient
    let patientId = mockPatients.find((p) => p.email === email)?.id;
    if (!patientId) {
      patientId = generateId();
      mockPatients.push({
        id: patientId,
        name: patient_name,
        email,
        phone,
      });
    }

    // Create new appointment
    const newAppointment: Appointment = {
      appointment_id: generateId(),
      patient_id: patientId,
      doctor_id,
      date,
      time,
      symptoms,
      urgency_level,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    appointments.push(newAppointment);

    const confirmationId = `CONF-${Date.now()}`;

    res.status(201).json({
      success: true,
      appointment: newAppointment,
      confirmation_id: confirmationId,
      message: "Appointment booked successfully",
    } as BookAppointmentResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to book appointment",
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse);
  }
};

// Get doctor dashboard data
export const getDoctorDashboard: RequestHandler = (req, res) => {
  try {
    const { doctorId } = req.params;

    // Get doctor's appointments
    const doctorAppointments = appointments.filter(
      (app) => app.doctor_id === doctorId,
    );

    // Calculate today's date
    const today = new Date().toISOString().split("T")[0];

    // Calculate stats
    const todayAppointments = doctorAppointments.filter(
      (app) => app.date === today,
    );
    const totalPatients = new Set(
      doctorAppointments.map((app) => app.patient_id),
    ).size;
    const pendingAppointments = doctorAppointments.filter(
      (app) => app.status === "pending",
    );
    const completedToday = todayAppointments.filter(
      (app) => app.status === "completed",
    );

    // Get recent appointments with details
    const recentAppointments = doctorAppointments
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10)
      .map(getAppointmentWithDetails);

    const dashboardData: DoctorDashboardData = {
      stats: {
        today_appointments: todayAppointments.length,
        total_patients: totalPatients,
        pending_appointments: pendingAppointments.length,
        completed_today: completedToday.length,
      },
      recent_appointments: recentAppointments,
    };

    res.json({
      success: true,
      data: dashboardData,
      message: "Dashboard data retrieved successfully",
    } as ApiResponse<DoctorDashboardData>);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard data",
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse);
  }
};

// Get patient dashboard data
export const getPatientDashboard: RequestHandler = (req, res) => {
  try {
    const { patientId } = req.params;

    // Get patient's appointments
    const patientAppointments = appointments.filter(
      (app) => app.patient_id === patientId,
    );

    // Separate upcoming and past appointments
    const now = new Date();
    const upcomingAppointments = patientAppointments
      .filter((app) => new Date(app.date) >= now)
      .map(getAppointmentWithDetails);

    const pastAppointments = patientAppointments
      .filter((app) => new Date(app.date) < now)
      .map(getAppointmentWithDetails);

    // Mock patient profile
    const patient = mockPatients.find((p) => p.id === patientId);
    const profile = {
      user_id: patientId,
      name: patient?.name || "Unknown Patient",
      email: patient?.email || "",
      phone: patient?.phone || "",
      role: "patient" as const,
      age: 32,
      gender: "male" as const,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    const dashboardData: PatientDashboardData = {
      profile,
      upcoming_appointments: upcomingAppointments,
      past_appointments: pastAppointments,
    };

    res.json({
      success: true,
      data: dashboardData,
      message: "Dashboard data retrieved successfully",
    } as ApiResponse<PatientDashboardData>);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard data",
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse);
  }
};

// Update appointment status
export const updateAppointmentStatus: RequestHandler = (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    const appointmentIndex = appointments.findIndex(
      (app) => app.appointment_id === appointmentId,
    );
    if (appointmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      } as ApiResponse);
    }

    // Update appointment
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      status,
      notes: notes || appointments[appointmentIndex].notes,
      updated_at: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: appointments[appointmentIndex],
      message: "Appointment updated successfully",
    } as ApiResponse<Appointment>);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse);
  }
};

// Get appointment by ID
export const getAppointment: RequestHandler = (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = appointments.find(
      (app) => app.appointment_id === appointmentId,
    );
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      } as ApiResponse);
    }

    const appointmentWithDetails = getAppointmentWithDetails(appointment);

    res.json({
      success: true,
      data: appointmentWithDetails,
      message: "Appointment retrieved successfully",
    } as ApiResponse<AppointmentWithDetails>);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve appointment",
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse);
  }
};

// Get all appointments (admin)
export const getAllAppointments: RequestHandler = (req, res) => {
  try {
    const appointmentsWithDetails = appointments.map(getAppointmentWithDetails);

    res.json({
      success: true,
      data: appointmentsWithDetails,
      message: "All appointments retrieved successfully",
    } as ApiResponse<AppointmentWithDetails[]>);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve appointments",
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse);
  }
};
