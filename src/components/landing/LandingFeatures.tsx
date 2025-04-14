
import React from 'react';
import { FileText, Users, Video, BarChart, Brain, CheckCircle } from 'lucide-react';

const FEATURES = [
  {
    icon: FileText,
    title: "AI Job Description Generator",
    description: "Create optimized, bias-free job descriptions in seconds based on the role requirements you input."
  },
  {
    icon: Users,
    title: "Intelligent Candidate Screening",
    description: "Automatically parse resumes and score candidates against job requirements to identify the best matches."
  },
  {
    icon: Video,
    title: "AI Video Interviews",
    description: "Conduct and analyze pre-recorded or live video interviews with AI-powered insights on candidate responses."
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Track key metrics and get AI recommendations to continuously improve your hiring process."
  },
  {
    icon: Brain,
    title: "Personality Insights",
    description: "Get deep insights into candidate personalities and work styles to ensure better team fit and lower turnover."
  },
  {
    icon: CheckCircle,
    title: "Bias Detection & Removal",
    description: "Identify and eliminate bias in your job descriptions, screening processes, and interview evaluations."
  }
];

const LandingFeatures = () => {
  return (
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
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="mb-4 rounded-full bg-[#3054A5]/10 p-3 w-12 h-12 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-[#3054A5]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground flex-grow">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
