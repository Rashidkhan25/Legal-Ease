export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// This service simulates an AI chat service
// In a real application, this would be replaced with actual AI API calls
export class ChatService {
  // Legal knowledge base
  private static legalKnowledge: Record<string, string> = {
    "ipc section 302": "IPC Section 302 deals with punishment for murder. It states that whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
    "ipc section 304": "IPC Section 304 deals with punishment for culpable homicide not amounting to murder. The punishment is imprisonment for life, or imprisonment for a term which may extend to 10 years, and fine.",
    "criminal trial": "The main stages of a criminal trial are: (1) Filing of charge sheet, (2) Framing of charges, (3) Evidence by prosecution, (4) Statement of accused, (5) Defense evidence, (6) Final arguments, (7) Judgment.",
    "bail application": "For a bail application, you typically need: (1) Bail application form, (2) Copy of FIR/complaint, (3) Copy of arrest memo, (4) Medical reports (if applicable), (5) Any previous court orders related to the case.",
    "divorce process": "The divorce process typically takes 6-18 months depending on whether it's contested or mutual consent. For mutual consent divorce, there's a 6-month mandatory cooling period after filing the petition before the final decree.",
    "legal aid": "Legal aid is free legal assistance provided to those who cannot afford legal representation. To avail it, you can approach the Legal Services Authority at district, state, or national level.",
    "writ petition": "A writ petition is a written document filed in court for a quick remedy against violation of fundamental rights or legal rights. Types include Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo Warranto."
  };

  // Process a user message and generate a response
  static async processMessage(message: string): Promise<string> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const query = message.toLowerCase();
    
    // Check for direct matches in knowledge base
    for (const key in this.legalKnowledge) {
      if (query.includes(key)) {
        return this.legalKnowledge[key];
      }
    }
    
    // Handle specific query types
    if (query.includes("ipc") || query.includes("section")) {
      return "I can provide information about specific IPC sections. Please specify the section number, for example 'What is IPC Section 302?'";
    }
    
    if (query.includes("lawyer") || query.includes("attorney") || query.includes("counsel")) {
      return "You can find and connect with qualified lawyers through our 'Find a Lawyer' service. Would you like me to guide you there?";
    }
    
    if (query.includes("case") || query.includes("hearing") || query.includes("court date")) {
      return "To track your case and get updates on hearing dates, please use our Case Tracking feature. You'll need your case number to access this information.";
    }
    
    // Default response for unknown queries
    return "I understand you have a legal question. For the most accurate information, could you please be more specific about what legal topic or section you'd like to know about?";
  }

  // Process a conversation history and generate a response
  static async processChatConversation(messages: ChatMessage[]): Promise<string> {
    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    
    if (!lastUserMessage) {
      return "Hello! I'm your AI legal assistant. How can I help you today?";
    }
    
    return this.processMessage(lastUserMessage.content);
  }
}
