import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Post()
  generate(@Body() body: any) {
    return this.suggestionsService.generate(body);
  }
}
