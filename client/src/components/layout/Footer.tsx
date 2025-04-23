import React from 'react';
import { Link } from 'wouter';
import { Gavel, Facebook, Twitter, Linkedin, Mail, Phone, MapPin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Gavel className="mr-2 h-6 w-6" />
              <span className="font-serif font-bold text-xl">LegalConnect</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Accessible legal support for everyone. Track cases, find lawyers, and get instant legal assistance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white text-sm transition">Home</Link>
              </li>
              <li>
                <Link href="/case-tracking" className="text-gray-300 hover:text-white text-sm transition">Case Tracking</Link>
              </li>
              <li>
                <Link href="/find-lawyer" className="text-gray-300 hover:text-white text-sm transition">Find a Lawyer</Link>
              </li>
              <li>
                <Link href="/legal-assistant" className="text-gray-300 hover:text-white text-sm transition">AI Assistant</Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-white text-sm transition">Legal News</Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-medium text-lg mb-4">Legal Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition">Legal Dictionary</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition">IPC Sections</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition">Court Procedures</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition">Document Templates</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition">FAQs</a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-medium text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="text-gray-300 mr-2 h-5 w-5" />
                <a href="mailto:support@legalconnect.com" className="text-gray-300 hover:text-white text-sm transition">
                  support@legalconnect.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="text-gray-300 mr-2 h-5 w-5" />
                <a href="tel:+911234567890" className="text-gray-300 hover:text-white text-sm transition">
                  +91 1234 567 890
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="text-gray-300 mr-2 h-5 w-5" />
                <span className="text-gray-300 text-sm">
                  123 Legal Street, New Delhi, 110001
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} LegalConnect. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-300 hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
