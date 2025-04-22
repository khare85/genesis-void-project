
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  company: string | null;
  status: string;
  lastLogin: string | null;
}

export const useUserFiltering = (users: User[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.company && user.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleFilterChange = (role: string | null) => {
    setRoleFilter(role === roleFilter ? null : role);
  };
  
  const handleStatusFilterChange = (status: string | null) => {
    setStatusFilter(status === statusFilter ? null : status);
  };

  return {
    searchQuery,
    setSearchQuery,
    roleFilter,
    statusFilter,
    handleRoleFilterChange,
    handleStatusFilterChange,
    filteredUsers
  };
};
