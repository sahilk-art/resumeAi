import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RewriterService } from './rewriter.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rewriter')
export class RewriterController {
  constructor(private readonly rewriterService: RewriterService) {}

  @Post('bullet')
  rewriteBullet(@Body() body: any) {
    return this.rewriterService.rewriteBullet(body);
  }

  @Post('bulk')
  rewriteBulk(@Body() body: any) {
    return this.rewriterService.rewriteBulk(body);
  }
}
