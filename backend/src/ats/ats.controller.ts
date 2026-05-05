import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AtsService } from './ats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ats')
export class AtsController {
  constructor(private readonly atsService: AtsService) {}

  @Post('check')
  check(@Body() body: any) {
    return this.atsService.check(body);
  }
}
