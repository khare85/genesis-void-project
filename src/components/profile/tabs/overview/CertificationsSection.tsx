
import React from 'react';
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Award, Trash2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "../OverviewTab";

interface CertificationsSectionProps {
  profileData: any;
  isEditing: boolean;
  form?: any;
  onDeleteCertificate: (id: number) => void;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  profileData,
  isEditing,
  form,
  onDeleteCertificate
}) => {
  return (
    <Card className="border border-gray-100 shadow-lg transform transition-all duration-300 hover:shadow-xl bg-white">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-black mb-4">Certifications</h3>
        <div className="space-y-6">
          {form && isEditing ? (
            form.getValues().certificates.map((cert: any, index: number) => (
              <div key={cert.id} className="flex items-start gap-4">
                <div className="mt-0.5 size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Award className="h-5 w-5" />
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
                            className="font-semibold text-black border-none p-0 focus:ring-0 w-full bg-transparent"
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
                              className="text-sm text-gray-600 border-none p-0 focus:ring-0 bg-transparent"
                              {...field}
                              placeholder="Issuer"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-sm text-gray-600">•</span>
                    <FormField
                      control={form.control}
                      name={`certificates.${index}.issueDate`}
                      render={({ field }) => (
                        <FormItem className="mb-0">
                          <FormControl>
                            <input
                              type="month"
                              className="text-sm text-gray-600 border-none p-0 focus:ring-0 bg-transparent"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {cert.expiryDate && (
                      <>
                        <span className="text-sm text-gray-600">-</span>
                        <FormField
                          control={form.control}
                          name={`certificates.${index}.expiryDate`}
                          render={({ field }) => (
                            <FormItem className="mb-0">
                              <FormControl>
                                <input
                                  type="month"
                                  className="text-sm text-gray-600 border-none p-0 focus:ring-0 bg-transparent"
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
                              className="text-xs text-gray-500 border-none p-0 focus:ring-0 bg-transparent"
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
                      onClick={() => onDeleteCertificate(cert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            profileData.certificates.map((cert: any) => (
              <div key={cert.id} className="flex items-start gap-4">
                <div className="mt-0.5 size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-black font-semibold text-base">{cert.name}</h4>
                  <p className="text-sm text-gray-600">
                    {cert.issuer} • {formatDate(cert.issueDate)}
                    {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Credential ID: {cert.credentialId}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationsSection;
