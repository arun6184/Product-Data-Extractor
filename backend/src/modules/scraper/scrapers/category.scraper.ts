import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaywrightCrawler } from 'crawlee';
import { BaseScraperService } from './base-scraper.service';
import { Category } from '../category/category.entity';
import { ConfigService } from '@nestjs/config';

interface CategoryData {
    name: string;
    slug: string;
    url: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    navigationId?: string;
}

@Injectable()
export class CategoryScraperService extends BaseScraperService {
    constructor(
        configService: ConfigService,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {
        super(configService);
    }

    async scrapeCategories(navigationUrl: string, navigationId: string): Promise<Category[]> {
        this.logger.log(`Starting category scraping for: ${navigationUrl}`);
        const results: CategoryData[] = [];

        const crawler = new PlaywrightCrawler({
            headless: this.config.headless,
            requestHandler: async ({ page, request }) => {
                this.logger.log(`Scraping categories from: ${request.url}`);

                await page.waitForLoadState('networkidle');
                await this.delay(1500);

                // Scrape main categories (adjust selectors for worldofbooks.com)
                const categoryElements = await page.$$(
                    '.category-grid .category-item, .categories-list a, .category-card, [class*="category"]',
                );

                for (const element of categoryElements) {
                    const name = this.cleanText(await element.textContent());
                    const href = await element.getAttribute('href');
                    const imgElement = await element.$('img');
                    const imageUrl = imgElement ? await imgElement.getAttribute('src') : null;

                    if (name && href) {
                        const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`;
                        const slug = this.generateSlug(name);

                        results.push({
                            name,
                            slug,
                            url: fullUrl,
                            imageUrl: imageUrl || undefined,
                            navigationId,
                        });
                    }
                }

                this.logger.log(`Found ${results.length} categories`);
            },
            maxRequestsPerCrawl: 1,
            maxConcurrency: 1,
        });

        await crawler.run([navigationUrl]);
        await this.delay(this.config.rateLimitMs);

        // Save to database
        const savedCategories: Category[] = [];

        for (const categoryData of results) {
            const existing = await this.categoryRepository.findOne({
                where: { slug: categoryData.slug },
            });

            if (existing) {
                Object.assign(existing, {
                    ...categoryData,
                    lastScrapedAt: new Date(),
                });
                savedCategories.push(await this.categoryRepository.save(existing));
            } else {
                const newCategory = this.categoryRepository.create({
                    ...categoryData,
                    lastScrapedAt: new Date(),
                });
                savedCategories.push(await this.categoryRepository.save(newCategory));
            }
        }

        this.logger.log(`Saved ${savedCategories.length} categories to database`);
        return savedCategories;
    }

    async scrapeSubcategories(parentCategoryUrl: string, parentId: string): Promise<Category[]> {
        this.logger.log(`Scraping subcategories for parent: ${parentId}`);
        const results: CategoryData[] = [];

        const crawler = new PlaywrightCrawler({
            headless: this.config.headless,
            requestHandler: async ({ page }) => {
                await page.waitForLoadState('networkidle');
                await this.delay(1500);

                const subcategoryElements = await page.$$(
                    '.subcategory-list a, .sub-categories a, [class*="subcategory"]',
                );

                for (const element of subcategoryElements) {
                    const name = this.cleanText(await element.textContent());
                    const href = await element.getAttribute('href');

                    if (name && href) {
                        const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`;
                        const slug = this.generateSlug(name);

                        results.push({
                            name,
                            slug,
                            url: fullUrl,
                            parentId,
                        });
                    }
                }
            },
            maxRequestsPerCrawl: 1,
        });

        await crawler.run([parentCategoryUrl]);
        await this.delay(this.config.rateLimitMs);

        const savedSubcategories: Category[] = [];

        for (const subcategoryData of results) {
            const existing = await this.categoryRepository.findOne({
                where: { slug: subcategoryData.slug },
            });

            if (existing) {
                Object.assign(existing, {
                    ...subcategoryData,
                    lastScrapedAt: new Date(),
                });
                savedSubcategories.push(await this.categoryRepository.save(existing));
            } else {
                const newSubcategory = this.categoryRepository.create({
                    ...subcategoryData,
                    lastScrapedAt: new Date(),
                });
                savedSubcategories.push(await this.categoryRepository.save(newSubcategory));
            }
        }

        this.logger.log(`Saved ${savedSubcategories.length} subcategories`);
        return savedSubcategories;
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}
