export type View = 'chat' | 'diagnosis' | 'recommendation' | 'report' | 'medication' | 'digital-twin' | 'fact-check' | 'thumbnail';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export interface SpecialistRecommendation {
  specialist: string;
  reasoning: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  tips: string[];
}

export interface DiagnosisResult {
  analysis: string;
  disclaimer: string;
}

export interface ReportSummary {
  summary: string;
  keyFindings: string[];
  actionItems: string[];
}