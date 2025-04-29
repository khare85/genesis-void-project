
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

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
    
    setIsParsing(true);
    setError(null);

    try {
      // Call the edge function to parse the resume
      const { data, error: fnError } = await supabase.functions.invoke('parse-resume', {
        body: { 
          filePath, 
          candidateId: user.id,
          jobId
        }
      });

      if (fnError) {
        throw new Error(`Error invoking parse-resume function: ${fnError.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred during parsing');
      }

      // Get the parsed text from the parsed-data bucket
      if (data.parsedFilePath) {
        setParsedFilePath(data.parsedFilePath);
        
        // Fetch the parsed text content
        const { data: fileData, error: fetchError } = await supabase.storage
          .from('parsed-data')
          .download(data.parsedFilePath);
          
        if (fetchError) {
          console.warn('Could not download parsed text file:', fetchError);
        } else if (fileData) {
          const text = await fileData.text();
          setParsedText(text);
        }
      }

      toast.success('Resume successfully parsed');
      return data;
    } catch (err) {
      console.error('Error parsing resume:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse resume');
      toast.error('Failed to parse resume. Please try again.');
      return null;
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
