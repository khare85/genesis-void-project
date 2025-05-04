import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '@/lib/auth';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarProvider, SidebarInset, SidebarRail, SidebarTrigger } from '@/components/ui/sidebar';
import SidebarNavigation from './SidebarNavigation';
import { useOpenAICredits } from '@/hooks/useOpenAICredits';
const MainLayout: React.FC = () => {
  const {
    user
  } = useAuth();
  const {
    data: credits,
    isLoading
  } = useOpenAICredits();
  if (!user) return <Outlet />;

  // Calculate the percentage for the progress bar
  const creditsPercentage = credits ? credits.usedCredits / credits.totalCredits * 100 : 0;

  // Determine if we should show AI credits based on user role
  const shouldShowAICredits = user.role !== 'candidate';
  return <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar>
          <SidebarHeader className="flex items-left h-16 px-6">
            <div className="flex flex-col gap-0 font-bold">
              <span className="text-xl text-primary">Persona AI</span>
              <span className="text-[10px] text-muted-foreground">A Bright Tier Solutions Product</span>
            </div>
          </SidebarHeader>
          
          <SidebarRail />
          
          <SidebarContent>
            <SidebarNavigation />
          </SidebarContent>
          
          <SidebarFooter>
            {shouldShowAICredits && <div className="m-4">
                <div className="bg-gradient-to-br from-blue-50/90 to-blue-100/50 rounded-lg border border-blue-100/80 p-4 shadow-sm">
                  <div className="mb-3 flex items-center">
                    <div className="mr-2 rounded-full bg-blue-500 h-2 w-2"></div>
                    <p className="text-sm font-medium text-gray-800">AI Credits</p>
                  </div>
                  <div className="mb-3 h-2 rounded-full bg-blue-100">
                    <div className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-in-out" style={{
                  width: `${isLoading ? 0 : Math.min(creditsPercentage, 100)}%`
                }}></div>
                  </div>
                  {isLoading ? <p className="text-xs text-gray-700">Loading credits...</p> : <p className="text-xs text-gray-700">
                      ${credits?.usedCredits.toFixed(2)} / ${credits?.totalCredits.toFixed(2)} credits used
                    </p>}
                </div>
              </div>}
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <div className="flex items-center h-16 px-4 border-b">
            <SidebarTrigger className="mr-2" />
            <Header />
          </div>
          <div className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>;
};
export default MainLayout;