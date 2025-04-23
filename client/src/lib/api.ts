import { apiRequest } from "./queryClient";

// User Authentication API
export const authAPI = {
  register: async (userData: any) => {
    const res = await apiRequest("POST", "/api/auth/register", userData);
    return res.json();
  },
  
  login: async (credentials: { username: string; password: string }) => {
    const res = await apiRequest("POST", "/api/auth/login", credentials);
    return res.json();
  },
  
  logout: async () => {
    const res = await apiRequest("POST", "/api/auth/logout", {});
    return res.json();
  },
  
  getUser: async (id: number) => {
    const res = await apiRequest("GET", `/api/user/${id}`, undefined);
    return res.json();
  }
};

// Lawyers API
export const lawyersAPI = {
  getLawyers: async (filters?: any) => {
    let url = '/api/lawyers';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.specialization) params.append('specialization', filters.specialization);
      if (filters.experience) params.append('experience', filters.experience.toString());
      if (filters.priceRange) {
        params.append('minPrice', filters.priceRange.min.toString());
        params.append('maxPrice', filters.priceRange.max.toString());
      }
      url += `?${params.toString()}`;
    }
    
    const res = await apiRequest("GET", url, undefined);
    return res.json();
  }
};

// Case Tracking API
export const caseAPI = {
  getCaseByNumber: async (caseNumber: string) => {
    const res = await apiRequest("GET", `/api/cases/${caseNumber}`, undefined);
    return res.json();
  },
  
  getUserCases: async (userId: number, role: 'client' | 'lawyer') => {
    const param = role === 'client' ? 'clientId' : 'lawyerId';
    const res = await apiRequest("GET", `/api/cases?${param}=${userId}`, undefined);
    return res.json();
  },
  
  createCase: async (caseData: any) => {
    const res = await apiRequest("POST", "/api/cases", caseData);
    return res.json();
  },
  
  getCaseEvents: async (caseId: number) => {
    const res = await apiRequest("GET", `/api/cases/${caseId}/events`, undefined);
    return res.json();
  },
  
  createCaseEvent: async (caseId: number, eventData: any) => {
    const res = await apiRequest("POST", `/api/cases/${caseId}/events`, eventData);
    return res.json();
  }
};

// Consultations API
export const consultationsAPI = {
  getUserConsultations: async (userId: number, role: 'client' | 'lawyer') => {
    const param = role === 'client' ? 'clientId' : 'lawyerId';
    const res = await apiRequest("GET", `/api/consultations?${param}=${userId}`, undefined);
    return res.json();
  },
  
  createConsultation: async (consultationData: any) => {
    const res = await apiRequest("POST", "/api/consultations", consultationData);
    return res.json();
  }
};

// Legal News API
export const newsAPI = {
  getLegalNews: async (category?: string) => {
    let url = '/api/legal-news';
    if (category) url += `?category=${category}`;
    
    const res = await apiRequest("GET", url, undefined);
    return res.json();
  }
};

// Legal AI Chat API
export const chatAPI = {
  // Quick chat without conversation history
  sendMessage: async (message: string) => {
    const res = await apiRequest("POST", "/api/chat/ai", { message });
    return res.json();
  },
  
  // Conversations for full chat history
  getConversations: async (userId: number) => {
    const res = await apiRequest("GET", `/api/chat/conversations?userId=${userId}`, undefined);
    return res.json();
  },
  
  createConversation: async (userData: { userId: number; title: string }) => {
    const res = await apiRequest("POST", "/api/chat/conversations", userData);
    return res.json();
  },
  
  getMessages: async (conversationId: number) => {
    const res = await apiRequest("GET", `/api/chat/conversations/${conversationId}/messages`, undefined);
    return res.json();
  },
  
  sendConversationMessage: async (conversationId: number, content: string) => {
    const res = await apiRequest("POST", `/api/chat/conversations/${conversationId}/messages`, {
      sender: 'user',
      content
    });
    return res.json();
  }
};

// Law Data API
export const lawAPI = {
  getLawByCode: async (code: string) => {
    const res = await apiRequest("GET", `/api/law-data/${code}`, undefined);
    return res.json();
  },
  
  searchLaws: async (query: string) => {
    const res = await apiRequest("GET", `/api/law-data/search?q=${query}`, undefined);
    return res.json();
  }
};

// Payments API
export const paymentsAPI = {
  createPayment: async (paymentData: any) => {
    const res = await apiRequest("POST", "/api/payments", paymentData);
    return res.json();
  },
  
  getUserPayments: async (userId: number, role: 'client' | 'lawyer') => {
    const param = role === 'client' ? 'clientId' : 'lawyerId';
    const res = await apiRequest("GET", `/api/payments?${param}=${userId}`, undefined);
    return res.json();
  }
};
