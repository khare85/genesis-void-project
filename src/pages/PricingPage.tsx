
import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import Pricing from '@/components/landing/Pricing';

const PricingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <Pricing />
      <LandingFooter />
    </div>
  );
};

export default PricingPage;
