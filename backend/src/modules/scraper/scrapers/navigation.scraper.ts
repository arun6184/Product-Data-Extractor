import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaywrightCrawler } from 'crawlee';
import { BaseScraperService } from './base-scraper.service';
import { Navigation } from '../navigation/navigation.entity';
import { ConfigService } from '@nestjs/config';

interface NavigationItem {
    name: string;
    url: string;
    position: number;
}

@Injectable()
export class NavigationScraperService extends BaseScraperService {
    constructor(
        configService: ConfigService,
        @InjectRepository(Navigation)
        private navigationRepository: Repository<Navigation>,
    ) {
        super(configService);
    }

    async scrapeNavigation(): Promise<Navigation[]> {
        this.logger.log('Starting navigation scraping...');
        const results: NavigationItem[] = [];

        const crawler = new PlaywrightCrawler({
            headless: this.config.headless,
            requestHandler: async ({ page, request }) => {
                this.logger.log(`Scraping navigation from: ${request.url}`);

                // Wait for navigation menu to load
                await page.waitForLoadState('networkidle');
                await this.delay(1000);

                // World of Books specific selectors (adjust based on actual site structure)
                const navItems = await page.$$('nav.main-navigation a, header nav a, .navigation-menu a');

                for (let i = 0; i < navItems.length; i++) {
                    const item = navItems[i];
                    const name = this.cleanText(await item.textContent());
                    const href = await item.getAttribute('href');

                    if (name && href && !href.startsWith('#')) {
                        const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`;

                        // Filter out non-category links (cart, login, etc.)
                        if (!this.isIgnoredNavLink(name)) {
                            results.push({
                                name,
                                url: fullUrl,
                                position: i,
                            });
                        }
                    }
                }

                this.logger.log(`Found ${results.length} navigation items`);
            },
            maxRequestsPerCrawl: 1,
            maxConcurrency: 1,
        });

        await crawler.run([this.config.baseUrl]);

        // Save to database
        const savedItems: Navigation[] = [];

        for (const item of results) {
            const existing = await this.navigationRepository.findOne({
                where: { url: item.url },
            });

            if (existing) {
                existing.name = item.name;
                existing.position = item.position;
                existing.lastScrapedAt = new Date();
                savedItems.push(await this.navigationRepository.save(existing));
            } else {
                const newItem = this.navigationRepository.create({
                    ...item,
                    lastScrapedAt: new Date(),
                });
                savedItems.push(await this.navigationRepository.save(newItem));
            }
        }

        this.logger.log(`Saved ${savedItems.length} navigation items to database`);
        return savedItems;
    }

    private isIgnoredNavLink(name: string): boolean {
        const ignoredKeywords = ['cart', 'checkout', 'login', 'account', 'sign in', 'register', 'search'];
        const lowerName = name.toLowerCase();
        return ignoredKeywords.some((keyword) => lowerName.includes(keyword));
    }
}
