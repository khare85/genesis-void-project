
import { useState, useEffect } from 'react';
import { uploadFileToStorage } from '@/services/fileStorage';
import { useResumeParser } from '@/hooks/candidate/useResumeParser';
import { toast } from 'sonner';

export const useResumeStepLogic = (
  initialFile: File | null,
  initialText: string | null,
  initialUrl: string | null,
  onComplete: (resumeFile: File | null, resumeText: string | null, resumeUrl: string | null, jsonFilePath?: string | null) => void
) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(initialFile);
  const [resumeText, setResumeText] = useState<string>(initialText || '');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>(initialText ? 'text' : 'file');
  const [isUploading, setIsUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(initialUrl);
  const { parseResume, isParsing, jsonFilePath } = useResumeParser();

  // Listen for custom file selected events
  useEffect(() => {
    const handleFileSelected = (event: CustomEvent) => {
      const { file } = event.detail;
      setSelectedFile(file);
    };

    document.addEventListener('resume-file-selected', handleFileSelected as EventListener);
    
    return () => {
      document.removeEventListener('resume-file-selected', handleFileSelected as EventListener);
    };
  }, []);

  const handleTabChange = (value: string) => {
    setUploadMethod(value as 'file' | 'text');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${Date.now()}_${selectedFile.name}`;
      // Upload to storage
      const filePath = await uploadFileToStorage(selectedFile, 'resume', fileName, '');

      if (filePath) {
        setResumeUrl(filePath);
        toast.success('Resume uploaded successfully');
        
        // Parse the resume
        const parseResult = await parseResume(filePath);
        if (parseResult && parseResult.success) {
          toast.success('Resume parsed successfully');
          
          // Complete with the resume URL and JSON file path if available
          onComplete(selectedFile, null, filePath, parseResult.jsonFilePath || null);
        } else {
          // Complete with just the resume URL if parsing failed
          onComplete(selectedFile, null, filePath);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextSubmit = () => {
    if (!resumeText.trim()) {
      toast.error('Please enter your resume text');
      return;
    }
    
    onComplete(null, resumeText, null);
    toast.success('Resume text saved successfully');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return {
    selectedFile,
    setSelectedFile,
    resumeText,
    setResumeText,
    uploadMethod,
    handleTabChange,
    resumeUrl,
    setResumeUrl,
    handleUpload,
    handleTextSubmit,
    isUploading,
    isParsing,
    jsonFilePath,
    containerVariants,
    itemVariants,
  };
};
