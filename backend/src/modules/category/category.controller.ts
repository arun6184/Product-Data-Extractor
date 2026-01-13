import {
    Controller,
    Get,
    Post,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { ScraperService } from '../scraper/scraper.service';
import { ScrapeJobType } from '../scraper/scrape-job.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly scraperService: ScraperService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiQuery({ name: 'navigationId', required: false })
    @ApiQuery({ name: 'parentId', required: false })
    async findAll(
        @Query('navigationId') navigationId?: string,
        @Query('parentId') parentId?: string,
    ): Promise<Category[]> {
        return await this.categoryService.findAll(navigationId, parentId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID' })
    async findOne(@Param('id') id: string): Promise<Category> {
        return await this.categoryService.findOne(id);
    }

    @Get(':id/subcategories')
    @ApiOperation({ summary: 'Get subcategories' })
    async getSubcategories(@Param('id') id: string): Promise<Category[]> {
        return await this.categoryService.findAll(undefined, id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete category' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.categoryService.remove(id);
    }

    @Post('scrape')
    @ApiOperation({ summary: 'Trigger category scraping' })
    @ApiQuery({ name: 'navigationUrl', required: true })
    @ApiQuery({ name: 'navigationId', required: true })
    async scrape(
        @Query('navigationUrl') navigationUrl: string,
        @Query('navigationId') navigationId: string,
    ): Promise<{ jobId: string; message: string }> {
        const job = await this.scraperService.createJob(
            ScrapeJobType.CATEGORY,
            navigationUrl,
            { navigationId },
        );

        this.scraperService.executeJob(job.id).catch((error) => {
            console.error('Category scraping failed:', error);
        });

        return {
            jobId: job.id,
            message: 'Category scraping job started',
        };
    }
}
