
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { Search } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "react-router-dom";
import { DEMO_USERS } from "@/lib/auth/mockUsers";
import { useApplications } from "@/hooks/useApplications";
import DashboardStatCards from "@/components/candidate/dashboard/DashboardStatCards";
import DashboardApplicationsList from "@/components/candidate/dashboard/DashboardApplicationsList";
import UpcomingInterviews from "@/components/candidate/dashboard/UpcomingInterviews";
import ProfileCompletionCard from "@/components/candidate/dashboard/ProfileCompletionCard";
import DashboardCareerInsights from "@/components/candidate/DashboardCareerInsights";
import InterviewPrep from "@/components/candidate/dashboard/InterviewPrep";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const isDemoUser = user ? Object.values(DEMO_USERS).some(demoUser => demoUser.id === user.id) : false;
  const { data: applications, isLoading } = useApplications();
  
  // Filter applications for dashboard display
  const realActiveApplications = applications?.filter(app => 
    !['Offer Accepted', 'Rejected', 'Withdrawn'].includes(app.status)
  ) || [];
  
  const realCompletedApplications = applications?.filter(app => 
    ['Offer Accepted', 'Rejected', 'Withdrawn'].includes(app.status)
  ) || [];

  // Demo applications data
  const demoActiveApplications = [
    { 
      id: "1",
      title: 'Senior React Developer', 
      company: 'TechCorp Inc.', 
      status: 'Interview Scheduled', 
      date: '2 days ago',
      statusColor: 'bg-blue-500'
    },
    { 
      id: "2",
      title: 'Frontend Developer', 
      company: 'WebSolutions Ltd', 
      status: 'Application Under Review', 
      date: '1 week ago',
      statusColor: 'bg-amber-500'
    },
    { 
      id: "3",
      title: 'Full Stack Engineer', 
      company: 'InnoTech Systems', 
      status: 'Technical Assessment', 
      date: '5 days ago',
      statusColor: 'bg-purple-500'
    },
    { 
      id: "4",
      title: 'UI/UX Developer', 
      company: 'DesignPro Agency', 
      status: 'Application Submitted', 
      date: '2 weeks ago',
      statusColor: 'bg-gray-500'
    }
  ];

  const demoCompletedApplications = [
    { 
      id: "5",
      title: 'JavaScript Developer', 
      company: 'SoftDev Inc.', 
      status: 'Offer Accepted', 
      date: '2 months ago',
      statusColor: 'bg-green-500',
      icon: null // Removing direct JSX reference
    },
    { 
      id: "6",
      title: 'Frontend Engineer', 
      company: 'TechStart', 
      status: 'Rejected', 
      date: '3 months ago',
      statusColor: 'bg-red-500',
      icon: null // Removing direct JSX reference
    },
    { 
      id: "7",
      title: 'Web Developer', 
      company: 'DigitalWorks', 
      status: 'Withdrawn', 
      date: '1 month ago',
      statusColor: 'bg-gray-500',
      icon: null // Removing direct JSX reference
    }
  ];
  
  // Use either real or demo data based on user type
  const activeApplications = isDemoUser ? demoActiveApplications : realActiveApplications;
  const completedApplications = isDemoUser ? demoCompletedApplications : realCompletedApplications;
  
  // Count stats
  const upcomingInterviews = isDemoUser ? 2 : 0; // Would be fetched from an API for real users
  const completedInterviews = isDemoUser ? 3 : 0; // Would be fetched from an API for real users
  const profileCompletion = isDemoUser ? 85 : 50; // Would be calculated from profile data for real users
  
  return <div className="space-y-6">
      <PageHeader 
        title={`Welcome back, ${user?.name.split(" ")[0]}`} 
        description="Track your job applications and upcoming interviews" 
        actions={
          <Button size="sm" asChild>
            <Link to="/candidate/jobs" className="gap-1.5">
              <Search className="h-4 w-4" />
              Browse Jobs
            </Link>
          </Button>
        } 
      />

      <DashboardStatCards 
        activeApplicationsCount={activeApplications.length}
        upcomingInterviews={upcomingInterviews}
        completedInterviews={completedInterviews}
        profileCompletion={profileCompletion}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardApplicationsList 
          activeApplications={activeApplications}
          completedApplications={completedApplications}
          isLoading={isLoading}
          isDemoUser={isDemoUser}
        />

        <UpcomingInterviews isDemoUser={isDemoUser} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <ProfileCompletionCard />
        <div className="md:col-span-2">
          <DashboardCareerInsights />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <InterviewPrep />
        <div className="md:col-span-2">
          {/* Additional content can go here in the future */}
        </div>
      </div>
    </div>;
};

export default CandidateDashboard;
