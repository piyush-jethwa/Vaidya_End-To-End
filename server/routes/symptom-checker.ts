import { RequestHandler } from "express";
import { 
  SymptomAnalysisRequest, 
  SymptomAnalysisResponse,
  ContactFormRequest,
  ContactFormResponse,
  ApiResponse 
} from "@shared/api";

// AI Symptom Checker (rule-based for demo purposes)
export const analyzeSymptoms: RequestHandler = (req, res) => {
  try {
    const { symptoms, age, gender } = req.body as SymptomAnalysisRequest;
    
    if (!symptoms || symptoms.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Symptoms description is required"
      } as ApiResponse);
    }

    const lowerSymptoms = symptoms.toLowerCase();
    
    // Rule-based symptom analysis
    const analysis = generateSymptomAnalysis(lowerSymptoms, age, gender);
    
    res.json({
      success: true,
      data: analysis,
      message: "Symptom analysis completed"
    } as ApiResponse<SymptomAnalysisResponse>);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to analyze symptoms",
      error: error instanceof Error ? error.message : "Unknown error"
    } as ApiResponse);
  }
};

function generateSymptomAnalysis(symptoms: string, age?: number, gender?: string): SymptomAnalysisResponse {
  // Emergency symptoms
  const emergencyKeywords = [
    "chest pain", "difficulty breathing", "severe pain", "blood in", "unconscious",
    "severe bleeding", "poisoning", "seizure", "severe allergic reaction",
    "heart attack", "stroke", "severe headache with fever"
  ];
  
  // Urgent symptoms
  const urgentKeywords = [
    "high fever", "severe headache", "vomiting", "dizziness", "severe nausea",
    "difficulty swallowing", "severe abdominal pain", "severe back pain"
  ];

  // Common conditions mapping
  const conditionMap = [
    {
      keywords: ["fever", "headache", "body ache", "fatigue"],
      condition: "Viral Infection",
      confidence: 78,
      description: "Common viral infection causing fever, headache, and body aches"
    },
    {
      keywords: ["cough", "sore throat", "runny nose"],
      condition: "Upper Respiratory Infection",
      confidence: 85,
      description: "Infection affecting the upper respiratory tract"
    },
    {
      keywords: ["back pain", "backache", "muscle pain"],
      condition: "Musculoskeletal Pain",
      confidence: 70,
      description: "Pain related to muscles, bones, or joints"
    },
    {
      keywords: ["stomach pain", "nausea", "diarrhea"],
      condition: "Gastrointestinal Issue",
      confidence: 75,
      description: "Digestive system related symptoms"
    },
    {
      keywords: ["headache", "stress", "anxiety"],
      condition: "Tension Headache",
      confidence: 68,
      description: "Headache related to stress or tension"
    },
    {
      keywords: ["skin rash", "itching", "allergic"],
      condition: "Allergic Reaction",
      confidence: 80,
      description: "Possible allergic reaction or skin condition"
    },
    {
      keywords: ["joint pain", "swelling", "arthritis"],
      condition: "Joint Inflammation",
      confidence: 72,
      description: "Inflammation of joints causing pain and swelling"
    }
  ];

  // Determine urgency level
  let urgency;
  if (emergencyKeywords.some(keyword => symptoms.includes(keyword))) {
    urgency = {
      level: "Emergency" as const,
      color: "red" as const,
      description: "Seek immediate medical attention - go to emergency room"
    };
  } else if (urgentKeywords.some(keyword => symptoms.includes(keyword))) {
    urgency = {
      level: "Urgent" as const,
      color: "orange" as const,
      description: "See a doctor within 24 hours"
    };
  } else {
    urgency = {
      level: "Low" as const,
      color: "green" as const,
      description: "Schedule routine appointment within a week"
    };
  }

  // Find matching condition
  let bestMatch = {
    condition: "General Health Concern",
    confidence: 60,
    description: "Various symptoms that require professional evaluation"
  };

  for (const conditionData of conditionMap) {
    const matchCount = conditionData.keywords.filter(keyword => 
      symptoms.includes(keyword)
    ).length;
    
    if (matchCount > 0) {
      bestMatch = {
        condition: conditionData.condition,
        confidence: Math.min(conditionData.confidence + (matchCount * 5), 95),
        description: conditionData.description
      };
      break;
    }
  }

  // Generate recommendations
  const recommendations = generateRecommendations(symptoms, urgency.level);
  
  // Generate related conditions
  const relatedConditions = generateRelatedConditions(symptoms);

  return {
    condition: {
      name: bestMatch.condition,
      confidence: bestMatch.confidence,
      description: bestMatch.description
    },
    urgency,
    recommendations,
    related_conditions: relatedConditions
  };
}

function generateRecommendations(symptoms: string, urgencyLevel: string): string[] {
  const recommendations = [];
  
  // Urgency-based recommendations
  if (urgencyLevel === "Emergency") {
    recommendations.push("Call emergency services immediately (911)");
    recommendations.push("Do not drive yourself to the hospital");
    recommendations.push("If unconscious, call for immediate help");
  } else if (urgencyLevel === "Urgent") {
    recommendations.push("Contact your doctor or urgent care center");
    recommendations.push("Monitor symptoms closely");
    recommendations.push("Seek medical attention within 24 hours");
  } else {
    recommendations.push("Schedule an appointment with your healthcare provider");
    recommendations.push("Monitor symptom changes");
  }

  // Symptom-specific recommendations
  if (symptoms.includes("fever")) {
    recommendations.push("Stay hydrated with plenty of fluids");
    recommendations.push("Rest and avoid strenuous activities");
    recommendations.push("Monitor temperature regularly");
  }
  
  if (symptoms.includes("headache")) {
    recommendations.push("Apply cold or warm compress to head/neck");
    recommendations.push("Rest in a quiet, dark room");
    recommendations.push("Stay hydrated");
  }
  
  if (symptoms.includes("cough")) {
    recommendations.push("Stay hydrated with warm liquids");
    recommendations.push("Use a humidifier if available");
    recommendations.push("Avoid irritants like smoke");
  }
  
  if (symptoms.includes("pain")) {
    recommendations.push("Apply appropriate hot/cold therapy");
    recommendations.push("Rest the affected area");
    recommendations.push("Consider over-the-counter pain relief if appropriate");
  }

  // General recommendations
  recommendations.push("Keep a symptom diary");
  recommendations.push("Follow up with healthcare provider as recommended");
  
  return recommendations;
}

function generateRelatedConditions(symptoms: string): string[] {
  const baseConditions = ["Common Cold", "Viral Infection", "Bacterial Infection"];
  
  if (symptoms.includes("fever")) {
    baseConditions.push("Influenza", "Pneumonia");
  }
  
  if (symptoms.includes("pain")) {
    baseConditions.push("Inflammation", "Injury");
  }
  
  if (symptoms.includes("headache")) {
    baseConditions.push("Migraine", "Tension Headache", "Sinus Infection");
  }
  
  if (symptoms.includes("cough")) {
    baseConditions.push("Bronchitis", "Asthma", "Allergies");
  }
  
  return [...new Set(baseConditions)].slice(0, 6);
}

// Contact form handler
export const handleContactForm: RequestHandler = (req, res) => {
  try {
    const { name, email, message } = req.body as ContactFormRequest;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      } as ContactFormResponse);
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Queue for customer service
    
    console.log("Contact form submission:", { name, email, message });
    
    res.json({
      success: true,
      message: "Thank you for your message. We'll get back to you within 24 hours."
    } as ContactFormResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error instanceof Error ? error.message : "Unknown error"
    } as ApiResponse);
  }
};

// Get health tips
export const getHealthTips: RequestHandler = (req, res) => {
  try {
    const healthTips = [
      {
        title: "Stay Hydrated",
        description: "Drink at least 8 glasses of water daily to maintain optimal health.",
        category: "General Health"
      },
      {
        title: "Regular Exercise",
        description: "Aim for at least 30 minutes of moderate exercise 5 days a week.",
        category: "Fitness"
      },
      {
        title: "Balanced Diet",
        description: "Include fruits, vegetables, whole grains, and lean proteins in your diet.",
        category: "Nutrition"
      },
      {
        title: "Quality Sleep",
        description: "Get 7-9 hours of quality sleep each night for better health.",
        category: "Sleep"
      },
      {
        title: "Regular Checkups",
        description: "Schedule annual health checkups even when feeling well.",
        category: "Prevention"
      }
    ];

    res.json({
      success: true,
      data: healthTips,
      message: "Health tips retrieved successfully"
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve health tips",
      error: error instanceof Error ? error.message : "Unknown error"
    } as ApiResponse);
  }
};
