
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadFileToStorage } from '@/services/fileStorage';
import { useResumeParser } from '@/hooks/candidate/useResumeParser';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { FileText, Upload, Check, Loader2 } from 'lucide-react';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(initialFile);
  const [resumeText, setResumeText] = useState<string>(initialText || '');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>(initialText ? 'text' : 'file');
  const [isUploading, setIsUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(initialUrl);
  const { parseResume, isParsing } = useResumeParser();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
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
        }
        
        // Complete this step
        onComplete(selectedFile, null, filePath);
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

  const handleTabChange = (value: string) => {
    setUploadMethod(value as 'file' | 'text');
  };

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
          <motion.div className="space-y-6" variants={itemVariants}>
            {!resumeUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => document.getElementById('resume-upload')?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-medium mb-2">
                  {selectedFile ? selectedFile.name : 'Click to upload your resume'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Support for PDF, DOCX, DOC (Max 5MB)
                </p>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('resume-upload')?.click();
                  }}
                >
                  Browse Files
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg p-6 bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Resume uploaded successfully</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedFile?.name}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              {selectedFile && !resumeUrl && (
                <Button 
                  onClick={handleUpload} 
                  className="bg-primary hover:bg-primary/90"
                  disabled={isUploading || isParsing}
                >
                  {isUploading || isParsing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Upload Resume'
                  )}
                </Button>
              )}
              
              {resumeUrl && (
                <Button 
                  onClick={() => onComplete(selectedFile, null, resumeUrl)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Continue
                </Button>
              )}
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="text">
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
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ResumeStep;
