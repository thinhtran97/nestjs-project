import { Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserModel, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { exec } from 'child_process';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';



@Injectable()
export class UsersService {
  constructor(@InjectModel(UserModel.name)
  private readonly userModel: SoftDeleteModel<UserDocument>) { }

  hashPassword = (password: string): string => {
    // Implement password hashing logic here
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash; // Return the hashed password
    // return password; // Placeholder - replace with actual hashing
  }

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    // return createUserDto
    // async create(email: string, password: string, name: string) {
    // const user = await this.userModel.create({ email: createUserDto.email, password: this.hashPassword(createUserDto.password), name: createUserDto.name });
    const { name, email, password, age, gender, address, role, company } = createUserDto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }
    const hashedPassword = this.hashPassword(password);
    const newUser = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      address,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return newUser;

  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    // Implement find all users logic here
    const { filter, sort, skip, limit, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;


    console.log('Database:', this.userModel.db.name);
    console.log('Collection:', this.userModel.collection.collectionName);
    console.log('Count:', await this.userModel.countDocuments());
    console.log('Filter:', filter);
    console.log('Count:', await this.userModel.countDocuments());
    console.log('Find:', await this.userModel.find({}));
    console.log('FindDeleted:', await this.userModel.findDeleted());

    // delete filter.sort;
    let offset = (currentPage - 1) * (+pageSize);
    let defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .select('-password') // Exclude the password field from the returned user objects
      .sort(sort as any)
      .populate(population)
      .exec();

    console.log('result =', result);


    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  findOne(id: string) {
    // return `This action returns a #${id} user`;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // throw new Error('ID is required');
      return "not found user"; // or throw an error, depending on your application's needs
    }
    return this.userModel.findOne({ _id: id }).select('-password').exec(); // Exclude the password field from the returned user object
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username }).exec();
  }

  isValidPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async update(updateUserDto: UpdateUserDto, @User() user: IUser) {
    const updatedUser = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }, { new: true }).exec();
    // return this.userModel.findByIdAndUpdate({ _id: updateUserDto._id }, { ...updateUserDto }, { new: true }).exec();
    return updatedUser;
  }

  async remove(id: string, user: IUser) {
    // return `This action removes a #${id} user`;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // throw new Error('ID is required');
      return "not found user"; // or throw an error, depending on your application's needs
    }
    // return this.userModel.findByIdAndDelete(id).exec();
    await this.userModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });
    return this.userModel.softDelete({ _id: id });
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }
    const hashedPassword = this.hashPassword(password);
    const newUser = await this.userModel.create({ name, email, password: hashedPassword, age, gender, address, role: 'USER' });
    return newUser;
  }

  updateUserToken(_id: string, refreshToken: string) {
    return this.userModel.updateOne({ _id }, { refreshToken }).exec();
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken })
  }
}
