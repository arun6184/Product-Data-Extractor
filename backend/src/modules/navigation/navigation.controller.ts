import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NavigationService } from './navigation.service';
import { CreateNavigationDto, UpdateNavigationDto } from './dto/navigation.dto';
import { Navigation } from './navigation.entity';
import { ScraperService } from '../scraper/scraper.service';
import { ScrapeJobType } from '../scraper/scrape-job.entity';

@ApiTags('navigation')
@Controller('navigation')
export class NavigationController {
    constructor(
        private readonly navigationService: NavigationService,
        private readonly scraperService: ScraperService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all navigation items' })
    @ApiResponse({ status: 200, description: 'Returns all navigation items' })
    async findAll(): Promise<Navigation[]> {
        return await this.navigationService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get navigation item by ID' })
    @ApiResponse({ status: 200, description: 'Returns navigation item' })
    @ApiResponse({ status: 404, description: 'Navigation item not found' })
    async findOne(@Param('id') id: string): Promise<Navigation> {
        return await this.navigationService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create new navigation item' })
    @ApiResponse({ status: 201, description: 'Navigation item created' })
    async create(@Body() createDto: CreateNavigationDto): Promise<Navigation> {
        return await this.navigationService.create(createDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update navigation item' })
    @ApiResponse({ status: 200, description: 'Navigation item updated' })
    @ApiResponse({ status: 404, description: 'Navigation item not found' })
    async update(
        @Param('id') id: string,
        @Body() updateDto: UpdateNavigationDto,
    ): Promise<Navigation> {
        return await this.navigationService.update(id, updateDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete navigation item' })
    @ApiResponse({ status: 204, description: 'Navigation item deleted' })
    @ApiResponse({ status: 404, description: 'Navigation item not found' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.navigationService.remove(id);
    }

    @Post('scrape')
    @ApiOperation({ summary: 'Trigger navigation scraping' })
    @ApiResponse({ status: 202, description: 'Scraping job started' })
    async scrape(): Promise<{ jobId: string; message: string }> {
        const job = await this.scraperService.createJob(
            ScrapeJobType.NAVIGATION,
            'https://www.worldofbooks.com',
        );

        // Execute asynchronously
        this.scraperService.executeJob(job.id).catch((error) => {
            console.error('Scraping job failed:', error);
        });

        return {
            jobId: job.id,
            message: 'Navigation scraping job started',
        };
    }
}
