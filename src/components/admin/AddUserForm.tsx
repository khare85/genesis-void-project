
import React from 'react';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PersonalInfoFields } from "./users/form/PersonalInfoFields";
import { RoleAndCompanyFields } from "./users/form/RoleAndCompanyFields";
import { useAddUserForm } from "@/hooks/admin/useAddUserForm";
import { AddCompanyDialog } from "./AddCompanyDialog";
import { toast } from "sonner";

interface AddUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded?: () => void;
}

const AddUserForm = ({ open, onOpenChange, onUserAdded }: AddUserFormProps) => {
  const [showNewCompanyDialog, setShowNewCompanyDialog] = React.useState(false);
  
  const { form, onSubmit } = useAddUserForm(() => {
    console.log("Form submission callback executed - user added successfully");
    if (onUserAdded) {
      console.log("Calling onUserAdded callback");
      onUserAdded();
    } else {
      console.log("No onUserAdded callback provided");
      onOpenChange(false);
    }
  });
  
  // Use a state to track when we need to refresh the companies list
  const [refreshCompanyTrigger, setRefreshCompanyTrigger] = React.useState(0);

  const handleAddNewCompany = () => {
    setShowNewCompanyDialog(true);
  };

  const handleCompanyAdded = () => {
    // Increment the trigger to cause a refresh
    setRefreshCompanyTrigger(prev => prev + 1);
    setShowNewCompanyDialog(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log("Form submitted", form.getValues());
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account for the platform. 
              An email invitation will be sent to set up their password.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
              <PersonalInfoFields form={form} />
              <RoleAndCompanyFields 
                form={form} 
                onNewCompany={handleAddNewCompany}
                onCompanyRefresh={refreshCompanyTrigger > 0 ? () => {} : undefined}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit">Add User</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AddCompanyDialog 
        open={showNewCompanyDialog}
        onOpenChange={setShowNewCompanyDialog}
        onCompanyAdded={handleCompanyAdded}
      />
    </>
  );
};

export default AddUserForm;
