import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Heart,
  Calendar,
  Clock,
  User,
  LogOut,
  Plus,
  RefreshCw,
  Eye,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  FileText,
  Activity,
  UserCheck,
  ClipboardList,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PatientDashboardData, AppointmentWithDetails } from "@shared/api";

export default function PatientDashboard() {
  const [dashboardData, setDashboardData] =
    useState<PatientDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithDetails | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const navigate = useNavigate();

  // Mock patient ID - in real app, this would come from authentication
  const patientId = "patient1"; // John Doe

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/dashboard/patient/${patientId}`);
      if (!response.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error(result.message || "Failed to load data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear authentication tokens and user data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_role");
    // Navigate to login page
    navigate("/patient/login");
  };

  const handleViewAppointmentDetails = (
    appointment: AppointmentWithDetails,
  ) => {
    setSelectedAppointment(appointment);
    setViewDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            ⏳ Pending Review
          </Badge>
        );
      case "confirmed":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            ✅ Confirmed
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            🎉 Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            ❌ Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return <Badge className="bg-red-600 text-white">🚨 Emergency</Badge>;
      case "high":
        return (
          <Badge className="bg-orange-600 text-white">🔥 High Priority</Badge>
        );
      case "medium":
        return <Badge className="bg-yellow-600 text-white">⚡ Medium</Badge>;
      case "low":
        return <Badge variant="outline">📋 Routine</Badge>;
      default:
        return null;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "Your appointment is being reviewed by the doctor. You'll receive a confirmation soon.";
      case "confirmed":
        return "Your appointment has been confirmed! Please arrive 15 minutes early.";
      case "completed":
        return "Your appointment has been completed. Thank you for visiting!";
      case "cancelled":
        return "This appointment was cancelled. Please book a new appointment if needed.";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Dashboard
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadDashboardData} className="mr-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">
                VAIDYA AI - Patient Portal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={loadDashboardData} variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Welcome, {dashboardData?.profile.name}
                </p>
                <p className="text-xs text-gray-500">
                  Patient ID: {dashboardData?.profile.user_id}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Health Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your appointments and health records
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link to="/book-appointment">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="flex items-center p-6">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <Plus className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Book Appointment
                  </h3>
                  <p className="text-sm text-gray-600">
                    Schedule with your doctor
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <a href="https://ai-chatbot-personal.streamlit.app/" target="_blank" rel="noopener noreferrer">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="flex items-center p-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Symptom Checker
                  </h3>
                  <p className="text-sm text-gray-600">
                    AI-powered health insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="flex items-center p-6">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Medical Records</h3>
                <p className="text-sm text-gray-600">
                  View your health history
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="flex items-center p-6">
              <div className="bg-orange-100 p-3 rounded-lg mr-4">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Health Metrics</h3>
                <p className="text-sm text-gray-600">Track your wellness</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile and Appointments Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    <strong>Name:</strong> {dashboardData?.profile.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    <strong>Age:</strong> {dashboardData?.profile.age} years
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    <strong>Gender:</strong> {dashboardData?.profile.gender}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    <strong>Email:</strong> {dashboardData?.profile.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    <strong>Phone:</strong> {dashboardData?.profile.phone}
                  </span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>
                Your scheduled appointments •{" "}
                {dashboardData?.upcoming_appointments.length || 0} upcoming
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.upcoming_appointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Schedule your next appointment to get started.
                  </p>
                  <Link to="/book-appointment">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData?.upcoming_appointments.map((appointment) => (
                    <div
                      key={appointment.appointment_id}
                      className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-blue-900">
                              {appointment.doctor_name}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {appointment.doctor_specialization}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-blue-700 mb-2">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(appointment.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {appointment.symptoms}
                          </p>
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusBadge(appointment.status)}
                            {getUrgencyBadge(appointment.urgency_level)}
                          </div>
                          <p className="text-xs text-gray-500">
                            {getStatusMessage(appointment.status)}
                          </p>
                        </div>
                        <div className="ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleViewAppointmentDetails(appointment)
                                }
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link to="/book-appointment">
                    <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Book Another Appointment
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Complete Appointment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="h-5 w-5 mr-2" />
              Complete Appointment History
            </CardTitle>
            <CardDescription>
              All your appointments with detailed information •{" "}
              {dashboardData?.past_appointments.length || 0} total appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.past_appointments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No appointment history
                </h3>
                <p className="text-gray-500">
                  Your past appointments will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Combine all appointments (upcoming and past) for complete history */}
                {[
                  ...(dashboardData?.upcoming_appointments || []),
                  ...(dashboardData?.past_appointments || []),
                ]
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map((appointment) => (
                    <div
                      key={appointment.appointment_id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-900 flex items-center">
                                <Stethoscope className="h-4 w-4 mr-2" />
                                Appointment Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center">
                                  <UserCheck className="h-3 w-3 mr-2 text-gray-400" />
                                  <strong>Doctor:</strong>{" "}
                                  <span className="ml-1">
                                    {appointment.doctor_name}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <FileText className="h-3 w-3 mr-2 text-gray-400" />
                                  <strong>Specialization:</strong>{" "}
                                  <span className="ml-1">
                                    {appointment.doctor_specialization}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                                  <strong>Date:</strong>{" "}
                                  <span className="ml-1">
                                    {new Date(
                                      appointment.date,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-2 text-gray-400" />
                                  <strong>Time:</strong>{" "}
                                  <span className="ml-1">
                                    {appointment.time}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <strong>Status:</strong>{" "}
                                  {getStatusBadge(appointment.status)}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <strong>Priority:</strong>{" "}
                                  {getUrgencyBadge(appointment.urgency_level)}
                                </div>
                              </div>
                            </div>

                            {/* Medical Information */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-900 flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Your Submitted Information
                              </h4>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="space-y-3 text-sm">
                                  <div>
                                    <strong>Symptoms/Reason for Visit:</strong>
                                    <p className="mt-1 text-gray-700">
                                      {appointment.symptoms}
                                    </p>
                                  </div>

                                  {/* Additional patient details (from booking form) */}
                                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div>
                                      <strong>Patient Name:</strong>
                                      <p className="text-gray-700">
                                        {appointment.patient_name}
                                      </p>
                                    </div>
                                    <div>
                                      <strong>Contact Email:</strong>
                                      <p className="text-gray-700">
                                        {appointment.patient_email}
                                      </p>
                                    </div>
                                    <div>
                                      <strong>Phone Number:</strong>
                                      <p className="text-gray-700">
                                        {appointment.patient_phone}
                                      </p>
                                    </div>
                                    <div>
                                      <strong>Booking ID:</strong>
                                      <p className="text-gray-700 font-mono text-xs">
                                        {appointment.appointment_id}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Doctor's notes (if completed) */}
                                  {appointment.status === "completed" &&
                                    appointment.notes && (
                                      <div className="pt-3 border-t">
                                        <strong>Doctor's Notes:</strong>
                                        <p className="mt-1 text-gray-700 bg-green-50 p-3 rounded border-l-4 border-green-400">
                                          {appointment.notes}
                                        </p>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Status Message */}
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              {getStatusMessage(appointment.status)}
                            </p>
                          </div>
                        </div>

                        <div className="ml-6">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleViewAppointmentDetails(appointment)
                                }
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Full Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Complete Appointment Information
                                </DialogTitle>
                                <DialogDescription>
                                  All details from your appointment booking and
                                  consultation
                                </DialogDescription>
                              </DialogHeader>
                              {selectedAppointment && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900">
                                        Appointment Details
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <p>
                                          <strong>Booking ID:</strong>{" "}
                                          {selectedAppointment.appointment_id}
                                        </p>
                                        <p>
                                          <strong>Doctor:</strong>{" "}
                                          {selectedAppointment.doctor_name}
                                        </p>
                                        <p>
                                          <strong>Specialization:</strong>{" "}
                                          {
                                            selectedAppointment.doctor_specialization
                                          }
                                        </p>
                                        <p>
                                          <strong>Date:</strong>{" "}
                                          {new Date(
                                            selectedAppointment.date,
                                          ).toLocaleDateString()}
                                        </p>
                                        <p>
                                          <strong>Time:</strong>{" "}
                                          {selectedAppointment.time}
                                        </p>
                                        <p>
                                          <strong>Status:</strong>{" "}
                                          <span className="ml-2">
                                            {getStatusBadge(
                                              selectedAppointment.status,
                                            )}
                                          </span>
                                        </p>
                                        <p>
                                          <strong>Priority:</strong>{" "}
                                          <span className="ml-2">
                                            {getUrgencyBadge(
                                              selectedAppointment.urgency_level,
                                            )}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900">
                                        Contact Information
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <p>
                                          <strong>Patient:</strong>{" "}
                                          {selectedAppointment.patient_name}
                                        </p>
                                        <p>
                                          <strong>Email:</strong>{" "}
                                          {selectedAppointment.patient_email}
                                        </p>
                                        <p>
                                          <strong>Phone:</strong>{" "}
                                          {selectedAppointment.patient_phone}
                                        </p>
                                        <p>
                                          <strong>Booked:</strong>{" "}
                                          {new Date(
                                            selectedAppointment.created_at,
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">
                                      Medical Information
                                    </h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <p className="text-sm">
                                        <strong>
                                          Symptoms/Reason for Visit:
                                        </strong>
                                      </p>
                                      <p className="text-sm mt-2 text-gray-700">
                                        {selectedAppointment.symptoms}
                                      </p>
                                    </div>

                                    {selectedAppointment.status ===
                                      "completed" &&
                                      selectedAppointment.notes && (
                                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                                          <p className="text-sm font-medium text-green-800">
                                            Doctor's Consultation Notes:
                                          </p>
                                          <p className="text-sm mt-2 text-green-700">
                                            {selectedAppointment.notes}
                                          </p>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Summary Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">Health Score</h3>
              <div className="text-2xl font-bold text-green-600 mb-2">85%</div>
              <p className="text-sm text-gray-600">Good overall health</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">Total Appointments</h3>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {(dashboardData?.upcoming_appointments.length || 0) +
                  (dashboardData?.past_appointments.length || 0)}
              </div>
              <p className="text-sm text-gray-600">Appointments booked</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Stethoscope className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">AI Consultations</h3>
              <div className="text-2xl font-bold text-purple-600 mb-2">12</div>
              <p className="text-sm text-gray-600">Symptom checks completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <Link to="/">
            <Button variant="outline">
              <Heart className="h-4 w-4 mr-2" />
              Back to VAIDYA AI Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
