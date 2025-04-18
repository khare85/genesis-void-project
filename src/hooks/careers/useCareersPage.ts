
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_range?: string;
  description?: string;
  posteddate: string;
  category?: string;
  level?: string;
  featured?: boolean;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  logourl?: string;
}

export const useCareersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all-categories');
  const [location, setLocation] = useState('all-locations');
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'active')
          .order('posteddate', { ascending: false });
        
        if (error) {
          console.error("Error fetching jobs:", error);
          toast.error("Failed to load job listings. Please try again later.");
          return;
        }
        
        setJobListings(data || []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        toast.error("An error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = category === 'all-categories' || job.category === category;
    const matchesLocation = location === 'all-locations' || (job.location && job.location.includes(location));
    
    return matchesSearch && matchesCategory && matchesLocation;
  });
  
  return {
    jobListings,
    isLoading,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    location,
    setLocation,
    filteredJobs
  };
};
