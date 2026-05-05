import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from './gemini.service';
import { OpenAIService } from './openai.service';
import { GroqService } from './groq.service';

@Injectable()
export class AIService {
  private activeProvider: string;
  private readonly logger = new Logger(AIService.name);

  constructor(
    private configService: ConfigService,
    private geminiService: GeminiService,
    private openaiService: OpenAIService,
    private groqService: GroqService,
  ) {
    this.activeProvider = this.configService.get<string>('ACTIVE_AI_PROVIDER', 'gemini');
  }

  setProvider(provider: string) {
    this.activeProvider = provider;
  }

  getProvider() {
    return this.activeProvider;
  }

  async callAI(prompt: string, retry = true): Promise<any> {
    const providers = [this.activeProvider, 'gemini', 'groq', 'openai'].filter((v, i, a) => a.indexOf(v) === i);

    for (const provider of providers) {
      try {
        const response = await this.executeCall(provider, prompt);
        return this.parseJSON(response);
      } catch (error) {
        this.logger.error(`Error with provider ${provider}: ${error.message}`);
        if (!retry) throw error;
      }
    }
    throw new Error('All AI providers failed');
  }

  private async executeCall(provider: string, prompt: string): Promise<string> {
    switch (provider) {
      case 'gemini':
        return this.geminiService.generate(prompt);
      case 'openai':
        return this.openaiService.generate(prompt);
      case 'groq':
        return this.groqService.generate(prompt);
      default:
        return this.geminiService.generate(prompt);
    }
  }

  private parseJSON(text: string): any {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      return JSON.parse(jsonStr);
    } catch (error) {
      this.logger.error(`Failed to parse JSON: ${text}`);
      throw new Error('Invalid JSON response from AI');
    }
  }
}
