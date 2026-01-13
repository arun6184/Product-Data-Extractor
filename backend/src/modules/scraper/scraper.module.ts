import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Navigation } from '../navigation/navigation.entity';
import { Category } from '../category/category.entity';
import { Product } from '../product/product.entity';
import { ProductDetail } from '../product-detail/product-detail.entity';
import { Review } from '../review/review.entity';
import { ScrapeJob } from './scrape-job.entity';
import { NavigationScraperService } from './scrapers/navigation.scraper';
import { CategoryScraperService } from './scrapers/category.scraper';
import { ProductScraperService } from './scrapers/product.scraper';
import { ProductDetailScraperService } from './scrapers/product-detail.scraper';
import { ScraperService } from './scraper.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Navigation,
            Category,
            Product,
            ProductDetail,
            Review,
            ScrapeJob,
        ]),
    ],
    providers: [
        ScraperService,
        NavigationScraperService,
        CategoryScraperService,
        ProductScraperService,
        ProductDetailScraperService,
    ],
    exports: [
        ScraperService,
        NavigationScraperService,
        CategoryScraperService,
        ProductScraperService,
        ProductDetailScraperService,
    ],
})
export class ScraperModule { }
