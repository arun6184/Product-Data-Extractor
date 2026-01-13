import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('product_detail')
export class ProductDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', unique: true })
    productId: string;

    @OneToOne(() => Product, (product) => product.detail)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    publisher: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    publicationDate: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    language: string;

    @Column({ type: 'int', nullable: true })
    pages: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    format: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    dimensions: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    weight: string;

    @Column({ type: 'jsonb', nullable: true })
    images: string[];

    @Column({ type: 'jsonb', nullable: true })
    specifications: Record<string, any>;

    @Column({ type: 'jsonb', nullable: true })
    relatedProducts: string[];

    @Column({ type: 'text', nullable: true })
    detailedConditionNotes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastScrapedAt: Date;
}
