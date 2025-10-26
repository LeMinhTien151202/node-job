import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyModel } from './schemas/company.schema';
import { User } from 'src/users/schemas/user.schema';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(
      @InjectModel(Company.name) private companyModel: CompanyModel
    ) {}
  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const company = await  this.companyModel.create({...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    });
    return company;
  }

  async findAll(currentPage: number, limit: number, qs: any) {
  const { filter, sort, population } = aqp(qs);
  delete filter.current;
  delete filter.pageSize;

  const offset = (currentPage - 1) * limit;
  const totalItems = await this.companyModel.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  const result = await this.companyModel.find(filter)
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

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.updateOne({_id: id}, {...updateCompanyDto,
      updatedBy: {
        _id: user._id,
        email: user.email,
      }});
  }

  async remove(id: string, user: IUser) {
    await this.companyModel.updateOne({_id: id}, {
      deletedBy: {
        _id: user._id,
        email: user.email,
      }
    });
    return this.companyModel.delete({_id: id});
  }

  /**
   * Cập nhật logo cho company
   * @param id - ID của company
   * @param logoPath - Đường dẫn logo mới
   * @param user - User thực hiện update
   * @returns Company đã được cập nhật
   */
  async updateLogo(id: string, logoPath: string, user: IUser) {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      id,
      {
        logo: logoPath,
        updatedBy: {
          _id: user._id,
          email: user.email,
        }
      },
      { new: true }
    );

    if (!updatedCompany) {
      throw new Error('Company not found');
    }

    return updatedCompany;
  }
}
