
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Building } from 'lucide-react';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company: string;
}

interface SignupFormFieldsProps {
  formData: SignupFormData;
  showCompanyField: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SignupFormFields = ({
  formData,
  showCompanyField,
  handleChange
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
        <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
      </div>

      {showCompanyField && (
        <div className="space-y-2">
          <Label htmlFor="company">Company Name (Optional)</Label>
          <div className="relative">
            <Input
              id="company"
              name="company"
              placeholder="Company name (optional)"
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
