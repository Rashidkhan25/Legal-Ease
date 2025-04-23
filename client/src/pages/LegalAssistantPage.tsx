import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LegalAssistant } from '@/components/legal-assistant/LegalAssistant';

export default function LegalAssistantPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary font-serif mb-6">AI Legal Assistant</h1>
      
      <Card>
        <CardContent className="pt-6">
          <LegalAssistant />
        </CardContent>
      </Card>
    </main>
  );
}
