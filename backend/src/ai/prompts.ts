export const ANALYZE_RESUME_PROMPT = (
  resumeText: string,
  jobTitle: string,
  jobDescription: string,
) => `
Analyze the following resume for the job title "${jobTitle}" and job description "${jobDescription}".
Resume Text:
${resumeText}

Return a JSON object with the following structure:
{
  "totalScore": number (0-100),
  "breakdown": {
    "contactInfo": number (0-20),
    "workExperience": number (0-25),
    "skills": number (0-20),
    "education": number (0-15),
    "summary": number (0-10),
    "atsKeywords": number (0-10)
  },
  "issues": [
    { "type": "error" | "warning" | "tip", "message": string }
  ],
  "strengths": [string],
  "summary": string (2-3 sentences)
}
`;

export const GET_SUGGESTIONS_PROMPT = (
  resumeText: string,
  jobTitle: string,
) => `
Based on the following resume and job title "${jobTitle}", provide specific suggestions to improve the resume.
Resume: ${resumeText}

Return a JSON object:
{
  "suggestions": [
    {
      "priority": "High" | "Medium" | "Low",
      "category": string,
      "problem": string,
      "solution": string,
      "example": string,
      "impact": number
    }
  ],
  "missingKeywords": [string],
  "recommendedSkills": [string],
  "powerVerbs": [string]
}
`;

export const GENERATE_COVER_LETTER_PROMPT = (data: any) => `
Generate a cover letter for:
Name: ${data.name}
Job Title: ${data.jobTitle}
Company: ${data.company}
Skills: ${data.skills}
Experience: ${data.experience}
Achievement: ${data.achievement}
Why This Company: ${data.whyCompany}
Tone: ${data.tone}
Length: ${data.length}
Language: ${data.language}

Return JSON: { "content": string }
`;

export const REWRITE_BULLET_PROMPT = (bullet: string, jobTitle: string) => `
Rewrite the following resume bullet point to be more powerful and relevant to a "${jobTitle}" role.
Bullet: ${bullet}

Return JSON: { "original": string, "rewritten": string, "scoreImpact": number }
`;

export const GENERATE_SUMMARY_PROMPT = (data: any) => `
Generate a professional resume summary for:
Name: ${data.name}
Title: ${data.title}
Experience: ${data.experience}
Skills: ${data.skills}

Return JSON: { "summary": string }
`;

export const SUGGEST_SKILLS_PROMPT = (
  jobTitle: string,
  currentSkills: string,
) => `
Suggest skills for a "${jobTitle}" role. Current skills: ${currentSkills}

Return JSON: { "suggestedSkills": [string] }
`;
