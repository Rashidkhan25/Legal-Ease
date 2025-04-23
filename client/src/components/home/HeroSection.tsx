import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Scale, Gavel, Shield, Scroll } from 'lucide-react';

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const statsItems = [
    { icon: <Scale className="h-6 w-6" />, value: "10,000+", label: "Cases Tracked" },
    { icon: <Gavel className="h-6 w-6" />, value: "500+", label: "Expert Lawyers" },
    { icon: <Shield className="h-6 w-6" />, value: "24/7", label: "Legal Assistance" },
    { icon: <Scroll className="h-6 w-6" />, value: "95%", label: "Success Rate" }
  ];

  return (
    <div className="mb-20">
      <div className="relative bg-gradient-to-br from-primary to-primary-dark rounded-xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
            alt="Legal office with law books" 
            className="w-full h-full object-cover opacity-20"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
              transition: 'transform 0.2s ease-out'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary-dark/90"></div>
        </div>
        
        <div className="relative px-6 py-16 sm:py-24 sm:px-12 lg:px-16 z-10">
          <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200 font-serif">
              Legal support made accessible for everyone
            </h1>
          </div>
          
          <div className="animate-fade-in-delay-1">
            <p className="mt-6 max-w-xl text-xl text-gray-200 leading-relaxed">
              Track your case progress, find qualified lawyers, and get instant legal assistance with our AI-powered platform.
            </p>
          </div>
          
          <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-delay-2">
            <Link href="/case-tracking">
              <Button 
                size="lg" 
                className="bg-gradient-to-b from-accent to-accent-dark hover:from-accent hover:to-accent-dark text-white font-bold px-6 py-6 rounded-md text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
              >
                Track Your Case
              </Button>
            </Link>
            <Link href="/find-lawyer">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 font-bold px-6 py-6 rounded-md text-lg transition-all duration-300 hover:translate-y-[-2px]"
              >
                Connect with a Lawyer
              </Button>
            </Link>
            <Link href="/legal-assistant">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 font-bold px-6 py-6 rounded-md text-lg transition-all duration-300 hover:translate-y-[-2px]"
              >
                AI Legal Assistant
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 mx-auto max-w-7xl px-4 animate-fade-in-up">
        {statsItems.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg p-4 shadow-md text-center hover:shadow-lg hover:translate-y-[-5px] transition-all duration-300"
          >
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
