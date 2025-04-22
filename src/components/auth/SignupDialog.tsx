
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSignupForm } from '@/hooks/auth/useSignupForm';
import SignupFormFields from './SignupFormFields';

interface SignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignupDialog = ({ open, onOpenChange }: SignupDialogProps) => {
  const { formData, isLoading, handleChange, handleRoleChange, handleSubmit } = useSignupForm(() => onOpenChange(false));
  const [showCompanyField, setShowCompanyField] = useState(false);

  useEffect(() => {
    setShowCompanyField(['hiring_manager', 'recruiter'].includes(formData.role));
  }, [formData.role]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create an Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <SignupFormFields
            formData={formData}
            showCompanyField={showCompanyField}
            handleChange={handleChange}
            handleRoleChange={handleRoleChange}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignupDialog;
