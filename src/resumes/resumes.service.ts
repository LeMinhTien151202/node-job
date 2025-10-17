import { Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeModel } from './schemas/resume.schema';

@Injectable()
export class ResumesService {
  constructor(
      @InjectModel(Resume.name) private resumeModel: ResumeModel
    ) {}
  async create(createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    const { url,  companyId, jobId } = createUserCvDto;
    const { _id, email } = user;
    const newResume = await this.resumeModel.create({
      url,
      companyId,
      jobId,
      userId: _id,
      status: "PENDING",
      createdBy: {
        _id,
        email
      },
      history: [{
        status: "PENDING",
        updateAt : new Date(),
        updateBy: {
          _id: _id,
          email: email
        }
      }]
    })
    return {
      _id: newResume?._id,
      createdAt: newResume.createdAt
    }
  }

  async findByUsers(user: IUser) {
    return await this.resumeModel.find({userId: user._id})
  }
  findAll() {
    return `This action returns all resumes`;
  }

  findOne(id: string) {
    const resume = this.resumeModel.findById(id);
    return resume;
  }

  async update(id: string, status: string, @User() user: IUser) {
    const updated = await this.resumeModel.findOneAndUpdate({
      _id: id
    }, {
      status,
      updatedBy: {
        _id: user._id,
        email: user.email
      },
      $push: {
        history: {
          status,
          updateAt : new Date(),
          updateBy: {
            _id: user._id,
            email: user.email
          }
        }
      }
    })
    return updated
  }

  async remove(id: string, @User() user: IUser) {
    await this.resumeModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email,
      }
    })
    return this.resumeModel.deleteOne({ _id: id });
  }
}
