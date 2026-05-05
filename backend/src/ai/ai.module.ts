import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIService } from './ai.service';
import { GeminiService } from './gemini.service';
import { OpenAIService } from './openai.service';
import { GroqService } from './groq.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AIService, GeminiService, OpenAIService, GroqService],
  exports: [AIService],
})
export class AIModule {}
