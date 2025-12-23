import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Message } from '../messages/entities/message.entity';
import { UserDTO, UserRequestDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private dataSource: DataSource,
  ) {}

  // 회원가입 (Spring UserService와 동일)
  async signup(requestDTO: UserRequestDTO): Promise<UserDTO> {
    const exists = await this.userRepository.existsBy({
      email: requestDTO.email,
    });
    if (exists) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    const user = this.userRepository.create({
      email: requestDTO.email,
      password: requestDTO.password, // 평문 저장 (Spring과 동일)
      username: requestDTO.username,
      profileImage: requestDTO.profileImage || null,
      bio: requestDTO.bio || null,
    });

    const saved = await this.userRepository.save(user);
    return this.convertToDTO(saved);
  }

  // 로그인 (Spring UserService와 동일)
  async login(email: string, password: string): Promise<UserDTO> {
    console.log('🔍 로그인 시도 - Email:', email, ', Password:', password);

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      console.log('❌ 사용자를 찾을 수 없음:', email);
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    console.log('✅ 사용자 찾음 - DB Password:', user.password);

    if (user.password !== password) {
      console.log(
        '❌ 비밀번호 불일치 - 입력:',
        password,
        ', DB:',
        user.password,
      );
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    console.log('🎉 로그인 성공!');
    return this.convertToDTO(user);
  }

  // 모든 사용자 조회
  async getAllUsers(): Promise<UserDTO[]> {
    const users = await this.userRepository.find();
    return users.map(user => this.convertToDTO(user));
  }

  // 사용자 조회
  async getUserById(id: number): Promise<UserDTO> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    return this.convertToDTO(user);
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ? this.convertToDTO(user) : null;
  }

  // 사용자 정보 수정
  async updateUser(id: number, requestDTO: UserRequestDTO): Promise<UserDTO> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    if (requestDTO.username) {
      user.username = requestDTO.username;
    }
    if (requestDTO.profileImage !== undefined) {
      user.profileImage = requestDTO.profileImage;
    }
    if (requestDTO.bio !== undefined) {
      user.bio = requestDTO.bio;
    }

    const updated = await this.userRepository.save(user);
    return this.convertToDTO(updated);
  }

  // 사용자 삭제 (Spring CommentService.deleteUser와 100% 동일한 순서)
  async deleteUser(id: number): Promise<void> {
    console.log(`🗑️ Starting cascade delete for user ID: ${id}`);
    
    // Spring Boot CommentService.deleteUser()와 동일한 순서 구현
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1단계: 사용자가 보내거나 받은 메시지 삭제 (Spring: messageService.deleteByUserId)
      console.log('🔹 Step 1: Deleting messages (sent and received)...');
      const deletedMessages = await queryRunner.manager.delete(Message, [
        { senderId: id },
        { recipientId: id }
      ]);
      console.log(`   ✅ Deleted ${deletedMessages.affected} messages`);

      // 2단계: 사용자가 작성한 댓글 삭제 (Spring: commentRepository.deleteByUserId)
      console.log('🔹 Step 2: Deleting user comments...');
      const deletedUserComments = await queryRunner.manager.delete(Comment, { userId: id });
      console.log(`   ✅ Deleted ${deletedUserComments.affected} user comments`);

      // 3단계: 사용자 게시글에 달린 댓글들 삭제 + 게시글 삭제
      console.log('🔹 Step 3: Processing user posts...');
      const userPosts = await queryRunner.manager.find(Post, { 
        where: { userId: id },
        select: ['id'] 
      });
      
      for (const post of userPosts) {
        // 3a: 각 게시글의 댓글 삭제 (Spring: commentRepository.deleteByPostId)
        const deletedPostComments = await queryRunner.manager.delete(Comment, { postId: post.id });
        console.log(`   ✅ Deleted ${deletedPostComments.affected} comments from post ${post.id}`);
        
        // 3b: 게시글 삭제 (Spring: postRepository.deleteById)
        await queryRunner.manager.delete(Post, { id: post.id });
        console.log(`   ✅ Deleted post ${post.id}`);
      }

      // 4단계: 사용자 삭제 (Spring: userRepository.deleteById)
      console.log('🔹 Step 4: Deleting user...');
      const deletedUser = await queryRunner.manager.delete(User, { id });
      console.log(`   ✅ Deleted user: ${deletedUser.affected}`);

      await queryRunner.commitTransaction();
      console.log(`🎉 Cascade delete completed successfully for user ID: ${id}`);
      
    } catch (error) {
      console.error(`❌ Cascade delete failed for user ID: ${id}`, error);
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed to delete user and related data: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  private convertToDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}