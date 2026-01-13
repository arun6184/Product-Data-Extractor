import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewHistory } from './history.entity';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
    imports: [TypeOrmModule.forFeature([ViewHistory])],
    controllers: [HistoryController],
    providers: [HistoryService],
    exports: [HistoryService],
})
export class HistoryModule { }
