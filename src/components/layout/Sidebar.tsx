
import React from 'react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import SidebarHeader from './SidebarHeader';
import NavigationItems from './NavigationItems';
import UserProfileSection from './UserProfileSection';

const Sidebar = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <aside 
      className="flex flex-col fixed left-0 top-0 bottom-0 border-r bg-white z-20 w-64"
    >
      {/* Header with logo */}
      <SidebarHeader collapsed={false} />
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <NavigationItems collapsed={false} />
      </nav>
      
      {/* User profile section at the bottom */}
      <Separator className="mx-3" />
      <UserProfileSection collapsed={false} />
    </aside>
  );
};

export default Sidebar;
