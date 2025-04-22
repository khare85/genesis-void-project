
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompanyActionsProps {
  onAddCompany: () => void;
}

export const CompanyActions = ({ onAddCompany }: CompanyActionsProps) => {
  return (
    <Button onClick={onAddCompany} className="sm:w-auto">
      <Plus className="h-4 w-4 mr-2" />
      Add Company
    </Button>
  );
};
