// data transfer object for creating a user

import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";



export class CreateCompanyDto {

    @IsNotEmpty({
        message: 'Name không được để trống',
    })
    name: string;

    @IsNotEmpty({
        message: 'Address không được để trống',
    })
    address: string;

    @IsNotEmpty({
        message: 'Description không được để trống',
    })
    description: string;

    // @IsOptional()
    // @IsString()
    @IsNotEmpty({
        message: 'Logo không được để trống',
    })
    logo: string;

}
