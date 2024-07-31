import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Users from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly user_repository: Repository<Users>,
    ) {}

    createUser = async (data: CreateUserDto) => {
        const user = await this.user_repository.create(data);

        this.user_repository.save(user);
        return user;
    };
    findAll = async () => {
        return await this.user_repository.find();
    };

    findByEmail = async (email: string) => {
        return await this.user_repository.findOne({ where: { email: email } });
    };
    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
