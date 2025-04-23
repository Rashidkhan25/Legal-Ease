import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query';
import { chatAPI } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';

// Simple AI chat without history
export function useChatAI() {
  return useMutation({
    mutationFn: (message: string) => chatAPI.sendMessage(message)
  });
}

// Get user's chat conversations
export function useChatConversations(userId: number | undefined): UseQueryResult<any[]> {
  return useQuery({
    queryKey: ['/api/chat/conversations', userId],
    queryFn: () => userId ? chatAPI.getConversations(userId) : Promise.resolve([]),
    enabled: !!userId
  });
}

// Create a new chat conversation
export function useCreateChatConversation() {
  return useMutation({
    mutationFn: (data: { userId: number; title: string }) => chatAPI.createConversation(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
      return data;
    }
  });
}

// Get messages for a conversation
export function useChatMessages(conversationId: number | undefined): UseQueryResult<any[]> {
  return useQuery({
    queryKey: [`/api/chat/conversations/${conversationId}/messages`],
    queryFn: () => conversationId ? chatAPI.getMessages(conversationId) : Promise.resolve([]),
    enabled: !!conversationId
  });
}

// Send a message in a conversation
export function useSendChatMessage(conversationId: number | undefined) {
  return useMutation({
    mutationFn: (content: string) => 
      conversationId 
        ? chatAPI.sendConversationMessage(conversationId, content) 
        : Promise.reject('No conversation ID'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/conversations/${conversationId}/messages`] });
    }
  });
}

// Search law data
export function useSearchLaws(query: string): UseQueryResult<any[]> {
  return useQuery({
    queryKey: ['/api/law-data/search', query],
    queryFn: () => query ? chatAPI.sendMessage(query) : Promise.resolve([]),
    enabled: !!query && query.length >= 3
  });
}
