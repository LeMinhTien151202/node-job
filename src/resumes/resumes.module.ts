import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeSchema } from './schemas/resume.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Resume', schema: ResumeSchema }])],
  controllers: [ResumesController],
  providers: [ResumesService]
})
export class ResumesModule {}
