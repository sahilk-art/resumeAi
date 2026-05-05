import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';

@Injectable()
export class AtsService {
  constructor(private aiService: AIService) {}

  async check(data: any) {
    const { resumeText, jobDescription } = data;
    const prompt = `
      Perform an ATS (Applicant Tracking System) check.
      Resume Text: ${resumeText}
      Job Description: ${jobDescription}

      Return a JSON object:
      {
        "matchPercentage": number,
        "matchedKeywords": [string],
        "missingKeywords": [string],
        "keywordDensity": [ { "keyword": string, "count": number } ],
        "sectionAnalysis": [ { "section": string, "status": "Good" | "Needs Improvement", "feedback": string } ],
        "fixSuggestions": [string]
      }
    `;
    return this.aiService.callAI(prompt);
  }
}
