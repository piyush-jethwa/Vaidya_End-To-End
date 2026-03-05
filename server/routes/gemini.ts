import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";

const getApiKey = (): string => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return apiKey;
};

const genAI = new GoogleGenerativeAI(getApiKey());
const MODEL_CHAT = 'gemini-1.5-pro';

export const sendChatMessage = async (req: Request, res: Response) => {
  try {
    const { message, history, mode } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    let systemInstruction = "";
    if (mode === 'clinical_agent') {
      systemInstruction = `
        You are Vaidya AI, a fully **Autonomous Clinical Agent**.
        Goal: Autonomously drive clinical workflow.
        Status Tags: [STATUS: INTERVIEWING], [STATUS: ANALYZING], [STATUS: IMAGING_REQ], [STATUS: REPORT_READY], [STATUS: EMERGENCY].
      `;
    } else {
      systemInstruction = "You are Vaidya AI, an emotion-aware health assistant. Start response with [STATUS: SUPPORT].";
    }

    const model = genAI.getGenerativeModel({ 
      model: MODEL_CHAT,
      systemInstruction 
    });

    // Convert history to proper format
    const chatHistory = (history || [])
      .filter((msg: any) => msg.role === 'user' || msg.role === 'model')
      .map((msg: any) => ({
        role: msg.role,
        parts: msg.parts
      }));

    // If the first message is from 'model', add a dummy user message
    const finalHistory = chatHistory.length > 0 && chatHistory[0].role === 'model' 
      ? [{ role: 'user', parts: [{ text: 'Hello' }] }, ...chatHistory]
      : chatHistory;

    const chat = model.startChat({
      history: finalHistory
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to get response from AI" 
    });
  }
};

export const analyzeMedicalCase = async (req: Request, res: Response) => {
  try {
    const { symptoms, imageBase64, language } = req.body;

    if (!symptoms) {
      res.status(400).json({ error: "Symptoms are required" });
      return;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    let promptText = `
      You are Vaidya AI, an elite Autonomous Clinical Agent and expert Radiologist.
      
      Task: Analyze the provided inputs (images, symptoms).
      Output Language: ${language || 'English'}
      
      Please provide the output in the following STRUCTURED FORMAT (Markdown):
      
      1. **Triage Level**: [Green (Mild) | Yellow (Moderate) | Orange (Serious) | Red (Emergency)] - Explain why.
      2. **Clinical Analysis**:
         - **Findings**: Detailed observations.
         - **Impression**: Primary diagnostic impression.
      3. **Potential Conditions**: List differential diagnoses.
      4. **Recommendations**: Next steps (tests, specialist, home care).
      5. **Disclaimer**: Standard AI medical disclaimer.
      
      Symptoms/Description: ${symptoms}
    `;

    const parts: any[] = [{ text: promptText }];

    if (imageBase64) {
      parts.unshift({
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg'
        }
      });
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.3,
      }
    });

    const responseText = result.response.text();
    res.json({ response: responseText });
  } catch (error: any) {
    console.error("Medical Analysis Error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to analyze medical case" 
    });
  }
};

