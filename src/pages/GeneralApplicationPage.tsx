import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// First, make sure we have a proper type definition for JobListing
interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedDate: string;
}

const job: JobListing = {
  id: "general",
  title: "General Application",
  department: "Various",
  location: "Remote", // Or whatever default location is appropriate
  type: "Full-time", // Using one of the allowed literal types
  description: "This is a general application for candidates interested in joining our company.",
  requirements: [
    "Relevant experience in your field",
    "Strong communication skills",
    "Ability to work in a team"
  ],
  responsibilities: [
    "Responsibilities will vary based on the position",
    "Contributing to company goals",
    "Collaborating with team members"
  ],
  postedDate: new Date().toISOString().split('T')[0]
};

const GeneralApplicationPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
	const [date, setDate] = React.useState<Date | undefined>(new Date())

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Submitting application:', { name, email, phone, resume, coverLetter });
  };

  return (
    <div className="container py-24">
      <h1 className="text-3xl font-bold mb-6">{job.title}</h1>
      <div className="mb-4">
        <span className="font-bold">Department:</span> {job.department}
      </div>
      <div className="mb-4">
        <span className="font-bold">Location:</span> {job.location}
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="grid gap-4 mb-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              placeholder="123-456-7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
					<div>
						<Label>Date of birth</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn(
										"w-[240px] justify-start text-left font-normal",
										!date && "text-muted-foreground"
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date ? format(date, "PPP") : <span>Pick a date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={date}
									onSelect={setDate}
									disabled={(date) =>
										date > new Date() || date < new Date("1900-01-01")
									}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</div>
          <div>
            <Label htmlFor="resume">Resume/CV</Label>
            <Input
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
            />
            {resume && <p className="mt-2 text-sm text-gray-500">Selected file: {resume.name}</p>}
          </div>
          <div>
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Write a brief cover letter..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <Button type="submit">Submit Application</Button>
      </form>
    </div>
  );
};

export default GeneralApplicationPage;
