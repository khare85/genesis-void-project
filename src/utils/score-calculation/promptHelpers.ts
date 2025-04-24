
export const prepareJobText = (job: any) => {
  const requirementsText = Array.isArray(job.requirements) 
    ? job.requirements.join('\n') 
    : (job.requirements || '');
    
  const responsibilitiesText = Array.isArray(job.responsibilities)
    ? job.responsibilities.join('\n')
    : (job.responsibilities || '');

  const skillsText = Array.isArray(job.skills)
    ? job.skills.join(', ')
    : (job.skills || '');

  return {
    requirementsText,
    responsibilitiesText,
    skillsText
  };
};

export const generateAIPrompt = (job: any, jobTexts: any, resumeText: string) => {
  return `
    I need to match a candidate's resume with a job description.
    
    JOB TITLE: ${job.title}
    
    JOB DESCRIPTION: ${job.description || 'No description provided'}
    
    JOB REQUIREMENTS:
    ${jobTexts.requirementsText || 'No specific requirements listed'}
    
    JOB RESPONSIBILITIES:
    ${jobTexts.responsibilitiesText || 'No specific responsibilities listed'}
    
    JOB SKILLS REQUIRED:
    ${jobTexts.skillsText || 'No specific skills listed'}
    
    CANDIDATE RESUME INFO:
    ${resumeText || 'Resume text not available, but candidate has applied for this position'}
    
    Based on the available information, give me a match score out of 100.
    The score should reflect how well the candidate's qualifications match the job requirements.
    Respond with ONLY a number from 0-100. Do not include any other text.
    `;
};
