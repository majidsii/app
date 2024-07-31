import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import Codes from 'src/entities/code.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Users, Codes]),
        JwtModule.register({
            secret: 'SHABIN',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService, JwtStrategy],
})
export class AuthModule {}
