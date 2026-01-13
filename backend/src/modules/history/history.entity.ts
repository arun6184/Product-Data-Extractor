import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('view_history')
@Index(['sessionId'])
@Index(['createdAt'])
export class ViewHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    sessionId: string;

    @Column({ type: 'varchar', length: 50 })
    entityType: string; // 'product', 'category', etc.

    @Column({ type: 'uuid' })
    entityId: string;

    @Column({ type: 'varchar', length: 500 })
    title: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    url: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    imageUrl: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;
}
