import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { ViewHistory } from './history.entity';
import { CreateHistoryDto } from './dto/history.dto';

@ApiTags('history')
@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Get()
    @ApiOperation({ summary: 'Get user browsing history' })
    @ApiQuery({ name: 'sessionId', required: true })
    @ApiQuery({ name: 'limit', required: false })
    async findBySessionId(
        @Query('sessionId') sessionId: string,
        @Query('limit') limit?: number,
    ): Promise<ViewHistory[]> {
        return await this.historyService.findBySessionId(sessionId, limit);
    }

    @Post()
    @ApiOperation({ summary: 'Add history entry' })
    async create(@Body() createDto: CreateHistoryDto): Promise<ViewHistory> {
        return await this.historyService.create(createDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete history entry' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.historyService.remove(id);
    }

    @Delete('session/:sessionId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Clear all history for session' })
    async clearSession(@Param('sessionId') sessionId: string): Promise<void> {
        return await this.historyService.clearBySessionId(sessionId);
    }
}
