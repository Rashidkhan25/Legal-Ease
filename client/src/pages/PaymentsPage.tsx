import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { usePayments } from '@/hooks/useLawyers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { IndianRupee } from 'lucide-react';

export default function PaymentsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const role = user?.role as 'client' | 'lawyer' || 'client';
  const { data: payments, isLoading, isError } = usePayments(user?.id, role);
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredPayments = payments?.filter(payment => {
    if (activeTab === 'all') return true;
    return payment.status === activeTab;
  });

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPP');
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Please login to view your payments</h2>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {role === 'client' ? 'My Payments' : 'Received Payments'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IndianRupee className="h-5 w-5 mr-2" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : isError ? (
                <div className="text-center py-8 text-red-500">
                  Failed to load payment data. Please try again.
                </div>
              ) : filteredPayments?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No payment records found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments?.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{formatDate(payment.createdAt)}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {payment.transactionId}
                          </TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell className="font-bold">₹{payment.amount}</TableCell>
                          <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payment.status === 'completed'
                                  ? 'secondary'
                                  : payment.status === 'pending'
                                  ? 'outline'
                                  : 'destructive'
                              }
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            {/* The same content is shown for all tabs since we're filtering in the component */}
            <TabsContent value="completed" className="mt-0">
              {/* Same content as "all" tab - filtered by state */}
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              {/* Same content as "all" tab - filtered by state */}
            </TabsContent>
            <TabsContent value="failed" className="mt-0">
              {/* Same content as "all" tab - filtered by state */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}