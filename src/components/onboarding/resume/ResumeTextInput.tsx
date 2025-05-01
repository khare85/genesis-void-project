
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

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
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
          onClick={handleTextSubmit}
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
