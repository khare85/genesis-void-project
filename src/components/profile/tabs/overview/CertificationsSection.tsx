
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Plus, Trash2 } from "lucide-react";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatDate } from '@/components/profile/tabs/OverviewTab';

interface CertificationsSectionProps {
  profileData: any;
  isEditing: boolean;
  form?: any;
  onDeleteCertificate?: (id: number) => void;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({ 
  profileData, 
  isEditing, 
  form,
  onDeleteCertificate 
}) => {
  const generateRandomId = () => Math.floor(Math.random() * 10000);
  
  const addNewCertificate = () => {
    if (!form) return;
    const currentCertificates = [...form.getValues().certificates];
    form.setValue('certificates', [
      ...currentCertificates,
      {
        id: generateRandomId(),
        name: '',
        issuer: '',
        issueDate: null,
        expiryDate: null,
        credentialId: ''
      }
    ]);
  };

  return (
    <Card className="border border-gray-100 shadow-lg transform transition-all duration-300 hover:shadow-xl bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-black">Certifications</h3>
          </div>
          {isEditing && (
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={addNewCertificate}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {(isEditing ? form?.getValues().certificates : profileData.certificates).map((cert: any, index: number) => (
            <div key={cert.id} className="border-b pb-4 last:border-0 last:pb-0">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Certificate #{index + 1}</h4>
                    {onDeleteCertificate && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 h-8 p-0"
                        onClick={() => onDeleteCertificate(cert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form?.control}
                      name={`certificates.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <Input placeholder="Certificate Name" {...field} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form?.control}
                      name={`certificates.${index}.issuer`}
                      render={({ field }) => (
                        <FormItem>
                          <Input placeholder="Issuing Organization" {...field} />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form?.control}
                      name={`certificates.${index}.issueDate`}
                      render={({ field }) => (
                        <FormItem>
                          <Input 
                            type="date"
                            placeholder="Issue Date" 
                            {...field} 
                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form?.control}
                      name={`certificates.${index}.expiryDate`}
                      render={({ field }) => (
                        <FormItem>
                          <Input 
                            type="date"
                            placeholder="Expiry Date (if applicable)" 
                            {...field} 
                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                          />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form?.control}
                    name={`certificates.${index}.credentialId`}
                    render={({ field }) => (
                      <FormItem>
                        <Input placeholder="Credential ID (if applicable)" {...field} />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                          <p className="text-gray-600">{cert.issuer}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(cert.issueDate)} 
                          {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                        </div>
                      </div>
                      {cert.credentialId && (
                        <p className="mt-1 text-sm text-gray-500">Credential ID: {cert.credentialId}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {!isEditing && profileData.certificates.length === 0 && (
            <p className="text-gray-500 italic">No certifications added yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationsSection;
