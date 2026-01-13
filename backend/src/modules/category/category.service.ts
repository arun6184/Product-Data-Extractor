import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async findAll(navigationId?: string, parentId?: string): Promise<Category[]> {
        const where: any = {};
        if (navigationId) where.navigationId = navigationId;
        if (parentId) where.parentId = parentId;
        if (parentId === null) where.parentId = null;

        return await this.categoryRepository.find({
            where,
            relations: ['children', 'products'],
            order: { name: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['children', 'products', 'parent', 'navigation'],
        });

        if (!category) {
            throw new NotFoundException(`Category ${id} not found`);
        }

        return category;
    }

    async findBySlug(slug: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { slug },
            relations: ['children', 'products'],
        });

        if (!category) {
            throw new NotFoundException(`Category with slug ${slug} not found`);
        }

        return category;
    }

    async create(createDto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create(createDto);
        return await this.categoryRepository.save(category);
    }

    async remove(id: string): Promise<void> {
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
    }
}
