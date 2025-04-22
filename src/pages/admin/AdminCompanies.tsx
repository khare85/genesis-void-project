import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Plus, Search, Filter, MoreHorizontal, 
  EyeIcon, EditIcon, Trash2Icon
} from 'lucide-react';
import { AddCompanyDialog } from '@/components/admin/AddCompanyDialog';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const companiesData = [
  {
    id: 1,
    name: 'TechnovateX',
    industry: 'Technology',
    employees: 350,
    hiringManagers: 4,
    activeJobs: 8,
    status: 'active',
    credits: 1500,
    subscriptionTier: 'Enterprise',
    renewalDate: '2025-08-12',
  },
  {
    id: 2,
    name: 'Global Finance Group',
    industry: 'Finance',
    employees: 820,
    hiringManagers: 6,
    activeJobs: 12,
    status: 'active',
    credits: 3000,
    subscriptionTier: 'Enterprise',
    renewalDate: '2025-07-19',
  },
  {
    id: 3,
    name: 'Healthcare Partners',
    industry: 'Healthcare',
    employees: 230,
    hiringManagers: 3,
    activeJobs: 5,
    status: 'active',
    credits: 800,
    subscriptionTier: 'Professional',
    renewalDate: '2025-09-01',
  },
  {
    id: 4,
    name: 'EduTech Solutions',
    industry: 'Education',
    employees: 85,
    hiringManagers: 2,
    activeJobs: 3,
    status: 'active',
    credits: 500,
    subscriptionTier: 'Standard',
    renewalDate: '2025-06-25',
  },
  {
    id: 5,
    name: 'Ecommerce Innovators',
    industry: 'Retail',
    employees: 120,
    hiringManagers: 3,
    activeJobs: 7,
    status: 'inactive',
    credits: 0,
    subscriptionTier: 'Professional',
    renewalDate: '2025-05-14',
  },
  {
    id: 6,
    name: 'Legal Experts Inc.',
    industry: 'Legal',
    employees: 65,
    hiringManagers: 1,
    activeJobs: 2,
    status: 'active',
    credits: 300,
    subscriptionTier: 'Standard',
    renewalDate: '2025-10-22',
  },
];

const AdminCompanies = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [addCompanyDialogOpen, setAddCompanyDialogOpen] = useState(false);
  
  const filteredCompanies = companiesData.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetails = (id: number) => {
    navigate(`/admin/companies/${id}`);
  };

  const handleAddCompany = () => {
    setAddCompanyDialogOpen(true);
  };

  const refreshCompanies = () => {
    // Implement refresh logic here when needed
    // For now, we're using mock data
  };
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies"
        description="Manage all companies using the platform"
        icon={<Building2 className="h-6 w-6" />}
      />
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button onClick={handleAddCompany} className="sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Companies Overview</CardTitle>
          <CardDescription>
            {filteredCompanies.length} total companies registered on the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead className="hidden md:table-cell">Employees</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Hiring Managers</TableHead>
                <TableHead className="hidden md:table-cell">Active Jobs</TableHead>
                <TableHead className="hidden lg:table-cell">AI Credits</TableHead>
                <TableHead className="hidden lg:table-cell">Subscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell className="hidden md:table-cell">{company.employees}</TableCell>
                    <TableCell>{getStatusBadge(company.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">{company.hiringManagers}</TableCell>
                    <TableCell className="hidden md:table-cell">{company.activeJobs}</TableCell>
                    <TableCell className="hidden lg:table-cell">{company.credits}</TableCell>
                    <TableCell className="hidden lg:table-cell">{company.subscriptionTier}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(company.id)}>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/companies/${company.id}`)}>
                            <EditIcon className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2Icon className="mr-2 h-4 w-4" />
                            <span>Deactivate</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">
                    No companies found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <div className="text-sm text-muted-foreground">
            Showing {filteredCompanies.length} of {companiesData.length} companies
          </div>
        </CardFooter>
      </Card>

      <AddCompanyDialog
        open={addCompanyDialogOpen}
        onOpenChange={setAddCompanyDialogOpen}
        onCompanyAdded={refreshCompanies}
      />
    </div>
  );
};

export default AdminCompanies;
