import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar?: string;

  @Prop({ default: 'FREE' })
  plan: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

@Schema({ timestamps: true })
export class Resume extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: 'modern' })
  template: string;

  @Prop({ required: true })
  data: string; // JSON string

  @Prop()
  lastScore?: number;

  @Prop({ default: false })
  isPublic: boolean;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);

@Schema({ timestamps: true })
export class Analysis extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Resume' })
  resumeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  totalScore: number;

  @Prop({ required: true })
  breakdown: string;

  @Prop({ required: true })
  issues: string;

  @Prop({ required: true })
  strengths: string;

  @Prop({ required: true })
  aiProvider: string;

  @Prop()
  jobTitle?: string;
}

export const AnalysisSchema = SchemaFactory.createForClass(Analysis);

@Schema({ timestamps: true })
export class CoverLetter extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  jobTitle: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  tone: string;
}

export const CoverLetterSchema = SchemaFactory.createForClass(CoverLetter);
