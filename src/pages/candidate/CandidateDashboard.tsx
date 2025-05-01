
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import DashboardStatCards from '@/components/candidate/dashboard/DashboardStatCards';
import DashboardApplicationsList from '@/components/candidate/dashboard/DashboardApplicationsList';
import InterviewPrep from '@/components/candidate/dashboard/InterviewPrep';
import ProfileCompletionCard from '@/components/candidate/dashboard/ProfileCompletionCard';
import { OnboardingProvider } from '@/context/OnboardingContext';
import DashboardOnboarding from '@/components/candidate/dashboard/DashboardOnboarding';

const CandidateDashboard = () => {
  const { user } = useAuth();
  
  // Sample data for the dashboard components
  // In a real application, this would come from API calls or context
  const [dashboardData, setDashboardData] = useState({
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
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoUser] = useState(true); // For demo purposes

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
