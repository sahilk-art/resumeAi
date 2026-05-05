import { Controller, Post, Body, Get, UseGuards, Request, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnalyzerService } from './analyzer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as pdf from 'pdf-parse';

@UseGuards(JwtAuthGuard)
@Controller('analyzer')
export class AnalyzerController {
  constructor(private readonly analyzerService: AnalyzerService) {}

  @Post('analyze')
  analyze(@Request() req, @Body() body: any) {
    return this.analyzerService.analyze(req.user.userId, body);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const data = await pdf(file.buffer);
    return { text: data.text };
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
