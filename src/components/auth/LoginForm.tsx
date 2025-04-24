
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Demo accounts:</p>
          <div className="grid gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                form.setValue("email", "admin@example.com");
                form.setValue("password", "password");
              }}
            >
              Admin Demo
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                form.setValue("email", "hm@example.com");
                form.setValue("password", "password");
              }}
            >
              Hiring Manager Demo
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                form.setValue("email", "recruiter@example.com");
                form.setValue("password", "password");
              }}
            >
              Recruiter Demo
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                form.setValue("email", "candidate@example.com");
                form.setValue("password", "password");
              }}
            >
              Candidate Demo
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
