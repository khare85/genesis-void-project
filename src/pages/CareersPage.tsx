
import React from 'react';
import CareersHeader from '@/components/careers/CareersHeader';
import CareersHero from '@/components/careers/CareersHero';
import JobListings from '@/components/careers/JobListings';
import CareersFooter from '@/components/careers/CareersFooter';
import { useCareersPage } from '@/hooks/careers/useCareersPage';

const CareersPage = () => {
  const {
    jobListings,
    isLoading,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    location,
    setLocation,
    filteredJobs
  } = useCareersPage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <CareersHeader />
      <CareersHero 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        location={location}
        setLocation={setLocation}
        category={category}
        setCategory={setCategory}
      />
      <JobListings 
        jobs={filteredJobs} 
        isLoading={isLoading}
        resetFilters={() => {
          setSearchTerm('');
          setCategory('');
          setLocation('');
        }}
      />
      <CareersFooter />
    </div>
  );
};

export default CareersPage;
