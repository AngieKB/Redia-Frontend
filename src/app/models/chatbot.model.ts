export interface ChatbotMessage {
  id: string;
  type: 'user' | 'bot' | 'agent';
  content: string;
  timestamp: Date;
  rating?: 'positive' | 'negative' | null;
  faqId?: string;
}

export interface ChatbotFAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  relatedQuestions?: string[];
}

export interface ChatbotSession {
  id: string;
  messages: ChatbotMessage[];
  startedAt: Date;
  escalatedToAgent: boolean;
  agentAssignedAt?: Date;
}

export interface ChatbotResponse {
  success: boolean;
  data?: any;
  message?: string;
  escalateToAgent?: boolean;
}
