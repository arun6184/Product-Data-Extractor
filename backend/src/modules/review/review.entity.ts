import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('review')
@Index(['productId'])
@Index(['rating'])
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    productId: string;

    @ManyToOne(() => Product, (product) => product.reviews)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'varchar', length: 255, nullable: true })
    reviewerName: string;

    @Column({ type: 'decimal', precision: 3, scale: 2 })
    rating: number;

    @Column({ type: 'varchar', length: 500, nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    reviewDate: string;

    @Column({ type: 'boolean', default: false })
    isVerifiedPurchase: boolean;

    @Column({ type: 'int', default: 0 })
    helpfulCount: number;

    @CreateDateColumn()
    createdAt: Date;
}
