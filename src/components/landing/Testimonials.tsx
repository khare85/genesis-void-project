
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    content: "Persona AI has completely transformed our hiring process. We've reduced our time-to-hire by over 60% while finding better candidates. The AI-powered screening is incredibly accurate.",
    author: "Sarah Johnson",
    position: "VP of Talent Acquisition",
    company: "TechGrowth Inc.",
    avatar: "/lovable-uploads/190e648d-5f47-496e-9fb5-ed5e3ac62af5.png"
  },
  {
    content: "As a hiring manager with limited resources, Persona AI felt like adding an entire recruitment team. The insights provided for each candidate are detailed and surprisingly accurate.",
    author: "Michael Chen",
    position: "Engineering Director",
    company: "InnovateSoft",
    avatar: "/lovable-uploads/2564f89a-2d91-4251-a6ab-f82d9c9ed4b0.png"
  },
  {
    content: "The AI interview analysis saved us countless hours. We no longer have to manually review every interview - the platform highlights the key strengths and concerns for each candidate.",
    author: "Emily Rodriguez",
    position: "CTO",
    company: "DataStream",
    avatar: "/lovable-uploads/aca11823-5bec-4b96-b66f-db72aa94e876.png"
  },
  {
    content: "What impressed me most about Persona AI is how it helped us eliminate bias from our hiring process. The data-backed recommendations ensure we're making decisions based on skills and fit.",
    author: "David Park",
    position: "HR Director",
    company: "Global Solutions Ltd.",
    avatar: ""
  },
  {
    content: "Implementing Persona AI reduced our cost-per-hire by 40%. The efficiency gains and quality of candidates have made this an essential tool for our recruitment team.",
    author: "Jessica Williams",
    position: "Recruitment Manager",
    company: "AlphaWave Technologies",
    avatar: ""
  },
  {
    content: "As a candidate, I appreciated the fairness and efficiency of the Persona AI interview process. It felt more objective than traditional interviews and I got feedback much faster.",
    author: "Thomas Miller",
    position: "Software Developer",
    company: "Recently hired via Persona AI",
    avatar: ""
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-[#EFF6FF] to-[#F5F8FF]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Our Customers Love Persona AI
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-xl">
            See why companies of all sizes trust our platform to transform their hiring process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <Card key={index} className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="flex flex-col h-full p-6">
                <div className="mb-4">
                  <Quote className="h-8 w-8 text-[#3054A5] opacity-50" />
                </div>
                <p className="text-lg mb-8 flex-grow">"{testimonial.content}"</p>
                <div className="flex items-center mt-4">
                  <Avatar className="h-12 w-12 mr-4 border-2 border-[#3054A5]/20">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback className="bg-[#3054A5]/10 text-[#3054A5]">
                      {testimonial.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
