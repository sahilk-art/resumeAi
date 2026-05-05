import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { GET_SUGGESTIONS_PROMPT } from '../ai/prompts';

@Injectable()
export class SuggestionsService {
  constructor(private aiService: AIService) {}

  async generate(data: any) {
    const { resumeText, jobTitle } = data;
    const prompt = GET_SUGGESTIONS_PROMPT(resumeText, jobTitle);
    const result = await this.aiService.callAI(prompt);
    return {
      ...result,
      aiProvider: this.aiService.getProvider(),
    };
  }
}
