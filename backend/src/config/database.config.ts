import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) { }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get('DATABASE_HOST', 'localhost'),
            port: this.configService.get('DATABASE_PORT', 5432),
            username: this.configService.get('DATABASE_USER', 'postgres'),
            password: this.configService.get('DATABASE_PASSWORD', ''),
            database: this.configService.get('DATABASE_NAME', 'worldofbooks_scraper'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: this.configService.get('NODE_ENV') === 'development',
            logging: this.configService.get('NODE_ENV') === 'development',
            ssl: this.configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
        };
    }
}
