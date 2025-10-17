import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

//   @Post()
//   create(
// //     @Body("name") name: string,
// // @Body("password") password: string,
// // @Body("email") email: string
//     @Body() createUserDto: CreateUserDto
// ) {
//     return this.usersService.create(createUserDto);
//   }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Get()
  @ResponseMessage('Lấy danh sách người dùng thành công')
  findAll(@Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Lấy user thành công")
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto,@User() user: IUser) {
    let newUser = await this.usersService.create(createUserDto, user);
    return {
      id: newUser?._id,
      createdAt: newUser?.createdAt,
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
