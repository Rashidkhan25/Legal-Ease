import React, { ReactNode } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, Search, TrendingUp, Users, 
  FileText, MessageSquare, CreditCard, ShieldCheck 
} from 'lucide-react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  bgColor: string;
  animationDelay: string;
}

// Service card component with animations
const ServiceCard = ({ 
  icon, 
  title, 
  description, 
  linkText, 
  linkHref, 
  bgColor,
  animationDelay
}: ServiceCardProps) => {
  return (
    <div className={`animate-fade-in-up ${animationDelay}`}>
      <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        <CardContent className="p-6 h-full flex flex-col">
          <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center mb-6 shadow-md transform transition-all duration-200`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-3 text-primary">{title}</h3>
          <p className="text-gray-600 mb-6 flex-grow">
            {description}
          </p>
          <Link href={linkHref}>
            <div className="text-gray-400 hover:text-gray-900 font-medium flex items-center group w-fit transition-all duration-300 hover:translate-x-1">
              {linkText}
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export function ServiceHighlights() {
  // Services data
  const services = [
    {
      icon: <Search className="h-7 w-7 text-white" />,
      title: "Legal Information Search",
      description: "Access comprehensive database of laws, statutes, and precedents using our AI-powered search engine with instant results.",
      linkText: "Try it now",
      linkHref: "/legal-assistant",
      bgColor: "bg-gradient-to-br from-blue-200 to-blue-600",
      animationDelay: "animation-delay-100"
    },
    {
      icon: <TrendingUp className="h-7 w-7 text-white" />,
      title: "Case Tracking",
      description: "Get real-time updates on your case status, hearing schedules, and important dates all in one place with alerts.",
      linkText: "Track your case",
      linkHref: "/case-tracking",
      bgColor: "bg-gradient-to-br from-red-200 to-red-600",
      animationDelay: "animation-delay-200"
    },
    {
      icon: <Users className="h-7 w-7 text-white" />,
      title: "Lawyer Consultation",
      description: "Connect with qualified lawyers for virtual consultations, secure payments, and ongoing representation for your case.",
      linkText: "Find a lawyer",
      linkHref: "/find-lawyer",
      bgColor: "bg-gradient-to-br from-gray-200 to-gray-600",
      animationDelay: "animation-delay-300"
    },
    {
      icon: <FileText className="h-7 w-7 text-white" />,
      title: "Legal Document Analysis",
      description: "Upload and analyze legal documents using AI to understand implications and get simplified explanations of legal terms.",
      linkText: "Analyze documents",
      linkHref: "/legal-assistant",
      bgColor: "bg-gradient-to-br from-emerald-500 to-green-600",
      animationDelay: "animation-delay-400"
    },
    {
      icon: <MessageSquare className="h-7 w-7 text-white" />,
      title: "Legal Chat Assistant",
      description: "Chat with our AI legal assistant 24/7 to get quick answers to your legal questions and guidance on next steps.",
      linkText: "Start chatting",
      linkHref: "/legal-assistant",
      bgColor: "bg-gradient-to-br from-purple-200 to-purple-600",
      animationDelay: "animation-delay-500"
    },
    {
      icon: <CreditCard className="h-7 w-7 text-white" />,
      title: "Secure Payments",
      description: "Make secure payments to lawyers through multiple payment options including UPI, credit cards, and international gateways.",
      linkText: "View payment options",
      linkHref: "/payments",
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
      animationDelay: "animation-delay-600"
    }
  ];

  return (
    <div className="pt-8 pb-16">
      <div className="text-center mb-12 animate-fade-in">
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4"></div>
        <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4">Our Legal Services</h2>
        <p className="max-w-2xl mx-auto text-gray-600 text-lg">
          Comprehensive legal solutions designed to provide easy access to justice and legal support for everyone.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {services.map((service, index) => (
          <ServiceCard 
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
            linkText={service.linkText}
            linkHref={service.linkHref}
            bgColor={service.bgColor}
            animationDelay={service.animationDelay}
          />
        ))}
      </div>
      
      <div className="mt-16 text-center animate-fade-in animation-delay-800">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-xl max-w-3xl mx-auto">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-primary mb-3">Legal Protection Plan</h3>
          <p className="text-gray-600 mb-6">
            Get comprehensive legal protection with our subscription plan. Access all services, priority support, and unlimited consultations.
          </p>
          <Link href="/pricing">
            <button
              className="px-6 py-3 bg-gradient-to-br from-primary to-secondary text-white font-medium rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Explore Plans
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
