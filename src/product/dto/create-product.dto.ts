import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import userGuard from 'src/users/dto/userGuard';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    description: string;
    @IsNotEmpty()
    @IsOptional()
    @IsNumber()
    price: number;
    @IsOptional()
    user: userGuard;
}
