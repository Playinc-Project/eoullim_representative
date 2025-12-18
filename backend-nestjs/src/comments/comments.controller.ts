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

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 댓글 생성: POST /api/comments?postId=X&userId=Y
  @Post()
  async createComment(
    @Query('postId') postId: string,
    @Query('userId') userId: string,
    @Body() commentDTO: CommentDTO,
  ) {
    try {
      return await this.commentsService.createComment(
        +postId,
        +userId,
        commentDTO.content,
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
    @Body() commentDTO: CommentDTO,
  ) {
    try {
      return await this.commentsService.updateComment(
        +id,
        +userId,
        commentDTO.content,
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