import React, { useState } from 'react';
import AddUserForm from "@/components/admin/AddUserForm";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  // Filter users based on search query and filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.company && user.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Format date to readable string
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge component based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format role for display
  const formatRole = (role: string) => {
    switch(role) {
      case 'admin':
        return 'Admin';
      case 'hiring_manager':
        return 'Hiring Manager';
      case 'recruiter':
        return 'Recruiter';
      case 'candidate':
        return 'Candidate';
      default:
        return role;
    }
  };
  
  // Handle role filter change
  const handleRoleFilterChange = (role: string | null) => {
    setRoleFilter(role === roleFilter ? null : role);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (status: string | null) => {
    setStatusFilter(status === statusFilter ? null : status);
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
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex-1 min-w-[280px]">
                <Input
                  placeholder="Search users by name, email or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    <DropdownMenuItem 
                      onClick={() => handleRoleFilterChange('admin')}
                      className={roleFilter === 'admin' ? 'bg-muted' : ''}
                    >
                      Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleRoleFilterChange('hiring_manager')}
                      className={roleFilter === 'hiring_manager' ? 'bg-muted' : ''}
                    >
                      Hiring Manager
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleRoleFilterChange('recruiter')}
                      className={roleFilter === 'recruiter' ? 'bg-muted' : ''}
                    >
                      Recruiter
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleRoleFilterChange('candidate')}
                      className={roleFilter === 'candidate' ? 'bg-muted' : ''}
                    >
                      Candidate
                    </DropdownMenuItem>
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
                      onClick={() => handleStatusFilterChange('active')}
                      className={statusFilter === 'active' ? 'bg-muted' : ''}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusFilterChange('inactive')}
                      className={statusFilter === 'inactive' ? 'bg-muted' : ''}
                    >
                      <XCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                      Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusFilterChange('pending')}
                      className={statusFilter === 'pending' ? 'bg-muted' : ''}
                    >
                      <Clock className="h-4 w-4 mr-2 text-amber-500" />
                      Pending
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{formatRole(user.role)}</TableCell>
                      <TableCell>{user.company || '-'}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No users found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
