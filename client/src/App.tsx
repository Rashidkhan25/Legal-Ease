import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatFloatingButton } from "@/components/layout/ChatFloatingButton";
import { AuthModal } from "@/components/auth/AuthModal";
import { AuthProvider } from "@/context/AuthContext";
import HomePage from "@/pages/HomePage";
import CaseTrackingPage from "@/pages/CaseTrackingPage";
import FindLawyerPage from "@/pages/FindLawyerPage";
import LegalAssistantPage from "@/pages/LegalAssistantPage";
import PaymentsPage from "@/pages/PaymentsPage";
import LawyerPaymentPage from "@/pages/LawyerPaymentPage";
import StripeCheckoutPage from "@/pages/StripeCheckoutPage";
import CaseLawSearchPage from "@/pages/CaseLawSearchPage";
import LegalDocumentGeneratorPage from "@/pages/LegalDocumentGeneratorPage";
import CommunityForumPage from "@/pages/CommunityForumPage";
import LegalAidEligibilityPage from "@/pages/LegalAidEligibilityPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/case-tracking" component={CaseTrackingPage} />
      <Route path="/find-lawyer" component={FindLawyerPage} />
      <Route path="/legal-assistant" component={LegalAssistantPage} />
      <Route path="/payments" component={PaymentsPage} />
      <Route path="/lawyer-payment/:id" component={LawyerPaymentPage} />
      <Route path="/stripe-checkout" component={StripeCheckoutPage} />
      <Route path="/case-law-search" component={CaseLawSearchPage} />
      <Route path="/document-generator" component={LegalDocumentGeneratorPage} />
      <Route path="/community-forum" component={CommunityForumPage} />
      <Route path="/legal-aid-check" component={LegalAidEligibilityPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
          onSkip={() => setAuthModalOpen(false)}
        />
        <Header onLoginClick={() => setAuthModalOpen(true)} />
        <Router />
        <Footer />
        <ChatFloatingButton />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
