
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, Loader2, CheckCircle } from 'lucide-react';

interface ResumeUploaderProps {
  onResumeChange: (file: File | null) => void;
  isUploading: boolean;
  resumeStorageUrl: string;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onResumeChange,
  isUploading,
  resumeStorageUrl,
}) => {
  const [resume, setResume] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle resume upload
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResume(file);
      onResumeChange(file);
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
                }}
              >
                Change
              </Button>
            )}
          </div>
        )}
      </div>
      {resumeStorageUrl && (
        <p className="text-xs text-green-600 mt-2 flex items-center">
          <CheckCircle className="h-3 w-3 mr-1" /> Resume uploaded successfully
        </p>
      )}
    </div>
  );
};

export default ResumeUploader;
