import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  Index
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity('users')
@Index('idx_user_email', ['email'], { unique: true })  // Spring @Column(unique=true) equivalent
@Index('idx_user_username', ['username'])
@Index('idx_user_created_at', ['createdAt'])
export class User {
  @PrimaryGeneratedColumn('increment')  // SQLite compatible integer
  id: number;

  @Column({ unique: true, nullable: false, length: 255 })
  email: string;

  @Column({ nullable: false, length: 255 })
  password: string; // 평문 저장 (Spring과 동일)

  @Column({ nullable: false, length: 50 })
  username: string;

  @Column({ type: 'text', nullable: true })
  profileImage: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  // CASCADE DELETE: Spring @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true) 동일
  @OneToMany(() => Post, post => post.user, { cascade: true, onDelete: 'CASCADE' })
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.user, { cascade: true, onDelete: 'CASCADE' })
  comments: Comment[];

  @OneToMany(() => Message, message => message.sender, { cascade: true, onDelete: 'CASCADE' })
  sentMessages: Message[];

  @OneToMany(() => Message, message => message.recipient, { cascade: true, onDelete: 'CASCADE' })
  receivedMessages: Message[];

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  setTimezone() {
    // Asia/Seoul 타임존 보장 - Spring @PrePersist/@PreUpdate 동일
    process.env.TZ = 'Asia/Seoul';
    const now = new Date();
    this.updatedAt = now;
  }
}
