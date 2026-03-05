import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Calendar,
  Stethoscope,
  User,
  Heart,
  Zap,
  Sparkles,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: "default" | "outline";
  }>;
}

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addAIMessage(
        "👋 Hi! I'm VAIDYA, your AI health assistant. I can help you instantly with appointments, symptoms, navigation, or health questions. What can I do for you?",
        [
          {
            label: "📅 Book Appointment",
            action: () => navigate("/book-appointment"),
          },
          {
            label: "🩺 Check Symptoms",
            action: () => window.open("https://ai-chatbot-personal.streamlit.app/", "_blank", "noopener,noreferrer"),
          },
          { label: "👨‍⚕️ Find Doctors", action: () => handleFindDoctors() },
          { label: "💡 Health Tips", action: () => handleHealthTips() },
        ],
      );
    }
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (
    text: string,
    sender: "user" | "ai",
    actions?: Array<{
      label: string;
      action: () => void;
      variant?: "default" | "outline";
    }>,
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      actions,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addAIMessage = (
    text: string,
    actions?: Array<{
      label: string;
      action: () => void;
      variant?: "default" | "outline";
    }>,
  ) => {
    setIsTyping(true);
    // Much faster response - reduced from 1-2 seconds to 200-500ms
    setTimeout(
      () => {
        setIsTyping(false);
        addMessage(text, "ai", actions);
      },
      200 + Math.random() * 300,
    ); // Fast response time
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    addMessage(inputText, "user");
    const userInput = inputText.toLowerCase();
    setInputText("");

    // Immediate AI Response - no delay
    generateAIResponse(userInput);
  };

  const generateAIResponse = (userInput: string) => {
    // Fast intent detection and immediate response
    if (
      userInput.includes("appointment") ||
      userInput.includes("book") ||
      userInput.includes("schedule")
    ) {
      addAIMessage(
        "🚀 Let's get you booked! I can take you directly to our smart booking system or help you find the right doctor first.",
        [
          { label: "📅 Book Now", action: () => navigate("/book-appointment") },
          { label: "👨‍⚕️ Find Doctor", action: () => handleFindDoctors() },
          { label: "⚡ Quick Info", action: () => handleQuickBookingInfo() },
        ],
      );
    } else if (
      userInput.includes("symptom") ||
      userInput.includes("pain") ||
      userInput.includes("fever") ||
      userInput.includes("sick") ||
      userInput.includes("feel")
    ) {
      addAIMessage(
        "🩺 I'll analyze your symptoms immediately! Our AI can provide instant insights and urgency assessment.",
        [
          {
            label: "🔍 Check Symptoms",
            action: () => window.open("https://ai-chatbot-personal.streamlit.app/", "_blank", "noopener,noreferrer"),
          },
          { label: "🚨 Emergency?", action: () => handleEmergencyCheck() },
          { label: "💊 Common Issues", action: () => handleCommonSymptoms() },
        ],
      );
    } else if (
      userInput.includes("doctor") ||
      userInput.includes("specialist")
    ) {
      handleFindDoctors();
    } else if (
      userInput.includes("login") ||
      userInput.includes("account") ||
      userInput.includes("register") ||
      userInput.includes("sign")
    ) {
      addAIMessage(
        "🔐 Account access made easy! Are you a patient or doctor?",
        [
          {
            label: "👤 Patient Login",
            action: () => navigate("/patient/login"),
          },
          { label: "👨‍⚕️ Doctor Login", action: () => navigate("/doctor/login") },
          { label: "✨ New Patient", action: () => handleNewPatientInfo() },
        ],
      );
    } else if (
      userInput.includes("health tip") ||
      userInput.includes("advice") ||
      userInput.includes("wellness") ||
      userInput.includes("tips")
    ) {
      handleHealthTips();
    } else if (
      userInput.includes("emergency") ||
      userInput.includes("urgent") ||
      userInput.includes("911") ||
      userInput.includes("help")
    ) {
      handleEmergencyCheck();
    } else if (
      userInput.includes("fast") ||
      userInput.includes("quick") ||
      userInput.includes("immediate")
    ) {
      addAIMessage("⚡ Speed is my specialty! I'm here for instant help:", [
        { label: "🚀 Quick Book", action: () => navigate("/book-appointment") },
        {
          label: "🔥 Fast Symptoms",
          action: () => window.open("https://ai-chatbot-personal.streamlit.app/", "_blank", "noopener,noreferrer"),
        },
        { label: "⭐ Express Help", action: () => handleExpressHelp() },
      ]);
    } else if (
      userInput.includes("how") ||
      userInput.includes("what") ||
      userInput.includes("can you")
    ) {
      addAIMessage(
        "💫 I'm your instant health companion! Here's what I can do:",
        [
          {
            label: "📅 Book Appointments",
            action: () => navigate("/book-appointment"),
          },
          {
            label: "🔍 Analyze Symptoms",
            action: () => window.open("https://ai-chatbot-personal.streamlit.app/", "_blank", "noopener,noreferrer"),
          },
          { label: "🏥 Find Doctors", action: () => handleFindDoctors() },
          { label: "🎯 Smart Help", action: () => handleSmartHelp() },
        ],
      );
    } else {
      // General fast response
      addAIMessage(
        "🤖 Got it! I'm here to help instantly. What would you like to do?",
        [
          {
            label: "📅 Book Appointment",
            action: () => navigate("/book-appointment"),
          },
          {
            label: "🩺 Check Symptoms",
            action: () => window.open("https://ai-chatbot-personal.streamlit.app/", "_blank", "noopener,noreferrer"),
          },
          { label: "🏠 Main Menu", action: () => navigate("/") },
          { label: "🔄 Try Again", action: () => setInputText("") },
        ],
      );
    }
  };

  const handleFindDoctors = () => {
    addAIMessage("🏥 Instant doctor search! Choose your specialty:", [
      { label: "❤️ Cardiology", action: () => handleSpecialty("Cardiology") },
      { label: "🧴 Dermatology", action: () => handleSpecialty("Dermatology") },
      {
        label: "👨‍⚕️ General Medicine",
        action: () => handleSpecialty("General Medicine"),
      },
      { label: "🏥 View All", action: () => navigate("/book-appointment") },
    ]);
  };

  const handleSpecialty = (specialty: string) => {
    addAIMessage(
      `⚡ ${specialty} specialists ready! Quick booking or more info?`,
      [
        { label: "🚀 Book Now", action: () => navigate("/book-appointment") },
        {
          label: "📋 Learn More",
          action: () => handleSpecialtyInfo(specialty),
        },
      ],
    );
  };

  const handleSpecialtyInfo = (specialty: string) => {
    const specialtyInfo: Record<string, string> = {
      Cardiology:
        "❤️ Heart & blood vessel experts. Treats: hypertension, heart disease, arrhythmias. Quick booking available!",
      Dermatology:
        "🧴 Skin, hair & nail specialists. Treats: acne, eczema, skin cancer screening. Fast appointments!",
      "General Medicine":
        "👨‍⚕️ Complete primary care. Handles: checkups, chronic conditions, general health. Book instantly!",
    };

    addAIMessage(
      specialtyInfo[specialty] || "🏥 Expert specialists ready to help you!",
      [
        {
          label: "📅 Book Appointment",
          action: () => navigate("/book-appointment"),
        },
      ],
    );
  };

  const handleHealthTips = () => {
    const tips = [
      "💧 Hydration boost: Drink 8+ glasses daily for optimal health",
      "🏃‍♂️ Move more: 30 minutes of activity = healthier you",
      "🥗 Fuel right: Colorful plates = better nutrition",
      "😴 Sleep smart: 7-9 hours = peak performance",
      "🧘‍♀️ Stress less: Deep breathing = instant calm",
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    addAIMessage(`✨ Quick health boost: ${randomTip}`, [
      { label: "💡 More Tips", action: () => handleHealthTips() },
      { label: "🩺 Check Health", action: () => window.open("https://ai-chatbot-personal.streamlit.app/", "_blank", "noopener,noreferrer") },
    ]);
  };

  const handleEmergencyCheck = () => {
    addAIMessage(
      "🚨 For emergencies: Call 911 immediately! For urgent care, I can help you find options:",
      [
        { label: "🏥 Find Urgent Care", action: () => handleUrgentCare() },
        {
          label: "🔍 Quick Symptoms",
          action: () => window.open("https://ai-chatbot-personal.streamlit.app/", "_blank", "noopener,noreferrer"),
        },
        { label: "📞 Emergency Info", action: () => handleEmergencyInfo() },
      ],
    );
  };

  const handleUrgentCare = () => {
    addAIMessage(
      "🏥 Urgent care guidance: Contact your doctor first, then urgent care center or ER based on severity.",
      [
        {
          label: "📅 Quick Booking",
          action: () => navigate("/book-appointment"),
        },
      ],
    );
  };

  const handleEmergencyInfo = () => {
    addAIMessage(
      "📞 Emergency numbers: 911 (Emergency), Poison Control (1-800-222-1222). For non-emergency urgent care, book quickly!",
      [
        {
          label: "🚀 Book Urgent",
          action: () => navigate("/book-appointment"),
        },
      ],
    );
  };

  const handleQuickBookingInfo = () => {
    addAIMessage(
      "⚡ Quick booking tips: Choose your doctor, select time, fill details - done in 2 minutes!",
      [
        {
          label: "🚀 Start Booking",
          action: () => navigate("/book-appointment"),
        },
      ],
    );
  };

  const handleNewPatientInfo = () => {
    addAIMessage(
      "✨ Welcome new patient! Registration is super quick - just basic info and you're ready to book!",
      [{ label: "📝 Sign Up", action: () => navigate("/patient/login") }],
    );
  };

  const handleCommonSymptoms = () => {
    addAIMessage(
      "💊 Common issues I help with: headaches, fever, cough, stomach pain, fatigue. What's bothering you?",
      [{ label: "🔍 Analyze Now", action: () => window.open("https://ai-chatbot-personal.streamlit.app/", "_blank", "noopener,noreferrer") }],
    );
  };

  const handleExpressHelp = () => {
    addAIMessage(
      "🚀 Express services: 2-min booking, instant symptom check, immediate doctor info!",
      [
        { label: "⚡ Book Fast", action: () => navigate("/book-appointment") },
        { label: "🔥 Quick Check", action: () => window.open("https://ai-chatbot-personal.streamlit.app/", "_blank", "noopener,noreferrer") },
      ],
    );
  };

  const handleSmartHelp = () => {
    addAIMessage(
      "🎯 Smart AI features: symptom analysis, doctor matching, appointment optimization, health insights!",
      [
        {
          label: "🧠 Try AI Symptoms",
          action: () => window.open("https://ai-chatbot-personal.streamlit.app/", "_blank", "noopener,noreferrer"),
        },
        {
          label: "🎯 Smart Booking",
          action: () => navigate("/book-appointment"),
        },
      ],
    );
  };

  return (
    <>
      {/* Floating Action Button - Enhanced with pulsing animation */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 hover:from-purple-700 hover:via-blue-700 hover:to-purple-800 shadow-2xl relative overflow-hidden group"
            size="lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <MessageCircle className="h-7 w-7 relative z-10" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
            <Sparkles className="absolute top-1 right-1 h-3 w-3 text-yellow-300 animate-pulse" />
          </Button>
        )}
      </div>

      {/* Chat Interface - Enhanced */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] max-h-[80vh]">
          <Card className="h-full flex flex-col shadow-2xl border-2 border-purple-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Bot className="h-6 w-6" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      VAIDYA AI Assistant
                      <Zap className="h-4 w-4 ml-2 animate-pulse" />
                    </CardTitle>
                    <p className="text-sm text-purple-100">
                      ⚡ Instant Health Support
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-purple-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      {message.actions && (
                        <div className="mt-3 space-y-1">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant={action.variant || "outline"}
                              size="sm"
                              onClick={action.action}
                              className="w-full text-xs h-8 font-medium hover:scale-105 transition-transform"
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - Enhanced */}
              <div className="border-t bg-white p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask me anything... I respond instantly!"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 border-2 border-purple-200 focus:border-purple-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex justify-center">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gradient-to-r from-purple-100 to-blue-100"
                  >
                    ⚡ Instant AI • 🚀 Lightning Fast
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
