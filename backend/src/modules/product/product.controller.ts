import {
    Controller,
    Get,
    Post,
    Param,
    Delete,
    Query,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService, PaginatedProducts } from './product.service';
import { Product } from './product.entity';
import { QueryProductDto, ScrapeProductsDto } from './dto/product.dto';
import { ScraperService } from '../scraper/scraper.service';
import { ScrapeJobType } from '../scraper/scrape-job.entity';

@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly scraperService: ScraperService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all products with pagination' })
    async findAll(@Query() query: QueryProductDto): Promise<PaginatedProducts> {
        return await this.productService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    async findOne(@Param('id') id: string): Promise<Product> {
        return await this.productService.findOne(id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete product' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.productService.remove(id);
    }

    @Post('scrape')
    @ApiOperation({ summary: 'Trigger product scraping' })
    async scrape(@Body() dto: ScrapeProductsDto): Promise<{ jobId: string; message: string }> {
        const job = await this.scraperService.createJob(
            ScrapeJobType.PRODUCT,
            dto.categoryUrl,
            {
                categoryId: dto.categoryId,
                maxPages: dto.maxPages || 5,
            },
        );

        this.scraperService.executeJob(job.id).catch((error) => {
            console.error('Product scraping failed:', error);
        });

        return {
            jobId: job.id,
            message: 'Product scraping job started',
        };
    }

    @Post(':id/scrape-details')
    @ApiOperation({ summary: 'Scrape product details' })
    async scrapeDetails(@Param('id') id: string): Promise<{ jobId: string; message: string }> {
        const product = await this.productService.findOne(id);

        const job = await this.scraperService.createJob(
            ScrapeJobType.PRODUCT_DETAIL,
            product.url,
            { productId: id },
        );

        this.scraperService.executeJob(job.id).catch((error) => {
            console.error('Product detail scraping failed:', error);
        });

        return {
            jobId: job.id,
            message: 'Product detail scraping job started',
        };
    }
}
