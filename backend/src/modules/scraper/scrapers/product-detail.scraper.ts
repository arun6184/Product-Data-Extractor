import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaywrightCrawler } from 'crawlee';
import { BaseScraperService } from './base-scraper.service';
import { ProductDetail } from '../product-detail/product-detail.entity';
import { Review } from '../review/review.entity';
import { Product } from '../product/product.entity';
import { ConfigService } from '@nestjs/config';

interface ProductDetailData {
    productId: string;
    description?: string;
    publisher?: string;
    publicationDate?: string;
    language?: string;
    pages?: number;
    format?: string;
    dimensions?: string;
    weight?: string;
    images?: string[];
    specifications?: Record<string, any>;
    relatedProducts?: string[];
    detailedConditionNotes?: string;
}

interface ReviewData {
    productId: string;
    reviewerName?: string;
    rating: number;
    title?: string;
    content?: string;
    reviewDate?: string;
    isVerifiedPurchase: boolean;
    helpfulCount: number;
}

@Injectable()
export class ProductDetailScraperService extends BaseScraperService {
    constructor(
        configService: ConfigService,
        @InjectRepository(ProductDetail)
        private productDetailRepository: Repository<ProductDetail>,
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {
        super(configService);
    }

    async scrapeProductDetail(productId: string): Promise<ProductDetail> {
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new Error(`Product not found: ${productId}`);
        }

        this.logger.log(`Scraping product detail for: ${product.title}`);

        let detailData: ProductDetailData = { productId };
        let reviews: ReviewData[] = [];

        const crawler = new PlaywrightCrawler({
            headless: this.config.headless,
            requestHandler: async ({ page }) => {
                await page.waitForLoadState('networkidle');
                await this.delay(2000);

                // Scrape product details
                const description = this.cleanText(
                    await this.safeGetText(page, '.product-description, [class*="description"]'),
                );
                const publisher = this.cleanText(
                    await this.safeGetText(page, '.publisher, [data-field="publisher"]'),
                );
                const publicationDate = this.cleanText(
                    await this.safeGetText(page, '.publication-date, [data-field="publication"]'),
                );
                const language = this.cleanText(
                    await this.safeGetText(page, '.language, [data-field="language"]'),
                );
                const pagesText = this.cleanText(
                    await this.safeGetText(page, '.pages, [data-field="pages"]'),
                );
                const format = this.cleanText(
                    await this.safeGetText(page, '.format, [data-field="format"]'),
                );

                // Scrape images
                const imageElements = await page.$$('.product-images img, .gallery img');
                const images = [];
                for (const img of imageElements) {
                    const src = await img.getAttribute('src');
                    if (src) images.push(src);
                }

                // Scrape specifications
                const specifications: Record<string, any> = {};
                const specRows = await page.$$('.specifications tr, .product-specs li');
                for (const row of specRows) {
                    const label = this.cleanText(await this.safeGetText(page, 'th, .label'));
                    const value = this.cleanText(await this.safeGetText(page, 'td, .value'));
                    if (label && value) {
                        specifications[label] = value;
                    }
                }

                // Scrape related products
                const relatedElements = await page.$$('.related-products a, .recommendations a');
                const relatedProducts = [];
                for (const el of relatedElements) {
                    const href = await el.getAttribute('href');
                    if (href) {
                        const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`;
                        relatedProducts.push(fullUrl);
                    }
                }

                detailData = {
                    productId,
                    description: description || undefined,
                    publisher: publisher || undefined,
                    publicationDate: publicationDate || undefined,
                    language: language || undefined,
                    pages: pagesText ? parseInt(pagesText.match(/\d+/)?.[0] || '0') : undefined,
                    format: format || undefined,
                    images: images.length > 0 ? images : undefined,
                    specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
                    relatedProducts: relatedProducts.length > 0 ? relatedProducts : undefined,
                };

                // Scrape reviews
                const reviewElements = await page.$$('.review-item, [class*="review"]');
                for (const reviewEl of reviewElements) {
                    const reviewerName = this.cleanText(
                        await reviewEl.$eval('.reviewer-name, .author', (el) => el.textContent).catch(() => null),
                    );
                    const ratingText = this.cleanText(
                        await reviewEl.$eval('[class*="rating"], .stars', (el) => el.textContent).catch(() => null),
                    );
                    const title = this.cleanText(
                        await reviewEl.$eval('.review-title, h4', (el) => el.textContent).catch(() => null),
                    );
                    const content = this.cleanText(
                        await reviewEl.$eval('.review-content, .review-text', (el) => el.textContent).catch(() => null),
                    );
                    const reviewDate = this.cleanText(
                        await reviewEl.$eval('.review-date, .date', (el) => el.textContent).catch(() => null),
                    );

                    const rating = this.parseRating(ratingText);
                    if (rating) {
                        reviews.push({
                            productId,
                            reviewerName: reviewerName || undefined,
                            rating,
                            title: title || undefined,
                            content: content || undefined,
                            reviewDate: reviewDate || undefined,
                            isVerifiedPurchase: false,
                            helpfulCount: 0,
                        });
                    }
                }
            },
            maxRequestsPerCrawl: 1,
        });

        await crawler.run([product.url]);

        // Save product detail
        let savedDetail: ProductDetail;
        const existingDetail = await this.productDetailRepository.findOne({
            where: { productId },
        });

        if (existingDetail) {
            Object.assign(existingDetail, {
                ...detailData,
                lastScrapedAt: new Date(),
            });
            savedDetail = await this.productDetailRepository.save(existingDetail);
        } else {
            const newDetail = this.productDetailRepository.create({
                ...detailData,
                lastScrapedAt: new Date(),
            });
            savedDetail = await this.productDetailRepository.save(newDetail);
        }

        // Save reviews
        await this.reviewRepository.delete({ productId });
        if (reviews.length > 0) {
            const newReviews = reviews.map((r) => this.reviewRepository.create(r));
            await this.reviewRepository.save(newReviews);

            // Update product review count and rating
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            await this.productRepository.update(productId, {
                reviewCount: reviews.length,
                rating: parseFloat(avgRating.toFixed(2)),
            });
        }

        this.logger.log(`Saved product detail and ${reviews.length} reviews`);
        return savedDetail;
    }

    private parseRating(ratingText: string | null): number | null {
        if (!ratingText) return null;
        const match = ratingText.match(/(\d+(\.\d+)?)/);
        if (!match) return null;
        const rating = parseFloat(match[1]);
        return rating > 5 ? rating / 20 : rating;
    }
}
