import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Category } from '../category/category.entity';

@Entity('navigation')
@Index(['url'], { unique: true })
export class Navigation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 500 })
    url: string;

    @Column({ type: 'int', default: 0 })
    position: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @OneToMany(() => Category, (category) => category.navigation)
    categories: Category[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastScrapedAt: Date;
}
