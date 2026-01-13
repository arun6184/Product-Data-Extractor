import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ScraperModule } from '../scraper/scraper.module';

@Module({
    imports: [TypeOrmModule.forFeature([Product]), ScraperModule],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule { }
