import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Index,
  OneToMany,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('posts')
@Index('idx_post_user_id', ['userId'])
@Index('idx_post_created_at', ['createdAt'])
@Index('idx_post_view_count', ['viewCount'])
@Index('idx_post_like_count', ['likeCount'])
@Index('idx_post_title', ['title'])  // 제목 검색용
export class Post {
  @PrimaryGeneratedColumn('increment')  // SQLite compatible integer
  id: number;

  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId: number;

  @ManyToOne(() => User, user => user.posts, { lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false, length: 255 })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ nullable: false, default: 0, type: 'int' })
  viewCount: number;

  @Column({ nullable: false, default: 0, type: 'int' })
  likeCount: number;

  // CASCADE DELETE: Spring @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
  @OneToMany(() => Comment, comment => comment.post, { cascade: true, onDelete: 'CASCADE' })
  comments: Comment[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
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
