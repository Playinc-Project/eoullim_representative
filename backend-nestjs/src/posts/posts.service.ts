import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { PostDTO, PostRequestDTO } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // 게시글 생성 (캐시 삭제)
  async createPost(userId: number, requestDTO: PostRequestDTO): Promise<PostDTO> {
    console.log('=== PostService.createPost ===');
    console.log('요청된 userId:', userId);
    console.log('전체 사용자 수:', await this.userRepository.count());

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      console.log('❌ 사용자 ID', userId, '를 찾을 수 없습니다');
      const allUsers = await this.userRepository.find();
      allUsers.forEach(u => console.log('기존 사용자: ID=', u.id, ', Email=', u.email));
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    console.log('✅ 사용자 찾음:', user.email);

    const post = this.postRepository.create({
      userId: user.id,
      title: requestDTO.title,
      content: requestDTO.content,
    });

    const saved = await this.postRepository.save(post);
    console.log('✅ 게시글 저장됨: ID=', saved.id);

    // 캐시 삭제 (Spring @CacheEvict와 동일)
    await this.cacheManager.del('posts:all');

    return this.convertToDTO(saved);
  }

  // 게시글 조회 (단일, 조회수 증가)
  async getPost(id: number): Promise<PostDTO> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    // 조회수 증가 (매번 실행되도록)
    post.viewCount += 1;
    await this.postRepository.save(post);

    const dto = await this.convertToDTO(post);

    // 조회수가 변경되었으므로 관련 캐시 삭제
    await this.cacheManager.del(`posts:${id}`);
    await this.cacheManager.del('posts:all');

    return dto;
  }

  // 모든 게시글 조회 (캐싱)
  async getAllPosts(): Promise<PostDTO[]> {
    const cached = await this.cacheManager.get<PostDTO[]>('posts:all');
    if (cached) {
      return cached;
    }

    const posts = await this.postRepository.find({
      order: { createdAt: 'DESC' },
    });

    const dtos = await Promise.all(posts.map(p => this.convertToDTO(p)));

    await this.cacheManager.set('posts:all', dtos, 60000);

    return dtos;
  }

  // 페이지네이션으로 게시글 조회 (Spring과 동일)
  async getPostsWithPagination(page: number, size: number): Promise<{ data: PostDTO[]; total: number }> {
    const [posts, total] = await this.postRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: page * size,
      take: size,
    });

    const data = await Promise.all(posts.map(p => this.convertToDTO(p)));

    return { data, total };
  }

  // 사용자별 게시글 조회
  async getUserPosts(userId: number): Promise<PostDTO[]> {
    const posts = await this.postRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return Promise.all(posts.map(p => this.convertToDTO(p)));
  }

  // 게시글 수정
  async updatePost(id: number, userId: number, requestDTO: PostRequestDTO): Promise<PostDTO> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    if (post.userId !== userId) {
      throw new Error('게시글 수정 권한이 없습니다.');
    }

    if (requestDTO.title) {
      post.title = requestDTO.title;
    }
    if (requestDTO.content) {
      post.content = requestDTO.content;
    }

    const updated = await this.postRepository.save(post);
    return this.convertToDTO(updated);
  }

  // 게시글 삭제 (댓글 먼저 삭제, Spring과 동일)
  async deletePost(id: number, userId: number): Promise<void> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    if (post.userId !== userId) {
      throw new Error('게시글 삭제 권한이 없습니다.');
    }

    // 1. 댓글 먼저 삭제
    await this.commentRepository.delete({ postId: id });

    // 2. 게시글 삭제
    await this.postRepository.delete(id);
  }

  // 좋아요 토글 (미구현, Spring과 동일)
  async toggleLike(id: number, userId: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    
    // 현재 좋아요 수 토글 (단순히 카운트 증감)
    post.likeCount = post.likeCount + 1; // Spring Boot와 동일한 단순 증가
    
    return await this.postRepository.save(post);
  }

  private async convertToDTO(post: Post): Promise<PostDTO> {
    // 댓글 수 계산 (Spring과 동일)
    const commentCount = await this.commentRepository.count({ where: { postId: post.id } });

    return {
      id: post.id,
      userId: post.userId,
      title: post.title,
      content: post.content,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
