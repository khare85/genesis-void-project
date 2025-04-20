
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_range?: string;
  description?: string;
  posteddate: string;
  category?: string;
  level?: string;
  logourl?: string;
  featured?: boolean;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedIn: string;
  portfolio: string;
  currentCompany: string;
  currentPosition: string;
  yearsOfExperience: string;
  noticePeriod: string;
  salaryExpectation: string;
  coverLetter: string;
  heardFrom: string;
}
