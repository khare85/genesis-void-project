
import React from 'react';
import { useAuth } from '@/lib/auth';
import DashboardStatCards from '@/components/candidate/dashboard/DashboardStatCards';
import DashboardApplicationsList from '@/components/candidate/dashboard/DashboardApplicationsList';
import InterviewPrep from '@/components/candidate/dashboard/InterviewPrep';
import ProfileCompletionCard from '@/components/candidate/dashboard/ProfileCompletionCard';
import { OnboardingProvider } from '@/context/OnboardingContext';
import DashboardOnboarding from '@/components/candidate/dashboard/DashboardOnboarding';

const CandidateDashboard = () => {
  const { user } = useAuth();

  return (
    <OnboardingProvider>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">
          Access your job applications, track your progress, and prepare for interviews.
        </p>

        <DashboardStatCards />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DashboardApplicationsList />
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
