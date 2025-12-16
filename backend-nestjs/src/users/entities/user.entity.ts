import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string; // 평문 저장 (Spring과 동일)

  @Column({ nullable: false })
  username: string;

  @Column({ type: 'text', nullable: true })
  profileImage: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  setTimezone() {
    // Asia/Seoul 타임존 보장
    const now = new Date();
    this.updatedAt = now;
  }
}
