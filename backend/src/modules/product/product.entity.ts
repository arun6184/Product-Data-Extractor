import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from '../category/category.entity';
import { ProductDetail } from '../product-detail/product-detail.entity';
import { Review } from '../review/review.entity';

@Entity('product')
@Index(['sku'], { unique: true })
@Index(['categoryId'])
@Index(['title'])
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    sku: string;

    @Column({ type: 'varchar', length: 500 })
    title: string;

    @Column({ type: 'varchar', length: 500 })
    url: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    imageUrl: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    originalPrice: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    condition: string;

    @Column({ type: 'boolean', default: true })
    inStock: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    author: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    isbn: string;

    @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true, default: 0 })
    rating: number;

    @Column({ type: 'int', default: 0 })
    reviewCount: number;

    @Column({ type: 'uuid', nullable: true })
    categoryId: string;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @OneToOne(() => ProductDetail, (detail) => detail.product)
    detail: ProductDetail;

    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastScrapedAt: Date;
}
