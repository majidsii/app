import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsString,
    IsStrongPassword,
    MaxLength,
    MinLength,
} from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @MinLength(4)
    username: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsStrongPassword()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
    @IsString()
    @MinLength(2)
    @MaxLength(25)
    @IsNotEmpty()
    frist_name: string;
    @IsString()
    @MinLength(2)
    @MaxLength(25)
    @IsNotEmpty()
    last_name: string;
    @IsNotEmpty()
    @IsNumber()
    age: number;
}
