import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config';
import { NavigationModule } from './modules/navigation/navigation.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { ProductDetailModule } from './modules/product-detail/product-detail.module';
import { ReviewModule } from './modules/review/review.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { HistoryModule } from './modules/history/history.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            useClass: DatabaseConfig,
        }),
        NavigationModule,
        CategoryModule,
        ProductModule,
        ProductDetailModule,
        ReviewModule,
        ScraperModule,
        HistoryModule,
    ],
})
export class AppModule { }
