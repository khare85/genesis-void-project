
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Lock, User, Building } from 'lucide-react';

type UserRole = 'candidate' | 'hiring_manager' | 'recruiter';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  company: string;
}

interface SignupFormFieldsProps {
  formData: SignupFormData;
  showCompanyField: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (value: UserRole) => void;
}

const SignupFormFields = ({
  formData,
  showCompanyField,
  handleChange,
  handleRoleChange
}: SignupFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <div className="relative">
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="pl-8"
            />
            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <div className="relative">
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="pl-8"
            />
            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="pl-8"
          />
          <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChange}
            className="pl-8"
          />
          <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={handleRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="candidate">Candidate</SelectItem>
            <SelectItem value="hiring_manager">Hiring Manager</SelectItem>
            <SelectItem value="recruiter">Recruiter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showCompanyField && (
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <div className="relative">
            <Input
              id="company"
              name="company"
              placeholder="Company name"
              required
              value={formData.company}
              onChange={handleChange}
              className="pl-8"
            />
            <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </>
  );
};

export default SignupFormFields;
