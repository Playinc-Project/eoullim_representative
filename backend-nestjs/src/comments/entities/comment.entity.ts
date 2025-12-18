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
import { Post } from '../../posts/entities/post.entity';

@Entity('comments')
@Index('idx_comment_post_id', ['postId'])
@Index('idx_comment_user_id', ['userId'])
@Index('idx_comment_created_at', ['createdAt'])
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'post_id', type: 'integer', nullable: false })
  postId: number;

  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId: number;

  @ManyToOne(() => Post, { lazy: true })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User, { lazy: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
