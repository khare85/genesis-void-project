
import React from 'react';
import { Filter, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface UsersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  roleFilter: string | null;
  statusFilter: string | null;
  onRoleFilterChange: (role: string | null) => void;
  onStatusFilterChange: (status: string | null) => void;
}

export const UsersFilters: React.FC<UsersFiltersProps> = ({
  searchQuery,
  onSearchChange,
  roleFilter,
  statusFilter,
  onRoleFilterChange,
  onStatusFilterChange
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between">
      <div className="flex-1 min-w-[280px]">
        <Input
          placeholder="Search users by name, email or company..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-4 w-4" />
              Role {roleFilter && '(1)'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {['admin', 'hiring_manager', 'recruiter', 'candidate'].map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => onRoleFilterChange(role)}
                className={roleFilter === role ? 'bg-muted' : ''}
              >
                {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-4 w-4" />
              Status {statusFilter && '(1)'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => onStatusFilterChange('active')}
              className={statusFilter === 'active' ? 'bg-muted' : ''}
            >
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              Active
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusFilterChange('inactive')}
              className={statusFilter === 'inactive' ? 'bg-muted' : ''}
            >
              <XCircle className="h-4 w-4 mr-2 text-muted-foreground" />
              Inactive
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusFilterChange('pending')}
              className={statusFilter === 'pending' ? 'bg-muted' : ''}
            >
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              Pending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
