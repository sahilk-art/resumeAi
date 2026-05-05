import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CoverLetter } from '../schemas/app.schemas';
import { GENERATE_COVER_LETTER_PROMPT } from '../ai/prompts';

@Injectable()
export class CoverLetterService {
  constructor(
    private aiService: AIService,
    @InjectModel(CoverLetter.name) private coverLetterModel: Model<CoverLetter>,
  ) {}

  async generate(userId: string, data: any) {
    const prompt = GENERATE_COVER_LETTER_PROMPT(data);
    const result = await this.aiService.callAI(prompt);

    const coverLetter = await this.coverLetterModel.create({
      userId: new Types.ObjectId(userId),
      content: result.content,
      jobTitle: data.jobTitle,
      company: data.company,
      tone: data.tone,
    });

    const obj = coverLetter.toObject();
    return {
      ...obj,
      id: obj._id,
      aiProvider: this.aiService.getProvider(),
    };
  }

  async getHistory(userId: string) {
    const history = await this.coverLetterModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(5);
    return history.map((h) => {
      const obj = h.toObject();
      return { ...obj, id: obj._id };
    });
  }

  async remove(id: string, userId: string) {
    return this.coverLetterModel.deleteOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
  }
}
