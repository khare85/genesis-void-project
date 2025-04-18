
import React from 'react';
import { Link } from 'react-router-dom';

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container flex h-16 items-center justify-between">
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
        
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
            Home
          </Link>
          <Link to="/careers" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
            Careers
          </Link>
          <a href="#about" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
            About
          </a>
          <a href="#contact" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
            Contact
          </a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
