
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
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

      if (authError) throw authError;

      if (authData.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ 
            user_id: authData.user.id, 
            role: data.role 
          });

        if (roleError) throw roleError;

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            company: data.company
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        toast({
          title: "User Added Successfully",
          description: `${data.first_name} ${data.last_name} has been added as a ${data.role}.`,
        });

        form.reset();
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
