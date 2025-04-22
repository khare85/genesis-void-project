
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { JobFormValues } from '../types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SkillsInput } from './SkillsInput';

interface FormFieldsProps {
  form: UseFormReturn<JobFormValues>;
}

export const FormFields: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      {/* Skills Input Field */}
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Required Skills</FormLabel>
            <FormControl>
              <SkillsInput 
                value={field.value || ''} 
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Salary Range Field */}
      <FormField
        control={form.control}
        name="salary_range"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salary Range</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. $80,000 - $100,000" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Department Field */}
      <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Department</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="customer_support">Customer Support</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Category Field */}
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="software_development">Software Development</SelectItem>
                <SelectItem value="frontend">Frontend Development</SelectItem>
                <SelectItem value="backend">Backend Development</SelectItem>
                <SelectItem value="fullstack">Full Stack Development</SelectItem>
                <SelectItem value="mobile">Mobile Development</SelectItem>
                <SelectItem value="web">Web Development</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="qa">Quality Assurance</SelectItem>
                <SelectItem value="data_science">Data Science</SelectItem>
                <SelectItem value="machine_learning">Machine Learning</SelectItem>
                <SelectItem value="ai">Artificial Intelligence</SelectItem>
                <SelectItem value="product_management">Product Management</SelectItem>
                <SelectItem value="project_management">Project Management</SelectItem>
                <SelectItem value="ux_design">UX Design</SelectItem>
                <SelectItem value="ui_design">UI Design</SelectItem>
                <SelectItem value="graphic_design">Graphic Design</SelectItem>
                <SelectItem value="content_marketing">Content Marketing</SelectItem>
                <SelectItem value="digital_marketing">Digital Marketing</SelectItem>
                <SelectItem value="sales_development">Sales Development</SelectItem>
                <SelectItem value="account_management">Account Management</SelectItem>
                <SelectItem value="customer_success">Customer Success</SelectItem>
                <SelectItem value="hr_management">HR Management</SelectItem>
                <SelectItem value="finance_accounting">Finance/Accounting</SelectItem>
                <SelectItem value="legal_counsel">Legal Counsel</SelectItem>
                <SelectItem value="operations_management">Operations Management</SelectItem>
                <SelectItem value="executive_leadership">Executive Leadership</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Experience Level Field */}
      <FormField
        control={form.control}
        name="level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience Level</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="mid">Mid-Level</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Job Description Field */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Enter a detailed job description"
                className="min-h-[200px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
