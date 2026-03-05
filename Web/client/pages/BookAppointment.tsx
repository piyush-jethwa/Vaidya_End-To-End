import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Calendar, Clock, User, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function BookAppointment() {
  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    symptoms: "",
    doctor: "",
    date: "",
    time: "",
    urgency: "",
  });

  const doctors = [
    {
      id: "1",
      name: "Dr. Sarah",
      specialization: "Cardiology",
      available: true,
    },
    {
      id: "2",
      name: "Dr. Michael",
      specialization: "Dermatology",
      available: true,
    },
    {
      id: "3",
      name: "Dr. Emily",
      specialization: "General Medicine",
      available: true,
    },
    {
      id: "4",
      name: "Dr. Robert",
      specialization: "Pediatrics",
      available: false,
    },
    { id: "5", name: "Dr. Lisa", specialization: "Neurology", available: true },
    {
      id: "6",
      name: "Dr. James",
      specialization: "Orthopedics",
      available: true,
    },
  ];

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle appointment booking logic here
    console.log("Appointment booking:", formData);
    alert(
      "Appointment booked successfully! You will receive a confirmation email shortly.",
    );
    // Reset form or redirect
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">VAIDYA AI</span>
            </Link>
            <div className="flex space-x-4">
              <Link to="/patient/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/">
                <Button size="sm">Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Book an Appointment
          </h1>
          <p className="text-xl text-gray-600">
            Schedule your visit with our expert doctors
          </p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Appointment Details</CardTitle>
            <CardDescription>
              Fill out the form below to schedule your appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Patient Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="patientName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name *
                    </label>
                    <Input
                      id="patientName"
                      placeholder="John Doe"
                      value={formData.patientName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          patientName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="age"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Age *
                    </label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Gender *
                    </label>
                    <select
                      id="gender"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Medical Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="symptoms"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Symptoms / Reason for Visit *
                    </label>
                    <Textarea
                      id="symptoms"
                      placeholder="Please describe your symptoms or reason for the appointment..."
                      rows={4}
                      value={formData.symptoms}
                      onChange={(e) =>
                        setFormData({ ...formData, symptoms: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="urgency"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Urgency Level *
                    </label>
                    <select
                      id="urgency"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      value={formData.urgency}
                      onChange={(e) =>
                        setFormData({ ...formData, urgency: e.target.value })
                      }
                      required
                    >
                      <option value="">Select urgency level</option>
                      <option value="low">Low - Routine checkup</option>
                      <option value="medium">
                        Medium - Need attention soon
                      </option>
                      <option value="high">High - Urgent care needed</option>
                      <option value="emergency">
                        Emergency - Immediate attention
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Doctor Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Select Doctor
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.doctor === doctor.id
                          ? "border-purple-500 bg-purple-50"
                          : doctor.available
                            ? "border-gray-300 hover:border-purple-300"
                            : "border-gray-200 bg-gray-50 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        doctor.available &&
                        setFormData({ ...formData, doctor: doctor.id })
                      }
                    >
                      <div className="font-semibold text-gray-900">
                        {doctor.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {doctor.specialization}
                      </div>
                      <div
                        className={`text-xs mt-1 ${doctor.available ? "text-green-600" : "text-red-600"}`}
                      >
                        {doctor.available ? "Available" : "Not Available"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date and Time Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Select Date & Time
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Preferred Date *
                    </label>
                    <Input
                      id="date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Preferred Time *
                    </label>
                    <select
                      id="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      required
                    >
                      <option value="">Select time slot</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-center pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 px-8"
                >
                  Book Appointment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Need help booking your appointment?
            <a
              href="#contact"
              className="text-purple-600 hover:text-purple-500 ml-1"
            >
              Contact us
            </a>
          </p>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
