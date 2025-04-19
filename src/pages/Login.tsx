import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import SignUpForm from '@/components/auth/SignUpForm';

const DEMO_ACCOUNTS = [
  { email: 'admin@example.com', role: 'Admin', id: '1' },
  { email: 'hm@example.com', role: 'Hiring Manager', id: '2' },
  { email: 'recruiter@example.com', role: 'Recruiter', id: '3' },
  { email: 'candidate@example.com', role: 'Candidate', id: '4' }
];

const Login = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    await login(email, password);
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    await login(demoEmail, 'password');
  };

  return (
    <div className="flex h-screen w-screen bg-white">
      <div className="hidden md:block md:w-1/2 bg-[#3054A5] text-white p-12 flex flex-col justify-center relative">
        <div className="max-w-lg">
          <div className="flex items-center gap-2 mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-white"
            >
              <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" />
              <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
              <path d="M22 12h-4" />
            </svg>
            <h1 className="text-3xl font-bold">Persona AI</h1>
          </div>

          <h2 className="text-3xl font-bold mb-4">
            AI-Powered Recruitment
          </h2>
          <p className="text-xl opacity-80 mb-10">
            Transform your hiring process with AI-driven insights, automated screening,
            and data-backed decision making.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-white">AI Resume Analysis & Scoring</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-white">Smart Job Description Generator</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-white">Automated Video Interviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 md:hidden mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3054A5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" />
                <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                <path d="M22 12h-4" />
              </svg>
              <h1 className="text-3xl font-bold text-[#3054A5]">Persona AI</h1>
            </div>
            
            <h2 className="text-2xl font-bold">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-muted-foreground mt-2">
              {isSignUp ? 'Sign up to join our community' : 'Sign in to access your account'}
            </p>
          </div>
          
          {isSignUp ? (
            <SignUpForm />
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button type="button" variant="link" className="text-xs text-[#3054A5]">
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#3054A5] hover:bg-[#264785]" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
              
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
                      onClick={() => handleDemoLogin(account.email)}
                      disabled={isLoading}
                      className="h-10"
                    >
                      {account.role}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
          
          <p className="text-center text-sm text-muted-foreground mt-8">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#3054A5] font-medium hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
