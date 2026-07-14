import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from './schemas/job.shema';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name)
  private readonly jobModel: SoftDeleteModel<JobDocument>) { }

  // hashPassword = (password: string): string => {
  //   // Implement password hashing logic here
  //   const salt = bcrypt.genSaltSync(10);
  //   const hash = bcrypt.hashSync(password, salt);
  //   return hash; // Return the hashed password
  //   // return password; // Placeholder - replace with actual hashing
  // }

  // create(createJobDto: CreateJobDto) {
  //   return 'This action adds a new job';
  // }
  create(createJobDto: CreateJobDto, user: IUser) {
    return this.jobModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  // findAll() {
  //   return `This action returns all jobs`;
  // }

  async findAll(
    currentPage: number,
    pageSize: number,
    qs: string,
  ) {

    const {
      filter,
      sort,
      population
    } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * pageSize;
    const defaultLimit = pageSize ? pageSize : 10;

    const totalItems = (await this.jobModel.find(filter)).length;

    const totalPages = Math.ceil(
      totalItems / defaultLimit
    );

    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems
      },
      result
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} job`;
  // }

  findOne(id: string) {
    return this.jobModel.findById(id);
  }

  // update(id: number, updateJobDto: UpdateJobDto) {
  //   return `This action updates a #${id} job`;
  // }

  update(
    id: string,
    updateJobDto: UpdateJobDto,
    user: IUser,
  ) {
    return this.jobModel.updateOne(
      { _id: id },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
  }

  // remove(id: number) {
  //   return `This action removes a #${id} job`;
  // }

  async remove(id: string, user: IUser) {

    await this.jobModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return this.jobModel.softDelete({
      _id: id
    });
  }
}
