
import React from 'react';
import {
  MoreHorizontal,
  EyeIcon,
  EditIcon,
  Trash2Icon
} from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Company } from '../../../types/company';

interface CompanyTableRowProps {
  company: Company;
  onViewDetails: (id: string) => void;
}

export const CompanyTableRow = ({ company, onViewDetails }: CompanyTableRowProps) => {
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

  return (
    <TableRow>
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
            <DropdownMenuItem onClick={() => onViewDetails(company.id)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
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
  );
};
