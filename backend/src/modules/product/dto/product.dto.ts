import { IsString, IsOptional, IsNumber, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryProductDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiProperty({ required: false, default: 1 })
    @IsOptional()
    @IsNumber()
    page?: number = 1;

    @ApiProperty({ required: false, default: 20 })
    @IsOptional()
    @IsNumber()
    limit?: number = 20;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt';

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class ScrapeProductsDto {
    @ApiProperty()
    @IsString()
    categoryUrl: string;

    @ApiProperty()
    @IsUUID()
    categoryId: string;

    @ApiProperty({ required: false, default: 5 })
    @IsOptional()
    @IsNumber()
    maxPages?: number = 5;
}
