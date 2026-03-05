import { GoogleGenAI } from "@google/genai";

// Safe API Key retrieval that works in browser environments avoiding process crash
const getApiKey = (): string => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || "";
    }
    return "";
  } catch (e) {
    console.warn("API Key environment check failed");
    return "";
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

// Gemini 3 Pro Models
const MODEL_VISION = 'gemini-3-pro-preview'; 
const MODEL_REASONING = 'gemini-3-pro-preview';
const MODEL_CHAT = 'gemini-3-pro-preview';

/**
 * Helper: Convert File to Base64
 */
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Feature (A): Multimodal Diagnosis + Radiology Report + Triage
 */
export const analyzeMedicalCase = async (
  symptoms: string,
  imageFile?: File,
  audioBlob?: Blob,
  language: string = 'English',
  onUpdate?: (text: string) => void
): Promise<string> => {
  const parts: any[] = [];

  // Highly structured prompt for competition-grade output
  let promptText = `
    You are Vaidya AI, an elite Autonomous Clinical Agent and expert Radiologist.
    
    Task: Analyze the provided inputs (images, symptoms, audio).
    Output Language: ${language}
    
    Please provide the output in the following STRUCTURED FORMAT (Markdown):
    
    1. **Triage Level**: [Green (Mild) | Yellow (Moderate) | Orange (Serious) | Red (Emergency)] - Explain why.
    2. **Clinical Analysis / Radiology Report**:
       - **Modality**: (e.g., X-Ray, MRI, Clinical Symptom Analysis)
       - **Findings**: Detailed observations.
       - **Impression**: Primary diagnostic impression.
    3. **Potential Conditions**: List differential diagnoses.
    4. **Medical Coding**: Suggest likely ICD-10 or SNOMED codes.
    5. **Recommendations**: Next steps (tests, specialist, home care).
    6. **Disclaimer**: Standard AI medical disclaimer.
    
    Be extremely precise with medical terminology.
    
    Symptoms/Description: ${symptoms}
  `;

  if (imageFile) {
    const imagePart = await fileToGenerativePart(imageFile);
    parts.push(imagePart);
    promptText += "\n[Medical Image attached for Radiology Analysis]";
  }

  if (audioBlob) {
    const audioFile = new File([audioBlob], "audio.webm", { type: "audio/webm" });
    const audioPart = await fileToGenerativePart(audioFile);
    parts.push(audioPart);
    promptText += "\n[Audio description attached]";
  }

  parts.push({ text: promptText });

  try {
    const result = await ai.models.generateContentStream({
      model: MODEL_VISION,
      contents: { parts },
      config: {
        temperature: 0.3,
      }
    });

    let fullText = "";
    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        if (onUpdate) onUpdate(fullText);
      }
    }
    return fullText;
  } catch (error) {
    console.error("Diagnosis Error:", error);
    throw new Error("Failed to analyze the case.");
  }
};

/**
 * Chat Feature
 */
export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  mode: 'support' | 'clinical_agent' = 'support'
): Promise<string> => {
  try {
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

    const chat = ai.chats.create({
      model: MODEL_CHAT,
      config: { systemInstruction },
      history: history,
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "";
  } catch (error) {
    console.error("Chat Error:", error);
    throw new Error("Connection error.");
  }
};

export const getDoctorRecommendation = async (symptoms: string, riskFactors: string): Promise<string> => {
  try {
    const prompt = `Patient Symptoms: ${symptoms}\nRisk Factors: ${riskFactors}\nRecommend specialist, reasoning, urgency.`;
    const response = await ai.models.generateContent({ model: MODEL_REASONING, contents: prompt });
    return response.text || "Error.";
  } catch (e) { return "Error."; }
};

export const summarizeMedicalReport = async (file: File): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: MODEL_VISION,
      contents: { parts: [imagePart, { text: "OCR this medical report, summarize findings, and audit for errors." }] }
    });
    return response.text || "Error.";
  } catch (e) { return "Error."; }
};

export const checkDrugInteractions = async (medList: string, imageFile?: File): Promise<string> => {
  const parts: any[] = [];
  let prompt = `Analyze medications: ${medList}. Check interactions/contraindications.`;
  if (imageFile) {
    parts.push(await fileToGenerativePart(imageFile));
    prompt += " [Image attached]";
  }
  parts.push({ text: prompt });
  try {
    const response = await ai.models.generateContent({ model: MODEL_VISION, contents: { parts } });
    return response.text || "Analysis failed.";
  } catch (e) { throw e; }
};

export const analyzeDigitalTwin = async (profileData: any): Promise<any> => {
  try {
    const prompt = `Digital Twin Analysis: ${JSON.stringify(profileData)}. Return JSON {healthScore, risks, actions, plan}.`;
    const response = await ai.models.generateContent({
      model: MODEL_REASONING,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) { throw new Error("Prediction failed."); }
};

export const verifyMedicalClaims = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: `Fact check: ${query}`,
      config: { tools: [{ googleSearch: {} }] }
    });
    let text = response.text || "Could not verify.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      text += "\n\n**Sources:**\n" + chunks.map((c: any) => c.web?.uri ? `- [${c.web.title}](${c.web.uri})` : '').join('\n');
    }
    return text;
  } catch (e) { return "Verification failed."; }
};