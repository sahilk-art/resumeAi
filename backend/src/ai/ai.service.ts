import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from './gemini.service';
import { OpenAIService } from './openai.service';
import { GroqService } from './groq.service';

@Injectable()
export class AIService {
  private activeProvider: string;
  private readonly logger = new Logger(AIService.name);
  private lastUsedProvider: string | null = null;

  constructor(
    private configService: ConfigService,
    private geminiService: GeminiService,
    private openaiService: OpenAIService,
    private groqService: GroqService,
  ) {
    this.activeProvider = this.configService.get<string>(
      'ACTIVE_AI_PROVIDER',
      'gemini',
    );
  }

  setProvider(provider: string) {
    this.activeProvider = provider;
  }

  getProvider() {
    return this.lastUsedProvider ?? this.activeProvider;
  }

  async callAI(prompt: string, retry = true): Promise<any> {
    const providerOrder = this.getProviderOrder();
    const providers = providerOrder.filter((p) => this.isProviderConfigured(p));

    if (providers.length === 0) {
      throw new ServiceUnavailableException(
        'No AI provider configured. Set at least one of GEMINI_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY.',
      );
    }

    for (const provider of providers) {
      try {
        const response = await this.executeCall(provider, prompt);
        const parsed = this.parseJSON(response);
        // Record which provider actually succeeded so UI/history can reflect it.
        this.lastUsedProvider = provider;
        this.activeProvider = provider;
        return parsed;
      } catch (error) {
        const message = (error as any)?.message ?? String(error);
        this.logger.error(`Error with provider ${provider}: ${message}`);
        if (!retry) throw error;
      }
    }
    throw new Error('All AI providers failed');
  }

  private getProviderOrder(): string[] {
    const configured = this.configService.get<string>('AI_PROVIDERS');
    const fromEnv = (configured ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const base = [this.activeProvider, 'gemini', 'openai', 'groq']
      .map((s) => (s ?? '').trim().toLowerCase())
      .filter(Boolean);

    const combined = [...fromEnv, ...base];
    return combined.filter((v, i, a) => a.indexOf(v) === i);
  }

  private isProviderConfigured(provider: string): boolean {
    switch (provider) {
      case 'gemini':
        return this.isRealKey(this.configService.get<string>('GEMINI_API_KEY'));
      case 'openai':
        return this.isRealKey(this.configService.get<string>('OPENAI_API_KEY'));
      case 'groq':
        return this.isRealKey(this.configService.get<string>('GROQ_API_KEY'));
      default:
        return false;
    }
  }

  private isRealKey(key: string | undefined): boolean {
    const value = (key ?? '').trim();
    if (!value) return false;
    const lower = value.toLowerCase();
    if (lower === 'dummy') return false;
    // Common placeholder values from sample .env files
    if (lower.includes('your-openai-api-key')) return false;
    if (lower.includes('your-groq-api-key')) return false;
    if (lower.includes('your-gemini-api-key')) return false;
    return true;
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
      const cleaned = (text ?? '').toString().trim();
      // Strip ```json fences if present.
      const unfenced = cleaned
        .replace(/^```(?:json)?/i, '')
        .replace(/```$/i, '')
        .trim();

      const jsonMatch = unfenced.match(/\{[\s\S]*\}/);
      const jsonStr = (jsonMatch ? jsonMatch[0] : unfenced).trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      this.logger.error(`Failed to parse JSON: ${text}`);
      throw new Error('Invalid JSON response from AI');
    }
  }
}
