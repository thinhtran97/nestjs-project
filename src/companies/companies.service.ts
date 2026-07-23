import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'node_modules/rxjs/dist/types/internal/operators/isEmpty';

@Injectable()
export class CompaniesService {

  constructor(
    @InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>
  ) { }

  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    // return this.companyModel.find();
    const { filter, sort, skip, limit, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    // delete filter.sort;
    let offset = (currentPage - 1) * (+pageSize);
    let defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.companyModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)

      .sort(sort as any)
      .populate(population)
      .exec();

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

  findOne(id: number) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found company with id=${id}`)
    }
    return this.companyModel.findById(id);

  }

  update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return this.companyModel.updateOne({ _id: id }, {
      ...updateCompanyDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // throw new Error('ID is required');
      return "not found company"; // or throw an error, depending on your application's needs
    }
    // return this.companyModel.findByIdAndDelete(id).exec();
    await this.companyModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });
    return this.companyModel.softDelete({ _id: id });
  }
}
