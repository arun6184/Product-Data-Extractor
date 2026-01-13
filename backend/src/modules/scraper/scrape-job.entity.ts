import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ScrapeJobStatus {
    PENDING = 'pending',
    RUNNING = 'running',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export enum ScrapeJobType {
    NAVIGATION = 'navigation',
    CATEGORY = 'category',
    PRODUCT = 'product',
    PRODUCT_DETAIL = 'product_detail',
}

@Entity('scrape_job')
@Index(['status'])
@Index(['type'])
export class ScrapeJob {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ScrapeJobType,
    })
    type: ScrapeJobType;

    @Column({
        type: 'enum',
        enum: ScrapeJobStatus,
        default: ScrapeJobStatus.PENDING,
    })
    status: ScrapeJobStatus;

    @Column({ type: 'varchar', length: 500 })
    url: string;

    @Column({ type: 'jsonb', nullable: true })
    params: Record<string, any>;

    @Column({ type: 'int', default: 0 })
    itemsProcessed: number;

    @Column({ type: 'int', default: 0 })
    itemsTotal: number;

    @Column({ type: 'text', nullable: true })
    errorMessage: string;

    @Column({ type: 'jsonb', nullable: true })
    result: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    startedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date;
}
