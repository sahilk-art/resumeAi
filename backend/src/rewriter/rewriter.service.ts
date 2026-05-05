import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { REWRITE_BULLET_PROMPT } from '../ai/prompts';

@Injectable()
export class RewriterService {
  constructor(private aiService: AIService) {}

  async rewriteBullet(data: any) {
    const { bullet, jobTitle } = data;
    const prompt = REWRITE_BULLET_PROMPT(bullet, jobTitle);
    return this.aiService.callAI(prompt);
  }

  async rewriteBulk(data: any) {
    const { bullets, jobTitle } = data;
    const results = await Promise.all(
      bullets.map((bullet: string) => this.rewriteBullet({ bullet, jobTitle })),
    );
    return results;
  }
}
