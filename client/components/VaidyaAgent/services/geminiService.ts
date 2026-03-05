// Groq API endpoint (server-side proxy)
const GROQ_API_BASE = '/api/groq';

/**
 * Feature (A): Multimodal Diagnosis + Radiology Report + Triage
 * Uses server-side Groq API
 */
export const analyzeMedicalCase = async (
  symptoms: string,
  imageFile?: File,
  audioBlob?: Blob,
  language: string = 'English',
  onUpdate?: (text: string) => void
): Promise<string> => {
  try {
    // Use server-side Groq API
    const response = await fetch(`${GROQ_API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptoms: symptoms,
        language: language,
        imageFile: imageFile ? true : undefined
      })
    });

    if (!response.ok) {
      // Try to parse error as JSON, fallback to text
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error("Diagnosis Error:", error);
    throw new Error(`Failed to analyze the case: ${error.message}`);
  }
};

/**
 * Chat Feature - Uses server-side Groq API to avoid CORS issues
 */
export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  mode: 'support' | 'clinical_agent' = 'support'
): Promise<string> => {
  try {
    // Use server-side API to avoid CORS
    const response = await fetch(`${GROQ_API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: newMessage,
        history: history,
        mode: mode
      })
    });

    if (!response.ok) {
      // Try to parse error as JSON, fallback to text
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error("Chat Error:", error);
    throw new Error(`Connection error: ${error.message}`);
  }
};

/**
 * Doctor Recommendation - Uses server-side Groq API
 */
export const getDoctorRecommendation = async (symptoms: string, riskFactors: string): Promise<string> => {
  try {
    const response = await fetch(`${GROQ_API_BASE}/doctor-recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptoms,
        riskFactors
      })
    });

    if (!response.ok) {
      // Try to parse error as JSON, fallback to text
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error("Doctor Recommendation Error:", error);
    throw new Error(`Failed to get recommendation: ${error.message}`);
  }
};

/**
 * Summarize Medical Report - Uses server-side Groq API
 */
export const summarizeMedicalReport = async (file: File): Promise<string> => {
  try {
    // Convert file to text (basic approach - for OCR would need server-side handling)
    const text = await file.text();
    
    const response = await fetch(`${GROQ_API_BASE}/summarize-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reportText: text
      })
    });

    if (!response.ok) {
      // Try to parse error as JSON, fallback to text
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error("Report Summary Error:", error);
    throw new Error(`Failed to summarize report: ${error.message}`);
  }
};

/**
 * Check Drug Interactions - Uses server-side Groq API
 */
export const checkDrugInteractions = async (medList: string, imageFile?: File): Promise<string> => {
  try {
    const response = await fetch(`${GROQ_API_BASE}/drug-interactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        medications: medList
      })
    });

    if (!response.ok) {
      // Try to parse error as JSON, fallback to text
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error("Drug Interactions Error:", error);
    throw new Error(`Failed to check interactions: ${error.message}`);
  }
};

/**
 * Analyze Digital Twin - Uses server-side Groq API
 */
export const analyzeDigitalTwin = async (profileData: any): Promise<any> => {
  try {
    const response = await fetch(`${GROQ_API_BASE}/digital-twin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileData
      })
    });

    if (!response.ok) {
      // Try to parse error as JSON, fallback to text
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }
    }

    const data = await response.json();
    // Try to parse JSON response
    try {
      return JSON.parse(data.response);
    } catch {
      return { healthScore: 0, risks: [], actions: [], plan: data.response };
    }
  } catch (error: any) {
    console.error("Digital Twin Error:", error);
    throw new Error(`Failed to analyze digital twin: ${error.message}`);
  }
};

/**
 * Verify Medical Claims - Uses server-side Groq API
 */
export const verifyMedicalClaims = async (query: string): Promise<string> => {
  try {
    const response = await fetch(`${GROQ_API_BASE}/fact-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query
      })
    });

    if (!response.ok) {
      // Try to parse error as JSON, fallback to text
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error("Fact Check Error:", error);
    throw new Error(`Failed to verify claim: ${error.message}`);
  }
};

