import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from './navigation.entity';
import { CreateNavigationDto, UpdateNavigationDto } from './dto/navigation.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NavigationService {
    private readonly cacheTtl: number;

    constructor(
        @InjectRepository(Navigation)
        private navigationRepository: Repository<Navigation>,
        private configService: ConfigService,
    ) {
        this.cacheTtl = parseInt(
            this.configService.get('CACHE_TTL_NAVIGATION', '86400'),
        );
    }

    async findAll(): Promise<Navigation[]> {
        return await this.navigationRepository.find({
            where: { isActive: true },
            order: { position: 'ASC' },
            relations: ['categories'],
        });
    }

    async findOne(id: string): Promise<Navigation> {
        const navigation = await this.navigationRepository.findOne({
            where: { id },
            relations: ['categories'],
        });

        if (!navigation) {
            throw new NotFoundException(`Navigation item ${id} not found`);
        }

        return navigation;
    }

    async create(createDto: CreateNavigationDto): Promise<Navigation> {
        const navigation = this.navigationRepository.create(createDto);
        return await this.navigationRepository.save(navigation);
    }

    async update(id: string, updateDto: UpdateNavigationDto): Promise<Navigation> {
        const navigation = await this.findOne(id);
        Object.assign(navigation, updateDto);
        return await this.navigationRepository.save(navigation);
    }

    async remove(id: string): Promise<void> {
        const navigation = await this.findOne(id);
        await this.navigationRepository.remove(navigation);
    }

    async isCacheValid(navigation: Navigation): Promise<boolean> {
        if (!navigation.lastScrapedAt) return false;
        const ageInSeconds =
            (Date.now() - navigation.lastScrapedAt.getTime()) / 1000;
        return ageInSeconds < this.cacheTtl;
    }
}
