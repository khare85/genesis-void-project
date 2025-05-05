
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { BarChart, Briefcase, Building2, FileText, HomeIcon, Users, CreditCard, Settings, Video, FileCheck, User, Search, Sparkles } from 'lucide-react';

const SidebarNavigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  
  if (!user) return null;

  // Get the appropriate icon color based on user role
  const getIconColor = () => {
    switch (user.role) {
      case 'admin': return "text-blue-400";
      case 'recruiter': return "text-blue-400";
      case 'hiring_manager': return "text-blue-400";
      case 'candidate': return "text-blue-400";
      default: return "text-blue-400";
    }
  };

  // Navigation items based on user role
  const getNavItems = () => {
    const iconColor = getIconColor();
    const items = [];
    
    switch (user.role) {
      case 'admin':
        items.push(
          { href: '/admin/dashboard', label: 'Dashboard', icon: <HomeIcon className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/admin/companies', label: 'Companies', icon: <Building2 className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/admin/users', label: 'Users', icon: <Users className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/admin/billing', label: 'Subscriptions', icon: <CreditCard className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/admin/settings', label: 'Settings', icon: <Settings className={`h-5 w-5 ${iconColor}`} /> }
        );
        break;
        
      case 'hiring_manager':
        items.push(
          { href: '/manager/dashboard', label: 'Dashboard', icon: <HomeIcon className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/manager/jobs', label: 'Job Listings', icon: <Briefcase className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/manager/candidates', label: 'Candidates', icon: <Users className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/manager/interviews', label: 'Interviews', icon: <Video className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/manager/analytics', label: 'Analytics', icon: <BarChart className={`h-5 w-5 ${iconColor}`} /> }
        );
        break;
        
      case 'recruiter':
        items.push(
          { href: '/recruiter/dashboard', label: 'Dashboard', icon: <HomeIcon className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/recruiter/jobs', label: 'Job Listings', icon: <Briefcase className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/recruiter/screening', label: 'AI Screening', icon: <Sparkles className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/recruiter/candidates', label: 'Talent Pool', icon: <Users className={`h-5 w-5 ${iconColor}`} /> }
        );
        break;
        
      case 'candidate':
        items.push(
          { href: '/candidate/dashboard', label: 'Dashboard', icon: <HomeIcon className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/candidate/jobs', label: 'Browse Jobs', icon: <Search className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/candidate/applications', label: 'Applications', icon: <FileText className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/candidate/interviews', label: 'Interviews', icon: <Video className={`h-5 w-5 ${iconColor}`} /> },
          { href: '/candidate/profile', label: 'My Profile', icon: <User className={`h-5 w-5 ${iconColor}`} /> }
        );
        break;
    }
    
    return items;
  };
  
  const navItems = getNavItems();
  
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                isActive={location.pathname === item.href} 
                tooltip={item.label} 
                className={`${location.pathname === item.href 
                  ? "bg-blue-800/40 hover:bg-blue-800/60 text-white" 
                  : "hover:bg-blue-800/20 text-blue-100"} 
                  rounded-lg transition-colors`} 
                asChild
              >
                <Link to={item.href} className="flex items-center gap-3 px-4 py-2">
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarNavigation;
