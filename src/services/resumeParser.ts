
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
      // For DOC/DOCX files, use our Mammoth parser
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
        console.log('Mammoth parser successful:', mammothData);
        
        // Save parsed data to the profiles table
        if (mammothData.jsonFilePath) {
          await saveResumeDataToProfile(userId, mammothData.jsonFilePath);
        }
        
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
      
      console.log('OpenAI parser successful:', openaiData);
      
      // Save parsed data to the profiles table
      if (openaiData.jsonFilePath) {
        await saveResumeDataToProfile(userId, openaiData.jsonFilePath);
      }
      
      return openaiData;
    }
    
    console.log('Gemini parser successful:', geminiData);
    
    // Save parsed data to the profiles table
    if (geminiData.jsonFilePath) {
      await saveResumeDataToProfile(userId, geminiData.jsonFilePath);
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
 * Save parsed resume data to the ai_parsed_data field in the profiles table
 */
const saveResumeDataToProfile = async (userId: string, jsonFilePath: string): Promise<void> => {
  try {
    // Get the parsed JSON data
    const parsedData = await getParsedResumeJson(jsonFilePath);
    
    if (!parsedData) {
      console.log(`No parsed data found in ${jsonFilePath}`);
      return;
    }
    
    // Save the parsed data as a string in the profiles table
    const { error } = await supabase
      .from('profiles')
      .update({ 
        ai_parsed_data: JSON.stringify(parsedData),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error saving parsed resume data to profile:', error);
      return;
    }
    
    console.log(`Successfully saved parsed resume data to profile for user ${userId}`);
  } catch (error) {
    console.error('Error in saveResumeDataToProfile:', error);
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
    console.log(`Retrieved text with length: ${text.length}`);
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
    try {
      const json = JSON.parse(text);
      console.log('Successfully parsed JSON data');
      return json;
    } catch (jsonError) {
      console.error('Error parsing JSON data:', jsonError);
      return null;
    }
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
    // First check if we have parsed data in the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('ai_parsed_data')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile data:', profileError);
    }
    
    let parsedData = null;
    
    // If we have parsed data in the profile, use it
    if (profileData?.ai_parsed_data) {
      try {
        parsedData = JSON.parse(profileData.ai_parsed_data);
        console.log('Using parsed resume data from profiles table');
      } catch (e) {
        console.error('Error parsing profile data:', e);
      }
    }
    
    // If we don't have parsed data in the profile, check localStorage
    if (!parsedData) {
      const onboardingProgress = localStorage.getItem(`onboarding_progress_${userId}`);
      let jsonFilePath = null;
      
      if (onboardingProgress) {
        try {
          const progress = JSON.parse(onboardingProgress);
          if (progress.resumeData?.jsonFilePath) {
            jsonFilePath = progress.resumeData.jsonFilePath;
            console.log('Found JSON file path in onboarding progress:', jsonFilePath);
            
            parsedData = await getParsedResumeJson(jsonFilePath);
            console.log('Retrieved parsed JSON data from storage:', parsedData ? 'Data found' : 'No data');
            
            // Save to profile if we found it
            if (parsedData) {
              await supabase
                .from('profiles')
                .update({ 
                  ai_parsed_data: JSON.stringify(parsedData),
                  updated_at: new Date().toISOString()
                })
                .eq('id', userId);
              console.log('Saved parsed data to profile table');
            }
          }
        } catch (e) {
          console.error('Error retrieving parsed data from localStorage:', e);
        }
      }
    }
    
    // Try using Gemini first
    console.log('Attempting to generate profile using Gemini API with parsed data:', parsedData ? 'Available' : 'Not available');
    const { data: geminiData, error: geminiError } = await supabase.functions.invoke('generate-profile-from-gemini', {
      body: { 
        userId,
        forceRefresh: true,
        resumeUrl,
        parsedData // Include any parsed data we found
      }
    });
    
    if (geminiError) {
      console.error('Error generating profile with Gemini:', geminiError);
      // Fallback to OpenAI
      
      const { data: openaiData, error: openaiError } = await supabase.functions.invoke('generate-profile-from-resume', {
        body: { 
          userId,
          forceRefresh: true,
          resumeUrl,
          parsedData // Include any parsed data we found
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
