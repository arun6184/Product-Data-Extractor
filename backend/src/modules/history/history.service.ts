import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewHistory } from './history.entity';
import { CreateHistoryDto } from './dto/history.dto';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(ViewHistory)
        private historyRepository: Repository<ViewHistory>,
    ) { }

    async findBySessionId(sessionId: string, limit: number = 50): Promise<ViewHistory[]> {
        return await this.historyRepository.find({
            where: { sessionId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async create(createDto: CreateHistoryDto): Promise<ViewHistory> {
        const history = this.historyRepository.create(createDto);
        return await this.historyRepository.save(history);
    }

    async remove(id: string): Promise<void> {
        await this.historyRepository.delete(id);
    }

    async clearBySessionId(sessionId: string): Promise<void> {
        await this.historyRepository.delete({ sessionId });
    }
}
