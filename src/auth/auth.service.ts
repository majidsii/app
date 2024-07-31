import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/Login.Dto';
import { RegisterDto } from './dto/register.Dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import Codes from 'src/entities/code.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly JwtService: JwtService,
        @InjectRepository(Codes)
        private code_repository: Repository<Codes>,
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

        if (LoginDto.code) {
            //check code is exist in database and is valid
            const checkCode = await this.code_repository.findOne({
                where: {
                    code: LoginDto.code,
                    email: LoginDto.email,
                    is_used: false,
                },
            });

            if (checkCode) {
                const time2 = Number(checkCode.date);
                const time1 = Date.now();
                const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
                const difference = Math.abs(time1 - time2);
                const five = difference < FIVE_MINUTES_IN_MS;
                console.log(five);
                if (five) {
                    await this.code_repository.update(checkCode, {
                        is_used: true,
                    });
                    const accessTokn = await this.JwtService.sign({
                        sub: user.id,
                        email: user.email,
                    });
                    return { access_Tokn: accessTokn };
                } else {
                    throw new HttpException('code is expire', 404);
                }
            } else {
                throw new HttpException('code is not valid', 400);
            }
        } else {
            //generate 5 digit code that is not exist in database
            const otp = await this.generateOtpCode();
            //save otp code to database
            this.code_repository.save({
                code: otp,
                email: LoginDto.email,
            });
            //send otp code to user
            return { code: otp };
        }
    }
    async generateOtpCode() {
        let code: number = null;
        while (!code) {
            const fiveDigitCode = this.getRandomCode();
            const checkCode = await this.code_repository.findOne({
                where: { code: fiveDigitCode },
            });
            if (!checkCode) {
                code = fiveDigitCode;
                break;
            }
        }
        return code;
    }
    getRandomCode() {
        const min = 10000;
        const max = 99999;
        const otp = Math.floor(Math.random() * (max - min + 1)) + min;
        return otp;
    }
}
