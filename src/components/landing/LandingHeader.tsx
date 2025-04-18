
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
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
        <nav className="hidden md:flex gap-6">
          <a href="#features" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
            Testimonials
          </a>
          <a href="#pricing" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hover:text-[#3054A5]" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button className="bg-[#3054A5] hover:bg-[#264785]" asChild>
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
