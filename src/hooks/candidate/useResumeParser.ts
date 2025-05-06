
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { parseResumeWithBestMethod, getParsedResumeText } from '@/services/resumeParser';

export const useResumeParser = () => {
  const [isParsing, setIsParsing] = useState(false);
  const [parsedText, setParsedText] = useState<string | null>(null);
  const [parsedFilePath, setParsedFilePath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const parseResume = async (filePath: string, jobId?: string) => {
    if (!user?.id) {
      setError('User not authenticated');
      toast.error('You must be logged in to parse resumes');
      return null;
    }
    
    if (!filePath) {
      setError('No file path provided');
      toast.error('No resume file specified');
      return null;
    }
    
    // Clean the file path to ensure it's correctly formatted
    // Sometimes the file path can contain the full URL, so we extract just the path
    const cleanedFilePath = filePath.includes('/object/public/resume/') 
      ? filePath.split('/object/public/resume/').pop() || filePath
      : filePath.includes('/object/resume/') 
        ? filePath.split('/object/resume/').pop() || filePath
        : filePath;
    
    console.log(`Cleaning file path: ${filePath} -> ${cleanedFilePath}`);
    
    setIsParsing(true);
    setError(null);

    try {
      console.log(`Starting to parse resume: ${cleanedFilePath}`);
      
      // Always use the best method directly for all file types
      const data = await parseResumeWithBestMethod(cleanedFilePath, user.id, jobId);
      
      console.log(`Parse result:`, data);

      if (!data || !data.success) {
        throw new Error(data?.error || 'Unknown error occurred during parsing');
      }

      // Get the parsed text from the parsed-data bucket
      if (data.parsedFilePath) {
        setParsedFilePath(data.parsedFilePath);
        
        // Fetch the parsed text content
        const parsedText = await getParsedResumeText(data.parsedFilePath);
        console.log(`Retrieved parsed text, length: ${parsedText?.length || 0}`);
        
        if (parsedText) {
          setParsedText(parsedText);
        }
      }

      toast.success('Resume successfully parsed');
      return data;
    } catch (err) {
      console.error('Error parsing resume:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse resume');
      toast.error('Failed to parse resume. Please try again.');
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to parse resume'
      };
    } finally {
      setIsParsing(false);
    }
  };

  return {
    parseResume,
    isParsing,
    parsedText,
    parsedFilePath,
    error
  };
};
