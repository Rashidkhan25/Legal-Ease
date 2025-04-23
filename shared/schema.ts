import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("client"), // client, lawyer, admin
  phoneNumber: text("phone_number"),
  specialization: text("specialization"), // For lawyers
  experience: integer("experience"), // For lawyers (years)
  ratePerHour: integer("rate_per_hour"), // For lawyers
  profileImage: text("profile_image"),
  bio: text("bio"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Case model
export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  caseNumber: text("case_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active, closed, pending
  caseType: text("case_type").notNull(),
  filedDate: timestamp("filed_date").notNull(),
  clientId: integer("client_id").notNull(), // References users
  lawyerId: integer("lawyer_id"), // References users, optional if not yet assigned
  court: text("court"),
  judge: text("judge"),
  createdAt: timestamp("created_at").defaultNow()
});

// Case Events (Timeline)
export const caseEvents = pgTable("case_events", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull(), // References cases
  eventDate: timestamp("event_date").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(), // completed, upcoming, cancelled
  createdAt: timestamp("created_at").defaultNow()
});

// Consultations
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(), // References users
  lawyerId: integer("lawyer_id").notNull(), // References users
  scheduleDate: timestamp("schedule_date").notNull(),
  duration: integer("duration").notNull(), // In minutes
  status: text("status").notNull().default("scheduled"), // scheduled, completed, cancelled
  fee: integer("fee").notNull(),
  notes: text("notes"),
  meetingLink: text("meeting_link"),
  createdAt: timestamp("created_at").defaultNow()
});

// Legal News
export const legalNews = pgTable("legal_news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  sourceUrl: text("source_url"),
  publishDate: timestamp("publish_date").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Chat Conversations
export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // References users
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Chat Messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(), // References chatConversations
  sender: text("sender").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Law Data
export const lawData = pgTable("law_data", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // e.g., "IPC302"
  section: text("section").notNull(), // e.g., "302"
  category: text("category").notNull(), // e.g., "Criminal Law"
  title: text("title").notNull(),
  description: text("description").notNull(),
  punishment: text("punishment"),
  createdAt: timestamp("created_at").defaultNow()
});

// Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(), // References users
  lawyerId: integer("lawyer_id").notNull(), // References users
  consultationId: integer("consultation_id"), // References consultations (optional)
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow()
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isVerified: true
});

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true, 
  createdAt: true
});

export const insertCaseEventSchema = createInsertSchema(caseEvents).omit({
  id: true, 
  createdAt: true
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true, 
  createdAt: true
});

export const insertLegalNewsSchema = createInsertSchema(legalNews).omit({
  id: true, 
  createdAt: true
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).omit({
  id: true, 
  createdAt: true
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true, 
  createdAt: true
});

export const insertLawDataSchema = createInsertSchema(lawData).omit({
  id: true, 
  createdAt: true
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true, 
  createdAt: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = typeof cases.$inferSelect;

export type InsertCaseEvent = z.infer<typeof insertCaseEventSchema>;
export type CaseEvent = typeof caseEvents.$inferSelect;

export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;

export type InsertLegalNews = z.infer<typeof insertLegalNewsSchema>;
export type LegalNews = typeof legalNews.$inferSelect;

export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type ChatConversation = typeof chatConversations.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertLawData = z.infer<typeof insertLawDataSchema>;
export type LawData = typeof lawData.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
