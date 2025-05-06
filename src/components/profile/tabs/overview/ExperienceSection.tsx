
import React from 'react';
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Briefcase, Trash2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "../OverviewTab";

interface ExperienceSectionProps {
  profileData: any;
  isEditing: boolean;
  form?: any;
  onDeleteExperience: (id: number) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  profileData,
  isEditing,
  form,
  onDeleteExperience
}) => {
  return (
    <Card className="border border-gray-100 shadow-lg transform transition-all duration-300 hover:shadow-xl bg-white">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-black mb-4">Experience Highlights</h3>
        <div className="space-y-6">
          {form && isEditing ? (
            form.getValues().experience.slice(0, 2).map((job: any, index: number) => (
              <div key={job.id} className="flex gap-4">
                <div className="mt-0.5 size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`experience.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <FormControl>
                          <input
                            type="text"
                            className="font-semibold text-black border-none p-0 focus:ring-0 w-full bg-transparent"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experience.${index}.company`}
                    render={({ field }) => (
                      <FormItem className="mb-1">
                        <FormControl>
                          <input
                            type="text"
                            className="text-sm text-gray-600 border-none p-0 focus:ring-0 w-full bg-transparent"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`experience.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem className="mb-0">
                          <FormControl>
                            <input
                              type="month"
                              className="text-xs text-gray-500 border-none p-0 focus:ring-0 bg-transparent"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-xs text-gray-500">-</span>
                    <FormField
                      control={form.control}
                      name={`experience.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem className="mb-0">
                          <FormControl>
                            <input
                              type="month"
                              className="text-xs text-gray-500 border-none p-0 focus:ring-0 bg-transparent"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive"
                      onClick={() => onDeleteExperience(job.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            profileData.experience.slice(0, 2).map((job: any) => (
              <div key={job.id} className="flex gap-4">
                <div className="mt-0.5 size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-black text-base">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(job.startDate)} - {formatDate(job.endDate)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;
