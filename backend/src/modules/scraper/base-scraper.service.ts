import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { Page } from 'playwright';

export interface ScraperConfig {
    baseUrl: string;
    headless: boolean;
    rateLimitMs: number;
    maxRetries: number;
    userAgent: string;
}

@Injectable()
export class BaseScraperService {
    protected readonly logger = new Logger(this.constructor.name);
    protected config: ScraperConfig;

    constructor(protected configService: ConfigService) {
        this.config = {
            baseUrl: this.configService.get('SCRAPER_BASE_URL', 'https://www.worldofbooks.com'),
            headless: this.configService.get('SCRAPER_HEADLESS', 'true') === 'true',
            rateLimitMs: parseInt(this.configService.get('SCRAPER_RATE_LIMIT_MS', '2000')),
            maxRetries: parseInt(this.configService.get('SCRAPER_MAX_RETRIES', '3')),
            userAgent: this.configService.get('SCRAPER_USER_AGENT', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
        };
    }

    protected async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    protected async withRetry<T>(
        fn: () => Promise<T>,
        retries: number = this.config.maxRetries,
    ): Promise<T> {
        let lastError: Error;

        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                this.logger.warn(`Attempt ${i + 1} failed: ${error.message}`);

                if (i < retries - 1) {
                    const backoffMs = Math.min(1000 * Math.pow(2, i), 10000);
                    await this.delay(backoffMs);
                }
            }
        }

        throw lastError;
    }

    protected async safeGetText(page: Page, selector: string): Promise<string | null> {
        try {
            const element = await page.$(selector);
            if (!element) return null;
            return await element.textContent();
        } catch (error) {
            return null;
        }
    }

    protected async safeGetAttribute(
        page: Page,
        selector: string,
        attribute: string,
    ): Promise<string | null> {
        try {
            const element = await page.$(selector);
            if (!element) return null;
            return await element.getAttribute(attribute);
        } catch (error) {
            return null;
        }
    }

    protected cleanText(text: string | null): string {
        if (!text) return '';
        return text.trim().replace(/\s+/g, ' ');
    }

    protected parsePrice(priceText: string | null): number | null {
        if (!priceText) return null;
        const match = priceText.match(/[\d,]+\.?\d*/);
        if (!match) return null;
        return parseFloat(match[0].replace(',', ''));
    }
}
