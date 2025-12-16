import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Index 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('posts')
@Index('idx_post_user_id', ['userId'])
@Index('idx_post_created_at', ['createdAt'])
@Index('idx_post_view_count', ['viewCount'])
@Index('idx_post_like_count', ['likeCount'])
export class Post {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', nullable: false })
  userId: number;

  @ManyToOne(() => User, { lazy: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ nullable: false, default: 0 })
  viewCount: number;

  @Column({ nullable: false, default: 0 })
  likeCount: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
