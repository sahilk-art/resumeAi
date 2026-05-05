import { Module } from '@nestjs/common';
import { AIHelpersService } from './ai-helpers.service';
import { AIHelpersController } from './ai-helpers.controller';

@Module({
  controllers: [AIHelpersController],
  providers: [AIHelpersService],
})
export class AIHelpersModule {}
