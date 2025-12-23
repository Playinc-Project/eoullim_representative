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

@Entity('messages')
@Index('idx_message_sender_id', ['senderId'])
@Index('idx_message_recipient_id', ['recipientId'])
@Index('idx_message_created_at', ['createdAt'])
export class Message {
  @PrimaryGeneratedColumn('increment')  // SQLite compatible integer
  id: number;

  @Column({ name: 'sender_id', type: 'integer', nullable: false })
  senderId: number;

  @Column({ name: 'recipient_id', type: 'integer', nullable: false })
  recipientId: number;

  @ManyToOne(() => User, user => user.sentMessages, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, user => user.receivedMessages, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

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
