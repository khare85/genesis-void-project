import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { AddCompanyDialog } from '@/components/admin/AddCompanyDialog';
import PageHeader from '@/components/shared/PageHeader';
import { CompanySearch } from '@/components/admin/companies/CompanySearch';
import { CompanyActions } from '@/components/admin/companies/CompanyActions';
import { CompanyTable } from '@/components/admin/companies/CompanyTable';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Company } from '@/types/company';

const AdminCompanies = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [addCompanyDialogOpen, setAddCompanyDialogOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      console.log('Fetching companies...');
      const { data, error } = await supabase
        .from('companies')
        .select('*');
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No companies found in the database');
        setCompanies([]);
        setLoading(false);
        return;
      }
      
      const formattedCompanies = data.map(company => ({
        id: company.id,
        name: company.name,
        industry: company.industry || '',
        employees: company.employees || 0,
        status: company.status || 'active',
        credits: company.credits || 0,
        subscriptionTier: company.subscription_tier || 'Standard',
        renewalDate: company.renewal_date,
        hiringManagers: 0,
        activeJobs: 0,
      }));
      
      console.log('Formatted companies:', formattedCompanies);
      setCompanies(formattedCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCompanies();
  }, []);
  
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing companies');
      fetchCompanies();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);
  
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleViewDetails = (id: string) => {
    navigate(`/admin/companies/${id}`);
  };

  const handleCompanyUpdated = () => {
    console.log('Refreshing companies after update...');
    fetchCompanies();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies"
        description="Manage all companies using the platform"
        icon={<Building2 className="h-6 w-6" />}
      />
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <CompanySearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <CompanyActions onAddCompany={() => setAddCompanyDialogOpen(true)} />
      </div>
      
      <CompanyTable
        companies={filteredCompanies}
        loading={loading}
        onViewDetails={handleViewDetails}
        onCompanyUpdated={handleCompanyUpdated}
      />

      <AddCompanyDialog
        open={addCompanyDialogOpen}
        onOpenChange={setAddCompanyDialogOpen}
        onCompanyAdded={fetchCompanies}
      />
    </div>
  );
};

export default AdminCompanies;
