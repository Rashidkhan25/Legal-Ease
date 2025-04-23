import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CaseTracker } from '@/components/case-tracking/CaseTracker';
import { useAuth } from '@/context/AuthContext';
import { getUserCases } from '@/hooks/useCaseTracking';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, AlertTriangle } from 'lucide-react';

export default function CaseTrackingPage() {
  const { user, isLoggedIn } = useAuth();
  const { data: userCases, isLoading } = getUserCases(
    user?.id,
    user?.role === 'lawyer' ? 'lawyer' : 'client'
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary font-serif mb-6">Case Tracking Portal</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <CaseTracker isLoading={isLoading} />
        </CardContent>
      </Card>
      
      {isLoggedIn && user ? (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary font-serif mb-6">Your Cases</h2>
          
          {isLoading ? (
            <p className="text-gray-500">Loading your cases...</p>
          ) : userCases && userCases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userCases.map((caseItem) => (
                <Card key={caseItem.id} className="hover:shadow-md transition">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                        <p className="text-sm text-gray-500">Case No: {caseItem.caseNumber}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium
                          ${caseItem.status === 'active' ? 'bg-green-100 text-green-800' : 
                            caseItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {caseItem.status}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-1 font-medium">{caseItem.caseType}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Filed:</span>
                          <span className="ml-1 font-medium">
                            {new Date(caseItem.filedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{caseItem.description}</p>
                      <div className="pt-2">
                        <Link href={`/case-tracking?caseNumber=${caseItem.caseNumber}`}>
                          <Button variant="link" className="p-0 h-auto text-secondary hover:text-secondary-dark">
                            View details <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center p-8">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No cases found</h3>
                <p className="text-gray-500 mb-6">
                  {user.role === 'client' 
                    ? "You don't have any active cases yet. You can add a case or search for existing case details using the case number."
                    : "You don't have any assigned cases yet."}
                </p>
                {user.role === 'client' && (
                  <Button>
                    Register a New Case
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Sign in to access your cases</h3>
                <p className="text-gray-600 text-sm">
                  To view all your cases and track their progress, please sign in to your account.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
