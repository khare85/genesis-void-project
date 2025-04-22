
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const userFormSchema = z.object({
  first_name: z.string().min(2, { message: "First name must be at least 2 characters." }),
  last_name: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(['admin', 'hiring_manager', 'recruiter', 'candidate'], {
    required_error: "Please select a user role."
  }),
  company: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const useAddUserForm = (onSuccess: () => void) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "candidate",
      company: "",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      console.log("Submitting user data:", data);
      
      // Only require company for hiring_manager and recruiter roles
      if ((data.role === 'hiring_manager' || data.role === 'recruiter') && !data.company) {
        throw new Error("Company is required for Hiring Manager and Recruiter roles");
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: `TempPass123!${Math.random().toString(36).slice(2)}`,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("User creation failed: No user returned from auth signup");
      }

      console.log("User created successfully:", authData.user.id);

      // Add user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: authData.user.id, 
          role: data.role 
        });

      if (roleError) {
        console.error('Role assignment error:', roleError);
        throw roleError;
      }

      console.log("Role assigned successfully");

      // Update profile with additional info including company if applicable
      const profileData: any = {
        first_name: data.first_name,
        last_name: data.last_name,
      };

      // Only add company if it's provided and not empty
      if (data.company && data.company !== "new" && data.company !== "") {
        profileData.company = data.company;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      console.log("Profile updated successfully");

      // Fix: Using the toast function correctly based on sonner's API
      toast(`${data.first_name} ${data.last_name} has been added as a ${data.role}.`);

      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding user:', error);
      // Fix: Using the toast function correctly based on sonner's API
      toast(error.message || "Failed to add user. Please try again.", {
        variant: "destructive",
      });
    }
  };

  return {
    form,
    onSubmit,
  };
};
