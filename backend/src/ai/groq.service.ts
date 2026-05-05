import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class GroqService {
  private groq: Groq;

  constructor(private configService: ConfigService) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('GROQ_API_KEY') || 'dummy',
    });
  }

  async generate(prompt: string): Promise<string> {
    const response = await this.groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
  }
}
