import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { GENERATE_COVER_LETTER_PROMPT } from '../ai/prompts';

@Injectable()
export class CoverLetterService {
  constructor(
    private aiService: AIService,
    private prisma: PrismaService,
  ) {}

  async generate(userId: string, data: any) {
    const prompt = GENERATE_COVER_LETTER_PROMPT(data);
    const result = await this.aiService.callAI(prompt);

    const coverLetter = await this.prisma.coverLetter.create({
      data: {
        userId,
        content: result.content,
        jobTitle: data.jobTitle,
        company: data.company,
        tone: data.tone,
      },
    });

    return {
      ...coverLetter,
      aiProvider: this.aiService.getProvider(),
    };
  }

  async getHistory(userId: string) {
    return this.prisma.coverLetter.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.coverLetter.delete({
      where: { id, userId },
    });
  }
}
