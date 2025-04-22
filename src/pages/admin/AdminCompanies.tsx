
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Company {
  id: string;
  name: string;
  industry: string;
  employees: number;
  status: string;
  credits: number;
  subscriptionTier: string;
  renewalDate: string | null;
  hiringManagers?: number;
  activeJobs?: number;
}

const AdminCompanies = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [addCompanyDialogOpen, setAddCompanyDialogOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch companies from the database
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*');
      
      if (error) throw error;
      
      // Transform database data to match our component interface
      const formattedCompanies = data.map(company => ({
        id: company.id,
        name: company.name,
        industry: company.industry || '',
        employees: company.employees || 0,
        status: company.status || 'active',
        credits: company.credits || 0,
        subscriptionTier: company.subscription_tier || 'Standard',
        renewalDate: company.renewal_date,
        hiringManagers: 0, // We'll need to implement this later
        activeJobs: 0, // We'll need to implement this later
      }));
      
      setCompanies(formattedCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };
  
  // Load companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);
  
  const filteredCompanies = companies.filter(company => 
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

  const handleViewDetails = (id: string) => {
    navigate(`/admin/companies/${id}`);
  };

  const handleAddCompany = () => {
    setAddCompanyDialogOpen(true);
  };

  const refreshCompanies = () => {
    fetchCompanies();
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">
                    Loading companies...
                  </TableCell>
                </TableRow>
              ) : filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell className="hidden md:table-cell">{company.employees}</TableCell>
                    <TableCell>{getStatusBadge(company.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">{company.hiringManagers || 0}</TableCell>
                    <TableCell className="hidden md:table-cell">{company.activeJobs || 0}</TableCell>
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
            Showing {filteredCompanies.length} of {companies.length} companies
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
