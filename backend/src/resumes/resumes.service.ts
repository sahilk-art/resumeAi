import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Resume } from '../schemas/app.schemas';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: Model<Resume>) {}

  async create(userId: string, data: any) {
    return this.resumeModel.create({
      userId: new Types.ObjectId(userId),
      title: data.title,
      template: data.template || 'modern',
      data: JSON.stringify(data.data),
    });
  }

  async findAll(userId: string) {
    const resumes = await this.resumeModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ updatedAt: -1 });
    return resumes.map((r) => {
      const obj = r.toObject();
      return { ...obj, id: obj._id };
    });
  }

  async findOne(id: string, userId: string) {
    const resume = await this.resumeModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
    if (!resume) throw new NotFoundException('Resume not found');
    const result = resume.toObject();
    return {
      ...result,
      id: result._id,
      data: JSON.parse(resume.data),
    };
  }

  async update(id: string, userId: string, data: any) {
    return this.resumeModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
      {
        title: data.title,
        template: data.template,
        data: data.data ? JSON.stringify(data.data) : undefined,
        lastScore: data.lastScore,
        isPublic: data.isPublic,
      },
      { new: true },
    );
  }

  async remove(id: string, userId: string) {
    return this.resumeModel.deleteOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
  }

  async duplicate(id: string, userId: string) {
    const original = await this.findOne(id, userId);
    return this.resumeModel.create({
      userId: new Types.ObjectId(userId),
      title: `${original.title} (Copy)`,
      template: original.template,
      data: JSON.stringify(original.data),
    });
  }
}
