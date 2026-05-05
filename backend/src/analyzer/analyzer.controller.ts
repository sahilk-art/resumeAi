import {
  BadRequestException,
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnalyzerService } from './analyzer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PDFParse } from 'pdf-parse';

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
    if (!file) throw new BadRequestException('No file uploaded');
    if (!file.buffer?.length)
      throw new BadRequestException('Uploaded file is empty');
    // Accept PDFs; allow octet-stream as some browsers/clients send generic content-type.
    if (
      file.mimetype &&
      !['application/pdf', 'application/octet-stream'].includes(file.mimetype)
    ) {
      throw new BadRequestException('Only PDF files are supported');
    }

    const parser = new PDFParse({ data: file.buffer });
    try {
      const data = await parser.getText();
      return { text: data.text ?? '' };
    } finally {
      await parser.destroy();
    }
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
