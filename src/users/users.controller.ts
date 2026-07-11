import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './user.interface';
import { User as UserModel } from './schemas/user.schema';
import { Public, ResponseMessage, User } from 'src/decorator/customize';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage('Tạo người dùng thành công')
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    let newUser = await this.usersService.create(createUserDto, user);
    return {
      _id: newUser?._id,
      createdAt: newUser.createdAt,
    };
  }

  // @Post()
  // create(
  //   // @Body('email') email: string,
  //   // @Body('password') password: string,
  //   // @Body('name') name: string
  //   @Body() createUserDto: CreateUserDto
  // ) {
  //   const { email, password, name } = createUserDto;
  //   // return "TEST OK"
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  @ResponseMessage('Lấy danh sách người dùng theo phân trang')
  findAll(@Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,) {
    return this.usersService.findAll(+currentPage, +pageSize, qs);
  }

  // @Get('abc')
  // findAllABC() {
  //   return "this.usersService.findAll() ABC";
  // }
  @Public()
  @ResponseMessage('Thông tin người dùng')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return user;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Patch()
  @ResponseMessage('Cập nhật người dùng thành công')
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    const updatedUser = await this.usersService.update(updateUserDto, user);
    return updatedUser;
  }

  @Delete(':id')
  @ResponseMessage('Xóa người dùng thành công')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.usersService.remove(id, user);
  }
}
