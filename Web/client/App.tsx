import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DoctorLogin from "./pages/DoctorLogin";
import PatientLogin from "./pages/PatientLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./pages/BookAppointment";
import SymptomChecker from "./pages/SymptomChecker";
import HospitalCommandCenter from "./pages/HospitalCommandCenter";
import SurgeForecastPage from "./pages/SurgeForecast";
import StaffingPage from "./pages/Staffing";
import SupplyPage from "./pages/Supply";
import AdvisoriesPage from "./pages/Advisories";
import AgentActivityPage from "./pages/AgentActivity";
import AIAgent from "./components/AIAgent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/hospital-command-center" element={<HospitalCommandCenter />} />
          <Route path="/surge-forecast" element={<SurgeForecastPage />} />
          <Route path="/staffing" element={<StaffingPage />} />
          <Route path="/supply" element={<SupplyPage />} />
          <Route path="/advisories" element={<AdvisoriesPage />} />
          <Route path="/agent-activity" element={<AgentActivityPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIAgent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
