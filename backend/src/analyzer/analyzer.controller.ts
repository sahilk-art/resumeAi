import { Controller, Post, Body, Get, UseGuards, Request, Param } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('analyzer')
export class AnalyzerController {
  constructor(private readonly analyzerService: AnalyzerService) {}

  @Post('analyze')
  analyze(@Request() req, @Body() body: any) {
    return this.analyzerService.analyze(req.user.userId, body);
  }

  @Get('history')
  getHistory(@Request() req) {
    return this.analyzerService.getHistory(req.user.userId);
  }

  @Get(':id')
  getOne(@Request() req, @Param('id') id: string) {
    return this.analyzerService.getOne(id, req.user.userId);
  }
}
