import { Request, Response } from "express";

const getApiKey = (): string => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }
  return apiKey;
};

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroq(prompt: string, systemInstruction?: string): Promise<string> {
  const messages: any[] = [];
  
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  
  messages.push({ role: "user", content: prompt });

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getApiKey()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: messages,
      temperature: 0.3,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "No response";
}

export const sendChatMessage = async (req: Request, res: Response) => {
  try {
    const { message, history, mode } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    let systemInstruction = "";
    if (mode === 'clinical_agent') {
      systemInstruction = `You are Vaidya AI, a fully Autonomous Clinical Agent. Goal: Autonomously drive clinical workflow. Status Tags: [STATUS: INTERVIEWING], [STATUS: ANALYZING], [STATUS: IMAGING_REQ], [STATUS: REPORT_READY], [STATUS: EMERGENCY].`;
    } else {
      systemInstruction = "You are Vaidya AI, an emotion-aware health assistant.";
    }

    // Build messages array for Groq
    const messages: any[] = [];
    
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }

    // Add history
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role && msg.parts && msg.parts[0]?.text) {
          messages.push({
            role: msg.role === 'model' ? 'assistant' : msg.role,
            content: msg.parts[0].text
          });
        }
      }
    }

    // Add current message
    messages.push({ role: "user", content: message });

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getApiKey()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.3,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content || "No response";

    res.json({ response: responseText });
  } catch (error: any) {
    console.error("Groq Chat Error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to get response from AI" 
    });
  }
};

export const analyzeMedicalCase = async (req: Request, res: Response) => {
  try {
    const { symptoms, language } = req.body;

    if (!symptoms) {
      res.status(400).json({ error: "Symptoms are required" });
      return;
    }

    let promptText = `You are Vaidya AI, an elite Autonomous Clinical Agent and expert Radiologist. Task: Analyze the provided inputs. Output Language: ${language || 'English'}

Please provide the output in the following STRUCTURED FORMAT:

1. **Triage Level**: [Green (Mild) | Yellow (Moderate) | Orange (Serious) | Red (Emergency)] - Explain why.
2. **Clinical Analysis**:
   - **Findings**: Detailed observations.
   - **Impression**: Primary diagnostic impression.
3. **Potential Conditions**: List differential diagnoses.
4. **Recommendations**: Next steps (tests, specialist, home care).
5. **Disclaimer**: Standard AI medical disclaimer.

Symptoms/Description: ${symptoms}`;

    const responseText = await callGroq(promptText);
    res.json({ response: responseText });
  } catch (error: any) {
    console.error("Medical Analysis Error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to analyze medical case" 
    });
  }
};

// Doctor Recommendation
export const getDoctorRecommendation = async (req: Request, res: Response) => {
  try {
    const { symptoms, riskFactors } = req.body;

    if (!symptoms) {
      res.status(400).json({ error: "Symptoms are required" });
      return;
    }

    const prompt = `Patient Symptoms: ${symptoms}\nRisk Factors: ${riskFactors || 'None'}\nBased on the symptoms and risk factors, recommend the appropriate specialist doctor, provide reasoning, and indicate the urgency level.`;

    const responseText = await callGroq(prompt);
    res.json({ response: responseText });
  } catch (error: any) {
    console.error("Doctor Recommendation Error:", error);
    res.status(500).json({ error: error.message || "Failed to get doctor recommendation" });
  }
};

// Summarize Medical Report
export const summarizeMedicalReport = async (req: Request, res: Response) => {
  try {
    const { reportText } = req.body;

    if (!reportText) {
      res.status(400).json({ error: "Report text is required" });
      return;
    }

    const prompt = `OCR this medical report and summarize the findings. Also audit for any errors or inconsistencies:\n\n${reportText}`;

    const responseText = await callGroq(prompt);
    res.json({ response: responseText });
  } catch (error: any) {
    console.error("Report Summary Error:", error);
    res.status(500).json({ error: error.message || "Failed to summarize report" });
  }
};

// Drug Interactions
export const checkDrugInteractions = async (req: Request, res: Response) => {
  try {
    const { medications } = req.body;

    if (!medications) {
      res.status(400).json({ error: "Medications list is required" });
      return;
    }

    const prompt = `Analyze the following medications for interactions and contraindications. Provide detailed information about any potential drug interactions, side effects, and warnings:\n\nMedications: ${medications}`;

    const responseText = await callGroq(prompt);
    res.json({ response: responseText });
  } catch (error: any) {
    console.error("Drug Interactions Error:", error);
    res.status(500).json({ error: error.message || "Failed to check drug interactions" });
  }
};

// Digital Twin Analysis
export const analyzeDigitalTwin = async (req: Request, res: Response) => {
  try {
    const { profileData } = req.body;

    if (!profileData) {
      res.status(400).json({ error: "Profile data is required" });
      return;
    }

    const prompt = `Analyze the following health profile data and provide a digital twin analysis. Return JSON with: healthScore (0-100), risks (array of risk factors), actions (recommended health actions), and plan (long-term health plan):\n\n${JSON.stringify(profileData)}`;

    const responseText = await callGroq(prompt, "You are a health analytics AI. Always respond with valid JSON.");
    res.json({ response: responseText });
  } catch (error: any) {
    console.error("Digital Twin Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze digital twin" });
  }
};

// Fact Check Medical Claims
export const verifyMedicalClaims = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    const prompt = `Fact check the following medical/health claim. Provide accurate information and cite reliable sources if possible:\n\nClaim: ${query}`;

    const responseText = await callGroq(prompt);
    res.json({ response: responseText });
  } catch (error: any) {
    console.error("Fact Check Error:", error);
    res.status(500).json({ error: error.message || "Failed to verify claim" });
  }
};

