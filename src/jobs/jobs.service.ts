import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { Job, JobModel } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class JobsService {
  constructor(
        @InjectModel(Job.name) private jobModel: JobModel
      ) {}
  async create(createJobDto: CreateJobDto, user: IUser) {
    const job = this.jobModel.create({...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    });
    return job; 
  }

  async findAll(currentPage: number, limit: number, qs: any) {
  const { filter, sort, population } = aqp(qs);
  delete filter.current;
  delete filter.pageSize;

  const offset = (currentPage - 1) * limit;
  const totalItems = await this.jobModel.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  const result = await this.jobModel.find(filter)
    .skip(offset)
    .limit(limit)
    .sort(sort as any)
    .populate(population)
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
    if(!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("job không tồn tại");
    }
    return this.jobModel.findOne({ _id: id });
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("user không tồn tại");
    }
    const newJob = await this.jobModel.findByIdAndUpdate({_id : id}, {...updateJobDto,
      updatedBy: {
        _id: user._id,
        email: user.email,
      },
      updatedAt: new Date(),
    });
    return newJob;
  }

  async remove(id: string, user: IUser) {
      if(!mongoose.isValidObjectId(id)) {
        return "user không tồn tại";
      }
      await this.jobModel.updateOne({ _id: id }, {
        deletedBy: {
          _id: user._id,
          email: user.email,
        }});
      const deleteUser = await this.jobModel.delete({ _id: id });
      return 'xóa thành công';
    }
}
