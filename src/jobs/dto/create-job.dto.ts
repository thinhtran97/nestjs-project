import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class CompanyDto {
    // @IsNotEmpty({ message: 'Company ID không được để trống' })
    // @IsString()
    // _id: string;

    // @IsNotEmpty({ message: 'Tên công ty không được để trống' })
    // @IsString()
    // name: string;
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}

export class CreateJobDto {
    @IsNotEmpty({ message: 'Tên job không được để trống' })
    @IsString()
    name: string;

    @IsArray({ message: 'Skills phải là mảng' })
    @IsNotEmpty({ each: true, message: 'Skill không được để trống' })
    skills: string[];

    @IsObject({ message: 'Company phải là object' })
    @ValidateNested()
    @Type(() => CompanyDto)
    company: CompanyDto;

    @IsNotEmpty({ message: 'Location không được để trống' })
    @IsString()
    location: string;

    @IsNotEmpty({ message: 'Salary không được để trống' })
    @IsNumber()
    salary: number;

    @IsNotEmpty({ message: 'Quantity không được để trống' })
    @IsNumber()
    quantity: number;

    @IsNotEmpty({ message: 'Level không được để trống' })
    @IsString()
    level: string;

    @IsNotEmpty({ message: 'Description không được để trống' })
    @IsString()
    description: string;

    @IsNotEmpty({ message: 'Start Date không được để trống' })
    @IsDateString()
    startDate: Date;

    @IsNotEmpty({ message: 'End Date không được để trống' })
    @IsDateString()
    endDate: Date;

    @IsBoolean()
    isActive: boolean;
}