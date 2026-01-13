import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetail } from './product-detail.entity';
import { ProductDetailController } from './product-detail.controller';
import { ProductDetailService } from './product-detail.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductDetail])],
    controllers: [ProductDetailController],
    providers: [ProductDetailService],
    exports: [ProductDetailService],
})
export class ProductDetailModule { }
