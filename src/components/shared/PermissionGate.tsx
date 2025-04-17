
import React from 'react';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { UserPermissions } from '@/lib/types/user';

interface PermissionGateProps {
  children: React.ReactNode;
  require: keyof UserPermissions;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({ children, require }) => {
  const permissions = usePermissions();
  
  if (!permissions[require]) {
    return null;
  }
  
  return <>{children}</>;
};
