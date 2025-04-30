
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, Loader2, CheckCircle, FileText, XCircle } from 'lucide-react';
import { useResumeParser } from '@/hooks/candidate/useResumeParser';
import { toast } from 'sonner';

interface ResumeUploaderProps {
  onResumeChange: (file: File | null) => void;
  isUploading: boolean;
  setIsUploading?: (isUploading: boolean) => void;
  resumeStorageUrl: string;
  setResumeStorageUrl?: (url: string) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onResumeChange,
  isUploading,
  setIsUploading,
  resumeStorageUrl,
  setResumeStorageUrl,
}) => {
  const [resume, setResume] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { parseResume, isParsing, parsedText } = useResumeParser();
  const [parseStatus, setParseStatus] = useState<'idle' | 'parsing' | 'parsed' | 'failed'>('idle');
  const [parseError, setParseError] = useState<string | null>(null);

  // Handle resume upload
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResume(file);
      onResumeChange(file);
      // Reset parse status when a new file is uploaded
      setParseStatus('idle');
      setParseError(null);
    }
  };

  // Handle drag events for resume upload
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setResume(file);
      onResumeChange(file);
      // Reset parse status when a new file is uploaded
      setParseStatus('idle');
      setParseError(null);
    }
  };

  // Parse resume when it's uploaded to storage
  const handleParseResume = async () => {
    if (!resumeStorageUrl) {
      toast.error('No resume file URL available');
      return;
    }
    
    // Extract the file path from the storage URL
    // The URL format is typically https://[project-ref].supabase.co/storage/v1/object/public/resume/[path]
    const filePath = resumeStorageUrl.includes('/resume/') 
      ? resumeStorageUrl.split('/resume/').pop() 
      : resumeStorageUrl;
    
    if (!filePath) {
      toast.error('Could not extract file path from URL');
      return;
    }
    
    console.log("Starting resume parsing with file path:", filePath);
    setParseStatus('parsing');
    setParseError(null);
    
    try {
      const result = await parseResume(filePath);
      console.log("Parse result:", result);
      
      if (result && result.success) {
        setParseStatus('parsed');
        toast.success(`Resume parsed successfully: ${result.parsedTextLength || 0} characters extracted`);
      } else {
        setParseStatus('failed');
        const errorMessage = result?.error || 'Unknown error during parsing';
        setParseError(errorMessage);
        toast.error(`Resume parsing failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error in handleParseResume:", error);
      setParseStatus('failed');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setParseError(errorMessage);
      toast.error(`Resume parsing error: ${errorMessage}`);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Resume Upload</h2>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? 'border-[#3054A5] bg-[#3054A5]/5' : 'border-gray-200'}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {!resume ? (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
              <Upload className="h-6 w-6 text-[#3054A5]" />
            </div>
            <p className="text-sm font-medium mb-1">
              Drag & drop your resume here or
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported formats: PDF, DOCX, DOC (Max 5MB)
            </p>
            <div className="flex justify-center">
              <label htmlFor="resume-upload" className="cursor-pointer">
                <div className="bg-[#3054A5] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#264785] transition-colors">
                  Browse Files
                </div>
                <input
                  id="resume-upload"
                  name="resume"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                />
              </label>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-md flex items-center justify-center">
                <File className="h-5 w-5 text-[#3054A5]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium truncate">{resume.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(resume.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            {isUploading ? (
              <div className="flex items-center text-sm text-[#3054A5]">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setResume(null);
                  onResumeChange(null);
                  setParseStatus('idle');
                  setParseError(null);
                }}
              >
                Change
              </Button>
            )}
          </div>
        )}
      </div>
      
      {resumeStorageUrl && (
        <div className="mt-2 space-y-2">
          <p className="text-xs text-green-600 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" /> Resume uploaded successfully
          </p>
          
          {parseStatus === 'idle' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center"
              onClick={handleParseResume}
            >
              <FileText className="h-4 w-4 mr-2" /> Parse Resume with AI
            </Button>
          )}
          
          {parseStatus === 'parsing' && (
            <div className="flex items-center justify-center text-sm text-muted-foreground py-2">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Parsing resume with AI...
            </div>
          )}
          
          {parseStatus === 'parsed' && (
            <p className="text-xs text-green-600 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" /> Resume parsed successfully
            </p>
          )}
          
          {parseStatus === 'failed' && (
            <div className="space-y-1">
              <p className="text-xs text-red-500 flex items-center">
                <XCircle className="h-3 w-3 mr-1" /> Resume parsing failed
                {parseError && <span className="ml-1">: {parseError}</span>}
              </p>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center"
                onClick={handleParseResume}
              >
                <FileText className="h-4 w-4 mr-2" /> Retry Parsing
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
