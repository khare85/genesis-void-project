
import React from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';

interface TermsAndConditionsProps {
  consent: boolean;
  onConsentChange: (checked: boolean) => void;
}

const TermsAndConditions = ({ consent, onConsentChange }: TermsAndConditionsProps) => {
  return (
    <div className="flex items-top space-x-2">
      <Checkbox 
        id="consent" 
        checked={consent}
        onCheckedChange={(checked) => onConsentChange(checked === true)} 
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="consent"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the terms and conditions
        </label>
        <p className="text-xs text-muted-foreground">
          By submitting this application, you agree to our{" "}
          <Link to="/terms" className="text-[#3054A5] underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-[#3054A5] underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
