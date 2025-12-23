import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Index,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity('comments')
@Index('idx_comment_post_id', ['postId'])
@Index('idx_comment_user_id', ['userId'])
@Index('idx_comment_created_at', ['createdAt'])
export class Comment {
  @PrimaryGeneratedColumn('increment')  // SQLite compatible integer
  id: number;

  @Column({ name: 'post_id', type: 'integer', nullable: false })
  postId: number;

  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId: number;

  @ManyToOne(() => Post, post => post.comments, { lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User, user => user.comments, { lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  setTimezone() {
    // Asia/Seoul 타임존 보장
    process.env.TZ = 'Asia/Seoul';
    const now = new Date();
    this.updatedAt = now;
  }
}
