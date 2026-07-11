import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/user.interface';


@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @ResponseMessage('Đăng nhập thành công')
    @UseGuards(LocalAuthGuard)
    @Post('login')
    handleLogin(
        @Req() req,
        @Res({ passthrough: true }) response: Response) {
        // If authentication is successful, the user object will be attached to the request
        return this.authService.login(req.user, response);
    }

    @Public()// @UseGuards(LocalAuthGuard)
    @ResponseMessage('Đăng ký thành công')
    @Post('Register')
    handleRegister(@Body() registerUserDto: RegisterUserDto, @Req() req) {
        // If authentication is successful, the user object will be attached to the request
        return this.authService.register(registerUserDto);
    }

    @Get("account")
    @ResponseMessage(" Lấy thông tin tài khoản người dùng")
    handleGetAccount(@User() user: IUser) {
        return { user }
    }

    @Public()
    @ResponseMessage("Get User by refresh token")
    @Get('/refresh')
    handleRefreshToken(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies["refresh_token"];

        return this.authService.processNewToken(refreshToken, response);
    }

    @ResponseMessage("Logout User")
    @Post('/logout')
    handleLogout(
        @Res({ passthrough: true }) response: Response,
        @User() user: IUser) {
        return this.authService.logout(response, user);
    }

    // // @Public()
    // @UseGuards(JwtAuthGuard)
    // @Get('profile')
    // getProfile(@Req() req) {
    //     return req.user;
    // }



}
