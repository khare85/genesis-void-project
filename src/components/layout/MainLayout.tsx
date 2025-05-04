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
          <SidebarHeader className="flex items-left h-16 px-6 border-b bg-blue-950">
            <div className="flex flex-col gap-0 font-bold">
              <span className="text-xl text-orange-600">Persona AI</span>
              <span className="text-[10px] text-gray-200">A Bright Tier Solutions Product</span>
            </div>
          </SidebarHeader>
          
          <SidebarRail />
          
          <SidebarContent className="bg-blue-950">
            <SidebarNavigation />
          </SidebarContent>
          
          <SidebarFooter className="bg-blue-950">
            {shouldShowAICredits && <div className="m-4">
                <div className="bg-gradient-to-br from-blue-50/90 to-blue-100/50 border border-blue-100/80 p-4 shadow-sm rounded-lg">
                  <div className="mb-3 flex items-center">
                    <div className="mr-2 rounded-full h-2 w-2 bg-orange-600"></div>
                    <p className="text-sm font-medium text-gray-800">AI Credits</p>
                  </div>
                  <div className="mb-3 h-2 rounded-full bg-white">
                    <div style={{
                  width: `${isLoading ? 0 : Math.min(creditsPercentage, 100)}%`
                }} className="h-full rounded-full transition-all duration-300 ease-in-out bg-orange-600"></div>
                  </div>
                  {isLoading ? <p className="text-xs text-gray-700">Loading credits...</p> : <p className="text-xs text-gray-700">
                      ${credits?.usedCredits.toFixed(2)} / ${credits?.totalCredits.toFixed(2)} credits used
                    </p>}
                </div>
              </div>}
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <div className="flex items-center h-16 px-4 border-b bg-blue-950">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <SidebarTrigger className="mr-4 text-white" />
                <div className="flex md:w-60 lg:w-72">
                  <div className="relative w-full">
                    <input type="search" placeholder="Search..." className="w-full rounded-md border border-input py-2 px-3 text-sm outline-none focus:ring-1 focus:ring-ring bg-gray-50" />
                  </div>
                </div>
              </div>
              <Header />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white/[0.31]">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>;
};
export default MainLayout;