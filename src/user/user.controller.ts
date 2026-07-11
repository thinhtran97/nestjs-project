import { Controller, Delete, Get } from '@nestjs/common';


@Controller('user')
export class UserController {
  // constructor(private readonly appService: AppService) {}

  @Get()
  findAll(): string {
    return 'This action returns all users';
  }

  @Delete("/by-id")
  findById(): string {
    return 'This action will delete a user by id';
  }

}
