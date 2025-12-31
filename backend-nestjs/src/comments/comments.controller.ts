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
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDTO } from './dto/comment.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 댓글 생성: POST /api/comments
  @Post()
  async createComment(
    @Body() body: { postId: number; userId: number; content: string },
  ) {
    try {
      return await this.commentsService.createComment(
        body.postId,
        body.userId,
        body.content,
      );
    } catch (error) {
      throw new HttpException({ error: '댓글 생성에 실패했습니다' }, HttpStatus.BAD_REQUEST);
    }
  }

  // 게시글의 댓글 조회: GET /api/comments/post/{postId}
  @Get('post/:postId')
  async getCommentsByPost(@Param('postId') postId: string) {
    return this.commentsService.getCommentsByPost(+postId);
  }

  // 댓글 수정: PUT /api/comments/{id}?userId=X
  @Put(':id')
  async updateComment(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() updateCommentDTO: UpdateCommentDTO,
  ) {
    try {
      return await this.commentsService.updateComment(
        +id,
        +userId,
        updateCommentDTO.content,
      );
    } catch (error) {
      throw new HttpException({ error: '댓글 수정에 실패했습니다' }, HttpStatus.BAD_REQUEST);
    }
  }

  // 댓글 삭제: DELETE /api/comments/{id}?userId=X
  @Delete(':id')
  async deleteComment(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    try {
      await this.commentsService.deleteComment(+id, +userId);
      return null;
    } catch (error) {
      throw new HttpException({ error: '댓글 삭제에 실패했습니다' }, HttpStatus.BAD_REQUEST);
    }
  }
}