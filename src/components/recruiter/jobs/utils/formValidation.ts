
export const checkRequiredFields = (jobForm: HTMLFormElement | null) => {
  if (!jobForm) {
    console.error('Form element not found');
    return { isValid: false, missingFields: [] };
  }
  
  const formData = new FormData(jobForm);
  
  console.log('Form data entries:', Object.fromEntries(formData.entries()));
  
  const requiredFields = {
    title: 'Job Title',
    company: 'Company',
    department: 'Department',
    type: 'Job Type',
    level: 'Experience Level',
  };
  
  const missing: string[] = [];
  
  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!formData.get(field)) {
      missing.push(label);
    }
  });
  
  return {
    isValid: missing.length === 0,
    missingFields: missing,
  };
};
