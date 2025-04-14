
import { Job, JobFormData, JobStatus, JobType } from "@/types/job";
import { v4 as uuidv4 } from "uuid";

// In-memory storage for jobs
const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    logo: "https://randomuser.me/api/portraits/men/1.jpg",
    type: "full-time",
    location: {
      city: "San Francisco",
      state: "CA",
      country: "USA",
      remote: true,
    },
    salary: {
      min: 120000,
      max: 160000,
      currency: "USD",
    },
    description: "We're looking for a skilled Senior Frontend Developer to join our team and help build our next-generation web applications.",
    requirements: [
      "5+ years of experience in frontend development",
      "Strong knowledge of React, TypeScript, and modern frontend tools",
      "Experience with state management libraries (Redux, Zustand, etc.)",
      "Understanding of web performance optimization techniques",
    ],
    responsibilities: [
      "Design and implement new features for our web applications",
      "Collaborate with designers, product managers, and backend developers",
      "Mentor junior developers and provide code reviews",
      "Help improve our development processes and tooling",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Health, dental, and vision insurance",
      "Unlimited PTO",
      "Remote-friendly environment",
      "Professional development budget",
    ],
    applicationUrl: "https://example.com/apply",
    status: "active",
    createdAt: new Date("2025-04-01"),
    updatedAt: new Date("2025-04-01"),
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "DesignHub",
    logo: "https://randomuser.me/api/portraits/women/2.jpg",
    type: "full-time",
    location: {
      city: "New York",
      state: "NY",
      country: "USA",
      remote: true,
    },
    salary: {
      min: 90000,
      max: 130000,
      currency: "USD",
    },
    description: "Join our creative team as a UX/UI Designer to help shape the future of our products.",
    requirements: [
      "3+ years of experience in UX/UI design",
      "Proficiency with design tools like Figma or Sketch",
      "Strong portfolio demonstrating user-centered design process",
      "Experience with design systems",
    ],
    responsibilities: [
      "Create wireframes, prototypes, and high-fidelity designs",
      "Collaborate with product managers to understand user needs",
      "Conduct user research and usability testing",
      "Contribute to our design system",
    ],
    benefits: [
      "Competitive salary",
      "Health benefits",
      "Flexible work hours",
      "Creative environment",
    ],
    applicationEmail: "careers@designhub.com",
    status: "active",
    createdAt: new Date("2025-03-28"),
    updatedAt: new Date("2025-03-28"),
  },
  {
    id: "3",
    title: "Backend Developer",
    company: "ServerStack",
    logo: "https://randomuser.me/api/portraits/men/3.jpg",
    type: "contract",
    location: {
      city: "Remote",
      country: "Worldwide",
      remote: true,
    },
    description: "We're seeking a skilled Backend Developer to help scale our services.",
    requirements: [
      "4+ years of experience with backend development",
      "Proficiency in Node.js and TypeScript",
      "Experience with database design and optimization",
      "Knowledge of cloud services (AWS, GCP, or Azure)",
    ],
    responsibilities: [
      "Design and implement new API endpoints",
      "Optimize database queries and server performance",
      "Collaborate with the frontend team to integrate new features",
      "Write and maintain documentation",
    ],
    applicationUrl: "https://serverstack.io/careers",
    status: "active",
    createdAt: new Date("2025-04-05"),
    updatedAt: new Date("2025-04-05"),
  }
];

export const getAllJobs = (): Job[] => {
  return [...jobs];
};

export const getActiveJobs = (): Job[] => {
  return jobs.filter(job => job.status === "active");
};

export const getJobById = (id: string): Job | undefined => {
  return jobs.find(job => job.id === id);
};

export const createJob = (jobData: JobFormData): Job => {
  const newJob: Job = {
    ...jobData,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  jobs.push(newJob);
  return newJob;
};

export const updateJob = (id: string, jobData: Partial<JobFormData>): Job | undefined => {
  const jobIndex = jobs.findIndex(job => job.id === id);
  
  if (jobIndex === -1) {
    return undefined;
  }
  
  const updatedJob: Job = {
    ...jobs[jobIndex],
    ...jobData,
    updatedAt: new Date()
  };
  
  jobs[jobIndex] = updatedJob;
  return updatedJob;
};

export const deleteJob = (id: string): boolean => {
  const jobIndex = jobs.findIndex(job => job.id === id);
  
  if (jobIndex === -1) {
    return false;
  }
  
  jobs.splice(jobIndex, 1);
  return true;
};

export const getJobTypes = (): JobType[] => {
  return ["full-time", "part-time", "contract", "internship", "freelance"];
};

export const getJobStatuses = (): JobStatus[] => {
  return ["draft", "active", "closed"];
};
