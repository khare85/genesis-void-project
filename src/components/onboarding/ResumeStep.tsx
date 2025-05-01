
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useResumeStepLogic } from '@/hooks/onboarding/useResumeStepLogic';
import ResumeFileUpload from './resume/ResumeFileUpload';
import ResumeTextInput from './resume/ResumeTextInput';

interface ResumeStepProps {
  onComplete: (resumeFile: File | null, resumeText: string | null, resumeUrl: string | null) => void;
  initialFile?: File | null;
  initialText?: string | null;
  initialUrl?: string | null;
}

const ResumeStep: React.FC<ResumeStepProps> = ({ 
  onComplete, 
  initialFile = null, 
  initialText = null,
  initialUrl = null 
}) => {
  const {
    selectedFile,
    resumeText,
    setResumeText,
    uploadMethod,
    handleTabChange,
    resumeUrl,
    containerVariants,
    itemVariants,
    handleUpload,
    handleTextSubmit,
    isUploading,
    isParsing
  } = useResumeStepLogic(initialFile, initialText, initialUrl, onComplete);

  return (
    <motion.div 
      className="max-w-2xl mx-auto px-8 py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-2">Upload Your Resume</h2>
        <p className="text-muted-foreground mb-6">
          Help us understand your skills and experience by uploading your resume
        </p>
      </motion.div>
      
      <Tabs defaultValue={uploadMethod} onValueChange={handleTabChange} className="w-full">
        <motion.div variants={itemVariants}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Paste Text
            </TabsTrigger>
          </TabsList>
        </motion.div>
        
        <TabsContent value="file">
          <ResumeFileUpload 
            selectedFile={selectedFile}
            resumeUrl={resumeUrl}
            isUploading={isUploading}
            isParsing={isParsing}
            onUpload={handleUpload}
            onComplete={onComplete}
          />
        </TabsContent>
        
        <TabsContent value="text">
          <ResumeTextInput
            resumeText={resumeText}
            setResumeText={setResumeText}
            handleTextSubmit={handleTextSubmit}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ResumeStep;
