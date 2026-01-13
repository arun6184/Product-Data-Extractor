import { IsString, IsUUID, IsOptional } from '@nestjs/validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHistoryDto {
    @ApiProperty()
    @IsString()
    sessionId: string;

    @ApiProperty()
    @IsString()
    entityType: string;

    @ApiProperty()
    @IsUUID()
    entityId: string;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    url?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    metadata?: Record<string, any>;
}
