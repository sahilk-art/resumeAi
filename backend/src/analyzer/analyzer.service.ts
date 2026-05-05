import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { ANALYZE_RESUME_PROMPT } from '../ai/prompts';

@Injectable()
export class AnalyzerService {
  constructor(
    private aiService: AIService,
    private prisma: PrismaService,
  ) {}

  async analyze(userId: string, data: any) {
    const { resumeText, jobTitle, jobDescription, resumeId } = data;
    const prompt = ANALYZE_RESUME_PROMPT(resumeText, jobTitle, jobDescription);
    const result = await this.aiService.callAI(prompt);

    const analysis = await this.prisma.analysis.create({
      data: {
        userId,
        resumeId: resumeId || '',
        totalScore: result.totalScore,
        breakdown: JSON.stringify(result.breakdown),
        issues: JSON.stringify(result.issues),
        strengths: JSON.stringify(result.strengths),
        aiProvider: this.aiService.getProvider(),
        jobTitle,
      },
    });

    if (resumeId) {
      await this.prisma.resume.update({
        where: { id: resumeId },
        data: { lastScore: result.totalScore },
      });
    }

    return {
      ...analysis,
      breakdown: result.breakdown,
      issues: result.issues,
      strengths: result.strengths,
      summary: result.summary,
    };
  }

  async getHistory(userId: string) {
    return this.prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { resume: { select: { title: true } } },
    });
  }

  async getOne(id: string, userId: string) {
    const analysis = await this.prisma.analysis.findFirst({
      where: { id, userId },
    });
    if (analysis) {
      return {
        ...analysis,
        breakdown: JSON.parse(analysis.breakdown),
        issues: JSON.parse(analysis.issues),
        strengths: JSON.parse(analysis.strengths),
      };
    }
    return null;
  }
}
