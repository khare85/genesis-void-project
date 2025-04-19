
import { Button } from '@/components/ui/button';

export const DEMO_ACCOUNTS = [
  { email: 'admin@example.com', role: 'Admin', id: '1' },
  { email: 'hm@example.com', role: 'Hiring Manager', id: '2' },
  { email: 'recruiter@example.com', role: 'Recruiter', id: '3' },
  { email: 'candidate@example.com', role: 'Candidate', id: '4' }
];

interface DemoAccountsProps {
  onDemoLogin: (email: string) => void;
  isLoading: boolean;
}

const DemoAccounts = ({ onDemoLogin, isLoading }: DemoAccountsProps) => {
  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-muted-foreground">
            Quick Login
          </span>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-3">
        {DEMO_ACCOUNTS.map((account) => (
          <Button
            key={account.id}
            variant="outline"
            type="button"
            onClick={() => onDemoLogin(account.email)}
            disabled={isLoading}
            className="h-10"
          >
            {account.role}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DemoAccounts;
