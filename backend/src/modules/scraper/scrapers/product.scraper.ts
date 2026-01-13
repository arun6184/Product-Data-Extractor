import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaywrightCrawler } from 'crawlee';
import { BaseScraperService } from './base-scraper.service';
import { Product } from '../product/product.entity';
import { ConfigService } from '@nestjs/config';

interface ProductData {
    sku: string;
    title: string;
    url: string;
    imageUrl?: string;
    price?: number;
    originalPrice?: number;
    condition?: string;
    inStock: boolean;
    author?: string;
    isbn?: string;
    rating?: number;
    reviewCount: number;
    categoryId: string;
}

@Injectable()
export class ProductScraperService extends BaseScraperService {
    constructor(
        configService: ConfigService,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {
        super(configService);
    }

    async scrapeProducts(categoryUrl: string, categoryId: string, maxPages: number = 5): Promise<Product[]> {
        this.logger.log(`Starting product scraping for category: ${categoryId}`);
        const results: ProductData[] = [];
        const seenSkus = new Set<string>();

        const crawler = new PlaywrightCrawler({
            headless: this.config.headless,
            requestHandler: async ({ page, request }) => {
                this.logger.log(`Scraping products from: ${request.url}`);

                await page.waitForLoadState('networkidle');
                await this.delay(2000);

                // World of Books product grid selectors (adjust based on actual structure)
                const productCards = await page.$$(
                    '.product-grid .product-item, .products-list .product, [class*="product-card"]',
                );

                this.logger.log(`Found ${productCards.length} product cards on page`);

                for (const card of productCards) {
                    try {
                        // Extract product data
                        const titleElement = await card.$('.product-title, h3, h4, [class*="title"]');
                        const linkElement = await card.$('a');
                        const imageElement = await card.$('img');
                        const priceElement = await card.$('.price, [class*="price"]');
                        const authorElement = await card.$('.author, [class*="author"]');
                        const ratingElement = await card.$('[class*="rating"], .stars');

                        const title = this.cleanText(await titleElement?.textContent());
                        const href = await linkElement?.getAttribute('href');
                        const imageUrl = await imageElement?.getAttribute('src');
                        const priceText = this.cleanText(await priceElement?.textContent());
                        const author = this.cleanText(await authorElement?.textContent());
                        const ratingText = this.cleanText(await ratingElement?.textContent());

                        if (!title || !href) continue;

                        const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`;
                        const sku = this.extractSkuFromUrl(fullUrl) || this.generateSku(title);

                        // Skip duplicates
                        if (seenSkus.has(sku)) continue;
                        seenSkus.add(sku);

                        const price = this.parsePrice(priceText);
                        const rating = this.parseRating(ratingText);

                        results.push({
                            sku,
                            title,
                            url: fullUrl,
                            imageUrl: imageUrl || undefined,
                            price,
                            condition: 'Used', // World of Books sells used books
                            inStock: true,
                            author: author || undefined,
                            rating: rating || undefined,
                            reviewCount: 0,
                            categoryId,
                        });
                    } catch (error) {
                        this.logger.warn(`Error parsing product card: ${error.message}`);
                    }
                }

                this.logger.log(`Extracted ${results.length} products so far`);
            },
            maxRequestsPerCrawl: maxPages,
            maxConcurrency: 1,
        });

        // Build paginated URLs
        const urls = [categoryUrl];
        for (let page = 2; page <= maxPages; page++) {
            urls.push(`${categoryUrl}?page=${page}`);
        }

        await crawler.run(urls);

        // Save to database
        const savedProducts: Product[] = [];

        for (const productData of results) {
            const existing = await this.productRepository.findOne({
                where: { sku: productData.sku },
            });

            if (existing) {
                Object.assign(existing, {
                    ...productData,
                    lastScrapedAt: new Date(),
                });
                savedProducts.push(await this.productRepository.save(existing));
            } else {
                const newProduct = this.productRepository.create({
                    ...productData,
                    lastScrapedAt: new Date(),
                });
                savedProducts.push(await this.productRepository.save(newProduct));
            }

            await this.delay(100); // Small delay between DB operations
        }

        this.logger.log(`Saved ${savedProducts.length} products to database`);
        return savedProducts;
    }

    private extractSkuFromUrl(url: string): string | null {
        const match = url.match(/\/product\/([^\/]+)/);
        return match ? match[1] : null;
    }

    private generateSku(title: string): string {
        const hash = title
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 20);
        return `WOB-${hash}-${Date.now()}`;
    }

    private parseRating(ratingText: string | null): number | null {
        if (!ratingText) return null;
        const match = ratingText.match(/(\d+(\.\d+)?)/);
        if (!match) return null;
        const rating = parseFloat(match[1]);
        return rating > 5 ? rating / 20 : rating; // Normalize to 0-5 scale
    }
}
