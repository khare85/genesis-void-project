
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
        
        // Get users from auth
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          throw authError;
        }

        if (!authUsers || !authUsers.users) {
          setUsers([]);
          return;
        }

        // Get roles for users
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
        }

        // Get profiles for additional user info
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, company');

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        // Create a map of user roles and profiles for quick lookup
        const roleMap = new Map();
        if (userRoles) {
          userRoles.forEach(ur => roleMap.set(ur.user_id, ur.role));
        }

        const profileMap = new Map();
        if (profiles) {
          profiles.forEach(p => profileMap.set(p.id, p));
        }

        // Transform auth users into our application user format
        const transformedUsers = authUsers.users.map(user => {
          const profile = profileMap.get(user.id);
          const name = profile 
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() 
            : (user.user_metadata?.first_name && user.user_metadata?.last_name 
                ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}` 
                : user.email);
          
          return {
            id: user.id,
            name: name || 'Unknown',
            email: user.email || '',
            role: roleMap.get(user.id) || 'unknown',
            company: profile?.company || null,
            status: user.banned ? 'inactive' : (user.email_confirmed_at ? 'active' : 'pending'),
            lastLogin: user.last_sign_in_at,
          };
        });

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
