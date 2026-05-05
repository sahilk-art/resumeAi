import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  create(@Request() req, @Body() body: any) {
    return this.resumesService.create(req.user.userId, body);
  }

  @Get()
  findAll(@Request() req) {
    return this.resumesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.resumesService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.resumesService.update(id, req.user.userId, body);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.resumesService.remove(id, req.user.userId);
  }

  @Post(':id/duplicate')
  duplicate(@Request() req, @Param('id') id: string) {
    return this.resumesService.duplicate(id, req.user.userId);
  }
}
