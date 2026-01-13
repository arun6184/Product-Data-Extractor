import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './product.entity';
import { QueryProductDto } from './dto/product.dto';

export interface PaginatedProducts {
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async findAll(query: QueryProductDto): Promise<PaginatedProducts> {
        const { categoryId, page = 1, limit = 20, search, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

        const where: any = {};
        if (categoryId) where.categoryId = categoryId;
        if (search) {
            where.title = ILike(`%${search}%`);
        }

        const [data, total] = await this.productRepository.findAndCount({
            where,
            relations: ['category'],
            order: { [sortBy]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'detail', 'reviews'],
        });

        if (!product) {
            throw new NotFoundException(`Product ${id} not found`);
        }

        return product;
    }

    async findBySku(sku: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { sku },
            relations: ['category', 'detail'],
        });

        if (!product) {
            throw new NotFoundException(`Product with SKU ${sku} not found`);
        }

        return product;
    }

    async remove(id: string): Promise<void> {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }
}
