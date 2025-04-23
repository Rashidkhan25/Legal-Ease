import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { 
  Gavel, LogIn, Menu, Bell, ChevronDown, User, LogOut, Settings, 
  MessageCircle, Briefcase, FileText, Scale, Search, FileQuestion, 
  Users
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  onLoginClick?: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const { isLoggedIn, user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Gavel className="text-primary text-accent mr-2 h-6 w-6"/>
                <span className="text-primary font-serif font-bold text-xl">LegalConnect</span>
              </Link>
              <nav className="hidden md:ml-8 md:flex md:space-x-6">
                <Link href="/" className={`px-1 py-2 text-sm font-medium ${location === '/' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary hover:border-b-2 hover:border-primary'}`}>
                  Home
                </Link>
                {/* Dropdown for Services */}
                <div className="relative group">
                  <div className={`px-1 py-2 text-sm font-medium flex items-center cursor-pointer ${
                    ['/legal-assistant', '/case-law-search', '/document-generator', '/legal-aid-check'].includes(location) ? 
                    'text-primary border-b-2 border-primary' : 
                    'text-gray-500 hover:text-primary hover:border-b-2 hover:border-primary'
                  }`}>
                    Services
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="absolute left-0 mt-1 w-56 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-1">
                      <Link href="/legal-assistant" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          <span>AI Legal Assistant</span>
                        </div>
                      </Link>
                      <Link href="/case-law-search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <div className="flex items-center">
                          <Search className="h-4 w-4 mr-2" />
                          <span>Case Law Search</span>
                        </div>
                      </Link>
                      <Link href="/document-generator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          <span>Document Generator</span>
                        </div>
                      </Link>
                      <Link href="/legal-aid-check" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <div className="flex items-center">
                          <Scale className="h-4 w-4 mr-2" />
                          <span>Legal Aid Eligibility</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <Link href="/case-tracking" className={`px-1 py-2 text-sm font-medium ${location === '/case-tracking' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary hover:border-b-2 hover:border-primary'}`}>
                  Case Tracking
                </Link>
                <Link href="/find-lawyer" className={`px-1 py-2 text-sm font-medium ${location === '/find-lawyer' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary hover:border-b-2 hover:border-primary'}`}>
                  Find a Lawyer
                </Link>
                <Link href="/community-forum" className={`px-1 py-2 text-sm font-medium ${location === '/community-forum' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary hover:border-b-2 hover:border-primary'}`}>
                  Community
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center">
              {/* Logged In State */}
              {isLoggedIn && user ? (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-primary">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent"></span>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 text-sm">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profileImage} alt={user.fullName} />
                          <AvatarFallback>{user.fullName ? getInitials(user.fullName) : 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="hidden md:block font-medium">{user.fullName}</span>
                        <ChevronDown className="text-gray-400 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      {user.role === 'client' && (
                        <DropdownMenuItem>
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>My Cases</span>
                        </DropdownMenuItem>
                      )}
                      {user.role === 'lawyer' && (
                        <DropdownMenuItem>
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>My Clients</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        <span>Messages</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                /* Logged Out State */
                <Button onClick={handleLoginClick} className="inline-flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
              
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden ml-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="pt-6 pb-3 space-y-1">
                      <Link href="/" className={`block pl-3 pr-4 py-2 text-base font-medium ${location === '/' ? 'bg-primary-light text-white border-l-4 border-accent' : 'text-gray-600 hover:bg-gray-50 hover:text-primary border-l-4 border-transparent'}`}>
                        Home
                      </Link>
                      
                      {/* Services Submenu */}
                      <div className="pl-3 pr-4 py-2 text-base font-medium text-gray-600">
                        Services
                      </div>
                      <div className="pl-6 space-y-1">
                        <Link href="/legal-assistant" className={`block pl-3 pr-4 py-1 text-sm font-medium ${location === '/legal-assistant' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
                          AI Legal Assistant
                        </Link>
                        <Link href="/case-law-search" className={`block pl-3 pr-4 py-1 text-sm font-medium ${location === '/case-law-search' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
                          Case Law Search
                        </Link>
                        <Link href="/document-generator" className={`block pl-3 pr-4 py-1 text-sm font-medium ${location === '/document-generator' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
                          Document Generator
                        </Link>
                        <Link href="/legal-aid-check" className={`block pl-3 pr-4 py-1 text-sm font-medium ${location === '/legal-aid-check' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
                          Legal Aid Eligibility
                        </Link>
                      </div>
                      
                      <Link href="/case-tracking" className={`block pl-3 pr-4 py-2 text-base font-medium ${location === '/case-tracking' ? 'bg-primary-light text-white border-l-4 border-accent' : 'text-gray-600 hover:bg-gray-50 hover:text-primary border-l-4 border-transparent'}`}>
                        Case Tracking
                      </Link>
                      <Link href="/find-lawyer" className={`block pl-3 pr-4 py-2 text-base font-medium ${location === '/find-lawyer' ? 'bg-primary-light text-white border-l-4 border-accent' : 'text-gray-600 hover:bg-gray-50 hover:text-primary border-l-4 border-transparent'}`}>
                        Find a Lawyer
                      </Link>
                      <Link href="/community-forum" className={`block pl-3 pr-4 py-2 text-base font-medium ${location === '/community-forum' ? 'bg-primary-light text-white border-l-4 border-accent' : 'text-gray-600 hover:bg-gray-50 hover:text-primary border-l-4 border-transparent'}`}>
                        Community
                      </Link>
                    </div>
                    
                    {!isLoggedIn && (
                      <div className="pt-4 border-t border-gray-200">
                        <Button onClick={handleLoginClick} className="w-full">
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In
                        </Button>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
}
