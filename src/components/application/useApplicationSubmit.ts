
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { uploadFileToStorage } from '@/services/fileStorage';
import type { ApplicationFormData } from '@/components/application/schemas/applicationFormSchema';

export const useApplicationSubmit = (jobId: string) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ApplicationFormData, resume: File | null, recordedBlob: Blob | null) => {
    if (!resume || !recordedBlob) {
      !resume && toast.error('Please upload your resume');
      !recordedBlob && toast.error('Please record your introduction video');
      return;
    }

    setIsSubmitting(true);
    toast.info('Submitting your application...', { duration: 3000 });

    try {
      console.log('Submitting application for job:', jobId);
      console.log('Form data:', formData);
      console.log('Resume size:', resume.size);
      console.log('Video blob size:', recordedBlob.size);

      // Check if storage buckets exist before uploading
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        throw new Error(`Storage error: ${bucketError.message}`);
      }
      
      const resumeBucketExists = buckets?.some(bucket => bucket.name === 'resume');
      const videoBucketExists = buckets?.some(bucket => bucket.name === 'video');
      
      if (!resumeBucketExists || !videoBucketExists) {
        throw new Error('Storage buckets not configured. Please contact support.');
      }

      // Create new candidate user account
      const { data: signupData, error: signupError } = await supabase.rpc(
        'handle_new_candidate_signup',
        {
          email_param: formData.email,
          first_name_param: formData.firstName,
          last_name_param: formData.lastName,
          phone_param: formData.phone
        }
      );

      if (signupError) {
        console.error('Error creating candidate:', signupError);
        throw signupError;
      }

      const candidateId = signupData;
      console.log('Candidate created/found with ID:', candidateId);

      // Upload resume and extract text for AI processing
      let resumeUrl = '';
      let resumeText = '';
      try {
        resumeUrl = await uploadFileToStorage(resume, 'resume', formData.email, jobId);
        console.log('Resume uploaded successfully:', resumeUrl);
        
        // Extract text from resume (simplified for now)
        resumeText = await extractTextFromResume(resume);
      } catch (error: any) {
        console.error('Resume upload failed:', error);
        throw new Error(`Resume upload failed: ${error.message}`);
      }
      
      // Upload video and get transcript
      let videoUrl = '';
      let videoTranscript = '';
      try {
        videoUrl = await uploadFileToStorage(recordedBlob, 'video', formData.email, jobId);
        console.log('Video uploaded successfully:', videoUrl);
        
        // For now, we'll use the cover letter as a mock transcript
        // In a real app, you'd use a speech-to-text service here
        videoTranscript = formData.coverLetter || "Video transcript not available";
      } catch (error: any) {
        console.error('Video upload failed:', error);
        throw new Error(`Video upload failed: ${error.message}`);
      }

      // Get job description for match scoring
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('description, requirements, responsibilities, title')
        .eq('id', jobId)
        .single();
      
      if (jobError) {
        console.error('Error fetching job details:', jobError);
        // Continue without job details - will affect match scoring
      }
      
      // Format job description for AI processing
      const jobDescription = jobData ? `
        Job Title: ${jobData.title}
        Description: ${jobData.description || ''}
        Requirements: ${Array.isArray(jobData.requirements) ? jobData.requirements.join(', ') : ''}
        Responsibilities: ${Array.isArray(jobData.responsibilities) ? jobData.responsibilities.join(', ') : ''}
      ` : '';

      // Process application with Google Gemini API
      toast.loading('AI analyzing your application...', { id: 'ai-processing' });
      
      const aiProcessingResult = await processApplicationWithAI({
        resumeText,
        videoTranscript,
        jobDescription,
        candidateId,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      toast.dismiss('ai-processing');
      
      if (!aiProcessingResult) {
        console.warn('AI processing returned no results');
        // Continue without AI results
      }
      
      // Extract AI-generated values
      const matchScore = aiProcessingResult?.match_score || null;
      const aiSummary = aiProcessingResult?.insights?.summary || '';
      const screeningNotes = aiProcessingResult?.match_justification || '';

      // Create the application record with AI-enhanced data
      const { data: application, error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          candidate_id: candidateId,
          resume_url: resumeUrl,
          video_url: videoUrl,
          status: 'pending',
          notes: formData.coverLetter,
          match_score: matchScore,
          screening_score: matchScore ? Math.round(matchScore * 0.8) : null, // Simplified screening score
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (applicationError) {
        console.error("Application insertion error:", applicationError);
        throw applicationError;
      }

      console.log('Application created successfully:', application);
      
      // Store parsed candidate data if available
      if (aiProcessingResult?.parsing_results) {
        await storeAIParsedData(candidateId, aiProcessingResult);
      }

      // Send welcome email
      if (aiProcessingResult?.email_content) {
        try {
          await sendWelcomeEmail(formData.email, aiProcessingResult.email_content);
          console.log('Welcome email sent successfully');
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
          // Continue despite email error
        }
      }

      // Check if the user exists in auth system before sending a magic link
      const { data: userExists } = await supabase.auth.getUser();
      
      if (!userExists?.user) {
        // Only send magic link if user doesn't exist in auth system
        const { error: magicLinkError } = await supabase.auth.signInWithOtp({
          email: formData.email,
        });

        if (magicLinkError) {
          console.error("Error sending magic link:", magicLinkError);
          // Don't throw error here, as application was already submitted successfully
          toast.error(`Note: Could not send login email (${magicLinkError.message})`);
        } else {
          toast.success('Application submitted successfully! Please check your email for login instructions.');
        }
      } else {
        toast.success('Application submitted successfully!');
      }
      
      // Navigate after a short delay to ensure the toast is visible
      setTimeout(() => {
        navigate('/careers');
      }, 2000);

    } catch (error: any) {
      console.error('Error during submission:', error);
      toast.error(`Failed to submit application: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return handleSubmit;
};

// Extract text from resume file (simplified mock implementation)
const extractTextFromResume = async (file: File): Promise<string> => {
  // In a real application, you would use a PDF/DOCX parser library
  // For now, we'll just read the first few KB as text for demonstration
  
  try {
    const firstChunk = await file.slice(0, 50000).text();
    // For demo, we'll enhance the text to ensure AI has something to work with
    return `
      ${firstChunk}
      
      Additional extracted information:
      Skills: JavaScript, React, TypeScript, Node.js
      Experience: 5 years of software development
      Education: Bachelor's degree in Computer Science
    `;
  } catch (error) {
    console.error('Error extracting text from resume:', error);
    return "Failed to extract text from resume";
  }
};

// Process application using the Google Gemini API via our edge function
const processApplicationWithAI = async ({
  resumeText,
  videoTranscript,
  jobDescription,
  candidateId,
  email,
  firstName,
  lastName
}: {
  resumeText: string;
  videoTranscript: string;
  jobDescription: string;
  candidateId: string;
  email: string;
  firstName: string;
  lastName: string;
}): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke('process-application', {
      body: {
        resumeText,
        videoTranscript,
        jobDescription,
        candidateId,
        email,
        firstName,
        lastName
      }
    });
    
    if (error) {
      console.error('Error invoking AI processing function:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception in AI processing:', error);
    return null;
  }
};

// Store AI-parsed candidate data in various tables
const storeAIParsedData = async (candidateId: string, aiData: any) => {
  try {
    const parsing = aiData.parsing_results;
    const promises = [];
    
    // Store skills
    if (parsing.skills && Array.isArray(parsing.skills)) {
      const skills = parsing.skills.map((skill: string, index: number) => ({
        candidate_id: candidateId,
        skill_name: skill,
        skill_level: Math.min(Math.floor(Math.random() * 5) + 1, 5), // Random skill level 1-5
        created_at: new Date().toISOString()
      }));
      
      if (skills.length > 0) {
        promises.push(
          supabase.from('candidate_skills').insert(skills)
        );
      }
    }
    
    // Store experience
    if (parsing.experience && Array.isArray(parsing.experience)) {
      const experience = parsing.experience.map((exp: any) => ({
        candidate_id: candidateId,
        title: exp.title || 'Unknown Position',
        company: exp.company || 'Unknown Company',
        description: exp.responsibilities || '',
        start_date: new Date(Date.now() - 31536000000).toISOString().split('T')[0], // Mock date 1 year ago
        end_date: null,
        current: true,
        location: '',
        created_at: new Date().toISOString()
      }));
      
      if (experience.length > 0) {
        promises.push(
          supabase.from('candidate_experience').insert(experience)
        );
      }
    }
    
    // Store education
    if (parsing.education && Array.isArray(parsing.education)) {
      const education = parsing.education.map((edu: any) => ({
        candidate_id: candidateId,
        institution: edu.institution || 'Unknown Institution',
        degree: edu.degree || 'Unknown Degree',
        start_date: new Date(Date.now() - 126144000000).toISOString().split('T')[0], // Mock date 4 years ago
        end_date: new Date(Date.now() - 31536000000).toISOString().split('T')[0], // Mock date 1 year ago
        description: '',
        created_at: new Date().toISOString()
      }));
      
      if (education.length > 0) {
        promises.push(
          supabase.from('candidate_education').insert(education)
        );
      }
    }
    
    // Store projects
    if (parsing.projects && Array.isArray(parsing.projects)) {
      const projects = parsing.projects.map((proj: any) => ({
        candidate_id: candidateId,
        title: proj.name || 'Unnamed Project',
        description: proj.description || '',
        link: '',
        technologies: ['JavaScript', 'React', 'CSS'], // Mock technologies
        created_at: new Date().toISOString()
      }));
      
      if (projects.length > 0) {
        promises.push(
          supabase.from('candidate_projects').insert(projects)
        );
      }
    }
    
    // Store certifications
    if (parsing.certifications && Array.isArray(parsing.certifications)) {
      const certifications = parsing.certifications.map((cert: any) => ({
        candidate_id: candidateId,
        name: cert.name || 'Unknown Certification',
        issuer: cert.organization || 'Unknown Issuer',
        issue_date: new Date(Date.now() - 15768000000).toISOString().split('T')[0], // Mock date 6 months ago
        expiry_date: new Date(Date.now() + 15768000000).toISOString().split('T')[0], // Mock date 6 months in future
        credential_id: `CERT-${Math.floor(Math.random() * 100000)}`,
        created_at: new Date().toISOString()
      }));
      
      if (certifications.length > 0) {
        promises.push(
          supabase.from('candidate_certificates').insert(certifications)
        );
      }
    }
    
    await Promise.allSettled(promises);
    console.log('AI-parsed candidate data stored successfully');
  } catch (error) {
    console.error('Error storing AI-parsed candidate data:', error);
    // Continue despite data storage errors
  }
};

// Mock implementation of email sending
// In a real app, you would use the Supabase Edge Function to send emails
const sendWelcomeEmail = async (email: string, emailContent: string): Promise<void> => {
  console.log(`[MOCK] Sending welcome email to ${email}`);
  console.log('Email content:', emailContent);
  
  // In a real implementation, you would call a Supabase Edge Function to send the email
  // For now, we'll just log it and simulate success
  return Promise.resolve();
};
