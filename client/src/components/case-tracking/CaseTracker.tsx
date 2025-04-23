import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCase } from '@/hooks/useCaseTracking';
import { format } from 'date-fns';
import { Search, FileDown, CheckCircle, Calendar } from 'lucide-react';

interface CaseEvent {
  id: number;
  caseId: number;
  eventDate: string;
  title: string;
  description: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  createdAt: string;
}

interface CaseData {
  id: number;
  caseNumber: string;
  title: string;
  description: string;
  status: string;
  caseType: string;
  filedDate: string;
  clientId: number;
  lawyerId?: number;
  court?: string;
  judge?: string;
  createdAt: string;
  events: CaseEvent[];
}

interface CaseTrackerProps {
  isLoading?: boolean;
}

export function CaseTracker({ isLoading: propLoading }: CaseTrackerProps) {
  const [caseNumber, setCaseNumber] = useState('');
  const [searchedCaseNumber, setSearchedCaseNumber] = useState('');
  
  const { data: caseData, isLoading, error } = useCase(searchedCaseNumber);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (caseNumber.trim()) {
      setSearchedCaseNumber(caseNumber.trim());
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="mb-6">
      <div className="mb-4">
        <form onSubmit={handleSearch}>
          <label htmlFor="case-number" className="block text-sm font-medium text-gray-700 mb-1">
            Enter your case number
          </label>
          <div className="flex">
            <Input 
              type="text" 
              id="case-number" 
              className="flex-1 rounded-l"
              placeholder="e.g. CR-2025-1234"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
            />
            <Button 
              type="submit"
              className="rounded-l-none bg-primary"
            >
              <Search className="mr-1 h-4 w-4" />
              Track
            </Button>
          </div>
        </form>
      </div>
      
      <p className="text-sm text-gray-500">
        Enter your case number to access real-time updates, hearing schedules, and case details.
      </p>

      {searchedCaseNumber && isLoading && (
        <div className="mt-6">
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
      )}

      {searchedCaseNumber && error && (
        <div className="mt-6 p-4 border rounded-lg bg-red-50 text-red-700">
          <p>Failed to retrieve case information. Please verify the case number and try again.</p>
        </div>
      )}

      {caseData && (
        <div className="border rounded-lg overflow-hidden mt-6">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <span className="font-medium text-primary">Case No: {caseData.caseNumber}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-600">{caseData.title}</span>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 font-medium">
                  {caseData.status}
                </Badge>
                <Button variant="ghost" size="icon" className="ml-4 text-secondary hover:text-secondary-dark">
                  <FileDown className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border rounded p-3">
                <h4 className="text-xs text-gray-500 mb-1">Case Type</h4>
                <p className="font-medium">{caseData.caseType}</p>
              </div>
              <div className="border rounded p-3">
                <h4 className="text-xs text-gray-500 mb-1">Filed Date</h4>
                <p className="font-medium">{formatDate(caseData.filedDate)}</p>
              </div>
              <div className="border rounded p-3">
                <h4 className="text-xs text-gray-500 mb-1">Next Hearing</h4>
                {caseData.events && caseData.events.some((e: CaseEvent) => e.status === 'upcoming') ? (
                  <p className="font-medium text-accent">
                  {formatDate(caseData.events.find((e: CaseEvent) => e.status === 'upcoming')?.eventDate || '')}
                  </p>
                ) : (
                  <p className="font-medium text-gray-500">No upcoming hearings</p>
                )}
              </div>
            </div>
            
            <h3 className="font-medium text-lg mb-3">Case Timeline</h3>
            
            {caseData.events && caseData.events.length > 0 ? (
                <div className="relative case-timeline pl-10 space-y-6">
                {caseData.events.map((event: CaseEvent) => (
                  <div key={event.id} className="relative">
                  <div 
                    className="absolute left-0 top-1 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center" 
                    style={{ 
                    backgroundColor: event.status === 'completed' ? '#def7ec' : event.status === 'upcoming' ? '#e1effe' : '#fde8e8',
                    }}
                  >
                    {event.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                    ) : event.status === 'upcoming' ? (
                    <Calendar className="h-5 w-5 text-secondary" />
                    ) : (
                    <span className="material-icons text-error">cancel</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{formatDate(event.eventDate)}</p>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                  </div>
                ))}
                </div>
            ) : (
              <p className="text-gray-500 italic">No events recorded for this case.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
