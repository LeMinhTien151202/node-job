import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { Permission, PermissionModel } from './schemas/permission.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PermissionsService {
  constructor(
        @InjectModel(Permission.name) private permissionModel: PermissionModel
      ) {}
  async create(createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    const {name, apiPath, method, module} = createPermissionDto;
    const isExist = await this.permissionModel.findOne({apiPath , method})
  }

  findAll() {
    return `This action returns all permissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
