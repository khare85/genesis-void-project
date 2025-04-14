
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  ChevronRight, 
  BarChart, 
  Users, 
  Video, 
  FileText,
  Brain,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3054A5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" />
              <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
              <path d="M22 12h-4" />
            </svg>
            <span className="text-xl font-bold text-[#3054A5]">Persona AI</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hover:text-[#3054A5]" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button className="bg-[#3054A5] hover:bg-[#264785]" asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-[#EFF6FF] to-[#F5F8FF]">
        <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#3054A5]/10 px-3 py-1 text-sm text-[#3054A5] font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI-Powered Recruiting</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Find the Perfect <span className="text-[#3054A5]">Talent Match</span> with AI
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mt-4">
                  Persona AI transforms your hiring process with intelligent candidate matching, automated screening, and data-driven insights that save time and improve hiring decisions.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-4">
                <Button className="gap-1.5 bg-[#3054A5] hover:bg-[#264785]" size="lg" asChild>
                  <Link to="/login">
                    Start Free Trial <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-[#3054A5] text-[#3054A5]" asChild>
                  <a href="#demo">
                    Watch Demo
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/lovable-uploads/aca11823-5bec-4b96-b66f-db72aa94e876.png"
                alt="Persona AI Dashboard"
                className="rounded-lg object-cover shadow-xl max-w-full h-auto"
                width={600}
                height={400}
              />
            </div>
          </div>

          <div className="mx-auto grid items-center gap-10 md:grid-cols-2 lg:grid-cols-4 mt-20">
            <div className="grid gap-1 text-center">
              <h3 className="text-3xl font-bold text-[#3054A5]">3x</h3>
              <p className="text-sm text-muted-foreground">
                Faster Time-to-Hire
              </p>
            </div>
            <div className="grid gap-1 text-center">
              <h3 className="text-3xl font-bold text-[#3054A5]">85%</h3>
              <p className="text-sm text-muted-foreground">
                Reduction in Screening Time
              </p>
            </div>
            <div className="grid gap-1 text-center">
              <h3 className="text-3xl font-bold text-[#3054A5]">95%</h3>
              <p className="text-sm text-muted-foreground">
                Candidate Match Accuracy
              </p>
            </div>
            <div className="grid gap-1 text-center">
              <h3 className="text-3xl font-bold text-[#3054A5]">40%</h3>
              <p className="text-sm text-muted-foreground">
                Cost Reduction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-[#3054A5] text-white">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need to Optimize Hiring
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto mt-4">
                Our platform combines cutting-edge AI with intuitive workflows to transform every step of your hiring process.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-16">
            <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="mb-4 rounded-full bg-[#3054A5]/10 p-3 w-12 h-12 flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#3054A5]" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Job Description Generator</h3>
              <p className="text-muted-foreground flex-grow">
                Create optimized, bias-free job descriptions in seconds based on the role requirements you input.
              </p>
            </div>
            <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="mb-4 rounded-full bg-[#3054A5]/10 p-3 w-12 h-12 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#3054A5]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Intelligent Candidate Screening</h3>
              <p className="text-muted-foreground flex-grow">
                Automatically parse resumes and score candidates against job requirements to identify the best matches.
              </p>
            </div>
            <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="mb-4 rounded-full bg-[#3054A5]/10 p-3 w-12 h-12 flex items-center justify-center">
                <Video className="h-6 w-6 text-[#3054A5]" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Video Interviews</h3>
              <p className="text-muted-foreground flex-grow">
                Conduct and analyze pre-recorded or live video interviews with AI-powered insights on candidate responses.
              </p>
            </div>
            <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="mb-4 rounded-full bg-[#3054A5]/10 p-3 w-12 h-12 flex items-center justify-center">
                <BarChart className="h-6 w-6 text-[#3054A5]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground flex-grow">
                Track key metrics and get AI recommendations to continuously improve your hiring process.
              </p>
            </div>
            <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="mb-4 rounded-full bg-[#3054A5]/10 p-3 w-12 h-12 flex items-center justify-center">
                <Brain className="h-6 w-6 text-[#3054A5]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Personality Insights</h3>
              <p className="text-muted-foreground flex-grow">
                Get deep insights into candidate personalities and work styles to ensure better team fit and lower turnover.
              </p>
            </div>
            <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="mb-4 rounded-full bg-[#3054A5]/10 p-3 w-12 h-12 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#3054A5]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bias Detection & Removal</h3>
              <p className="text-muted-foreground flex-grow">
                Identify and eliminate bias in your job descriptions, screening processes, and interview evaluations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-[#EFF6FF] to-[#F5F8FF]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How Persona AI Works
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              Our seamless end-to-end process streamlines your hiring workflow
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-[#3054A5] text-white flex items-center justify-center text-2xl font-bold">1</div>
                <div className="hidden md:block absolute top-8 left-16 w-full h-0.5 bg-[#3054A5]/20"></div>
              </div>
              <h3 className="text-xl font-bold mb-3">Create & Optimize Job Listings</h3>
              <p className="text-muted-foreground">
                Use our AI to generate optimized job descriptions or improve existing ones for better candidate attraction.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-[#3054A5] text-white flex items-center justify-center text-2xl font-bold">2</div>
                <div className="hidden md:block absolute top-8 left-16 w-full h-0.5 bg-[#3054A5]/20"></div>
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Screening</h3>
              <p className="text-muted-foreground">
                Our AI analyzes resumes, scores candidates, and provides insights to help you identify the best matches.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-[#3054A5] text-white flex items-center justify-center text-2xl font-bold">3</div>
              </div>
              <h3 className="text-xl font-bold mb-3">Interview & Select</h3>
              <p className="text-muted-foreground">
                Conduct AI-analyzed interviews and make data-backed hiring decisions with confidence.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button className="gap-1.5 bg-[#3054A5] hover:bg-[#264785]" size="lg" asChild>
              <Link to="/careers">
                Browse Job Openings <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:py-12">
          <div className="flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3054A5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" />
                <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                <path d="M22 12h-4" />
              </svg>
              <span className="text-xl font-bold text-[#3054A5]">Persona AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transforming recruitment with AI-powered insights.
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-muted-foreground hover:text-[#3054A5]">Features</a></li>
                <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-[#3054A5]">Pricing</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Integrations</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">About Us</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Careers</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Help Center</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Support</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container flex flex-col gap-4 border-t py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 Persona AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
