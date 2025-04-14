import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronRight } from 'lucide-react';
const LandingHero = () => {
  return <section className="w-full py-16 lg:py-32 bg-gradient-to-r from-[#EFF6FF] to-[#F5F8FF] md:py-0">
      <div className="container md:px-6 space-y-10 xl:space-y-16 py-[95px] px-[25px]">
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
                <a href="#demo">Watch Demo</a>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img alt="Persona AI Dashboard" className="rounded-lg object-cover shadow-xl max-w-full h-auto" width={600} height={400} src="/lovable-uploads/edd4b93b-333a-42de-abf0-2ffa16a82666.jpg" />
          </div>
        </div>

        <div className="mx-auto grid items-center gap-10 md:grid-cols-2 lg:grid-cols-4 mt-20">
          <div className="grid gap-1 text-center">
            <h3 className="text-3xl font-bold text-[#3054A5]">3x</h3>
            <p className="text-sm text-muted-foreground">Faster Time-to-Hire</p>
          </div>
          <div className="grid gap-1 text-center">
            <h3 className="text-3xl font-bold text-[#3054A5]">85%</h3>
            <p className="text-sm text-muted-foreground">Reduction in Screening Time</p>
          </div>
          <div className="grid gap-1 text-center">
            <h3 className="text-3xl font-bold text-[#3054A5]">95%</h3>
            <p className="text-sm text-muted-foreground">Candidate Match Accuracy</p>
          </div>
          <div className="grid gap-1 text-center">
            <h3 className="text-3xl font-bold text-[#3054A5]">40%</h3>
            <p className="text-sm text-muted-foreground">Cost Reduction</p>
          </div>
        </div>
      </div>
    </section>;
};
export default LandingHero;