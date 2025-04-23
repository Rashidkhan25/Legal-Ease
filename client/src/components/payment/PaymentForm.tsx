import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { useCreatePayment } from '@/hooks/useLawyers';

type PaymentFormProps = {
  lawyerId: number;
  consultationId?: number;
  amount: number;
  service: string;
};

export function PaymentForm({ lawyerId, consultationId, amount, service }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { mutate: createPayment } = useCreatePayment();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If Stripe is selected, the button in that tab handles the redirect
    if (paymentMethod === 'stripe') {
      return;
    }
    
    if (paymentMethod === 'upi' && !upiId) {
      toast({
        title: "Missing information",
        description: "Please enter your UPI ID",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Submit payment record to backend
      createPayment({
        lawyerId,
        consultationId,
        amount,
        paymentMethod,
        status: 'completed',
        transactionId: 'TXN' + Math.floor(Math.random() * 1000000),
        description: `Payment for ${service}`
      }, {
        onSuccess: () => {
          toast({
            title: "Payment Successful",
            description: `₹${amount} paid successfully`,
          });
          
          // Navigate to consultations page after payment
          navigate('/consultations');
        },
        onError: (error: any) => {
          toast({
            title: "Payment Failed",
            description: error?.message || "There was an error processing your payment",
            variant: "destructive",
          });
          setIsProcessing(false);
        }
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };
  
  // Generate a random QR code image URL (simulated)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=example@upi&pn=LegalService&am=${amount}&cu=INR&tn=${encodeURIComponent(service)}`;

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Payment for Legal Services</CardTitle>
        <CardDescription>
          Complete your payment of ₹{amount} for {service}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment}>
          <Tabs defaultValue="upi" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger 
                value="upi" 
                onClick={() => setPaymentMethod('upi')}
              >
                UPI
              </TabsTrigger>
              <TabsTrigger 
                value="netbanking" 
                onClick={() => setPaymentMethod('netbanking')}
              >
                Net Banking
              </TabsTrigger>
              <TabsTrigger 
                value="card" 
                onClick={() => setPaymentMethod('card')}
              >
                Card
              </TabsTrigger>
              <TabsTrigger 
                value="stripe" 
                onClick={() => setPaymentMethod('stripe')}
              >
                Stripe
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upi" className="space-y-4 mt-4">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <RadioGroup defaultValue="pay" className="mt-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pay" id="pay" />
                      <Label htmlFor="pay">Pay directly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="collect" id="collect" />
                      <Label htmlFor="collect">Generate UPI request</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <img 
                    src={qrCodeUrl}
                    alt="UPI QR Code" 
                    className="w-32 h-32"
                  />
                  <p className="text-center text-xs mt-2 text-gray-500">Scan to pay</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="netbanking" className="space-y-4 mt-4">
              <div className="space-y-3">
                <Label>Select Bank</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['SBI', 'HDFC', 'ICICI', 'Axis', 'Punjab National', 'Bank of Baroda'].map((bank) => (
                    <div 
                      key={bank}
                      className="border rounded-md p-3 cursor-pointer hover:border-primary transition"
                    >
                      <p className="font-medium">{bank}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="card" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="mt-1"
                      type="password"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    placeholder="Full Name"
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="stripe" className="space-y-4 mt-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start mb-4">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <img 
                      src="https://www.svgrepo.com/show/328142/stripe.svg" 
                      alt="Stripe Logo" 
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Secure Card Payment</h4>
                    <p className="text-sm text-gray-600">Pay securely with Stripe's protected payment system</p>
                  </div>
                </div>
                
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    End-to-end encrypted payment
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Support for international cards
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    24/7 fraud protection
                  </li>
                </ul>
                
                <Button 
                  type="button"
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    // Redirect to Stripe checkout page with params
                    const url = `/stripe-checkout?amount=${amount}&service=${encodeURIComponent(service)}&lawyerId=${lawyerId}${consultationId ? `&consultationId=${consultationId}` : ''}`;
                    navigate(url);
                  }}
                >
                  Continue to Stripe Checkout
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Payment...' : `Pay ₹${amount}`}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <p className="text-xs text-gray-500">Secure payment powered by Legal Services</p>
        <div className="flex space-x-2">
          <img src="https://www.svgrepo.com/show/357316/upi.svg" alt="UPI" className="h-6" />
          <img src="https://www.svgrepo.com/show/402801/bank.svg" alt="Bank" className="h-6" />
          <img src="https://www.svgrepo.com/show/472849/visa.svg" alt="Visa" className="h-6" />
          <img src="https://www.svgrepo.com/show/355039/mastercard.svg" alt="MasterCard" className="h-6" />
        </div>
      </CardFooter>
    </Card>
  );
}