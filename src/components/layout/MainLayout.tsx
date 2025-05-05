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
        <Sidebar className="border-r border-slate-200/20">
          <SidebarHeader className="flex items-left h-16 px-6 bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-700">
            <div className="flex flex-col gap-0 font-bold">
              <span className="text-xl text-white">Persona AI</span>
              <span className="text-[10px] text-blue-200">A Bright Tier Solutions Product</span>
            </div>
          </SidebarHeader>
          
          <SidebarRail />
          
          <SidebarContent className="bg-gradient-to-b from-blue-900 to-blue-950">
            <SidebarNavigation />
          </SidebarContent>
          
          <SidebarFooter className="bg-gradient-to-b from-blue-950 to-blue-900 rounded-none">
            {shouldShowAICredits && <div className="m-4">
                <div className="rounded-2xl bg-transparent">
                  <div className="mb-3 flex items-center">
                    <div className="mr-2 rounded-full h-2 w-2 bg-blue-400 animate-pulse-subtle"></div>
                    <p className="text-sm font-medium text-white">AI Credits</p>
                  </div>
                  <div className="mb-3 h-2 rounded-full bg-blue-900/30">
                    <div style={{
                  width: `${isLoading ? 0 : Math.min(creditsPercentage, 100)}%`
                }} className="h-full rounded-full transition-all duration-300 ease-in-out bg-blue-400"></div>
                  </div>
                  {isLoading ? <p className="text-xs text-blue-200">Loading credits...</p> : <p className="text-xs text-blue-200">
                      ${credits?.usedCredits.toFixed(2)} / ${credits?.totalCredits.toFixed(2)} credits used
                    </p>}
                </div>
              </div>}
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex flex-col bg-slate-50">
          <div className="flex items-center h-16 px-4 bg-white border-b border-slate-200 shadow-sm">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <SidebarTrigger className="mr-4 text-slate-600 hover:bg-slate-100 rounded-md" />
                <div className="flex md:w-60 lg:w-72">
                  <div className="relative w-full">
                    <input type="search" placeholder="Search..." className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50" />
                  </div>
                </div>
              </div>
              <Header />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/80">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>;
};
export default MainLayout;