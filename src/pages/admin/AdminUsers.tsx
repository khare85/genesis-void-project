
import React, { useState, useCallback } from 'react';
import { Users, UserPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddUserForm from "@/components/admin/AddUserForm";
import PageHeader from "@/components/shared/PageHeader";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { useUserFiltering } from "@/hooks/admin/useUserFiltering";
import { formatRole, formatDate, getStatusBadge } from "@/utils/userUtils";
import { useUsers } from "@/hooks/admin/useUsers";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const AdminUsers = () => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const { users, loading, error, refreshUsers } = useUsers();
  
  console.log('AdminUsers: Rendering with', users.length, 'users');
  
  const {
    searchQuery,
    setSearchQuery,
    roleFilter,
    statusFilter,
    handleRoleFilterChange,
    handleStatusFilterChange,
    filteredUsers
  } = useUserFiltering(users);

  const handleUserAdded = useCallback(() => {
    console.log('User added, refreshing users list...');
    refreshUsers();
    setIsAddUserDialogOpen(false);
    toast.success("User added successfully");
  }, [refreshUsers]);

  const handleEditUser = (userId: string | number) => {
    // For now, just show a toast that we would edit this user
    toast.info(`Editing user with ID: ${userId}`);
    // Future enhancement: Open edit dialog or navigate to edit page
  };

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
        onUserAdded={handleUserAdded}
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
            
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-muted-foreground">
                Error loading users: {error}
              </div>
            ) : (
              <UsersTable
                users={filteredUsers}
                formatRole={formatRole}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                onEdit={handleEditUser}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
