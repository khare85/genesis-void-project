
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
    console.log("Form submission started with data:", data);
    
    try {
      // Only require company for hiring_manager and recruiter roles
      if ((data.role === 'hiring_manager' || data.role === 'recruiter') && !data.company) {
        console.error("Company validation failed");
        throw new Error("Company is required for Hiring Manager and Recruiter roles");
      }

      // Generate a UUID for the new user
      const userId = crypto.randomUUID();
      console.log("Generated user ID:", userId);
      
      // Create profile entry
      console.log("Creating profile for user:", userId);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          company: data.company && data.company !== "new" ? data.company : null
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }
      
      // Add user role
      console.log("Assigning role:", data.role, "to user:", userId);
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: userId, 
          role: data.role 
        });

      if (roleError) {
        console.error('Role assignment error:', roleError);
        throw roleError;
      }

      console.log("User created successfully with ID:", userId);
      
      // Using the sonner toast API correctly
      toast.success(`${data.first_name} ${data.last_name} has been added as a ${data.role}.`);
      
      console.log("Form reset and success callback triggered");
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error('Error adding user:', error);
      // Using the sonner toast API correctly for error state
      toast.error(error.message || "Failed to add user. Please try again.");
    }
  };

  return {
    form,
    onSubmit,
  };
};
