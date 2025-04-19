
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import SignUpForm from '@/components/auth/SignUpForm';
import LoginHero from '@/components/auth/LoginHero';
import LoginForm from '@/components/auth/LoginForm';
import DemoAccounts from '@/components/auth/DemoAccounts';

const Login = () => {
  const { login, isLoading, user, isAuthenticated } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname || `/dashboard`;
      console.log('User authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleDemoLogin = async (demoEmail: string) => {
    const loadingToast = toast.loading('Signing in with demo account...');
    try {
      await login(demoEmail, 'password');
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.dismiss(loadingToast);
      // Error handling is already in the login function
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white">
      <LoginHero />
      
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
              <LoginForm onDemoLogin={handleDemoLogin} />
              <DemoAccounts onDemoLogin={handleDemoLogin} isLoading={isLoading} />
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
