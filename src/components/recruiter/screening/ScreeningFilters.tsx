
import React from 'react';
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScreeningFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  jobRoleFilter: string;
  setJobRoleFilter: (value: string) => void;
  uniqueJobRoles: string[];
  getCandidateCountByStatus: (status: string) => number;
}

export const ScreeningFilters: React.FC<ScreeningFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  jobRoleFilter,
  setJobRoleFilter,
  uniqueJobRoles,
  getCandidateCountByStatus
}) => {
  const onClearFilters = () => {
    setSearchTerm('');
    setJobRoleFilter('all');
    setActiveTab('all');
  };

  return (
    <div className="flex flex-col space-y-4 bg-background border rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={jobRoleFilter} onValueChange={setJobRoleFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>{jobRoleFilter === 'all' ? 'All Roles' : jobRoleFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueJobRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all" className="flex gap-2">
            All
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              {getCandidateCountByStatus('all')}
            </span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex gap-2">
            Pending
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              {getCandidateCountByStatus('pending')}
            </span>
          </TabsTrigger>
          <TabsTrigger value="shortlisted" className="flex gap-2">
            Shortlisted
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              {getCandidateCountByStatus('shortlisted')}
            </span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex gap-2">
            Rejected
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              {getCandidateCountByStatus('rejected')}
            </span>
          </TabsTrigger>
          <TabsTrigger value="interview" className="flex gap-2">
            Interview
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              {getCandidateCountByStatus('interview')}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
