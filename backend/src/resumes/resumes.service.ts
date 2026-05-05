import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResumesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.resume.create({
      data: {
        userId,
        title: data.title,
        template: data.template || 'modern',
        data: JSON.stringify(data.data),
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId },
    });
    if (!resume) throw new NotFoundException('Resume not found');
    return {
      ...resume,
      data: JSON.parse(resume.data),
    };
  }

  async update(id: string, userId: string, data: any) {
    return this.prisma.resume.update({
      where: { id, userId },
      data: {
        title: data.title,
        template: data.template,
        data: data.data ? JSON.stringify(data.data) : undefined,
        lastScore: data.lastScore,
        isPublic: data.isPublic,
      },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.resume.delete({
      where: { id, userId },
    });
  }

  async duplicate(id: string, userId: string) {
    const original = await this.findOne(id, userId);
    return this.prisma.resume.create({
      data: {
        userId,
        title: `${original.title} (Copy)`,
        template: original.template,
        data: JSON.stringify(original.data),
      },
    });
  }
}
