
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string | null;
  status: string;
  lastLogin: string | null;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshUsers = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch profiles with user_roles and user information
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            last_name,
            email,
            company
          `);

        if (profilesError) {
          throw profilesError;
        }

        // Get roles for users
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
        }

        // Create a map of user roles for quick lookup
        const roleMap = new Map();
        if (userRoles) {
          userRoles.forEach(ur => roleMap.set(ur.user_id, ur.role));
        }

        // Transform profiles into our application user format
        const transformedUsers = profiles?.map(profile => {
          const name = profile.first_name && profile.last_name 
            ? `${profile.first_name} ${profile.last_name}`.trim()
            : profile.email || 'Unknown';
          
          return {
            id: profile.id,
            name: name,
            email: profile.email || '',
            role: roleMap.get(profile.id) || 'unknown',
            company: profile.company || null,
            status: 'active', // Default status since we can't directly query auth.users
            lastLogin: null,  // We don't have this information with regular API
          };
        }) || [];

        setUsers(transformedUsers);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        setError(error.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);

  return { users, loading, error, refreshUsers };
};
