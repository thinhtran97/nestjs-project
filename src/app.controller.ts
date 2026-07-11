import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/customize';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private authService: AuthService
  ) { }

  // @Get()
  // @Render('home')
  // getHello() {
  //   console.log("check port", this.configService.get<string>('PORT'));

  //   const message = this.appService.getHello();
  //   return { message: message };

  // }
  // @Public()
  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // handleLogin(@Request() req) {
  //   // If authentication is successful, the user object will be attached to the request
  //   return this.authService.login(req.user);
  // }


  // @Public()
  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

}
