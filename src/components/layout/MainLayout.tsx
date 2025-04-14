
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '@/lib/auth';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarInset
} from '@/components/ui/sidebar';
import SidebarNavigation from './SidebarNavigation';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return <Outlet />;
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar>
          <SidebarHeader className="flex items-center h-16 border-b px-6">
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <span className="sr-only">Persona AI</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
                <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
                <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
                <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
              </svg>
              <span>Persona AI</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarNavigation />
          </SidebarContent>
          
          <SidebarFooter>
            <div className="m-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="mb-2 flex items-center">
                  <span className="mr-2 rounded-full bg-primary h-2 w-2"></span>
                  <p className="text-sm font-medium">AI Credits</p>
                </div>
                <div className="mb-2 h-2 rounded-full bg-muted-foreground/20">
                  <div className="h-full w-2/3 rounded-full bg-primary"></div>
                </div>
                <p className="text-xs text-muted-foreground">1,254 / 2,000 credits used</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <Header />
          <div className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
