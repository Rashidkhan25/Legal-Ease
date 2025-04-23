import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCreateConsultation } from '@/hooks/useLawyers';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ArrowLeft, Calendar, Clock, Video, Phone, MessageSquare } from 'lucide-react';

export default function LawyerPaymentPage() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [lawyer, setLawyer] = useState<any>(null);
  const [selectedService, setSelectedService] = useState('consultation');
  const [selectedMode, setSelectedMode] = useState('video');
  const [loading, setLoading] = useState(true);
  const { mutate: createConsultation } = useCreateConsultation();
  
  // Get lawyer ID from URL
  const lawyerId = parseInt(location.split('/').pop() || '0');
  
  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const response = await fetch(`/api/user/${lawyerId}`);
        if (!response.ok) throw new Error('Failed to fetch lawyer details');
        
        const data = await response.json();
        setLawyer(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lawyer:', error);
        toast({
          title: 'Error',
          description: 'Could not load lawyer details',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };
    
    fetchLawyer();
  }, [lawyerId, toast]);
  
  const getServiceAmount = () => {
    switch (selectedService) {
      case 'consultation': return 1500;
      case 'document-review': return 3000;
      case 'legal-representation': return 10000;
      default: return 1500;
    }
  };
  
  const getServiceName = () => {
    switch (selectedService) {
      case 'consultation': return 'Legal Consultation';
      case 'document-review': return 'Document Review';
      case 'legal-representation': return 'Legal Representation';
      default: return 'Legal Service';
    }
  };
  
  const handleBookConsultation = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to book a consultation',
        variant: 'destructive',
      });
      return;
    }
    
    // Create a consultation record before payment
    createConsultation({
      clientId: user.id,
      lawyerId: lawyer.id,
      service: getServiceName(),
      consultationMode: selectedMode,
      status: 'pending-payment',
      scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      notes: `${selectedMode} consultation for ${getServiceName()}`
    }, {
      onSuccess: (data) => {
        // Scroll to payment section
        document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
      },
      onError: (error: any) => {
        toast({
          title: 'Booking Failed',
          description: error?.message || 'Failed to book consultation',
          variant: 'destructive',
        });
      }
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!lawyer) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Lawyer not found</h2>
        <Button onClick={() => navigate('/find-lawyer')}>Back to Lawyer Search</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6 pl-0"
        onClick={() => navigate(`/lawyer-profile/${lawyerId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <img
                  src={lawyer.profileImage || 'https://www.svgrepo.com/show/382106/male-avatar-boy-face-man-user-9.svg'}
                  alt={lawyer.fullName}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold">{lawyer.fullName}</h2>
                  <p className="text-gray-600">{lawyer.specialization || 'General Practice'}</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-xl font-bold mb-4">Select Service</h3>
              <Tabs defaultValue="consultation" className="w-full" onValueChange={setSelectedService}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="consultation">Consultation</TabsTrigger>
                  <TabsTrigger value="document-review">Document Review</TabsTrigger>
                  <TabsTrigger value="legal-representation">Representation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="consultation" className="space-y-4">
                  <div className="bg-primary-light/10 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">Legal Consultation</h4>
                    <p className="text-gray-600 mb-4">
                      Get expert legal advice on your specific situation with a professional consultation.
                    </p>
                    <div className="flex items-center text-primary mb-2">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>60 minutes session</span>
                    </div>
                    <div className="flex items-center text-primary">
                      <Check className="h-4 w-4 mr-2" />
                      <span>Follow-up questions included</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-bold mb-2">Select Mode</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div
                        className={`border rounded-md p-3 flex flex-col items-center cursor-pointer transition ${
                          selectedMode === 'video' ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedMode('video')}
                      >
                        <Video className="h-6 w-6 mb-2" />
                        <span className="text-sm">Video Call</span>
                      </div>
                      <div
                        className={`border rounded-md p-3 flex flex-col items-center cursor-pointer transition ${
                          selectedMode === 'audio' ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedMode('audio')}
                      >
                        <Phone className="h-6 w-6 mb-2" />
                        <span className="text-sm">Phone Call</span>
                      </div>
                      <div
                        className={`border rounded-md p-3 flex flex-col items-center cursor-pointer transition ${
                          selectedMode === 'chat' ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedMode('chat')}
                      >
                        <MessageSquare className="h-6 w-6 mb-2" />
                        <span className="text-sm">Text Chat</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="document-review" className="space-y-4">
                  <div className="bg-primary-light/10 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">Document Review</h4>
                    <p className="text-gray-600 mb-4">
                      Have your legal documents reviewed by an expert lawyer with detailed feedback.
                    </p>
                    <div className="flex items-center text-primary mb-2">
                      <Check className="h-4 w-4 mr-2" />
                      <span>Up to 25 pages of documents</span>
                    </div>
                    <div className="flex items-center text-primary mb-2">
                      <Check className="h-4 w-4 mr-2" />
                      <span>Detailed written feedback</span>
                    </div>
                    <div className="flex items-center text-primary">
                      <Check className="h-4 w-4 mr-2" />
                      <span>One revision included</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="legal-representation" className="space-y-4">
                  <div className="bg-primary-light/10 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">Legal Representation</h4>
                    <p className="text-gray-600 mb-4">
                      Full legal representation for your case from start to finish.
                    </p>
                    <div className="flex items-center text-primary mb-2">
                      <Check className="h-4 w-4 mr-2" />
                      <span>Initial case assessment</span>
                    </div>
                    <div className="flex items-center text-primary mb-2">
                      <Check className="h-4 w-4 mr-2" />
                      <span>Court representation</span>
                    </div>
                    <div className="flex items-center text-primary">
                      <Check className="h-4 w-4 mr-2" />
                      <span>Document preparation and filing</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={handleBookConsultation}
                  className="w-full md:w-auto px-8 py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition"
                >
                  Book {getServiceName()} for ₹{getServiceAmount()}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div id="payment-section">
          <div className="sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-center md:text-left">Payment</h3>
            <PaymentForm
              lawyerId={lawyer.id}
              amount={getServiceAmount()}
              service={getServiceName()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}