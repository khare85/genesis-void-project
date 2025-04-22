import React, { useState } from 'react';
import { Users, UserPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddUserForm from "@/components/admin/AddUserForm";
import PageHeader from "@/components/shared/PageHeader";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { useUserFiltering } from "@/hooks/admin/useUserFiltering";
import { formatRole, formatDate, getStatusBadge } from "@/utils/userUtils";

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@technovatex.com",
    role: "hiring_manager",
    company: "TechnovateX",
    status: "active",
    lastLogin: "2025-04-09T09:30:45"
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@globalfinancegroup.com",
    role: "recruiter",
    company: "Global Finance Group",
    status: "active",
    lastLogin: "2025-04-08T15:22:10"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    email: "e.rodriguez@healthcareinc.com",
    role: "hiring_manager",
    company: "Healthcare Inc",
    status: "inactive",
    lastLogin: "2025-03-27T10:45:32"
  },
  {
    id: 4,
    name: "David Wilson",
    email: "d.wilson@technovatex.com",
    role: "recruiter",
    company: "TechnovateX",
    status: "pending",
    lastLogin: null
  },
  {
    id: 5,
    name: "Jennifer Park",
    email: "j.park@educationplus.org",
    role: "candidate",
    company: null,
    status: "active",
    lastLogin: "2025-04-09T08:12:55"
  },
  {
    id: 6,
    name: "Robert Smith",
    email: "r.smith@retailnow.com",
    role: "hiring_manager",
    company: "Retail Now",
    status: "active",
    lastLogin: "2025-04-09T11:05:22"
  },
  {
    id: 7,
    name: "Lisa Wong",
    email: "l.wong@legalexperts.com",
    role: "recruiter",
    company: "Legal Experts LLC",
    status: "active", 
    lastLogin: "2025-04-07T14:30:00"
  },
  {
    id: 8,
    name: "James Miller",
    email: "j.miller@globalfinancegroup.com",
    role: "candidate",
    company: null,
    status: "inactive",
    lastLogin: "2025-03-15T09:20:12"
  },
  {
    id: 9,
    name: "Amanda Harris",
    email: "a.harris@technovatex.com",
    role: "admin",
    company: "HireAI",
    status: "active",
    lastLogin: "2025-04-09T07:45:30"
  },
  {
    id: 10,
    name: "Daniel Lee",
    email: "d.lee@healthcareinc.com",
    role: "hiring_manager",
    company: "Healthcare Inc",
    status: "active",
    lastLogin: "2025-04-08T16:50:15"
  }
];

const AdminUsers = () => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const {
    searchQuery,
    setSearchQuery,
    roleFilter,
    statusFilter,
    handleRoleFilterChange,
    handleStatusFilterChange,
    filteredUsers
  } = useUserFiltering(mockUsers);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage user accounts across the platform"
        icon={<Users className="h-6 w-6" />}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button 
              size="sm" 
              className="gap-1.5"
              onClick={() => setIsAddUserDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </>
        }
      />

      <AddUserForm 
        open={isAddUserDialogOpen} 
        onOpenChange={setIsAddUserDialogOpen} 
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <UsersFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              roleFilter={roleFilter}
              statusFilter={statusFilter}
              onRoleFilterChange={handleRoleFilterChange}
              onStatusFilterChange={handleStatusFilterChange}
            />
            <UsersTable
              users={filteredUsers}
              formatRole={formatRole}
              formatDate={formatDate}
              getStatusBadge={getStatusBadge}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
