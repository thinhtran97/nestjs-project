import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/user.interface';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        // const isValid = this.usersService.isValidPassword(pass, user.password);

        // if (user && isValid) {
        //   return { ...user, password: undefined }; // Exclude the password from the returned user object
        // }

        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true) {
                return user; // Return the user object if the password is valid
            }
            // return { ...user, password: undefined }; // Exclude the password from the returned user object
            return null;
        }
    }
    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };

        const refreshToken = this.createRefreshToken(payload);

        // update the user's refresh token in the database
        await this.usersService.updateUserToken(_id, refreshToken);

        // set refresh token as a cookie in the response (if using cookies) or return it in the response body
        // res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))
        })


        return {
            access_token: this.jwtService.sign(payload),
            // refresh_token: refreshToken,
            user: {
                _id,
                name,
                email,
                role
            }
        };
    }

    async register(user: RegisterUserDto) {
        const newUser = await this.usersService.register(user);
        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt,
        };
    }

    createRefreshToken = (payload: any) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000, // Convert milliseconds to seconds
        });
        return refreshToken;
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            let a = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            });

            const user = await this.usersService.findUserByToken(refreshToken)
            if (user) {
                // update refresh token

                const { _id, name, email, role } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                };

                const refreshToken = this.createRefreshToken(payload);

                // update the user's refresh token in the database
                await this.usersService.updateUserToken(_id.toString(), refreshToken);

                // delete old cookies with refresh token
                response.clearCookie("refresh_token")

                // set refresh token as a cookie in the response (if using cookies) or return it in the response body
                // res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
                response.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))
                })


                return {
                    access_token: this.jwtService.sign(payload),
                    // refresh_token: refreshToken,
                    user: {
                        _id,
                        name,
                        email,
                        role
                    }
                };
            } else {
                throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login")
            }

            // console.log(a);
        } catch (error) {
            throw new BadRequestException('Refresh token không hợp lệ. Vui lòng login.');
        }
    }

    logout = async (response: Response, user: IUser) => {
        await this.usersService.updateUserToken("", user._id);
        response.clearCookie("refresh_token");
        return "ok";
    }
}
