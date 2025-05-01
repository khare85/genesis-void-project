
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Briefcase,
  Building2,
  FileText,
  HomeIcon,
  Users,
  CreditCard,
  Settings,
  Video,
  FileCheck,
  User
} from 'lucide-react';

interface NavigationItemsProps {
  collapsed: boolean;
}

const NavigationItems: React.FC<NavigationItemsProps> = ({ collapsed }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  // Navigation items based on user role
  const getNavItems = () => {
    const items = [];
    
    switch (user.role) {
      case 'admin':
        items.push(
          { href: '/admin/dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
          { href: '/admin/companies', label: 'Companies', icon: <Building2 className="h-5 w-5" /> },
          { href: '/admin/users', label: 'Users', icon: <Users className="h-5 w-5" /> },
          { href: '/admin/billing', label: 'Subscriptions', icon: <CreditCard className="h-5 w-5" /> },
          { href: '/admin/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> }
        );
        break;
      
      case 'hiring_manager':
        items.push(
          { href: '/manager/dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
          { href: '/manager/jobs', label: 'Job Listings', icon: <Briefcase className="h-5 w-5" /> },
          { href: '/manager/candidates', label: 'Candidates', icon: <Users className="h-5 w-5" /> },
          { href: '/manager/interviews', label: 'Interviews', icon: <Video className="h-5 w-5" /> },
          { href: '/manager/analytics', label: 'Analytics', icon: <BarChart className="h-5 w-5" /> }
        );
        break;
        
      case 'recruiter':
        items.push(
          { href: '/recruiter/dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
          { href: '/recruiter/jobs', label: 'Job Listings', icon: <Briefcase className="h-5 w-5" /> },
          { href: '/recruiter/screening', label: 'AI Screening', icon: <FileCheck className="h-5 w-5" /> },
          { href: '/recruiter/candidates', label: 'Talent Pool', icon: <Users className="h-5 w-5" /> }
        );
        break;
        
      case 'candidate':
        items.push(
          { href: '/candidate/dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
          { href: '/candidate/applications', label: 'Applications', icon: <FileText className="h-5 w-5" /> },
          { href: '/candidate/interviews', label: 'Interviews', icon: <Video className="h-5 w-5" /> },
          { href: '/candidate/profile', label: 'My Profile', icon: <User className="h-5 w-5" /> }
        );
        break;
    }
    
    return items;
  };
  
  const navItems = getNavItems();
  
  return (
    <div className="px-3 py-2">
      {!collapsed && (
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
          Navigation
        </h2>
      )}
      <div className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={location.pathname === item.href ? 'secondary' : 'ghost'}
            className={cn(
              "w-full justify-start",
              location.pathname === item.href && "bg-secondary/50",
              collapsed && "justify-center p-2"
            )}
            asChild
          >
            <Link to={item.href}>
              {item.icon}
              {!collapsed && <span className="ml-2">{item.label}</span>}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NavigationItems;
