import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AIHelpersService } from './ai-helpers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AIHelpersController {
  constructor(private readonly aiHelpersService: AIHelpersService) {}

  @Post('generate-summary')
  generateSummary(@Body() body: any) {
    return this.aiHelpersService.generateSummary(body);
  }

  @Post('improve-bullet')
  improveBullet(@Body() body: any) {
    return this.aiHelpersService.improveBullet(body);
  }

  @Post('suggest-skills')
  suggestSkills(@Body() body: any) {
    return this.aiHelpersService.suggestSkills(body);
  }
}
