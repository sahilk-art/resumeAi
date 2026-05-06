import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private ai: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    this.ai = new GoogleGenAI({
      apiKey: apiKey || '',
    });
  }

  async generate(prompt: string): Promise<string> {
    try {
      const modelName =
        this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.0-flash';

      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });

      console.log('Gemini response:', response.text);

      return response.text || 'No response';
    } catch (error) {
      console.error('Gemini generate error:', error);
      throw error;
    }
  }
}