
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  highlight?: boolean;
  priceCaption?: string;
};

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Startup",
    price: "$99",
    priceCaption: "per month",
    description: "Perfect for small teams making up to 5 hires per month.",
    features: [
      "5 active job postings",
      "AI resume screening (100/mo)",
      "Basic analytics dashboard",
      "Email support",
      "1 admin user",
      "Standard job templates"
    ],
    buttonText: "Start Free Trial"
  },
  {
    name: "Growth",
    price: "$299",
    priceCaption: "per month",
    description: "For growing companies making up to 15 hires per month.",
    features: [
      "15 active job postings",
      "AI resume screening (500/mo)",
      "AI video interviews (50/mo)",
      "Advanced analytics & reporting",
      "Priority email & chat support",
      "3 admin users", 
      "Custom job templates",
      "Team collaboration tools"
    ],
    buttonText: "Start Free Trial",
    highlight: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with advanced recruitment needs.",
    features: [
      "Unlimited job postings",
      "Unlimited AI resume screening",
      "Unlimited AI video interviews",
      "Executive dashboard & reporting",
      "Dedicated account manager",
      "Unlimited admin users",
      "API access",
      "Custom ATS integration",
      "Advanced security features",
      "SLA guarantees"
    ],
    buttonText: "Contact Sales"
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="w-full py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              Choose the plan that's right for your recruitment needs
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan, index) => (
            <Card 
              key={index} 
              className={`flex flex-col h-full border ${plan.highlight ? 'border-[#3054A5] shadow-lg' : ''}`}
            >
              {plan.highlight && (
                <div className="bg-[#3054A5] text-white py-1.5 px-4 text-sm text-center font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-4 flex items-baseline text-5xl font-bold">
                  {plan.price}
                  {plan.priceCaption && (
                    <span className="ml-1 text-lg font-normal text-muted-foreground">
                      {plan.priceCaption}
                    </span>
                  )}
                </div>
                <CardDescription className="mt-4">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#3054A5] mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${plan.highlight ? 'bg-[#3054A5] hover:bg-[#264785]' : ''}`}
                  variant={plan.highlight ? 'default' : 'outline'}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-2">Need a custom solution?</h3>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            We offer tailored plans for businesses with specific requirements. Contact our sales team to discuss your needs.
          </p>
          <Button variant="outline" className="border-[#3054A5] text-[#3054A5]">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
