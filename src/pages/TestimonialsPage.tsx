
import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import Testimonials from '@/components/landing/Testimonials';

const TestimonialsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <Testimonials />
      <LandingFooter />
    </div>
  );
};

export default TestimonialsPage;
