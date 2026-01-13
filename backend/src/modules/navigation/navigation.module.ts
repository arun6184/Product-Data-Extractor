import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Navigation } from './navigation.entity';
import { NavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';
import { ScraperModule } from '../scraper/scraper.module';

@Module({
    imports: [TypeOrmModule.forFeature([Navigation]), ScraperModule],
    controllers: [NavigationController],
    providers: [NavigationService],
    exports: [NavigationService],
})
export class NavigationModule { }
