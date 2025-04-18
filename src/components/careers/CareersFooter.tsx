
import React from 'react';
import { Link } from 'react-router-dom';

const CareersFooter = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3054A5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" />
                <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                <path d="M22 12h-4" />
              </svg>
              <span className="text-xl font-bold text-[#3054A5]">Persona AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transforming recruitment with AI-powered insights and automated screening.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-[#3054A5]">Home</Link></li>
              <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-[#3054A5]">All Jobs</Link></li>
              <li><Link to="/login" className="text-sm text-muted-foreground hover:text-[#3054A5]">Sign In</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">For Employers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Post a Job</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Pricing</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Enterprise Solutions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li><a href="mailto:info@personaai.com" className="text-sm text-muted-foreground hover:text-[#3054A5]">info@personaai.com</a></li>
              <li><a href="tel:+11234567890" className="text-sm text-muted-foreground hover:text-[#3054A5]">(123) 456-7890</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 Persona AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-[#3054A5]">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-[#3054A5]">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CareersFooter;
