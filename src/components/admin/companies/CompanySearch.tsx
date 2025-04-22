
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CompanySearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const CompanySearch = ({ searchQuery, onSearchChange }: CompanySearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button className="sm:w-auto">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
    </div>
  );
};
