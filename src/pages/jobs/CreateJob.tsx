
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { createJob, getJobStatuses, getJobTypes } from "@/services/jobService";
import { Job, JobFormData, JobType, JobStatus } from "@/types/job";
import { BriefcaseBusiness, Check, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(5, "Job title must be at least 5 characters"),
  company: z.string().min(2, "Company name is required"),
  type: z.enum(["full-time", "part-time", "contract", "internship", "freelance"] as const),
  location: z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    remote: z.boolean().default(false),
  }),
  salary: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().optional(),
  }).optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  requirements: z.array(z.string()).min(1, "At least one requirement is needed"),
  responsibilities: z.array(z.string()).min(1, "At least one responsibility is needed"),
  benefits: z.array(z.string()).optional(),
  applicationUrl: z.string().url().optional().or(z.literal('')),
  applicationEmail: z.string().email().optional().or(z.literal('')),
  status: z.enum(["draft", "active", "closed"] as const),
  logo: z.string().optional(),
});

const CreateJob = () => {
  const navigate = useNavigate();
  const [requirementInput, setRequirementInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      type: "full-time",
      location: {
        city: "",
        state: "",
        country: "",
        remote: false,
      },
      salary: {
        min: undefined,
        max: undefined,
        currency: "USD",
      },
      description: "",
      requirements: [],
      responsibilities: [],
      benefits: [],
      applicationUrl: "",
      applicationEmail: "",
      status: "draft",
      logo: "",
    },
  });
  
  const jobTypes = getJobTypes();
  const jobStatuses = getJobStatuses();
  
  const requirements = form.watch("requirements");
  const responsibilities = form.watch("responsibilities");
  const benefits = form.watch("benefits");
  
  const addRequirement = () => {
    if (requirementInput.trim()) {
      form.setValue("requirements", [...requirements, requirementInput.trim()]);
      setRequirementInput("");
    }
  };
  
  const removeRequirement = (index: number) => {
    form.setValue("requirements", requirements.filter((_, i) => i !== index));
  };
  
  const addResponsibility = () => {
    if (responsibilityInput.trim()) {
      form.setValue("responsibilities", [...responsibilities, responsibilityInput.trim()]);
      setResponsibilityInput("");
    }
  };
  
  const removeResponsibility = (index: number) => {
    form.setValue("responsibilities", responsibilities.filter((_, i) => i !== index));
  };
  
  const addBenefit = () => {
    if (benefitInput.trim()) {
      form.setValue("benefits", [...benefits || [], benefitInput.trim()]);
      setBenefitInput("");
    }
  };
  
  const removeBenefit = (index: number) => {
    form.setValue("benefits", benefits!.filter((_, i) => i !== index));
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      const jobData: JobFormData = values as JobFormData;
      const newJob = createJob(jobData);
      
      toast.success("Job posting created successfully!");
      
      if (values.status === "draft") {
        toast("Your job is saved as a draft. You can publish it later.", {
          description: "It won't appear in the job listings until published."
        });
      }
      
      navigate(`/jobs/${newJob.id}`);
    } catch (error) {
      toast.error("Failed to create job posting");
      console.error(error);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
        <p className="text-muted-foreground mt-2">Fill out the form below to create a new job posting.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5" />
            Job Details
          </CardTitle>
          <CardDescription>
            Provide the basic information about the job position.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jobTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Status*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jobStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Draft jobs will not be visible in the job listings.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Location</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. San Francisco" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. California" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. United States" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location.remote"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Remote Position
                          </FormLabel>
                          <FormDescription>
                            Can this job be done remotely?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Salary Information (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="salary.min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Salary</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g. 70000" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : Number(e.target.value);
                              field.onChange(value);
                            }}
                            value={field.value === undefined ? '' : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="salary.max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Salary</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g. 100000" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : Number(e.target.value);
                              field.onChange(value);
                            }}
                            value={field.value === undefined ? '' : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="salary.currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. USD" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of the job..." 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Requirements*</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a job requirement"
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRequirement();
                        }
                      }}
                    />
                    <Button type="button" onClick={addRequirement}>Add</Button>
                  </div>
                  
                  {requirements.length === 0 && (
                    <p className="text-sm text-muted-foreground">No requirements added yet.</p>
                  )}
                  
                  <ul className="space-y-2">
                    {requirements.map((req, index) => (
                      <li key={index} className="flex justify-between items-center p-3 rounded-md bg-accent">
                        <span className="mr-2">{req}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeRequirement(index)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                  
                  {form.formState.errors.requirements && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.requirements.message}</p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Responsibilities*</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a job responsibility"
                      value={responsibilityInput}
                      onChange={(e) => setResponsibilityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addResponsibility();
                        }
                      }}
                    />
                    <Button type="button" onClick={addResponsibility}>Add</Button>
                  </div>
                  
                  {responsibilities.length === 0 && (
                    <p className="text-sm text-muted-foreground">No responsibilities added yet.</p>
                  )}
                  
                  <ul className="space-y-2">
                    {responsibilities.map((resp, index) => (
                      <li key={index} className="flex justify-between items-center p-3 rounded-md bg-accent">
                        <span className="mr-2">{resp}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeResponsibility(index)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                  
                  {form.formState.errors.responsibilities && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.responsibilities.message}</p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Benefits (Optional)</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a job benefit"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addBenefit();
                        }
                      }}
                    />
                    <Button type="button" onClick={addBenefit}>Add</Button>
                  </div>
                  
                  {(!benefits || benefits.length === 0) && (
                    <p className="text-sm text-muted-foreground">No benefits added yet.</p>
                  )}
                  
                  <ul className="space-y-2">
                    {benefits && benefits.map((benefit, index) => (
                      <li key={index} className="flex justify-between items-center p-3 rounded-md bg-accent">
                        <span className="mr-2">{benefit}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeBenefit(index)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Application Process</h3>
                <Alert variant="default" className="bg-primary/10 border-primary/20">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Application Instructions</AlertTitle>
                  <AlertDescription>
                    Provide at least one way for candidates to apply - URL or email.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="applicationUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/apply" {...field} />
                        </FormControl>
                        <FormDescription>
                          Link to your application form or ATS
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="applicationEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Email</FormLabel>
                        <FormControl>
                          <Input placeholder="careers@example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Email address for application submissions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <CardFooter className="px-0 flex justify-between">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Check className="mr-2 h-4 w-4" />
                  Create Job Posting
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;
