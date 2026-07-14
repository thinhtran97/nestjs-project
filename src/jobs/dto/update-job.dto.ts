import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

// export class UpdateJobDto extends PartialType(CreateJobDto) {}

export class UpdateJobDto extends OmitType(CreateJobDto, [] as const) {
    @IsNotEmpty({ message: 'ID không được để trống' })
    _id: string;
}