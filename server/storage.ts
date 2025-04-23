import { 
  users, User, InsertUser,
  cases, Case, InsertCase,
  caseEvents, CaseEvent, InsertCaseEvent,
  consultations, Consultation, InsertConsultation,
  legalNews, LegalNews, InsertLegalNews,
  chatConversations, ChatConversation, InsertChatConversation,
  chatMessages, ChatMessage, InsertChatMessage,
  lawData, LawData, InsertLawData,
  payments, Payment, InsertPayment
} from "@shared/schema";
import fetch from "node-fetch";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  getLawyers(): Promise<User[]>;
  getFilteredLawyers(filters: LawyerFilters): Promise<User[]>;

  // Case methods
  getCase(id: number): Promise<Case | undefined>;
  getCaseByNumber(caseNumber: string): Promise<Case | undefined>;
  getCasesByClientId(clientId: number): Promise<Case[]>;
  getCasesByLawyerId(lawyerId: number): Promise<Case[]>;
  createCase(caseData: InsertCase): Promise<Case>;
  updateCase(id: number, caseData: Partial<Case>): Promise<Case | undefined>;

  // Case Events methods
  getCaseEvents(caseId: number): Promise<CaseEvent[]>;
  createCaseEvent(event: InsertCaseEvent): Promise<CaseEvent>;

  // Consultations methods
  getConsultation(id: number): Promise<Consultation | undefined>;
  getConsultationsByClientId(clientId: number): Promise<Consultation[]>;
  getConsultationsByLawyerId(lawyerId: number): Promise<Consultation[]>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  updateConsultation(id: number, data: Partial<Consultation>): Promise<Consultation | undefined>;

  // Legal News methods
  getLegalNews(): Promise<LegalNews[]>;
  getLegalNewsByCategory(category: string): Promise<LegalNews[]>;
  createLegalNews(news: InsertLegalNews): Promise<LegalNews>;

  // Chat Conversations methods
  getChatConversations(userId: number): Promise<ChatConversation[]>;
  getChatConversation(id: number): Promise<ChatConversation | undefined>;
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;

  // Chat Messages methods
  getChatMessages(conversationId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Law Data methods
  getLawData(code: string): Promise<LawData | undefined>;
  searchLawData(query: string): Promise<LawData[]>;
  createLawData(law: InsertLawData): Promise<LawData>;

  // Payment methods
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentsByClientId(clientId: number): Promise<Payment[]>;
  getPaymentsByLawyerId(lawyerId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, data: Partial<Payment>): Promise<Payment | undefined>;
}

// Lawyer filter type
export interface LawyerFilters {
  specialization?: string;
  experience?: number;
  availability?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cases: Map<number, Case>;
  private caseEvents: Map<number, CaseEvent>;
  private consultations: Map<number, Consultation>;
  private legalNews: Map<number, LegalNews>;
  private chatConversations: Map<number, ChatConversation>;
  private chatMessages: Map<number, ChatMessage>;
  private lawData: Map<number, LawData>;
  private payments: Map<number, Payment>;
  
  private currentIds: {
    users: number;
    cases: number;
    caseEvents: number;
    consultations: number;
    legalNews: number;
    chatConversations: number;
    chatMessages: number;
    lawData: number;
    payments: number;
  };

  constructor() {
    this.users = new Map();
    this.cases = new Map();
    this.caseEvents = new Map();
    this.consultations = new Map();
    this.legalNews = new Map();
    this.chatConversations = new Map();
    this.chatMessages = new Map();
    this.lawData = new Map();
    this.payments = new Map();
    
    this.currentIds = {
      users: 1,
      cases: 1,
      caseEvents: 1,
      consultations: 1,
      legalNews: 1,
      chatConversations: 1,
      chatMessages: 1,
      lawData: 1,
      payments: 1
    };
    
    // Initialize with sample legal news and law data
    this.initSampleData();
  }

  private initSampleData() {
    // Sample Legal News
    const newsItems: InsertLegalNews[] = [
      {
        title: "Supreme Court Issues Landmark Ruling on Digital Privacy Rights",
        content: "The Supreme Court issued a 7-2 decision expanding Fourth Amendment protections to include digital communications and cloud storage.",
        category: "Constitutional Law",
        imageUrl: "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        sourceUrl: "https://example.com/news/1",
        publishDate: new Date()
      },
      {
        title: "New Legislation Introduces AI Regulations for Legal Sector",
        content: "Parliament approves new regulations governing the use of artificial intelligence in legal proceedings and advisory services.",
        category: "Legal Tech",
        imageUrl: "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        sourceUrl: "https://example.com/news/2",
        publishDate: new Date()
      },
      {
        title: "Criminal Procedure Amendment Bill Passes Final Reading",
        content: "Significant changes to criminal procedure including remote hearings and digital evidence standards will take effect next month.",
        category: "Criminal Law",
        imageUrl: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        sourceUrl: "https://example.com/news/3",
        publishDate: new Date()
      }
    ];
    
    newsItems.forEach(news => this.createLegalNews(news));
    
    // Sample Law Data for IPC sections
    const lawItems: InsertLawData[] = [
      {
        code: "IPC302",
        section: "302",
        category: "Criminal Law",
        title: "Punishment for murder",
        description: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
        punishment: "Death or imprisonment for life, and fine"
      },
      {
        code: "IPC304",
        section: "304",
        category: "Criminal Law",
        title: "Punishment for culpable homicide not amounting to murder",
        description: "Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life, or imprisonment for a term which may extend to 10 years, and shall also be liable to fine.",
        punishment: "Imprisonment for life, or up to 10 years, and fine"
      }
    ];
    
    lawItems.forEach(law => this.createLawData(law));
    
    // Sample lawyers
    const lawyers: InsertUser[] = [
      {
        username: "davidwilson",
        password: "hashed_password", // In a real app, this would be properly hashed
        email: "david.wilson@example.com",
        fullName: "David Wilson",
        role: "lawyer",
        phoneNumber: "+1234567890",
        specialization: "Criminal Law",
        experience: 12,
        ratePerHour: 150,
        profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        bio: "Specializing in criminal defense with 12+ years of experience handling complex cases. Former prosecutor with deep understanding of both sides of criminal proceedings."
      },
      {
        username: "sarahchen",
        password: "hashed_password", // In a real app, this would be properly hashed
        email: "sarah.chen@example.com",
        fullName: "Sarah Chen",
        role: "lawyer",
        phoneNumber: "+1987654321",
        specialization: "Family Law",
        experience: 15,
        ratePerHour: 180,
        profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        bio: "Compassionate family law attorney with 15+ years of experience. Specialized in divorce settlements and child custody arrangements with a focus on collaborative solutions."
      }
    ];
    
    lawyers.forEach(lawyer => this.createUser(lawyer));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { 
      ...userData, 
      id, 
      createdAt: new Date(), 
      isVerified: false, 
      role: userData.role || "user", // Provide a default value for role
      phoneNumber: userData.phoneNumber ?? null, // Ensure phoneNumber is either string or null
      specialization: userData.specialization ?? null, // Ensure specialization is either string or null
      experience: userData.experience ?? null, // Ensure experience is either number or null
      ratePerHour: userData.ratePerHour ?? null, // Ensure ratePerHour is either number or null
      profileImage: userData.profileImage ?? null, // Ensure profileImage is either string or null
      bio: userData.bio ?? null // Ensure bio is either string or null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getLawyers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === "lawyer"
    );
  }
  
  async getFilteredLawyers(filters: LawyerFilters): Promise<User[]> {
    let lawyers = await this.getLawyers();
    
    if (filters.specialization) {
      lawyers = lawyers.filter(lawyer => lawyer.specialization === filters.specialization);
    }
    
    if (filters.experience) {
      lawyers = lawyers.filter(lawyer => (lawyer.experience || 0) >= filters.experience!);
    }
    
    if (filters.priceRange) {
      lawyers = lawyers.filter(lawyer => 
        (lawyer.ratePerHour || 0) >= filters.priceRange!.min && 
        (lawyer.ratePerHour || 0) <= filters.priceRange!.max
      );
    }
    
    return lawyers;
  }

  // Case methods
  async getCase(id: number): Promise<Case | undefined> {
    return this.cases.get(id);
  }
  
  async getCaseByNumber(caseNumber: string): Promise<Case | undefined> {
    return Array.from(this.cases.values()).find(
      (caseItem) => caseItem.caseNumber === caseNumber
    );
  }
  
  async getCasesByClientId(clientId: number): Promise<Case[]> {
    return Array.from(this.cases.values()).filter(
      (caseItem) => caseItem.clientId === clientId
    );
  }
  
  async getCasesByLawyerId(lawyerId: number): Promise<Case[]> {
    return Array.from(this.cases.values()).filter(
      (caseItem) => caseItem.lawyerId === lawyerId
    );
  }
  
  async createCase(caseData: InsertCase): Promise<Case> {
    const id = this.currentIds.cases++;
    const newCase: Case = { 
      ...caseData, 
      id, 
      createdAt: new Date(), 
      status: caseData.status || "Pending", 
      description: caseData.description ?? null,
      lawyerId: caseData.lawyerId ?? null,
      court: caseData.court ?? null,
      judge: caseData.judge ?? null
    };
    this.cases.set(id, newCase);
    return newCase;
  }
  
  async updateCase(id: number, caseData: Partial<Case>): Promise<Case | undefined> {
    const caseItem = this.cases.get(id);
    if (!caseItem) return undefined;
    
    const updatedCase = { ...caseItem, ...caseData };
    this.cases.set(id, updatedCase);
    return updatedCase;
  }

  // Case Events methods
  async getCaseEvents(caseId: number): Promise<CaseEvent[]> {
    return Array.from(this.caseEvents.values()).filter(
      (event) => event.caseId === caseId
    );
  }
  
  async createCaseEvent(eventData: InsertCaseEvent): Promise<CaseEvent> {
    const id = this.currentIds.caseEvents++;
    const event: CaseEvent = { 
      ...eventData, 
      id, 
      createdAt: new Date(), 
      description: eventData.description ?? null 
    };
    this.caseEvents.set(id, event);
    return event;
  }

  // Consultations methods
  async getConsultation(id: number): Promise<Consultation | undefined> {
    return this.consultations.get(id);
  }
  
  async getConsultationsByClientId(clientId: number): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      (consultation) => consultation.clientId === clientId
    );
  }
  
  async getConsultationsByLawyerId(lawyerId: number): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      (consultation) => consultation.lawyerId === lawyerId
    );
  }
  
  async createConsultation(consultationData: InsertConsultation): Promise<Consultation> {
    const id = this.currentIds.consultations++;
    const consultation: Consultation = { 
      ...consultationData, 
      id, 
      createdAt: new Date(), 
      status: consultationData.status || "Pending", // Provide a default value for status
      notes: consultationData.notes ?? null, // Ensure notes is explicitly null if undefined
      meetingLink: consultationData.meetingLink ?? null // Ensure meetingLink is explicitly null if undefined
    };
    this.consultations.set(id, consultation);
    return consultation;
  }
  
  async updateConsultation(id: number, data: Partial<Consultation>): Promise<Consultation | undefined> {
    const consultation = this.consultations.get(id);
    if (!consultation) return undefined;
    
    const updatedConsultation = { ...consultation, ...data };
    this.consultations.set(id, updatedConsultation);
    return updatedConsultation;
  }

  // Legal News methods
  async getLegalNews(): Promise<LegalNews[]> {
    return Array.from(this.legalNews.values()).sort(
      (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
    );
  }

  async getLegalNewsByCategory(category: string): Promise<LegalNews[]> {
    return Array.from(this.legalNews.values())
      .filter((news) => news.category === category)
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }
  
  async createLegalNews(newsData: InsertLegalNews): Promise<LegalNews> {
    const id = this.currentIds.legalNews++;
    const news: LegalNews = { 
      ...newsData, 
      id, 
      createdAt: new Date(), 
      imageUrl: newsData.imageUrl ?? null, 
      sourceUrl: newsData.sourceUrl ?? null 
    };
    this.legalNews.set(id, news);
    return news;
  }

  // Chat Conversations methods
  async getChatConversations(userId: number): Promise<ChatConversation[]> {
    return Array.from(this.chatConversations.values())
      .filter((conv) => conv.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  
  async getChatConversation(id: number): Promise<ChatConversation | undefined> {
    return this.chatConversations.get(id);
  }
  
  async createChatConversation(conversationData: InsertChatConversation): Promise<ChatConversation> {
    const id = this.currentIds.chatConversations++;
    const conversation: ChatConversation = { ...conversationData, id, createdAt: new Date() };
    this.chatConversations.set(id, conversation);
    return conversation;
  }

  // Chat Messages methods
  async getChatMessages(conversationId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((msg) => msg.conversationId === conversationId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }
  
  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentIds.chatMessages++;
    const message: ChatMessage = { ...messageData, id, createdAt: new Date() };
    this.chatMessages.set(id, message);
    return message;
  }

  // Law Data methods
  async getLawData(code: string): Promise<LawData | undefined> {
    return Array.from(this.lawData.values()).find(
      (law) => law.code === code
    );
  }
  
  async searchLawData(query: string): Promise<LawData[]> {
    query = query.toLowerCase();
    return Array.from(this.lawData.values()).filter(
      (law) => 
        law.code.toLowerCase().includes(query) ||
        law.section.toLowerCase().includes(query) ||
        law.title.toLowerCase().includes(query) ||
        law.description.toLowerCase().includes(query)
    );
  }
  
  async createLawData(lawData: InsertLawData): Promise<LawData> {
    const id = this.currentIds.lawData++;
    const law: LawData = { ...lawData, id, createdAt: new Date(), punishment: lawData.punishment ?? null };
    this.lawData.set(id, law);
    return law;
  }

  // Payment methods
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }
  
  async getPaymentsByClientId(clientId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.clientId === clientId
    );
  }
  
  async getPaymentsByLawyerId(lawyerId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.lawyerId === lawyerId
    );
  }
  
  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const id = this.currentIds.payments++;
    const payment: Payment = { 
      ...paymentData, 
      id, 
      createdAt: new Date(), 
      status: paymentData.status || "Pending", // Provide a default value for status
      consultationId: paymentData.consultationId ?? null, // Ensure consultationId is explicitly null if undefined
      paymentMethod: paymentData.paymentMethod ?? null, // Ensure paymentMethod is explicitly null if undefined
      transactionId: paymentData.transactionId ?? null // Ensure transactionId is explicitly null if undefined
    };
    this.payments.set(id, payment);
    return payment;
  }
  
  async updatePayment(id: number, data: Partial<Payment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment = { ...payment, ...data };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
}

export const storage = new MemStorage();
