import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { GENERATE_SUMMARY_PROMPT, REWRITE_BULLET_PROMPT, SUGGEST_SKILLS_PROMPT } from '../ai/prompts';

@Injectable()
export class AIHelpersService {
  constructor(private aiService: AIService) {}

  async generateSummary(data: any) {
    const prompt = GENERATE_SUMMARY_PROMPT(data);
    return this.aiService.callAI(prompt);
  }

  async improveBullet(data: any) {
    const prompt = REWRITE_BULLET_PROMPT(data.bullet, data.jobTitle);
    return this.aiService.callAI(prompt);
  }

  async suggestSkills(data: any) {
    const prompt = SUGGEST_SKILLS_PROMPT(data.jobTitle, data.currentSkills);
    return this.aiService.callAI(prompt);
  }
}
