
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Video, Info } from 'lucide-react';

interface AIInterviewConsentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

const AIInterviewConsent: React.FC<AIInterviewConsentProps> = ({
  open,
  onOpenChange,
  onAccept,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            AI Interview Guidelines & Consent
          </DialogTitle>
          <DialogDescription>
            Please review these important guidelines before starting your AI interview
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Video className="h-4 w-4 text-primary" />
              Environment Setup
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Find a quiet, well-lit room with minimal background distractions</li>
              <li>• Ensure your face is clearly visible with good lighting in front of you</li>
              <li>• Test your camera and microphone before starting</li>
              <li>• Use a plain, professional background or a tidy space</li>
              <li>• Maintain stable internet connection</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Interview Rules
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• No dual screens or additional devices allowed during the interview</li>
              <li>• Reading from prepared answers or documents is prohibited</li>
              <li>• Stay within camera frame throughout the interview</li>
              <li>• No headphones or earpieces allowed unless required for accessibility</li>
              <li>• No other applications or browsers should be open</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Important Notes
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Your video will be recorded and analyzed by AI</li>
              <li>• Any violation of guidelines may result in interview disqualification</li>
              <li>• You can pause the interview for emergencies, but excessive pauses will be flagged</li>
              <li>• Technical issues should be reported immediately</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAccept} className="gap-2">
            <Shield className="h-4 w-4" />
            Accept & Start Interview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIInterviewConsent;
