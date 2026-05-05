import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyzerService } from './analyzer.service';
import { AnalyzerController } from './analyzer.controller';
import { Analysis, AnalysisSchema, Resume, ResumeSchema } from '../schemas/app.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Analysis.name, schema: AnalysisSchema },
      { name: Resume.name, schema: ResumeSchema }
    ])
  ],
  controllers: [AnalyzerController],
  providers: [AnalyzerService],
})
export class AnalyzerModule {}
