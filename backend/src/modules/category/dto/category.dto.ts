import { IsString, IsOptional, IsInt, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    slug: string;

    @ApiProperty()
    @IsString()
    url: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    navigationId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    productCount?: number;
}

export class QueryCategoryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    navigationId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    parentId?: string;
}
