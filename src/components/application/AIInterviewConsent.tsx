
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface AIInterviewConsentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

const AIInterviewConsent = ({ open, onOpenChange, onAccept }: AIInterviewConsentProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Interview Guidelines & Consent</DialogTitle>
          <DialogDescription>
            Please review and accept the following guidelines before proceeding with your AI interview.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-medium">Environment Requirements</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Ensure you are in a quiet, well-lit room with minimal background noise</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Position yourself facing a light source to ensure your face is clearly visible</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Use a plain, neutral background if possible</span>
              </li>
            </ul>

            <h3 className="font-medium pt-4">Interview Rules</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Do not use dual screens or external devices during the interview</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Reading from notes or other materials is not permitted</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Your submission will be discarded if cheating is detected</span>
              </li>
            </ul>

            <div className="bg-muted p-4 rounded-lg mt-4 text-sm">
              <p className="font-medium mb-2">By proceeding, you agree that:</p>
              <ul className="space-y-2">
                <li>• Your video will be recorded and analyzed</li>
                <li>• The recording may be reviewed by hiring managers</li>
                <li>• Your responses will be evaluated by AI for initial screening</li>
                <li>• Any violation of the guidelines may result in disqualification</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onAccept}>I Accept & Begin Interview</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIInterviewConsent;
