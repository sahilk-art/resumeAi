import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AIModule } from './ai/ai.module';
import { ResumesModule } from './resumes/resumes.module';
import { AnalyzerModule } from './analyzer/analyzer.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { CoverLetterModule } from './cover-letter/cover-letter.module';
import { RewriterModule } from './rewriter/rewriter.module';
import { AtsModule } from './ats/ats.module';
import { AIHelpersModule } from './ai-helpers/ai-helpers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AIModule,
    ResumesModule,
    AnalyzerModule,
    SuggestionsModule,
    CoverLetterModule,
    RewriterModule,
    AtsModule,
    AIHelpersModule,
  ],
})
export class AppModule {}
