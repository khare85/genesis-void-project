
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResumeFileUploadProps {
  selectedFile: File | null;
  resumeUrl: string | null;
  isUploading: boolean;
  isParsing: boolean;
  onUpload: () => void;
  onComplete: (resumeFile: File | null, resumeText: string | null, resumeUrl: string | null) => void;
}

const ResumeFileUpload: React.FC<ResumeFileUploadProps> = ({
  selectedFile,
  resumeUrl,
  isUploading,
  isParsing,
  onUpload,
  onComplete
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
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
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                // We can't call setSelectedFile directly as it's in the parent component
                // Instead we can dispatch a custom event to communicate with the parent
                const event = new CustomEvent('resume-file-selected', { 
                  detail: { file }
                });
                document.dispatchEvent(event);
              }
            }}
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
            onClick={onUpload} 
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
  );
};

export default ResumeFileUpload;
