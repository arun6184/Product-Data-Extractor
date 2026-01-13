import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Navigation } from '../navigation/navigation.entity';
import { Product } from '../product/product.entity';

@Entity('category')
@Index(['slug'], { unique: true })
@Index(['navigationId'])
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 300 })
    slug: string;

    @Column({ type: 'varchar', length: 500 })
    url: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    imageUrl: string;

    @Column({ type: 'uuid', nullable: true })
    parentId: string;

    @ManyToOne(() => Category, (category) => category.children, { nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @Column({ type: 'uuid', nullable: true })
    navigationId: string;

    @ManyToOne(() => Navigation, (navigation) => navigation.categories, { nullable: true })
    @JoinColumn({ name: 'navigationId' })
    navigation: Navigation;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @Column({ type: 'int', default: 0 })
    productCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastScrapedAt: Date;
}
