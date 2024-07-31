import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/Login.Dto';
import { RegisterDto } from './dto/register.Dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly JwtService: JwtService,
    ) {}
    async register(RegisterDto: RegisterDto) {
        const user = await this.userService.findByEmail(RegisterDto.email);
        if (user) {
            throw new HttpException('the user already exists', 400);
        }

        RegisterDto.password = await bcrypt.hash(RegisterDto.password, 10);
        await this.userService.createUser(RegisterDto);
        return new HttpException('the user created secss', 200);
    }

    async login(LoginDto: LoginDto) {
        const user = await this.userService.findByEmail(LoginDto.email);
        if (!user)
            throw new HttpException(
                'this user by this given email not found',
                404,
            );
        if (LoginDto.password !== user.password) {
            throw new HttpException('Wrong password', 400);
        }

        const accessTokn = await this.JwtService.sign({
            sub: user.id,
            email: user.email,
        });
        return { access_Tokn: accessTokn };
    }
}
