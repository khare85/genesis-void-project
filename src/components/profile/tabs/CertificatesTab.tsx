
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { PlusCircle, Award, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface CertificatesTabProps {
  certificates: any[];
  isEditing: boolean;
  form?: any;
}

const CertificatesTab: React.FC<CertificatesTabProps> = ({ certificates, isEditing, form }) => {
  const { toast } = useToast();
  
  const handleDeleteCertificate = (index: number) => {
    if (!form) return;
    
    const currentCertificates = [...form.getValues().certificates];
    currentCertificates.splice(index, 1);
    
    form.setValue('certificates', currentCertificates);
    
    toast({
      title: "Certificate deleted",
      description: "The certificate has been removed from your profile."
    });
  };

  const handleAddCertificate = () => {
    if (!form) return;
    
    const currentCertificates = [...form.getValues().certificates];
    const newCertificate = {
      id: uuidv4(),
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: ""
    };
    
    form.setValue('certificates', [...currentCertificates, newCertificate]);
    
    toast({
      title: "Certificate added",
      description: "Please fill in the details for your new certificate."
    });
  };
  
  return (
    <>
      <div className="mb-5">
        <h3 className="text-lg font-medium">Certificates</h3>
        <p className="text-muted-foreground">Manage your professional certifications and achievements</p>
      </div>
      
      <div className="space-y-4">
        {certificates && certificates.map((certificate: any, index: number) => (
          <div key={certificate.id || index} className="border p-4 rounded-md">
            {isEditing ? (
              <div className="space-y-3">
                {form ? (
                  <>
                    <div className="flex justify-between items-start">
                      <FormField
                        control={form.control}
                        name={`certificates.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} className="font-medium text-base" defaultValue={certificate.name} placeholder="Certificate Name" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-1"
                        onClick={() => handleDeleteCertificate(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`certificates.${index}.issuer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} defaultValue={certificate.issuer} placeholder="Issuing Organization" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`certificates.${index}.issueDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="month" {...field} defaultValue={certificate.issueDate} placeholder="Issue Date" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`certificates.${index}.expiryDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="month" {...field} defaultValue={certificate.expiryDate} placeholder="Expiry Date (or leave empty if no expiry)" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`certificates.${index}.credentialId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} defaultValue={certificate.credentialId} placeholder="Credential ID (optional)" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <div className="text-center">
                    <p>Form not available</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{certificate.name || "Certificate Name"}</h4>
                  <p className="text-sm text-muted-foreground">{certificate.issuer || "Issuer"}</p>
                  <p className="text-sm text-muted-foreground">
                    {certificate.issueDate || "Issue Date"} - {certificate.expiryDate || 'No Expiration'}
                  </p>
                  {certificate.credentialId && (
                    <p className="text-sm mt-1">Credential ID: {certificate.credentialId}</p>
                  )}
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    {/* Edit/Delete buttons would go here in edit mode */}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {(!certificates || certificates.length === 0) && (
          <div className="text-center p-8 border border-dashed rounded-md">
            <p className="text-muted-foreground">No certificates added yet</p>
            {isEditing && (
              <Button 
                onClick={handleAddCertificate}
                variant="ghost" 
                size="sm" 
                className="mt-2 text-primary hover:text-primary-dark"
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Certificate
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CertificatesTab;
