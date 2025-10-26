import { Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeModel } from './schemas/resume.schema';
import aqp from 'api-query-params';

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
    .sort({createdAt: -1})
    .populate([
      {
        path: 'companyId',
        select: {_id: -1, name: 1, email: 1}},
      {
        path: 'jobId',
        select: {_id: -1, name: 1, email: 1}
      }
    ]);
  }
  async findAll(currentPage: number, limit: number, qs: any) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

  const offset = (currentPage - 1) * limit;
  const totalItems = await this.resumeModel.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  const result = await this.resumeModel.find(filter)
    .skip(offset)
    .limit(limit)
    .sort(sort as any)
    .populate(population)
    .select(projection as any)
    .exec();

  return {
    meta: {
      current: currentPage,
      pageSize: limit,
      pages: totalPages,
      total: totalItems,
    },
    result,
  };
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
