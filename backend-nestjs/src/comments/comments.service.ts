import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { CommentDTO } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 댓글 생성
  async createComment(
    postId: number,
    userId: number,
    content: string,
  ): Promise<CommentDTO> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const comment = this.commentRepository.create({
      postId,
      userId,
      content,
    });

    const saved = await this.commentRepository.save(comment);
    return this.convertToDTO(saved);
  }

  // 게시글의 댓글 조회
  async getCommentsByPost(postId: number): Promise<CommentDTO[]> {
    const comments = await this.commentRepository.find({
      where: { postId },
      order: { createdAt: 'ASC' },
    });

    return comments.map((c) => this.convertToDTO(c));
  }

  // 댓글 수정
  async updateComment(
    id: number,
    userId: number,
    content: string,
  ): Promise<CommentDTO> {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new Error('댓글 수정 권한이 없습니다.');
    }

    comment.content = content;
    const updated = await this.commentRepository.save(comment);
    return this.convertToDTO(updated);
  }

  // 댓글 삭제
  async deleteComment(id: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new Error('댓글 삭제 권한이 없습니다.');
    }

    await this.commentRepository.delete(id);
  }

  private convertToDTO(comment: Comment): CommentDTO {
    return {
      id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}