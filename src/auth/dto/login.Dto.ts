import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsStrongPassword,
} from 'class-validator';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsNumber()
    code: number;
}
