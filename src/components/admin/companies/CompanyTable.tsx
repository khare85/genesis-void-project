
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { CompanyTableRow } from './CompanyTableRow';
import { Company } from '@/types/company';

interface CompanyTableProps {
  companies: Company[];
  loading: boolean;
  onViewDetails: (id: string) => void;
  onCompanyUpdated: () => void;
}

export const CompanyTable = ({ 
  companies, 
  loading, 
  onViewDetails,
  onCompanyUpdated 
}: CompanyTableProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Companies Overview</CardTitle>
        <CardDescription>
          {companies.length} total companies registered on the platform
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
            ) : companies.length > 0 ? (
              companies.map((company) => (
                <CompanyTableRow 
                  key={company.id}
                  company={company}
                  onViewDetails={onViewDetails}
                  onCompanyUpdated={onCompanyUpdated}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  No companies found. Please add a company using the "Add Company" button above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="text-sm text-muted-foreground">
          Showing {companies.length} companies
        </div>
      </CardFooter>
    </Card>
  );
};
