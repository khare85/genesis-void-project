
// Mock data for AI interview analysis
export const mockAnalysis = {
  completedOn: new Date().toLocaleDateString(),
  duration: "28 minutes",
  questions: 12,
  overallScore: 85,
  confidence: 89,
  clarity: 82,
  technicalAccuracy: 87,
  engagement: 83,
  keyInsights: [
    { type: "strength", text: "Shows exceptional problem-solving skills with practical examples" },
    { type: "strength", text: "Demonstrates clear understanding of system architecture principles" },
    { type: "area_for_improvement", text: "Could improve specific knowledge of cloud deployment strategies" },
    { type: "neutral", text: "Prefers collaborative work environments with regular feedback" },
  ],
  skillAssessments: [
    { skill: "JavaScript", score: 90 },
    { skill: "React", score: 87 },
    { skill: "Node.js", score: 78 },
    { skill: "System Design", score: 85 },
    { skill: "Problem Solving", score: 92 },
  ],
  interviewSummary: `The candidate demonstrated strong technical knowledge in frontend development, particularly in React and state management. They were able to explain complex concepts clearly and provided practical examples from their previous work. 
  
  When discussing system architecture, the candidate showed good understanding of microservices and API design principles. The candidate's problem-solving approach was systematic and thorough.
  
  Areas for development include deeper knowledge of cloud infrastructure and deployment strategies. The candidate would benefit from more hands-on experience with container orchestration.
  
  Overall, the candidate would be a valuable addition to the engineering team with their strong technical foundation and collaborative approach to problem-solving.`
};
