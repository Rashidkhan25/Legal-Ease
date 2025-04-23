import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { NewsFeed } from '@/components/home/NewsFeed';
import { ServiceHighlights } from '@/components/home/ServiceHighlights';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { Link, useLocation } from 'wouter';
import { MessageSquareText } from 'lucide-react';

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showChatButton, setShowChatButton] = useState(false);
  const { isLoggedIn } = useAuth();

  // Show auth modal on first visit if not logged in
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisitedBefore && !isLoggedIn) {
      const timer = setTimeout(() => {
        setShowAuthModal(true);
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  // Show chat button after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatButton(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSkip={() => setShowAuthModal(false)}
      />
      
      <section id="home" className="mb-16 relative">
        <HeroSection />
        <NewsFeed />
        <ServiceHighlights />
      </section>
    </main>
  );
}
