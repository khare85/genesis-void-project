
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface ResumeTextInputProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  handleTextSubmit: () => void;
}

const ResumeTextInput: React.FC<ResumeTextInputProps> = ({
  resumeText,
  setResumeText,
  handleTextSubmit
}) => {
  const { user } = useAuth();
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleSaveAndContinue = async () => {
    if (!resumeText.trim()) {
      toast.error('Please enter your resume text');
      return;
    }
    
    // Save resume text to applications table if user is logged in
    if (user?.id) {
      try {
        // Check if user already has an application
        const { data: existingApplications } = await supabase
          .from('applications')
          .select('id')
          .eq('candidate_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (existingApplications && existingApplications.length > 0) {
          // Update existing application
          await supabase
            .from('applications')
            .update({
              resume_text: resumeText,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingApplications[0].id);
        } else {
          // Create a new application record
          await supabase
            .from('applications')
            .insert({
              candidate_id: user.id,
              resume_text: resumeText,
              status: 'draft',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
        }
        
        toast.success('Resume text saved successfully');
      } catch (error) {
        console.error('Error saving resume text to applications table:', error);
        // Continue with the onboarding process even if saving to DB fails
      }
    }
    
    // Call original submit handler to continue the onboarding process
    handleTextSubmit();
  };

  return (
    <motion.div className="space-y-6" variants={itemVariants}>
      <Textarea
        placeholder="Copy and paste your resume text here..."
        className="min-h-[300px]"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveAndContinue}
          className="bg-primary hover:bg-primary/90"
          disabled={!resumeText.trim()}
        >
          Save & Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default ResumeTextInput;
