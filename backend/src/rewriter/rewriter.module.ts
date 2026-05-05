import { Module } from '@nestjs/common';
import { RewriterService } from './rewriter.service';
import { RewriterController } from './rewriter.controller';

@Module({
  controllers: [RewriterController],
  providers: [RewriterService],
})
export class RewriterModule {}
