import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Info, Send } from 'lucide-react';
import { useChatAI, useChatConversations, useChatMessages, useSendChatMessage, useCreateChatConversation } from '@/hooks/useLegalAssistant';
import { useAuth } from '@/context/AuthContext';

interface ChatMessage {
  id?: number;
  conversationId?: number;
  sender: string;
  content: string;
  createdAt?: string;
}

interface LegalAssistantProps {
  isLoading?: boolean;
}

export function LegalAssistant({ isLoading: propLoading }: LegalAssistantProps) {
  const [message, setMessage] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<number | undefined>(undefined);
  const [suggestedQueries] = useState([
    "What are the stages of a criminal trial?",
    "Explain IPC Section 302 in simple terms",
    "What documents do I need for bail application?",
    "How long does divorce process usually take?"
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isLoggedIn } = useAuth();
  
  // Queries and mutations
  const chatAI = useChatAI();
  const { data: conversations } = useChatConversations(isLoggedIn ? user?.id : undefined);
  const { data: messages, isLoading: messagesLoading } = useChatMessages(activeConversationId);
  const sendMessage = useSendChatMessage(activeConversationId);
  const createConversation = useCreateChatConversation();
  
  // Local state for simple chat (non-logged in)
  const [simpleChatHistory, setSimpleChatHistory] = useState<ChatMessage[]>([
    { sender: 'assistant', content: "Hello! I'm your AI legal assistant. How can I help you today?" }
  ]);
  
  // // Scroll to bottom whenever messages change
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages, simpleChatHistory]);
  
  // Set active conversation if we have conversations and none is selected
  useEffect(() => {
    if (conversations?.length && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSuggestedQuery = async (query: string) => {
    setMessage(query);
    // We don't submit automatically to give user a chance to edit
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    if (isLoggedIn && activeConversationId) {
      // If logged in and has active conversation, use conversation API
      await sendChatMessage(message);
    } else if (isLoggedIn && !activeConversationId) {
      // If logged in but no active conversation, create one
      const newConversation = await createConversation.mutateAsync({
        userId: user!.id,
        title: message.substring(0, 30) + (message.length > 30 ? '...' : '')
      });
      setActiveConversationId(newConversation.id);
      await sendChatMessage(message);
    } else {
      // Simple chat for non-logged in users
      await sendSimpleChat(message);
    }
    
    setMessage('');
  };
  
  const sendChatMessage = async (content: string) => {
    try {
      // Add user message to UI first for better UX
      setSimpleChatHistory(prev => [...prev, { sender: 'user', content }]);
      
      // Send message via API
      await sendMessage.mutateAsync(content);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const sendSimpleChat = async (content: string) => {
    try {
      // Add user message to chat history
      setSimpleChatHistory(prev => [...prev, { sender: 'user', content }]);
      
      // Get AI response
      const response = await chatAI.mutateAsync(content);
      
      // Add AI response to chat history
      setSimpleChatHistory(prev => [...prev, { sender: 'assistant', content: response.response }]);
    } catch (error) {
      console.error('Error in AI chat:', error);
      setSimpleChatHistory(prev => [...prev, { 
        sender: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    }
  };
  
  // Determine which messages to display
  const displayMessages = isLoggedIn && messages ? messages : simpleChatHistory;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-lg mb-4">How can I help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Ask questions about legal terms, procedures, or specific laws. I can provide general legal information, but not legal advice.
          </p>
          
          <div className="space-y-3">
            {suggestedQueries.map((query, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto py-3 px-3"
                onClick={() => handleSuggestedQuery(query)}
              >
                {query}
              </Button>
            ))}
          </div>
        </div>
        
        <Card className="bg-red-50 border-red-100">
          <CardContent className="pt-6">
            <div className="flex items-start mb-3">
              <Info className="text-red-500 mr-2 h-5 w-5" />
              <h3 className="font-medium">Legal Disclaimer</h3>
            </div>
            <p className="text-sm text-gray-700">
              This AI assistant provides general legal information only, not legal advice. For specific advice about your situation, please consult with a qualified lawyer.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <Card className="h-[28rem] flex flex-col">
          <CardHeader className="border-b p-3 bg-gray-50 flex flex-row items-center">
            <Bot className="text-primary mr-2 h-5 w-5" />
            <span className="font-medium">Legal Assistant</span>
          </CardHeader>
          
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
            {displayMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : ''}`}
              >
                {msg.sender !== 'user' && (
                  <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div 
                  className={`rounded-lg p-3 max-w-[80%] ${
                    msg.sender === 'user' 
                      ? 'bg-blue-100' 
                      : 'bg-gray-100'
                  }`}
                >
                  {/* Handle lists in messages */}
                  {msg.content.includes('•') || msg.content.includes('- ') ? (
                    <div className="text-sm">
                      {msg.content.split('\n').map((line: string, i: number) => {
                      if (line.startsWith('•') || line.startsWith('- ')) {
                        return (
                        <div key={i} className="flex items-start my-1">
                          <span className="mr-2">{line.startsWith('•') ? '•' : '•'}</span>
                          <span>{line.replace(/^[•-]\s/, '')}</span>
                        </div>
                        );
                      }
                      return <p key={i} className="my-1">{line}</p>;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
                
                {msg.sender === 'user' && (
                  <Avatar className="h-8 w-8 ml-2 flex-shrink-0">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {(chatAI.isPending || sendMessage.isPending) && (
              <div className="flex items-start">
                <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-gray-100 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>
          
          <CardFooter className="border-t p-3">
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a legal question..."
                className="flex-1 rounded-md"
              />
              <Button 
                type="submit"
                size="icon"
                className="bg-primary"
                disabled={!message.trim() || chatAI.isPending || sendMessage.isPending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
