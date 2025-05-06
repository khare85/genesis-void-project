
import { supabase } from '@/integrations/supabase/client';

/**
 * Use the best available method to parse a resume
 * First tries the Mammoth parser for DOC/DOCX, falls back to Gemini, then OpenAI
 */
export const parseResumeWithBestMethod = async (
  filePath: string,
  userId: string,
  jobId?: string
): Promise<{
  success: boolean;
  parsedFilePath?: string;
  jsonFilePath?: string;
  error?: string;
}> => {
  try {
    // Clean the file path if needed
    const cleanPath = filePath.startsWith('http') 
      ? filePath 
      : `${filePath}`;
    
    console.log(`Attempting to parse resume: ${cleanPath}`);
    
    // Check file extension to determine parsing strategy
    const isDocx = cleanPath.toLowerCase().endsWith('.docx') || 
                  cleanPath.toLowerCase().endsWith('.doc');
    
    if (isDocx) {
      // For DOC/DOCX files, use our new Mammoth parser
      console.log('Detected DOC/DOCX file, using Mammoth parser');
      
      const { data: mammothData, error: mammothError } = await supabase.functions.invoke('parse-resume-with-mammoth', {
        body: { 
          filePath: cleanPath,
          candidateId: userId,
          jobId: jobId || ''
        }
      });
      
      if (mammothError) {
        console.error('Error with Mammoth parser:', mammothError);
        // Fall through to next parser
      } else if (mammothData && mammothData.success) {
        return mammothData;
      }
    }
    
    // Try Gemini parser (as fallback or for non-DOC/DOCX files)
    console.log('Trying Gemini parser');
    const { data: geminiData, error: geminiError } = await supabase.functions.invoke('parse-resume-with-gemini', {
      body: { 
        filePath: cleanPath,
        candidateId: userId,
        jobId: jobId || ''
      }
    });
    
    if (geminiError) {
      console.error('Error with Gemini parser:', geminiError);
      
      // If Gemini fails, try the OpenAI parser
      console.log('Falling back to OpenAI parser');
      
      const { data: openaiData, error: openaiError } = await supabase.functions.invoke('parse-resume', {
        body: { 
          filePath: cleanPath,
          candidateId: userId,
          jobId: jobId || ''
        }
      });
      
      if (openaiError) {
        throw new Error(`All parsers failed. OpenAI error: ${openaiError.message}`);
      }
      
      return openaiData;
    }
    
    return geminiData;
  } catch (error) {
    console.error('Error in parseResumeWithBestMethod:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get the parsed text content from a file in the parsed-data bucket
 */
export const getParsedResumeText = async (filePath: string): Promise<string | null> => {
  try {
    console.log(`Fetching parsed text from: ${filePath}`);
    
    const { data, error } = await supabase
      .storage
      .from('parsed-data')
      .download(filePath);
    
    if (error) {
      console.error('Error downloading parsed text:', error);
      return null;
    }
    
    const text = await data.text();
    return text;
  } catch (error) {
    console.error('Error getting parsed resume text:', error);
    return null;
  }
};

/**
 * Get the parsed JSON data from a file in the parsed-data bucket
 */
export const getParsedResumeJson = async (filePath: string): Promise<any | null> => {
  try {
    console.log(`Fetching parsed JSON from: ${filePath}`);
    
    const { data, error } = await supabase
      .storage
      .from('parsed-data')
      .download(filePath);
    
    if (error) {
      console.error('Error downloading parsed JSON:', error);
      return null;
    }
    
    const text = await data.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error getting parsed resume JSON:', error);
    return null;
  }
};

/**
 * Generate profile data from parsed resume text
 */
export const generateProfileFromResume = async (
  userId: string,
  resumeUrl?: string | null
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    // Try using Gemini first
    const { data: geminiData, error: geminiError } = await supabase.functions.invoke('generate-profile-from-gemini', {
      body: { 
        userId,
        forceRefresh: true,
        resumeUrl
      }
    });
    
    if (geminiError) {
      console.error('Error generating profile with Gemini:', geminiError);
      // Fallback to OpenAI
      
      const { data: openaiData, error: openaiError } = await supabase.functions.invoke('generate-profile-from-resume', {
        body: { 
          userId,
          forceRefresh: true,
          resumeUrl
        }
      });
      
      if (openaiError) {
        throw new Error(`Both generators failed. OpenAI error: ${openaiError.message}`);
      }
      
      return openaiData;
    }
    
    return geminiData;
  } catch (error) {
    console.error('Error generating profile from resume:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
