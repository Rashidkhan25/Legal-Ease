import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query';
import { lawyersAPI, consultationsAPI, paymentsAPI } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';

// Get all lawyers with optional filters
export function useLawyers(filters?: any): UseQueryResult<any[]> {
  return useQuery({
    queryKey: ['/api/lawyers', filters],
    queryFn: () => lawyersAPI.getLawyers(filters)
  });
}

// Get user's consultations
export function useConsultations(userId: number | undefined, role: 'client' | 'lawyer'): UseQueryResult<any[]> {
  return useQuery({
    queryKey: ['/api/consultations', userId, role],
    queryFn: () => userId ? consultationsAPI.getUserConsultations(userId, role) : Promise.resolve([]),
    enabled: !!userId
  });
}

// Create a consultation
export function useCreateConsultation() {
  return useMutation({
    mutationFn: (data: any) => consultationsAPI.createConsultation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/consultations'] });
    }
  });
}

// Process a payment
export function useCreatePayment() {
  return useMutation({
    mutationFn: (data: any) => paymentsAPI.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
    }
  });
}

// Get user's payments
export function usePayments(userId: number | undefined, role: 'client' | 'lawyer'): UseQueryResult<any[]> {
  return useQuery({
    queryKey: ['/api/payments', userId, role],
    queryFn: () => userId ? paymentsAPI.getUserPayments(userId, role) : Promise.resolve([]),
    enabled: !!userId
  });
}
