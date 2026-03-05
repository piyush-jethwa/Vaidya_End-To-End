import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Eye, EyeOff, User, Phone, Mail, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LoginRequest, LoginResponse, RegisterPatientRequest, RegisterPatientResponse } from "@shared/api";

export default function PatientLogin() {
  const [loginData, setLoginData] = useState({
    email: "",
    phone: "",
    password: ""
  });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
      // For now, backend only supports email login. Phone login will need backend support.
      if (loginType === "phone") {
        throw new Error("Phone login is not available yet. Please use email login.");
      }
      
      const email = loginData.email;
      
      if (!email) {
        throw new Error("Email is required");
      }

      const loginRequest: LoginRequest = {
        email: email,
        password: loginData.password,
        role: "patient",
      };

      let response: Response;
      try {
        response = await fetch("/api/auth/login/patient", {
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
      localStorage.setItem("user_role", "patient");

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.name}!`,
      });

      // Navigate to patient dashboard
      navigate("/patient/dashboard");
    } catch (error) {
      console.error("Patient login error:", error);
      
      let errorMessage = "Invalid credentials. Please try again.";
      
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
      setIsLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords don't match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(signupData.age) < 1 || parseInt(signupData.age) > 120) {
      toast({
        title: "Invalid Age",
        description: "Please enter a valid age.",
        variant: "destructive",
      });
      return;
    }

    setIsSignupLoading(true);

    try {
      const registerRequest: RegisterPatientRequest = {
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password,
        age: parseInt(signupData.age),
        gender: signupData.gender as 'male' | 'female' | 'other' | 'prefer-not-to-say',
      };

      let response: Response;
      try {
        response = await fetch("/api/auth/register/patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerRequest),
        });
      } catch (fetchError) {
        throw new Error("Unable to connect to server. Please make sure the server is running.");
      }

      // Read response as text first to handle both JSON and non-JSON responses
      const responseText = await response.text();
      let data: RegisterPatientResponse;

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
        throw new Error(data.message || "Registration failed");
      }

      // Store token and user info
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("user_role", "patient");

      toast({
        title: "Registration Successful",
        description: `Welcome to VAIDYA AI, ${data.user.name}!`,
      });

      // Navigate to patient dashboard
      navigate("/patient/dashboard");
    } catch (error) {
      console.error("Patient signup error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (error instanceof SyntaxError) {
        errorMessage = "Server response error. Please check if the server is running.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 flex items-center justify-center p-4">
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
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Patient Portal</CardTitle>
            <CardDescription>
              Login or create your account to book appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Login with
                    </label>
                    <div className="flex space-x-2 mb-3">
                      <Button
                        type="button"
                        variant={loginType === "email" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLoginType("email")}
                        className="flex-1"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                      <Button
                        type="button"
                        variant={loginType === "phone" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLoginType("phone")}
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Phone
                      </Button>
                    </div>
                  </div>

                  {loginType === "email" ? (
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="patient@example.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number (Coming Soon)
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={loginData.phone}
                        onChange={(e) => setLoginData({...loginData, phone: e.target.value})}
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Phone login is not available yet. Please use email login.</p>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
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
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50" />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-purple-600 hover:text-purple-500">
                      Forgot password?
                    </a>
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoginLoading}>
                    {isLoginLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={signupData.name}
                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        min="1"
                        max="120"
                        value={signupData.age}
                        onChange={(e) => setSignupData({...signupData, age: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      value={signupData.gender}
                      onChange={(e) => setSignupData({...signupData, gender: e.target.value})}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="patient@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      required
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="#" className="text-purple-600 hover:text-purple-500">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-purple-600 hover:text-purple-500">
                        Privacy Policy
                      </a>
                    </span>
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSignupLoading}>
                    {isSignupLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Are you a doctor?{" "}
                <Link to="/doctor/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Doctor Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
