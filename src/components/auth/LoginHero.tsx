
import { Sparkles } from 'lucide-react';

const LoginHero = () => {
  return (
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

        <h2 className="text-3xl font-bold mb-4">AI-Powered Recruitment</h2>
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
  );
};

export default LoginHero;
