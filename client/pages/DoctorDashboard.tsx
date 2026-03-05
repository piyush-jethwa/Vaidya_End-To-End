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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  X,
  LogOut,
  RefreshCw,
  Eye,
  TrendingUp,
  AlertCircle,
  Plus,
  User,
  Phone,
  Mail,
  FileText,
  ThumbsUp,
  ClipboardCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DoctorDashboardData, AppointmentWithDetails } from "@shared/api";

export default function DoctorDashboard() {
  const [dashboardData, setDashboardData] =
    useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingAppointment, setUpdatingAppointment] = useState<string | null>(
    null,
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithDetails | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  const navigate = useNavigate();

  // Mock doctor ID - in real app, this would come from authentication
  const doctorId = "doc1"; // Dr. Sarah Johnson
  const doctorName = "Dr. Sarah";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/dashboard/doctor/${doctorId}`);
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

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: "confirmed" | "completed" | "cancelled",
    notes?: string,
  ) => {
    try {
      setUpdatingAppointment(appointmentId);

      const response = await fetch(
        `/api/appointments/${appointmentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            notes: notes || `Appointment ${status} by doctor`,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      const result = await response.json();
      if (result.success) {
        // Refresh dashboard data
        await loadDashboardData();

        // Show success message
        const actionText = status === "confirmed" ? "approved" : status;
        alert(`Appointment ${actionText} successfully!`);

        // Close any open dialogs
        setViewDetailsOpen(false);
        setCompletionNotes("");
      } else {
        throw new Error(result.message || "Failed to update appointment");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert(`Failed to ${status} appointment. Please try again.`);
    } finally {
      setUpdatingAppointment(null);
    }
  };

  const handleViewDetails = (appointment: AppointmentWithDetails) => {
    setSelectedAppointment(appointment);
    setViewDetailsOpen(true);
  };

  const handleCompleteAppointment = () => {
    if (selectedAppointment) {
      updateAppointmentStatus(
        selectedAppointment.appointment_id,
        "completed",
        completionNotes,
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending Review
          </Badge>
        );
      case "confirmed":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Confirmed
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Cancelled
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

  const handleLogout = () => {
    // Clear authentication tokens and user data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_role");
    // Navigate to login page
    navigate("/doctor/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
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
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                VAIDYA AI - Doctor Portal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={loadDashboardData} variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {doctorName}
                </p>
                <p className="text-xs text-gray-500">Cardiology Specialist</p>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Manage your appointments and patients
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Availability
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.stats.today_appointments || 0}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Active schedule
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.stats.total_patients || 0}
              </div>
              <p className="text-xs text-muted-foreground">Under your care</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {dashboardData?.stats.pending_appointments || 0}
              </div>
              <p className="text-xs text-muted-foreground">Need approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Today
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {dashboardData?.stats.completed_today || 0}
              </div>
              <p className="text-xs text-muted-foreground">Great progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Appointments</CardTitle>
            <CardDescription>
              Review, approve, and manage patient appointments •{" "}
              {dashboardData?.recent_appointments.length || 0} appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.recent_appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No appointments yet
                </h3>
                <p className="text-gray-500">
                  Your appointments will appear here once patients book with
                  you.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">
                        Patient Details
                      </th>
                      <th className="text-left p-4 font-medium">Appointment</th>
                      <th className="text-left p-4 font-medium">
                        Medical Info
                      </th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recent_appointments.map((appointment) => (
                      <tr
                        key={appointment.appointment_id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {appointment.patient_name}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {appointment.patient_email}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {appointment.patient_phone}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">
                              {new Date(appointment.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.time}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <p
                              className="text-sm max-w-xs truncate"
                              title={appointment.symptoms}
                            >
                              {appointment.symptoms}
                            </p>
                            {getUrgencyBadge(appointment.urgency_level)}
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(appointment.status)}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDetails(appointment)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Patient Appointment Details
                                  </DialogTitle>
                                  <DialogDescription>
                                    Complete patient information and appointment
                                    management
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedAppointment && (
                                  <div className="space-y-6">
                                    {/* Patient Information */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900 flex items-center">
                                          <User className="h-4 w-4 mr-2" />
                                          Patient Information
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                          <p>
                                            <strong>Name:</strong>{" "}
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
                                        </div>
                                      </div>
                                      <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900 flex items-center">
                                          <Calendar className="h-4 w-4 mr-2" />
                                          Appointment Details
                                        </h4>
                                        <div className="space-y-2 text-sm">
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
                                            {selectedAppointment.status}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Medical Information */}
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900 flex items-center">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Medical Information
                                      </h4>
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm">
                                          <strong>Symptoms/Reason:</strong>
                                        </p>
                                        <p className="text-sm mt-1">
                                          {selectedAppointment.symptoms}
                                        </p>
                                        <div className="mt-3 flex items-center space-x-2">
                                          <span className="text-sm font-medium">
                                            Urgency Level:
                                          </span>
                                          {getUrgencyBadge(
                                            selectedAppointment.urgency_level,
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-4">
                                      {selectedAppointment.status ===
                                        "pending" && (
                                        <div className="flex space-x-3">
                                          <Button
                                            onClick={() =>
                                              updateAppointmentStatus(
                                                selectedAppointment.appointment_id,
                                                "confirmed",
                                              )
                                            }
                                            disabled={
                                              updatingAppointment ===
                                              selectedAppointment.appointment_id
                                            }
                                            className="bg-green-600 hover:bg-green-700"
                                          >
                                            <ThumbsUp className="h-4 w-4 mr-2" />
                                            Approve Appointment
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              updateAppointmentStatus(
                                                selectedAppointment.appointment_id,
                                                "cancelled",
                                              )
                                            }
                                            disabled={
                                              updatingAppointment ===
                                              selectedAppointment.appointment_id
                                            }
                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                          >
                                            <X className="h-4 w-4 mr-2" />
                                            Decline
                                          </Button>
                                        </div>
                                      )}

                                      {selectedAppointment.status ===
                                        "confirmed" && (
                                        <div className="space-y-3">
                                          <Label htmlFor="completion-notes">
                                            Completion Notes (Optional)
                                          </Label>
                                          <Textarea
                                            id="completion-notes"
                                            placeholder="Add any notes about the consultation, treatment provided, or follow-up recommendations..."
                                            value={completionNotes}
                                            onChange={(e) =>
                                              setCompletionNotes(e.target.value)
                                            }
                                            rows={3}
                                          />
                                          <Button
                                            onClick={handleCompleteAppointment}
                                            disabled={
                                              updatingAppointment ===
                                              selectedAppointment.appointment_id
                                            }
                                            className="bg-blue-600 hover:bg-blue-700"
                                          >
                                            <ClipboardCheck className="h-4 w-4 mr-2" />
                                            Mark as Completed
                                          </Button>
                                        </div>
                                      )}

                                      {selectedAppointment.status ===
                                        "completed" && (
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <p className="text-green-800 font-medium">
                                            ✅ Appointment Completed
                                          </p>
                                          {selectedAppointment.notes && (
                                            <div className="mt-2">
                                              <p className="text-sm text-green-700">
                                                <strong>Notes:</strong>{" "}
                                                {selectedAppointment.notes}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {selectedAppointment.status ===
                                        "cancelled" && (
                                        <div className="bg-red-50 p-4 rounded-lg">
                                          <p className="text-red-800 font-medium">
                                            ❌ Appointment Cancelled
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {appointment.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateAppointmentStatus(
                                    appointment.appointment_id,
                                    "confirmed",
                                  )
                                }
                                disabled={
                                  updatingAppointment ===
                                  appointment.appointment_id
                                }
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {updatingAppointment ===
                                appointment.appointment_id ? (
                                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                )}
                                Approve
                              </Button>
                            )}

                            {appointment.status === "confirmed" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateAppointmentStatus(
                                    appointment.appointment_id,
                                    "completed",
                                  )
                                }
                                disabled={
                                  updatingAppointment ===
                                  appointment.appointment_id
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                {updatingAppointment ===
                                appointment.appointment_id ? (
                                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                Complete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">Manage Schedule</h3>
              <p className="text-sm text-gray-600">
                Set availability and time slots
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">Patient Records</h3>
              <p className="text-sm text-gray-600">
                View patient history and notes
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">View performance metrics</p>
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
