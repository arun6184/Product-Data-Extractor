import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
    ) { }

    async findByProductId(productId: string): Promise<Review[]> {
        return await this.reviewRepository.find({
            where: { productId },
            order: { createdAt: 'DESC' },
        });
    }
}
