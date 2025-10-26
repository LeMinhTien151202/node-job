import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { Permission, PermissionModel } from './schemas/permission.schema';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
        @InjectModel(Permission.name) private permissionModel: PermissionModel
      ) {}
  async create(createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    const {name, apiPath, method, module} = createPermissionDto;
    const isExist = await this.permissionModel.findOne({apiPath , method});
    if(isExist) {
      throw new BadRequestException('Permission already exist');
    }
    const newPermission = await this.permissionModel.create({name, apiPath, method, module,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    });
    return {
      _id: newPermission?._id,
      createdAt: newPermission.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: any) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

  const offset = (currentPage - 1) * limit;
  const totalItems = await this.permissionModel.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  const result = await this.permissionModel.find(filter)
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

  async findOne(id: string) {
    if(!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Permission not exist');
    }
    const permission = await this.permissionModel.findById(id);
    return permission;
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
    const updatePermission = this.permissionModel.updateOne(
      { _id: id },
      {...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email
      }}
    )
    return updatePermission;
  }

  async remove(id: string, @User() user: IUser) {
    await this.permissionModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email,
      }
    })
    const deletePermission = await this.permissionModel.deleteOne({ _id: id });
    return deletePermission;
  }
}
