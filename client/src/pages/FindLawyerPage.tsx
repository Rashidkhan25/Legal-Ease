import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LawyerFinder } from '@/components/lawyers/LawyerFinder';

export default function FindLawyerPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary font-serif mb-6">Find a Lawyer</h1>
      
      <Card>
        <CardContent className="pt-6">
          <LawyerFinder />
        </CardContent>
      </Card>
    </main>
  );
}
