
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from "@/hooks/admin/useAddUserForm";
import { useCompanies, Company } from "@/hooks/admin/useCompanies";
import { useEffect } from "react";

interface RoleAndCompanyFieldsProps {
  form: UseFormReturn<UserFormValues>;
  onNewCompany: () => void;
  onCompanyRefresh?: () => void;
}

export const RoleAndCompanyFields = ({ form, onNewCompany, onCompanyRefresh }: RoleAndCompanyFieldsProps) => {
  const { companies, isLoading, refreshCompanies } = useCompanies();
  const selectedRole = form.watch("role");
  
  const showCompanyField = selectedRole === "hiring_manager" || selectedRole === "recruiter";

  // Run refresh function if provided from parent
  useEffect(() => {
    if (onCompanyRefresh) {
      refreshCompanies();
    }
  }, [onCompanyRefresh, refreshCompanies]);

  // Handle "Create new company" option
  const handleCreateNewCompany = (e: React.MouseEvent) => {
    e.preventDefault();
    onNewCompany();
  };

  return (
    <>
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="hiring_manager">Hiring Manager</SelectItem>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              This determines what permissions the user will have.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {showCompanyField && (
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading ? "Loading companies..." : "Select a company"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies.map((company: Company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                  <SelectSeparator />
                  <div 
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    onClick={handleCreateNewCompany}
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create new company
                    </span>
                  </div>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};
