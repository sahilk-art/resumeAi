import { Controller, Post, Body, Get, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { CoverLetterService } from './cover-letter.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cover-letter')
export class CoverLetterController {
  constructor(private readonly coverLetterService: CoverLetterService) {}

  @Post('generate')
  generate(@Request() req, @Body() body: any) {
    return this.coverLetterService.generate(req.user.userId, body);
  }

  @Get('history')
  getHistory(@Request() req) {
    return this.coverLetterService.getHistory(req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.coverLetterService.remove(id, req.user.userId);
  }
}
