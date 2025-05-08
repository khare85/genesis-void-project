
import React from 'react';
import { Link } from 'react-router-dom';

const LandingFooter = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:py-12">
        <div className="flex flex-col gap-2">
          <Link to="/" className="flex items-center gap-2">
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
          </Link>
          <p className="text-sm text-muted-foreground">
            Transforming recruitment with AI-powered insights.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-muted-foreground hover:text-[#3054A5]">Features</a></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-[#3054A5]">Pricing</Link></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Integrations</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">About Us</a></li>
              <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-[#3054A5]">Careers</Link></li>
              <li><Link to="/testimonials" className="text-sm text-muted-foreground hover:text-[#3054A5]">Testimonials</Link></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Contact</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Help Center</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Support</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container flex flex-col gap-4 border-t py-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          © 2025 Persona AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
