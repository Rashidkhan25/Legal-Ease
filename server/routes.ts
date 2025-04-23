import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer, WebSocket } from "ws";
import { LegalApiService } from "./services/legalApi";
import { ChatService } from "./services/chatService";
import { z } from "zod";
import Stripe from "stripe";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing Stripe Secret Key - Stripe payments will not work');
}
const stripe = process.env.STRIPE_SECRET_KEY ? 
  new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any }) : 
  null;
import {
  insertUserSchema,
  insertCaseSchema,
  insertCaseEventSchema,
  insertConsultationSchema,
  insertChatConversationSchema,
  insertChatMessageSchema,
  insertPaymentSchema
} from "@shared/schema";

// Session types
interface UserSession {
  userId: number;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserSession;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup WebSocket server for chat and conferences
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  setupWebSockets(wss);
  
  // Authentication Routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      
      // Create new user
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) { // In real app, use proper password comparison
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Create user session
      const userSession: UserSession = {
        userId: user.id,
        username: user.username,
        role: user.role
      };
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        user: userWithoutPassword,
        session: userSession
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    return res.status(200).json({ message: 'Logged out successfully' });
  });
  
  // User Routes
  app.get('/api/user/:id', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Lawyer Routes
  app.get('/api/lawyers', async (req: Request, res: Response) => {
    try {
      const specialization = req.query.specialization as string | undefined;
      const experienceStr = req.query.experience as string | undefined;
      const minPriceStr = req.query.minPrice as string | undefined;
      const maxPriceStr = req.query.maxPrice as string | undefined;
      
      const filters: any = {};
      
      if (specialization) {
        filters.specialization = specialization;
      }
      
      if (experienceStr) {
        filters.experience = parseInt(experienceStr);
      }
      
      if (minPriceStr && maxPriceStr) {
        filters.priceRange = {
          min: parseInt(minPriceStr),
          max: parseInt(maxPriceStr)
        };
      }
      
      const lawyers = await storage.getFilteredLawyers(filters);
      
      // Remove passwords from response
      const lawyersWithoutPasswords = lawyers.map(lawyer => {
        const { password, ...lawyerWithoutPassword } = lawyer;
        return lawyerWithoutPassword;
      });
      
      return res.status(200).json(lawyersWithoutPasswords);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Case Routes
  app.get('/api/cases', async (req: Request, res: Response) => {
    try {
      const clientIdStr = req.query.clientId as string | undefined;
      const lawyerIdStr = req.query.lawyerId as string | undefined;
      
      let cases = [];
      
      if (clientIdStr) {
        const clientId = parseInt(clientIdStr);
        cases = await storage.getCasesByClientId(clientId);
      } else if (lawyerIdStr) {
        const lawyerId = parseInt(lawyerIdStr);
        cases = await storage.getCasesByLawyerId(lawyerId);
      } else {
        return res.status(400).json({ message: 'Either clientId or lawyerId must be provided' });
      }
      
      return res.status(200).json(cases);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/api/cases/:caseNumber', async (req: Request, res: Response) => {
    try {
      const caseNumber = req.params.caseNumber;
      const caseData = await storage.getCaseByNumber(caseNumber);
      
      if (!caseData) {
        return res.status(404).json({ message: 'Case not found' });
      }
      
      // Get case events for the timeline
      const events = await storage.getCaseEvents(caseData.id);
      
      return res.status(200).json({
        ...caseData,
        events
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/cases', async (req: Request, res: Response) => {
    try {
      const caseData = insertCaseSchema.parse(req.body);
      const newCase = await storage.createCase(caseData);
      
      return res.status(201).json(newCase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Case Events Routes
  app.get('/api/cases/:caseId/events', async (req: Request, res: Response) => {
    try {
      const caseId = parseInt(req.params.caseId);
      const events = await storage.getCaseEvents(caseId);
      
      return res.status(200).json(events);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/cases/:caseId/events', async (req: Request, res: Response) => {
    try {
      const caseId = parseInt(req.params.caseId);
      const eventData = insertCaseEventSchema.parse({
        ...req.body,
        caseId
      });
      
      const newEvent = await storage.createCaseEvent(eventData);
      
      return res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Consultation Routes
  app.get('/api/consultations', async (req: Request, res: Response) => {
    try {
      const clientIdStr = req.query.clientId as string | undefined;
      const lawyerIdStr = req.query.lawyerId as string | undefined;
      
      let consultations = [];
      
      if (clientIdStr) {
        const clientId = parseInt(clientIdStr);
        consultations = await storage.getConsultationsByClientId(clientId);
      } else if (lawyerIdStr) {
        const lawyerId = parseInt(lawyerIdStr);
        consultations = await storage.getConsultationsByLawyerId(lawyerId);
      } else {
        return res.status(400).json({ message: 'Either clientId or lawyerId must be provided' });
      }
      
      return res.status(200).json(consultations);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/consultations', async (req: Request, res: Response) => {
    try {
      const consultationData = insertConsultationSchema.parse(req.body);
      const newConsultation = await storage.createConsultation(consultationData);
      
      return res.status(201).json(newConsultation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Legal News Routes
  app.get('/api/legal-news', async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      
      let news;
      if (category) {
        news = await storage.getLegalNewsByCategory(category);
      } else {
        news = await storage.getLegalNews();
      }
      
      return res.status(200).json(news);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Law Data Routes
  app.get('/api/law-data/:code', async (req: Request, res: Response) => {
    try {
      const code = req.params.code;
      const law = await storage.getLawData(code);
      
      if (!law) {
        return res.status(404).json({ message: 'Law data not found' });
      }
      
      return res.status(200).json(law);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/api/law-data/search', async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      const results = await storage.searchLawData(query);
      
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Chat Conversations Routes
  app.get('/api/chat/conversations', async (req: Request, res: Response) => {
    try {
      const userIdStr = req.query.userId as string;
      
      if (!userIdStr) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const userId = parseInt(userIdStr);
      const conversations = await storage.getChatConversations(userId);
      
      return res.status(200).json(conversations);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/chat/conversations', async (req: Request, res: Response) => {
    try {
      const conversationData = insertChatConversationSchema.parse(req.body);
      const newConversation = await storage.createChatConversation(conversationData);
      
      return res.status(201).json(newConversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Chat Messages Routes
  app.get('/api/chat/conversations/:id/messages', async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messages = await storage.getChatMessages(conversationId);
      
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/chat/conversations/:id/messages', async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        conversationId
      });
      
      // Save user message
      const userMessage = await storage.createChatMessage(messageData);
      
      // Generate AI response
      const conversation = await storage.getChatConversation(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
      
      const messages = await storage.getChatMessages(conversationId);
      const formattedMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
      
      // Cast to correct type to satisfy TypeScript
      const aiResponse = await ChatService.processChatConversation(
        formattedMessages as import('./services/chatService').ChatMessage[]
      );
      
      // Save AI response
      const aiMessageData = {
        conversationId,
        sender: 'assistant',
        content: aiResponse
      };
      
      const aiMessage = await storage.createChatMessage(aiMessageData);
      
      return res.status(201).json({
        userMessage,
        aiMessage
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Simple AI chat endpoint for floating chat
  app.post('/api/chat/ai', async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: 'Message is required' });
      }
      
      const response = await ChatService.processMessage(message);
      
      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Payment Routes
  app.post('/api/payments', async (req: Request, res: Response) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const newPayment = await storage.createPayment(paymentData);
      
      return res.status(201).json(newPayment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/api/payments', async (req: Request, res: Response) => {
    try {
      const clientIdStr = req.query.clientId as string | undefined;
      const lawyerIdStr = req.query.lawyerId as string | undefined;
      
      let payments = [];
      
      if (clientIdStr) {
        const clientId = parseInt(clientIdStr);
        payments = await storage.getPaymentsByClientId(clientId);
      } else if (lawyerIdStr) {
        const lawyerId = parseInt(lawyerIdStr);
        payments = await storage.getPaymentsByLawyerId(lawyerId);
      } else {
        return res.status(400).json({ message: 'Either clientId or lawyerId must be provided' });
      }
      
      return res.status(200).json(payments);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Stripe Payment Routes
  app.post('/api/create-payment-intent', async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          message: 'Stripe is not configured properly. Please check your environment variables.' 
        });
      }

      const { amount } = req.body;
      
      if (!amount) {
        return res.status(400).json({ message: 'Amount is required' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'inr', // Indian Rupee
        // Payment method types can include more options like 'card', 'upi', etc.
        payment_method_types: ['card'],
      });

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error('Stripe payment error:', error);
      return res.status(500).json({ 
        message: 'Error creating payment intent', 
        error: error.message 
      });
    }
  });
  
  return httpServer;
}

// WebSocket setup for chat and conference calls
function setupWebSockets(wss: WebSocketServer) {
  const clients = new Map<string, WebSocket>();
  
  wss.on('connection', (ws: WebSocket) => {
    const id = Math.random().toString(36).substring(2, 15);
    clients.set(id, ws);
    
    ws.on('message', async (message: string) => {
      const data = JSON.parse(message);
      
      // Handle different message types
      switch (data.type) {
        case 'chat':
          // Handle chat messages between users
          if (data.recipientId && clients.has(data.recipientId)) {
            const recipient = clients.get(data.recipientId);
            if (recipient && recipient.readyState === WebSocket.OPEN) {
              recipient.send(JSON.stringify({
                type: 'chat',
                senderId: id,
                message: data.message
              }));
            }
          }
          break;
          
        case 'conference':
          // Handle conference signaling (for WebRTC)
          if (data.recipientId && clients.has(data.recipientId)) {
            const recipient = clients.get(data.recipientId);
            if (recipient && recipient.readyState === WebSocket.OPEN) {
              recipient.send(JSON.stringify({
                type: 'conference',
                senderId: id,
                signal: data.signal
              }));
            }
          }
          break;
          
        case 'register':
          // Associate user ID with connection
          ws.send(JSON.stringify({
            type: 'register',
            id
          }));
          break;
      }
    });
    
    ws.on('close', () => {
      clients.delete(id);
    });
  });
}
