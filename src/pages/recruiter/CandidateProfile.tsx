
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/shared/PageHeader';
import { User } from 'lucide-react';
import { useCandidateProfile } from '@/hooks/recruiter/useCandidateProfile';
import { useCompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';
import { ComprehensiveProfile } from '@/components/recruiter/candidate-profile/ComprehensiveProfile';
import CandidateProfileSidebar from '@/components/recruiter/candidate-profile/CandidateProfileSidebar';

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { candidate, loading: basicLoading } = useCandidateProfile(id);
  const { profile, loading: completeLoading, error } = useCompleteCandidateProfile(id);
  
  const loading = basicLoading || completeLoading;

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || (!candidate && !profile)) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <User className="h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Candidate Not Found</h2>
            <p className="text-muted-foreground">
              {error || "The candidate you are looking for does not exist or you don't have permission to view them."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use the complete profile if available, otherwise use the basic candidate data
  const displayName = profile?.name || candidate?.name;
  const displayTitle = profile?.title || candidate?.position || 'Candidate';

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title={displayName}
        description={displayTitle}
        icon={<User className="h-6 w-6" />}
      />

      {profile ? (
        // Use the comprehensive profile component if we have complete data
        <ComprehensiveProfile profile={profile} />
      ) : (
        // Fallback to the original implementation if we only have basic data
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar with candidate info */}
          <div>
            <CandidateProfileSidebar candidate={candidate!} />
          </div>

          {/* Main content area */}
          <div className="col-span-2">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Limited profile information available. Please check back later for a more complete profile.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfile;
