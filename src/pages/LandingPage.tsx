
import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingHowItWorks from '@/components/landing/LandingHowItWorks';
import LandingFooter from '@/components/landing/LandingFooter';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
