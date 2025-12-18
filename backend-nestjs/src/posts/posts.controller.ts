import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PostsService } from './posts.service';
import { CommentsService } from '../comments/comments.service';
import { PostRequestDTO } from './dto/post.dto';
import { CommentDTO } from '../comments/dto/comment.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 게시글 작성 (Spring PostController와 동일)
  @Post()
  async createPost(@Body() requestDTO: PostRequestDTO) {
    try {
      if (!requestDTO.userId) {
        throw new HttpException(
          {
            success: false,
            message: '사용자 ID가 필요합니다.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const post = await this.postsService.createPost(requestDTO.userId, requestDTO);
      return {
        success: true,
        message: '게시글이 성공적으로 작성되었습니다.',
        data: post,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          message: '게시글 작성 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 모든 게시글 조회
  @Get()
  async getAllPosts() {
    try {
      const posts = await this.postsService.getAllPosts();
      return { success: true, data: posts };
    } catch (error: any) {
      throw new HttpException(
        { success: false, message: '게시글 조회 실패', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 페이지네이션으로 게시글 조회 (Spring과 동일)
  @Get('pagination')
  async getPostsWithPagination(
    @Query('page') page = '0',
    @Query('size') size = '10',
  ) {
    try {
      const pageNum = parseInt(page, 10);
      const pageSize = parseInt(size, 10);
      const posts = await this.postsService.getPostsWithPagination(
        pageNum,
        pageSize,
      );
      return { success: true, data: posts };
    } catch (error: any) {
      throw new HttpException(
        { success: false, message: '게시글 조회 실패', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ID로 특정 게시글 조회
  @Get(':id')
  async getPost(@Param('id') id: string) {
    try {
      const postId = parseInt(id, 10);
      const post = await this.postsService.getPost(postId);
      return { success: true, data: post };
    } catch (error: any) {
      throw new HttpException(
        { success: false, message: '게시글을 찾을 수 없습니다.', error: error.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // 사용자별 게시글 조회
  @Get('user/:userId')
  async getUserPosts(@Param('userId') userId: string) {
    try {
      const userIdNum = parseInt(userId, 10);
      const posts = await this.postsService.getUserPosts(userIdNum);
      return { success: true, data: posts };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          message: '사용자 게시글 조회 실패',
          error: error instanceof Error ? error.message : String(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 게시글 수정
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() requestDTO: PostRequestDTO,
  ) {
    try {
      const postId = parseInt(id, 10);
      if (!requestDTO.userId) {
        throw new HttpException(
          {
            success: false,
            message: '사용자 ID가 필요합니다.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const post = await this.postsService.updatePost(postId, requestDTO.userId, requestDTO);
      return {
        success: true,
        message: '게시글이 성공적으로 수정되었습니다.',
        data: post,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          message: '게시글 수정 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 게시글 삭제
  @Delete(':id')
  async deletePost(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    try {
      const postId = parseInt(id, 10);
      const userIdNum = parseInt(userId, 10);
      await this.postsService.deletePost(postId, userIdNum);
      return {
        success: true,
        message: '게시글이 성공적으로 삭제되었습니다.',
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          message: '게시글 삭제 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 특정 게시글의 댓글 조회
  @Get(':postId/comments')
  async getCommentsByPost(@Param('postId') postId: string) {
    try {
      const postIdNum = parseInt(postId, 10);
      const comments = await this.commentsService.getCommentsByPost(
        postIdNum,
      );
      return { success: true, data: comments };
    } catch (error: any) {
      throw new HttpException(
        { success: false, message: '댓글 조회 실패', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 댓글 작성
  @Post(':postId/comments')
  async createComment(
    @Param('postId') postId: string,
    @Body() commentDTO: CommentDTO,
  ) {
    try {
      const postIdNum = parseInt(postId, 10);
      const comment = await this.commentsService.createComment(
        postIdNum,
        commentDTO.userId,
        commentDTO.content,
      );
      return {
        success: true,
        message: '댓글이 성공적으로 작성되었습니다.',
        data: comment,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          message: '댓글 작성 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 좋아요 토글
  @Put(':id/like')
  async toggleLike(@Param('id') id: string, @Query('userId') userId: string) {
    try {
      const postId = parseInt(id, 10);
      const userIdNum = parseInt(userId, 10);
      const result = await this.postsService.toggleLike(postId, userIdNum);
      return { success: true, data: result };
    } catch (error: any) {
      throw new HttpException(
        { success: false, message: '좋아요 처리 실패', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}