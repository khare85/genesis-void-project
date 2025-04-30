
import { supabase } from '@/integrations/supabase/client';

/**
 * Parses a resume file using OpenAI and stores the extracted text
 * @param filePath Path to the file in the resume bucket
 * @param candidateId UUID of the candidate
 * @param jobId Optional job ID for context
 * @returns Parsed data information or null if error
 */
export const parseResumeFile = async (
  filePath: string,
  candidateId: string,
  jobId?: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('parse-resume', {
      body: { filePath, candidateId, jobId }
    });
    
    if (error) {
      console.error('Error parsing resume:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception parsing resume:', error);
    return null;
  }
};

/**
 * Parses a resume file using OfficeParser and stores the extracted text
 * @param filePath Path to the file in the resume bucket
 * @param candidateId UUID of the candidate
 * @param jobId Optional job ID for context
 * @returns Parsed data information or null if error
 */
export const parseResumeWithOfficeParser = async (
  filePath: string,
  candidateId: string,
  jobId?: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('parse-resume-with-officeparser', {
      body: { filePath, candidateId, jobId }
    });
    
    if (error) {
      console.error('Error parsing resume with OfficeParser:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception parsing resume with OfficeParser:', error);
    return null;
  }
};

/**
 * Parses a resume file using LLMWhisperer and stores the extracted text
 * @param filePath Path to the file in the resume bucket
 * @param bucket Storage bucket name (default: "resume")
 * @param jobId Job ID for organizing parsed data
 * @returns Parsed data information or null if error
 */
export const parseResumeWithLLMWhisperer = async (
  filePath: string,
  bucket = "resume",
  jobId: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('parse-resume-with-llmwhisperer', {
      body: { filePath, bucket, jobId }
    });
    
    if (error) {
      console.error('Error parsing resume with LLMWhisperer:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception parsing resume with LLMWhisperer:', error);
    return null;
  }
};

/**
 * Retrieves parsed resume text from the parsed-data bucket
 * @param parsedFilePath Path to the parsed file in the parsed-data bucket
 * @returns The parsed text content or null if error
 */
export const getParsedResumeText = async (parsedFilePath: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('parsed-data')
      .download(parsedFilePath);
      
    if (error) {
      console.error('Error downloading parsed resume:', error);
      return null;
    }
    
    return await data.text();
  } catch (error) {
    console.error('Exception getting parsed resume text:', error);
    return null;
  }
};

/**
 * Checks if a resume has already been parsed
 * @param candidateId UUID of the candidate
 * @param resumeFileName Original resume file name
 * @returns Boolean indicating if resume has been parsed
 */
export const hasResumeBeenParsed = async (
  candidateId: string,
  resumeFileName: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from('parsed-data')
      .list(`${candidateId}`, {
        search: resumeFileName
      });
      
    if (error) {
      console.error('Error checking parsed resumes:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Exception checking parsed resumes:', error);
    return false;
  }
};

/**
 * Determines the best parsing method based on file type
 * @param filePath Path to the file in the resume bucket
 * @param candidateId UUID of the candidate
 * @param jobId Optional job ID for context
 * @returns Parsed data information or null if error
 */
export const parseResumeWithBestMethod = async (
  filePath: string,
  candidateId: string,
  jobId?: string
) => {
  const fileExtension = filePath.toLowerCase().split('.').pop();
  
  // Use officeparser for doc, docx, pdf
  if (['doc', 'docx', 'pdf'].includes(fileExtension || '')) {
    return parseResumeWithOfficeParser(filePath, candidateId, jobId);
  }
  
  // Fall back to OpenAI for other file types
  return parseResumeFile(filePath, candidateId, jobId);
};
