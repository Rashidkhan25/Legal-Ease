import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query';
import { caseAPI } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';

// Get case by case number
export function useCase(caseNumber: string): UseQueryResult<any> {
  return useQuery({
    queryKey: [`/api/cases/${caseNumber}`],
    queryFn: () => caseNumber ? caseAPI.getCaseByNumber(caseNumber) : Promise.resolve(null),
    enabled: !!caseNumber
  });
}

// Get cases for a user (client or lawyer)
export function getUserCases(userId: number | undefined, role: 'client' | 'lawyer'): UseQueryResult<any[]> {
  return useQuery({
    queryKey: ['/api/cases', userId, role],
    queryFn: () => userId ? caseAPI.getUserCases(userId, role) : Promise.resolve([]),
    enabled: !!userId
  });
}

// Create a new case
export function useCreateCase() {
  return useMutation({
    mutationFn: (caseData: any) => caseAPI.createCase(caseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cases'] });
    }
  });
}

// Get case events
export function useCaseEvents(caseId: number | undefined): UseQueryResult<any[]> {
  return useQuery({
    queryKey: [`/api/cases/${caseId}/events`],
    queryFn: () => caseId ? caseAPI.getCaseEvents(caseId) : Promise.resolve([]),
    enabled: !!caseId
  });
}

// Create a case event
export function useCreateCaseEvent(caseId: number | undefined) {
  return useMutation({
    mutationFn: (eventData: any) => caseId ? caseAPI.createCaseEvent(caseId, eventData) : Promise.reject('No case ID'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cases/${caseId}/events`] });
      queryClient.invalidateQueries({ queryKey: [`/api/cases/${caseId}`] });
    }
  });
}
