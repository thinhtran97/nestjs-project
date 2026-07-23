import {
    IsEmail,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsMongoId({ message: 'UserId không hợp lệ' })
    @IsNotEmpty({ message: 'userId không được để trống' })
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'URL không được để trống' })
    @IsString()
    url: string;

    // @IsOptional()
    @IsNotEmpty({ message: 'Status không được để trống' })
    @IsString()
    status: string;

    @IsMongoId({ message: 'CompanyId không hợp lệ' })
    @IsNotEmpty({ message: 'companyId không được để trống' })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsMongoId({ message: 'JobId không hợp lệ' })
    @IsNotEmpty({ message: 'jobId không được để trống' })
    jobId: mongoose.Schema.Types.ObjectId;
}


export class CreateUserCvDto {
    @IsNotEmpty({ message: 'url không được để trống', })
    url: string;

    @IsNotEmpty({ message: 'companyId không được để trống', })
    @IsMongoId({ message: 'companyId is a mongo id' })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'jobId không được để trống', })
    @IsMongoId({ message: 'jobId is a mongo id' })
    jobId: mongoose.Schema.Types.ObjectId;
}