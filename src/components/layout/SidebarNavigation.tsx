
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { BarChart, Briefcase, Building2, FileText, HomeIcon, Users, CreditCard, Settings, Video, FileCheck, User, Search } from 'lucide-react';

const SidebarNavigation = () => {
  const {
    user
  } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();

  // Removed the sidebar expansion effect

  if (!user) return null;

  // Navigation items based on user role
  const getNavItems = () => {
    const items = [];
    switch (user.role) {
      case 'admin':
        items.push({
          href: '/admin/dashboard',
          label: 'Dashboard',
          icon: <HomeIcon className="h-5 w-5" />
        }, {
          href: '/admin/companies',
          label: 'Companies',
          icon: <Building2 className="h-5 w-5" />
        }, {
          href: '/admin/users',
          label: 'Users',
          icon: <Users className="h-5 w-5" />
        }, {
          href: '/admin/billing',
          label: 'Subscriptions',
          icon: <CreditCard className="h-5 w-5" />
        }, {
          href: '/admin/settings',
          label: 'Settings',
          icon: <Settings className="h-5 w-5" />
        });
        break;
      case 'hiring_manager':
        items.push({
          href: '/manager/dashboard',
          label: 'Dashboard',
          icon: <HomeIcon className="h-5 w-5" />
        }, {
          href: '/manager/jobs',
          label: 'Job Listings',
          icon: <Briefcase className="h-5 w-5" />
        }, {
          href: '/manager/candidates',
          label: 'Candidates',
          icon: <Users className="h-5 w-5" />
        }, {
          href: '/manager/interviews',
          label: 'Interviews',
          icon: <Video className="h-5 w-5" />
        }, {
          href: '/manager/analytics',
          label: 'Analytics',
          icon: <BarChart className="h-5 w-5" />
        });
        break;
      case 'recruiter':
        items.push({
          href: '/recruiter/dashboard',
          label: 'Dashboard',
          icon: <HomeIcon className="h-5 w-5" />
        }, {
          href: '/recruiter/jobs',
          label: 'Job Listings',
          icon: <Briefcase className="h-5 w-5" />
        }, {
          href: '/recruiter/screening',
          label: 'AI Screening',
          icon: <FileCheck className="h-5 w-5" />
        }, {
          href: '/recruiter/candidates',
          label: 'Talent Pool',
          icon: <Users className="h-5 w-5" />
        });
        break;
      case 'candidate':
        items.push({
          href: '/candidate/dashboard',
          label: 'Dashboard',
          icon: <HomeIcon className="h-5 w-5" />
        }, {
          href: '/candidate/jobs',
          label: 'Browse Jobs',
          icon: <Search className="h-5 w-5" />
        }, {
          href: '/candidate/applications',
          label: 'Applications',
          icon: <FileText className="h-5 w-5" />
        }, {
          href: '/candidate/interviews',
          label: 'Interviews',
          icon: <Video className="h-5 w-5" />
        }, {
          href: '/candidate/profile',
          label: 'My Profile',
          icon: <User className="h-5 w-5" />
        });
        break;
    }
    return items;
  };
  const navItems = getNavItems();
  return <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map(item => <SidebarMenuItem key={item.href}>
              <SidebarMenuButton isActive={location.pathname === item.href} tooltip={item.label} asChild>
                <Link to={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>)}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>;
};
export default SidebarNavigation;
