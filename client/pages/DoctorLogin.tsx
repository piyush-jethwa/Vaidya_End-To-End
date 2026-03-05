import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LoginRequest, LoginResponse } from "@shared/api";

export default function DoctorLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginRequest: LoginRequest = {
        email: formData.email,
        password: formData.password,
        role: "doctor",
      };

      let response: Response;
      try {
        response = await fetch("/api/auth/login/doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginRequest),
        });
      } catch (fetchError) {
        throw new Error("Unable to connect to server. Please make sure the server is running.");
      }

      // Read response as text first to handle both JSON and non-JSON responses
      const responseText = await response.text();
      let data: LoginResponse;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", responseText.substring(0, 200));
        console.error("Response status:", response.status);
        throw new Error(`Server error: Invalid response format. Response: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data?.message || `Server error (${response.status}): ${responseText.substring(0, 100)}`);
      }

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user info
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("user_role", "doctor");

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.name}!`,
      });

      // Navigate to doctor dashboard
      navigate("/doctor/dashboard");
    } catch (error) {
      console.error("Doctor login error:", error);
      
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (error instanceof SyntaxError) {
        errorMessage = "Server response error. Please check if the server is running.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 p-6">
        <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
          <Heart className="h-8 w-8 text-purple-600" />
          <span className="text-xl font-bold">VAIDYA AI</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Doctor Portal</CardTitle>
            <CardDescription>
              Access your dashboard to manage appointments and patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@medicareplus.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  IT Support
                </a>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Are you a patient?{" "}
                <Link to="/patient/login" className="text-purple-600 hover:text-purple-500 font-medium">
                  Patient Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
