import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScrapeJob, ScrapeJobStatus, ScrapeJobType } from './scrape-job.entity';
import { NavigationScraperService } from './scrapers/navigation.scraper';
import { CategoryScraperService } from './scrapers/category.scraper';
import { ProductScraperService } from './scrapers/product.scraper';
import { ProductDetailScraperService } from './scrapers/product-detail.scraper';

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);

    constructor(
        @InjectRepository(ScrapeJob)
        private scrapeJobRepository: Repository<ScrapeJob>,
        private navigationScraper: NavigationScraperService,
        private categoryScraper: CategoryScraperService,
        private productScraper: ProductScraperService,
        private productDetailScraper: ProductDetailScraperService,
    ) { }

    async createJob(type: ScrapeJobType, url: string, params?: Record<string, any>): Promise<ScrapeJob> {
        const job = this.scrapeJobRepository.create({
            type,
            url,
            params,
            status: ScrapeJobStatus.PENDING,
        });
        return await this.scrapeJobRepository.save(job);
    }

    async executeJob(jobId: string): Promise<ScrapeJob> {
        const job = await this.scrapeJobRepository.findOne({ where: { id: jobId } });
        if (!job) {
            throw new Error(`Job not found: ${jobId}`);
        }

        job.status = ScrapeJobStatus.RUNNING;
        job.startedAt = new Date();
        await this.scrapeJobRepository.save(job);

        try {
            let result: any;

            switch (job.type) {
                case ScrapeJobType.NAVIGATION:
                    result = await this.navigationScraper.scrapeNavigation();
                    job.itemsTotal = result.length;
                    job.itemsProcessed = result.length;
                    break;

                case ScrapeJobType.CATEGORY:
                    result = await this.categoryScraper.scrapeCategories(
                        job.url,
                        job.params?.navigationId,
                    );
                    job.itemsTotal = result.length;
                    job.itemsProcessed = result.length;
                    break;

                case ScrapeJobType.PRODUCT:
                    result = await this.productScraper.scrapeProducts(
                        job.url,
                        job.params?.categoryId,
                        job.params?.maxPages || 5,
                    );
                    job.itemsTotal = result.length;
                    job.itemsProcessed = result.length;
                    break;

                case ScrapeJobType.PRODUCT_DETAIL:
                    result = await this.productDetailScraper.scrapeProductDetail(
                        job.params?.productId,
                    );
                    job.itemsTotal = 1;
                    job.itemsProcessed = 1;
                    break;

                default:
                    throw new Error(`Unknown job type: ${job.type}`);
            }

            job.status = ScrapeJobStatus.COMPLETED;
            job.result = { success: true, itemCount: job.itemsProcessed };
            job.completedAt = new Date();
        } catch (error) {
            this.logger.error(`Job ${jobId} failed: ${error.message}`, error.stack);
            job.status = ScrapeJobStatus.FAILED;
            job.errorMessage = error.message;
            job.completedAt = new Date();
        }

        return await this.scrapeJobRepository.save(job);
    }

    async getJobStatus(jobId: string): Promise<ScrapeJob> {
        const job = await this.scrapeJobRepository.findOne({ where: { id: jobId } });
        if (!job) {
            throw new Error(`Job not found: ${jobId}`);
        }
        return job;
    }
}
