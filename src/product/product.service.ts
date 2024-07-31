import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Products from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import userGuard from 'src/users/dto/userGuard';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Products)
        private product_Repository: Repository<Products>,
    ) {}

    async create(createProductDto: CreateProductDto) {
        const new_product =
            await this.product_Repository.save(createProductDto);
        return new_product;
    }

    findAll() {
        const alluser = this.product_Repository.find({
            relations: {
                user: true,
            },
        });
        return alluser;
    }

    async findOne(id: number) {
        const product = await this.product_Repository.findOne({
            where: { id: id },
            relations: { user: true },
        });

        if (!product)
            throw new HttpException(
                'the product by this given id is not found',
                404,
            );
        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        const updateProduct = await this.product_Repository.update(
            { id, user: updateProductDto.user },
            { ...updateProductDto },
        );

        if (updateProduct.affected === 0)
            throw new HttpException('product not found', 404);
        return { message: 'update seccess' };
    }

    async remove(id: number, user: userGuard) {
        const check = await this.product_Repository
            .createQueryBuilder('products')
            .leftJoinAndSelect('products.user', 'users')
            .where('products.id = :id', { id })
            .andWhere('products.user = :user', { user: user.id })
            .getOne();
        if (!check) throw new HttpException('product not found', 404);
        await this.product_Repository.remove(check);
        return { message: 'the product is removed' };
    }
}
