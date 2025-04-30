
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AIGenerated from "@/components/shared/AIGenerated";
import { BookOpen, Loader2, PartyPopper, Sparkles } from 'lucide-react';
import { useInterviewPrep } from '@/hooks/useInterviewPrep';
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const InterviewPrepCard: React.FC = () => {
  const { isLoading, prepData, jobTitle, generateInterviewPrep } = useInterviewPrep();
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewFullGuide, setViewFullGuide] = useState(false);

  const handleGenerate = async () => {
    await generateInterviewPrep(customJobTitle);
    setDialogOpen(false);
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            Interview Preparation
          </h3>
        </div>
        
        <AIGenerated isLoading={isLoading}>
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">Generating interview preparation content...</p>
            </div>
          )}
          
          {!prepData && !isLoading && (
            <div className="flex flex-col items-center justify-center py-4">
              <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-3 text-center">
                Generate AI-powered interview preparation tailored to your profile and target role
              </p>
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Prepare for Interview</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Interview Preparation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      Enter the job title you're interviewing for to get personalized preparation content.
                      Leave blank to use your profile title.
                    </p>
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter job title (e.g. Frontend Developer)"
                        value={customJobTitle}
                        onChange={(e) => setCustomJobTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleGenerate} disabled={isLoading}>
                        {isLoading ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating</>
                        ) : (
                          'Generate Prep Content'
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
          
          {prepData && !isLoading && !viewFullGuide && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Interview Prep for</h4>
                  <p className="text-lg font-semibold">{jobTitle}</p>
                </div>
                <PartyPopper className="h-5 w-5 text-amber-500" />
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="common-questions">
                  <AccordionTrigger>Common Questions</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      {prepData.commonQuestions.slice(0, 2).map((item, index) => (
                        <div key={index} className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium mb-1">{item.question}</p>
                          <p className="text-xs text-muted-foreground">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="behavioral">
                  <AccordionTrigger>Behavioral Questions</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      {prepData.behavioralQuestions.slice(0, 2).map((item, index) => (
                        <div key={index} className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium mb-1">{item.question}</p>
                          <p className="text-xs text-muted-foreground">{item.framework}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="skills">
                  <AccordionTrigger>Key Skills to Highlight</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      {prepData.keySkills.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button size="sm" className="w-full" onClick={() => setViewFullGuide(true)}>
                View Full Interview Guide
              </Button>
            </div>
          )}
          
          {prepData && !isLoading && viewFullGuide && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Comprehensive Guide for</h4>
                  <p className="text-lg font-semibold">{jobTitle}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setViewFullGuide(false)}>
                  Back to Summary
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">1</span>
                    Common Interview Questions
                  </h4>
                  <div className="space-y-3">
                    {prepData.commonQuestions.map((item, index) => (
                      <div key={index} className="p-3 rounded-md bg-muted/50">
                        <p className="text-sm font-medium mb-1">{item.question}</p>
                        <p className="text-xs text-muted-foreground">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">2</span>
                    Behavioral Questions
                  </h4>
                  <div className="space-y-3">
                    {prepData.behavioralQuestions.map((item, index) => (
                      <div key={index} className="p-3 rounded-md bg-muted/50">
                        <p className="text-sm font-medium mb-1">{item.question}</p>
                        <p className="text-xs text-muted-foreground">{item.framework}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">3</span>
                    Key Skills to Highlight
                  </h4>
                  <div className="flex flex-wrap gap-2 p-3 rounded-md bg-muted/50">
                    {prepData.keySkills.map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">4</span>
                    Technical Tips
                  </h4>
                  <div className="p-3 rounded-md bg-muted/50">
                    <p className="text-xs text-muted-foreground">{prepData.technicalTips}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">5</span>
                    Questions to Ask Interviewer
                  </h4>
                  <div className="p-3 rounded-md bg-muted/50">
                    <ul className="list-disc pl-4 space-y-1">
                      {prepData.questionsToAsk.map((question, index) => (
                        <li key={index} className="text-xs text-muted-foreground">{question}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AIGenerated>
      </div>
    </Card>
  );
};

export default InterviewPrepCard;
