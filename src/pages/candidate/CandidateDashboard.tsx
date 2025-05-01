
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import DashboardStatCards from '@/components/candidate/dashboard/DashboardStatCards';
import DashboardApplicationsList from '@/components/candidate/dashboard/DashboardApplicationsList';
import InterviewPrep from '@/components/candidate/dashboard/InterviewPrep';
import ProfileCompletionCard from '@/components/candidate/dashboard/ProfileCompletionCard';
import { OnboardingProvider } from '@/context/OnboardingContext';
import DashboardOnboarding from '@/components/candidate/dashboard/DashboardOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isDemoUser } from '@/lib/auth/mockUsers';

const CandidateDashboard = () => {
  const { user } = useAuth();
  
  // Initial state setup
  const [dashboardData, setDashboardData] = useState({
    activeApplicationsCount: 0,
    upcomingInterviews: 0,
    completedInterviews: 0,
    profileCompletion: 0,
    activeApplications: [],
    completedApplications: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  // Fetch real data if not using demo user
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      // Check if this is a demo user
      const isDemo = user.email ? isDemoUser(user.email) : false;
      setIsDemoUser(isDemo);

      if (isDemo) {
        // Use mock data for demo users
        setDashboardData({
          activeApplicationsCount: 3,
          upcomingInterviews: 2,
          completedInterviews: 5,
          profileCompletion: 75,
          activeApplications: [
            {
              id: 1,
              title: "Full-Stack Developer",
              company: "TechCorp",
              date: "2 days ago",
              status: "Under Review",
              statusColor: "bg-blue-500"
            },
            {
              id: 2,
              title: "Frontend Engineer",
              company: "WebSoft",
              date: "5 days ago",
              status: "Interview",
              statusColor: "bg-purple-500"
            }
          ],
          completedApplications: [
            {
              id: 3,
              title: "Software Engineer",
              company: "CodeLab",
              date: "Apr 15, 2025",
              status: "Offer Accepted",
              statusColor: "bg-green-500"
            }
          ]
        });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch applications for the user
        const { data: applications, error: appError } = await supabase
          .from('applications')
          .select(`
            *,
            jobs(title, company)
          `)
          .eq('candidate_id', user.id)
          .order('created_at', { ascending: false });
        
        if (appError) throw appError;
        
        // Fetch interviews for the user
        const { data: interviews, error: interviewError } = await supabase
          .from('interviews')
          .select(`
            *,
            applications(
              candidate_id,
              jobs(title, company)
            )
          `)
          .filter('applications.candidate_id', 'eq', user.id)
          .order('scheduled_at', { ascending: true });
        
        if (interviewError) throw interviewError;
        
        // Process applications
        const activeApps = [];
        const completedApps = [];
        
        applications?.forEach(app => {
          const formattedApp = {
            id: app.id,
            title: app.jobs?.title || 'Untitled Position',
            company: app.jobs?.company || 'Unknown Company',
            date: new Date(app.created_at).toLocaleDateString(),
            status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
            statusColor: getStatusColor(app.status)
          };
          
          if (['rejected', 'accepted', 'withdrawn'].includes(app.status)) {
            completedApps.push(formattedApp);
          } else {
            activeApps.push(formattedApp);
          }
        });
        
        // Process interviews
        const upcomingCount = interviews?.filter(i => 
          new Date(i.scheduled_at) > new Date() && i.status !== 'completed'
        ).length || 0;
        
        const completedCount = interviews?.filter(i => 
          i.status === 'completed'
        ).length || 0;
        
        // Calculate profile completion (simple version)
        let profileCompletion = 0;
        if (user) {
          // Add a default score just for having signed up
          profileCompletion = 25;
          
          // Check if user has completed applications
          if (applications && applications.length > 0) {
            profileCompletion += 25;
          }
          
          // Check if user has uploaded a resume
          const hasResume = applications?.some(app => app.resume_url);
          if (hasResume) {
            profileCompletion += 25;
          }
          
          // Check if user has completed video interviews
          if (completedCount > 0) {
            profileCompletion += 25;
          }
          
          // Cap at 100%
          profileCompletion = Math.min(profileCompletion, 100);
        }
        
        setDashboardData({
          activeApplicationsCount: activeApps.length,
          upcomingInterviews: upcomingCount,
          completedInterviews: completedCount,
          profileCompletion: profileCompletion,
          activeApplications: activeApps,
          completedApplications: completedApps
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  // Helper function to determine status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'review':
      case 'under review':
        return 'bg-blue-500';
      case 'interview':
        return 'bg-purple-500';
      case 'accepted':
      case 'offer':
      case 'offer accepted':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'withdrawn':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <OnboardingProvider>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">
          Access your job applications, track your progress, and prepare for interviews.
        </p>

        <DashboardStatCards 
          activeApplicationsCount={dashboardData.activeApplicationsCount}
          upcomingInterviews={dashboardData.upcomingInterviews}
          completedInterviews={dashboardData.completedInterviews}
          profileCompletion={dashboardData.profileCompletion}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DashboardApplicationsList 
              activeApplications={dashboardData.activeApplications}
              completedApplications={dashboardData.completedApplications}
              isLoading={isLoading}
              isDemoUser={isDemoUser}
            />
          </div>
          <div className="space-y-6">
            <ProfileCompletionCard />
            <InterviewPrep />
          </div>
        </div>
        
        {/* Onboarding System */}
        <DashboardOnboarding />
      </div>
    </OnboardingProvider>
  );
};

export default CandidateDashboard;
