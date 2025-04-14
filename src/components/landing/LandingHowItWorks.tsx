
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const LandingHowItWorks = () => {
  return (
    <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-[#EFF6FF] to-[#F5F8FF]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How Persona AI Works
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-xl">
            Our seamless end-to-end process streamlines your hiring workflow
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full bg-[#3054A5] text-white flex items-center justify-center text-2xl font-bold">1</div>
              <div className="hidden md:block absolute top-8 left-16 w-full h-0.5 bg-[#3054A5]/20"></div>
            </div>
            <h3 className="text-xl font-bold mb-3">Create & Optimize Job Listings</h3>
            <p className="text-muted-foreground">
              Use our AI to generate optimized job descriptions or improve existing ones for better candidate attraction.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full bg-[#3054A5] text-white flex items-center justify-center text-2xl font-bold">2</div>
              <div className="hidden md:block absolute top-8 left-16 w-full h-0.5 bg-[#3054A5]/20"></div>
            </div>
            <h3 className="text-xl font-bold mb-3">AI-Powered Screening</h3>
            <p className="text-muted-foreground">
              Our AI analyzes resumes, scores candidates, and provides insights to help you identify the best matches.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full bg-[#3054A5] text-white flex items-center justify-center text-2xl font-bold">3</div>
            </div>
            <h3 className="text-xl font-bold mb-3">Interview & Select</h3>
            <p className="text-muted-foreground">
              Conduct AI-analyzed interviews and make data-backed hiring decisions with confidence.
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Button className="gap-1.5 bg-[#3054A5] hover:bg-[#264785]" size="lg" asChild>
            <Link to="/careers">
              Browse Job Openings <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LandingHowItWorks;
