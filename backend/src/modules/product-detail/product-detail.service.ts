import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDetail } from './product-detail.entity';

@Injectable()
export class ProductDetailService {
    constructor(
        @InjectRepository(ProductDetail)
        private productDetailRepository: Repository<ProductDetail>,
    ) { }

    async findByProductId(productId: string): Promise<ProductDetail> {
        const detail = await this.productDetailRepository.findOne({
            where: { productId },
            relations: ['product'],
        });

        if (!detail) {
            throw new NotFoundException(`Product detail for product ${productId} not found`);
        }

        return detail;
    }
}
