import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { uploadFileToStorage } from '@/services/fileStorage';
import { useResumeParser } from '@/hooks/candidate/useResumeParser';
import { toast } from 'sonner';
import { FileText, ClipboardPaste } from 'lucide-react';
interface ResumeUploaderProps {
  onResumeChange: (file: File | null) => void;
  isUploading?: boolean;
  setIsUploading?: (isUploading: boolean) => void;
  resumeStorageUrl?: string;
  setResumeStorageUrl?: (url: string) => void;
  onResumeTextChange?: (text: string | null) => void;
}
const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onResumeChange,
  isUploading = false,
  setIsUploading,
  resumeStorageUrl,
  setResumeStorageUrl,
  onResumeTextChange
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>('file');
  const {
    parseResume,
    isParsing,
    parsedText
  } = useResumeParser();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      onResumeChange(file);
      if (uploadMethod === 'file') {
        setResumeText('');
        if (onResumeTextChange) onResumeTextChange(null);
      }
    }
  };
  const handleResumeTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setResumeText(text);
    if (onResumeTextChange) onResumeTextChange(text);
    if (uploadMethod === 'text') {
      setSelectedFile(null);
      onResumeChange(null);
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }
    if (setIsUploading) setIsUploading(true);
    try {
      const fileName = `${Date.now()}_${selectedFile.name}`;
      // Fix here: Adding the fourth parameter (jobId) as an empty string since it might be optional in the function
      const filePath = await uploadFileToStorage(selectedFile, 'resume', fileName, '');
      if (filePath) {
        if (setResumeStorageUrl) setResumeStorageUrl(filePath);
        toast.success('Resume uploaded successfully');

        // Parse the resume
        const parseResult = await parseResume(filePath);
        if (parseResult && parseResult.success) {
          toast.success('Resume parsed successfully');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload resume');
    } finally {
      if (setIsUploading) setIsUploading(false);
    }
  };
  const handleUploadMethodChange = (value: string) => {
    setUploadMethod(value as 'file' | 'text');

    // Clear the other input method when switching
    if (value === 'file') {
      setResumeText('');
      if (onResumeTextChange) onResumeTextChange(null);
    } else {
      setSelectedFile(null);
      onResumeChange(null);
    }
  };
  return <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Resume/CV</h2>
      
      <Tabs defaultValue="file" onValueChange={handleUploadMethodChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="file">
            <FileText className="mr-2 h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="text">
            <ClipboardPaste className="mr-2 h-4 w-4" />
            Paste Text
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="file">
          <div className="space-y-4">
            <div className="bg-white">
              <Label htmlFor="resume" className="block text-sm font-medium mb-2">
                Upload your resume (PDF, DOCX, DOC)
              </Label>
              <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} disabled={isUploading || isParsing} />
              {selectedFile && <p className="mt-2 text-sm text-gray-600">
                  Selected: {selectedFile.name}
                </p>}
            </div>
            
            {selectedFile && !resumeStorageUrl && <Button type="button" onClick={handleUpload} disabled={isUploading || isParsing}>
                {isUploading || isParsing ? 'Processing...' : 'Upload Resume'}
              </Button>}
            
            {resumeStorageUrl && <p className="text-sm text-green-600">
                ✓ Resume uploaded successfully
              </p>}
          </div>
        </TabsContent>
        
        <TabsContent value="text">
          <div className="space-y-2 bg-white">
            <Label htmlFor="resumeText" className="block text-sm font-medium">
              Paste your resume text here
            </Label>
            <Textarea id="resumeText" placeholder="Copy and paste the contents of your resume here..." value={resumeText} onChange={handleResumeTextChange} className="min-h-[300px]" disabled={isUploading || isParsing} />
          </div>
        </TabsContent>
      </Tabs>

      {isParsing && <div className="text-sm text-blue-600">
          Analyzing your resume...
        </div>}
    </div>;
};
export default ResumeUploader;