import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'sender_id', type: 'bigint', nullable: false })
  senderId: number;

  @Column({ name: 'recipient_id', type: 'bigint', nullable: false })
  recipientId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
