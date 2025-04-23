import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowUpCircle, Bot, X, Minimize, Maximize, MessageSquareText } from 'lucide-react';
import { useChatAI } from '@/hooks/useLegalAssistant';
import { Transition } from '@headlessui/react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI legal assistant. How can I help you today?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatMutation = useChatAI();

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const closeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    
    // Clear input
    setMessage('');
    
    try {
      // Get AI response
      const response = await chatMutation.mutateAsync(message);
      
      // Add AI response to chat
      const aiMessage: ChatMessage = { role: 'assistant', content: response.response };
      setChatHistory(prev => [...prev, aiMessage]);
      
      // Scroll to bottom
      scrollToBottom();
    } catch (error) {
      console.error('Error getting AI response:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      <Transition
        show={isOpen && !isMinimized}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Card className="w-80 md:w-96 h-96 mb-4 shadow-lg">
          <CardHeader className="bg-primary text-white p-3 flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <CardTitle className="text-sm font-medium">Legal Assistant</CardTitle>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-primary-light" onClick={minimizeChat}>
                <Minimize className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-primary-light" onClick={closeChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-3 h-64 overflow-y-auto flex flex-col space-y-3">
            {chatHistory.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                  </Avatar>
                )}
                
                <div 
                  className={`rounded-lg p-3 max-w-[80%] ${
                    msg.role === 'user' 
                      ? 'bg-blue-100 text-gray-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                
                {msg.role === 'user' && (
                  <Avatar className="h-8 w-8 ml-2 flex-shrink-0">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </CardContent>
          
          <CardFooter className="border-t p-3">
            <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
              <Input
                placeholder="Ask a legal question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={chatMutation.isPending || !message.trim()}>
                <ArrowUpCircle className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </Transition>
      
      <Transition
        show={isMinimized}
        enter="transition-all duration-300"
        enterFrom="opacity-0 translate-y-10"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-300"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-10"
      >
        <div className="bg-primary text-white rounded-lg shadow-lg p-3 mb-4 flex items-center" onClick={() => setIsMinimized(false)}>
          <Bot className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Legal Assistant</span>
          <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-white hover:bg-primary-light" onClick={closeChat}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Transition>
      
      <Button
        onClick={toggleChat}
        className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg group relative overflow-hidden hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Chat with AI Legal Assistant"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <div className="animate-chat-wiggle">
          <Bot style={{ width: '30px', height: '30px' }} /> {/* Explicitly set size */}
        </div>
        
        {/* Tooltip */}
        <div className="absolute -top-20 right-0 bg-white px-4 py-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          <div className="absolute -bottom-2 right-5 w-7 h-7 bg-white transform rotate-45"></div>
        </div>
        
        {/* Animated Ping Effect */}
        <span className="absolute -inset-1.5 rounded-full animate-ping bg-blue-200 opacity-40"></span>
      </Button>
    </div>         
  );
}