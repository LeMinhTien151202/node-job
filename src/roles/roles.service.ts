import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleModel } from './schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class RolesService {
   constructor(
          @InjectModel(Role.name) private roleModel: RoleModel
        ) {}
  async create(createRoleDto: CreateRoleDto, @User() user: IUser) {
    const {name, description, isActive, permissions} = createRoleDto
    const isExist = await this.roleModel.findOne({name});
    if(isExist) {
      throw new BadRequestException('Role already exist');
    }
    const newRole = await this.roleModel.create({name, description, isActive, permissions,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    });
    return {
      _id: newRole?._id,
      createdAt: newRole.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: any) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

  const offset = (currentPage - 1) * limit;
  const totalItems = await this.roleModel.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  const result = await this.roleModel.find(filter)
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
    return await this.roleModel.findById(id)
    .populate({path: 'permissions', select: {_id: -1, name: 1, apiPath: 1, method: 1}});
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return await this.roleModel.updateOne({ _id: id }, {...updateRoleDto, updatedBy: {_id: user._id, email: user.email}});
  }

  async remove(id: string, @User() user: IUser) {
    const foundRole = await this.roleModel.findById(id);
    if(foundRole.name === ADMIN_ROLE) {
      throw new BadRequestException('Role not removeable');
    }
    await this.roleModel.updateOne({ _id: id }, {deletedBy: {_id: user._id, email: user.email}});
    return await this.roleModel.deleteOne({ _id: id });
  }
}
