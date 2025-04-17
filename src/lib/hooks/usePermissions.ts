
import { useAuth } from '@/lib/auth';
import { getRolePermissions, UserPermissions } from '@/lib/types/user';

export const usePermissions = (): UserPermissions => {
  const { user } = useAuth();
  return getRolePermissions(user?.role || 'candidate');
};
