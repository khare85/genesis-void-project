
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface WelcomeStepProps {
  onGetStarted: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onGetStarted }) => {
  return (
    <motion.div
      className="text-center space-y-6 max-w-xl mx-auto px-8 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div 
        className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 text-primary"
        >
          <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" />
          <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
          <path d="M22 12h-4" />
        </svg>
      </motion.div>
      
      <motion.h2 
        className="text-3xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Welcome to Persona AI!
      </motion.h2>
      
      <motion.p 
        className="text-muted-foreground text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        We're excited to help you find the perfect job opportunities.
      </motion.p>
      
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="font-semibold">Getting started is easy:</h3>
        <ul className="text-left space-y-3">
          <li className="flex items-start gap-3">
            <div className="bg-primary/20 h-7 w-7 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-primary font-semibold">1</span>
            </div>
            <span>Upload your resume to help us understand your skills and experience</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-primary/20 h-7 w-7 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-primary font-semibold">2</span>
            </div>
            <span>Record a brief video introduction to stand out to employers</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-primary/20 h-7 w-7 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-primary font-semibold">3</span>
            </div>
            <span>Our AI will help match you with the best opportunities</span>
          </li>
        </ul>
      </motion.div>
      
      <motion.div 
        className="pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button 
          onClick={onGetStarted} 
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 h-auto text-lg"
        >
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeStep;
