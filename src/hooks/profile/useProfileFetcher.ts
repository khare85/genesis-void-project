
// Update this part in useProfileFetcher.ts where it fetches the resume URL

const fetchResumeUrls = async (userId: string) => {
  // First check applications table for a resume
  const { data: applications } = await supabase
    .from('applications')
    .select('resume_url')
    .eq('candidate_id', userId)
    .not('resume_url', 'is', null)
    .order('created_at', { ascending: false });
  
  if (applications && applications.length > 0 && applications[0].resume_url) {
    console.log('Found resume URL from applications table:', applications[0].resume_url);
    return applications[0].resume_url;
  }
  
  // If not found in applications, check profiles table
  const { data: profiles } = await supabase
    .from('profiles')
    .select('resume_url')
    .eq('id', userId)
    .not('resume_url', 'is', null)
    .single();
    
  if (profiles && profiles.resume_url) {
    console.log('Found resume URL from profiles table:', profiles.resume_url);
    return profiles.resume_url;
  }

  // Check onboarding progress in localStorage
  const onboardingProgress = localStorage.getItem(`onboarding_progress_${userId}`);
  if (onboardingProgress) {
    try {
      const progress = JSON.parse(onboardingProgress);
      if (progress.resumeData && progress.resumeData.uploadedUrl) {
        console.log('Found resume URL from onboarding progress:', progress.resumeData.uploadedUrl);
        return progress.resumeData.uploadedUrl;
      }
    } catch (e) {
      console.error('Error parsing onboarding progress:', e);
    }
  }
  
  console.log('No resume URL found for user:', userId);
  return null;
};
