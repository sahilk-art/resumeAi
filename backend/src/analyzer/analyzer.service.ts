import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Analysis, Resume } from '../schemas/app.schemas';
import { ANALYZE_RESUME_PROMPT } from '../ai/prompts';

@Injectable()
export class AnalyzerService {
  constructor(
    private aiService: AIService,
    @InjectModel(Analysis.name) private analysisModel: Model<Analysis>,
    @InjectModel(Resume.name) private resumeModel: Model<Resume>,
  ) {}

  async analyze(userId: string, data: any) {
    const { resumeText, jobTitle, jobDescription, resumeId } = data;
    const prompt = ANALYZE_RESUME_PROMPT(resumeText, jobTitle, jobDescription);
    const result = await this.aiService.callAI(prompt);

    const analysis = await this.analysisModel.create({
      userId: new Types.ObjectId(userId),
      resumeId: resumeId ? new Types.ObjectId(resumeId) : undefined,
      totalScore: result.totalScore,
      breakdown: JSON.stringify(result.breakdown),
      issues: JSON.stringify(result.issues),
      strengths: JSON.stringify(result.strengths),
      aiProvider: this.aiService.getProvider(),
      jobTitle,
    });

    if (resumeId) {
      await this.resumeModel.findByIdAndUpdate(resumeId, {
        lastScore: result.totalScore,
      });
    }

    const obj = analysis.toObject();
    return {
      ...obj,
      id: obj._id,
      breakdown: result.breakdown,
      issues: result.issues,
      strengths: result.strengths,
      summary: result.summary,
    };
  }

  async getHistory(userId: string) {
    const history = await this.analysisModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate('resumeId', 'title');
    return history.map(h => {
      const obj = h.toObject();
      return { ...obj, id: obj._id };
    });
  }

  async getOne(id: string, userId: string) {
    const analysis = await this.analysisModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId)
    });
    if (analysis) {
      const result = analysis.toObject();
      return {
        ...result,
        id: result._id,
        breakdown: JSON.parse(analysis.breakdown),
        issues: JSON.parse(analysis.issues),
        strengths: JSON.parse(analysis.strengths),
      };
    }
    return null;
  }
}
