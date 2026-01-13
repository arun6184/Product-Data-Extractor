import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { Review } from './review.entity';

@ApiTags('products')
@Controller('products')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Get(':id/reviews')
    @ApiOperation({ summary: 'Get product reviews' })
    async getReviews(@Param('id') productId: string): Promise<Review[]> {
        return await this.reviewService.findByProductId(productId);
    }
}
