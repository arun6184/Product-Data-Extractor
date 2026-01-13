import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNavigationDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    url: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    position?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateNavigationDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    url?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    position?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
