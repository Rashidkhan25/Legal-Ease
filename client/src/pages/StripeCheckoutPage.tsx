import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCreatePayment } from '@/hooks/useLawyers';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('Missing Stripe Public Key - Stripe payments will not work');
}

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) 
  : null;

// Component for the actual payment form
const CheckoutForm = ({ 
  amount, 
  service, 
  onSuccess, 
  onError 
}: { 
  amount: number;
  service: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/payments',
      },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message || 'An unexpected error occurred');
      setIsLoading(false);
    } else {
      // Payment succeeded
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement className="mb-6" />
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? 'Processing...' : `Pay ₹${amount}`}
      </Button>
    </form>
  );
};

// Main Checkout Page
export default function StripeCheckoutPage() {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mutate: createPayment } = useCreatePayment();
  
  // Parse URL query parameters
  const params = new URLSearchParams(location.split('?')[1]);
  const amount = Number(params.get('amount') || 0);
  const service = params.get('service') || 'Legal Services';
  const lawyerId = Number(params.get('lawyerId') || 0);
  const consultationId = params.get('consultationId') ? Number(params.get('consultationId')) : undefined;

  useEffect(() => {
    if (!amount || amount <= 0) {
      setError('Invalid payment amount');
      setIsLoading(false);
      return;
    }

    const createIntent = async () => {
      try {
        const response = await apiRequest('POST', '/api/create-payment-intent', { 
          amount,
          lawyerId,
          service,
          consultationId
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create payment intent');
        }
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || 'There was an error setting up the payment');
        console.error('Payment setup error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    createIntent();
  }, [amount, lawyerId, service, consultationId]);

  const handlePaymentSuccess = () => {
    // Record successful payment in our system
    createPayment({
      lawyerId,
      consultationId,
      amount,
      paymentMethod: 'stripe',
      status: 'completed',
      transactionId: 'STRIPE-' + Date.now(),
      description: `Payment for ${service}`
    }, {
      onSuccess: () => {
        toast({
          title: "Payment Successful",
          description: `₹${amount} paid successfully for ${service}`,
        });
        navigate('/payments');
      },
      onError: (error: any) => {
        toast({
          title: "Payment tracking failed",
          description: "Payment was successful but we couldn't save the record. Please contact support.",
          variant: "destructive",
        });
      }
    });
  };

  const handlePaymentError = (message: string) => {
    toast({
      title: "Payment Failed",
      description: message,
      variant: "destructive",
    });
  };

  // Setup payment options for Elements
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#4f46e5',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      borderRadius: '0.5rem',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Button
          variant="ghost"
          className="mb-8 pl-0"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Payment Error</CardTitle>
            <CardDescription>We couldn't set up the payment</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/")}>
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Button
        variant="ghost"
        className="mb-8 pl-0"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>
            Secure payment for {service} - ₹{amount}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : clientSecret && stripePromise ? (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm 
                amount={amount} 
                service={service} 
                onSuccess={handlePaymentSuccess} 
                onError={handlePaymentError} 
              />
            </Elements>
          ) : (
            <div className="text-center py-6 text-red-500">
              <p>Stripe payments are currently unavailable.</p>
              <p className="text-sm text-gray-500 mt-2">Please try another payment method or contact support.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <div className="flex justify-between items-center w-full">
            <p className="text-sm text-gray-500">Secure payment processed by Stripe</p>
            <div className="flex space-x-2">
              <img src="https://www.svgrepo.com/show/472849/visa.svg" alt="Visa" className="h-6" />
              <img src="https://www.svgrepo.com/show/355039/mastercard.svg" alt="MasterCard" className="h-6" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}