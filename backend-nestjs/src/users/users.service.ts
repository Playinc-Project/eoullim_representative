import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDTO, UserRequestDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  // 사용자 삭제 (Spring과 동일한 순서)
  async deleteUser(id: number): Promise<void> {
    // 1. 메시지 삭제
    await this.userRepository.query(
      'DELETE FROM messages WHERE sender_id = ? OR recipient_id = ?',
      [id, id],
    );

    // 2. 댓글 삭제
    await this.userRepository.query('DELETE FROM comments WHERE user_id = ?', [
      id,
    ]);

    // 3. 게시글의 댓글 삭제 후 게시글 삭제
    const posts = await this.userRepository.query(
      'SELECT id FROM posts WHERE user_id = ?',
      [id],
    );
    for (const post of posts as { id: number }[]) {
      await this.userRepository.query(
        'DELETE FROM comments WHERE post_id = ?',
        [post.id],
      );
      await this.userRepository.query('DELETE FROM posts WHERE id = ?', [
        post.id,
      ]);
    }

    // 4. 사용자 삭제
    await this.userRepository.delete(id);
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