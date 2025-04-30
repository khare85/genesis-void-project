
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Briefcase, School, Award, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Helper function to format dates
export const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date);
};

interface OverviewTabProps {
  profileData: any;
  isEditing: boolean;
  form?: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ profileData, isEditing, form }) => {
  const { toast } = useToast();
  
  // Handler functions for deleting entries
  const handleDeleteExperience = (id: number) => {
    if (!form) return;
    
    const currentExperiences = [...form.getValues().experience];
    const filtered = currentExperiences.filter(exp => exp.id !== id);
    form.setValue('experience', filtered);
    
    toast({
      title: "Experience removed",
      description: "The experience has been removed from your profile."
    });
  };
  
  const handleDeleteEducation = (id: number) => {
    if (!form) return;
    
    const currentEducation = [...form.getValues().education];
    const filtered = currentEducation.filter(edu => edu.id !== id);
    form.setValue('education', filtered);
    
    toast({
      title: "Education removed",
      description: "The education entry has been removed from your profile."
    });
  };
  
  const handleDeleteCertificate = (id: number) => {
    if (!form) return;
    
    const currentCertificates = [...form.getValues().certificates];
    const filtered = currentCertificates.filter(cert => cert.id !== id);
    form.setValue('certificates', filtered);
    
    toast({
      title: "Certificate removed",
      description: "The certificate has been removed from your profile."
    });
  };

  return (
    <>
      <div>
        <h3 className="text-lg font-medium mb-2">About Me</h3>
        {isEditing ? (
          <FormField
            control={form?.control}
            name="personal.bio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    className="w-full"
                    rows={4}
                    placeholder="Tell us about yourself"
                    {...field}
                    defaultValue={profileData.personal.bio}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ) : (
          <p className="text-muted-foreground">{profileData.personal.bio}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Experience Highlights</h3>
        </div>
        <div className="space-y-4">
          {form && isEditing 
            ? form.getValues().experience.slice(0, 2).map((job: any, index: number) => (
                <div key={job.id} className="flex gap-3">
                  <div className="mt-0.5 size-7 rounded-full bg-muted flex items-center justify-center text-primary">
                    <Briefcase className="h-4 w-4" />
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
                              className="font-medium border-none p-0 focus:ring-0 w-full bg-transparent"
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
                              className="text-sm text-muted-foreground border-none p-0 focus:ring-0 w-full bg-transparent"
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
                                className="text-xs text-muted-foreground border-none p-0 focus:ring-0 bg-transparent"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <span className="text-xs text-muted-foreground">-</span>
                      <FormField
                        control={form.control}
                        name={`experience.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem className="mb-0">
                            <FormControl>
                              <input 
                                type="month" 
                                className="text-xs text-muted-foreground border-none p-0 focus:ring-0 bg-transparent"
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
                        onClick={() => handleDeleteExperience(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            : profileData.experience.slice(0, 2).map((job: any) => (
                <div key={job.id} className="flex gap-3">
                  <div className="mt-0.5 size-7 rounded-full bg-muted flex items-center justify-center text-primary">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(job.startDate)} - {formatDate(job.endDate)}
                    </p>
                  </div>
                </div>
              ))
          }
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Education Highlights</h3>
        </div>
        <div className="space-y-4">
          {form && isEditing 
            ? form.getValues().education.map((edu: any, index: number) => (
                <div key={edu.id} className="flex gap-3">
                  <div className="mt-0.5 size-7 rounded-full bg-muted flex items-center justify-center text-primary">
                    <School className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem className="mb-2">
                          <FormControl>
                            <input 
                              type="text" 
                              className="font-medium border-none p-0 focus:ring-0 w-full bg-transparent"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.institution`}
                      render={({ field }) => (
                        <FormItem className="mb-1">
                          <FormControl>
                            <input 
                              type="text" 
                              className="text-sm text-muted-foreground border-none p-0 focus:ring-0 w-full bg-transparent"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`education.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem className="mb-0">
                            <FormControl>
                              <input 
                                type="month" 
                                className="text-xs text-muted-foreground border-none p-0 focus:ring-0 bg-transparent"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <span className="text-xs text-muted-foreground">-</span>
                      <FormField
                        control={form.control}
                        name={`education.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem className="mb-0">
                            <FormControl>
                              <input 
                                type="month" 
                                className="text-xs text-muted-foreground border-none p-0 focus:ring-0 bg-transparent"
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
                        onClick={() => handleDeleteEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            : profileData.education.map((edu: any) => (
                <div key={edu.id} className="flex gap-3">
                  <div className="mt-0.5 size-7 rounded-full bg-muted flex items-center justify-center text-primary">
                    <School className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                  </div>
                </div>
              ))
          }
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Certifications</h3>
        </div>
        <div className="space-y-3">
          {form && isEditing 
            ? form.getValues().certificates.map((cert: any, index: number) => (
                <div key={cert.id} className="flex items-start gap-3">
                  <div className="mt-0.5 size-7 rounded-full bg-muted flex items-center justify-center text-primary">
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`certificates.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="mb-1">
                          <FormControl>
                            <input 
                              type="text" 
                              className="font-medium border-none p-0 focus:ring-0 w-full bg-transparent"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center gap-1 mb-1">
                      <FormField
                        control={form.control}
                        name={`certificates.${index}.issuer`}
                        render={({ field }) => (
                          <FormItem className="mb-0">
                            <FormControl>
                              <input 
                                type="text" 
                                className="text-sm text-muted-foreground border-none p-0 focus:ring-0 bg-transparent"
                                {...field}
                                placeholder="Issuer"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <span className="text-sm text-muted-foreground">•</span>
                      <FormField
                        control={form.control}
                        name={`certificates.${index}.issueDate`}
                        render={({ field }) => (
                          <FormItem className="mb-0">
                            <FormControl>
                              <input 
                                type="month" 
                                className="text-sm text-muted-foreground border-none p-0 focus:ring-0 bg-transparent"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {cert.expiryDate && (
                        <>
                          <span className="text-sm text-muted-foreground">-</span>
                          <FormField
                            control={form.control}
                            name={`certificates.${index}.expiryDate`}
                            render={({ field }) => (
                              <FormItem className="mb-0">
                                <FormControl>
                                  <input 
                                    type="month" 
                                    className="text-sm text-muted-foreground border-none p-0 focus:ring-0 bg-transparent"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <FormField
                        control={form.control}
                        name={`certificates.${index}.credentialId`}
                        render={({ field }) => (
                          <FormItem className="mb-0">
                            <FormControl>
                              <input 
                                type="text" 
                                className="text-xs text-muted-foreground border-none p-0 focus:ring-0 bg-transparent"
                                {...field}
                                placeholder="Credential ID"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-destructive"
                        onClick={() => handleDeleteCertificate(cert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            : profileData.certificates.map((cert: any) => (
                <div key={cert.id} className="flex items-start gap-3">
                  <div className="mt-0.5 size-7 rounded-full bg-muted flex items-center justify-center text-primary">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer} • {formatDate(cert.issueDate)}
                      {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">Credential ID: {cert.credentialId}</p>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
