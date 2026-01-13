import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductDetailService } from './product-detail.service';
import { ProductDetail } from './product-detail.entity';

@ApiTags('products')
@Controller('products')
export class ProductDetailController {
    constructor(private readonly productDetailService: ProductDetailService) { }

    @Get(':id/details')
    @ApiOperation({ summary: 'Get product details' })
    async getDetails(@Param('id') productId: string): Promise<ProductDetail> {
        return await this.productDetailService.findByProductId(productId);
    }
}
