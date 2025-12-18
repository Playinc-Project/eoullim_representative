import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // 메시지 보내기: POST /api/messages?senderId=X&recipientId=Y
  @Post()
  async send(
    @Query('senderId') senderId: string,
    @Query('recipientId') recipientId: string,
    @Body() body: { content?: string },
  ) {
    try {
      const content = body?.content;
      if (!content) {
        throw new HttpException({ error: 'Content is required' }, HttpStatus.BAD_REQUEST);
      }
      return await this.messagesService.send(+senderId, +recipientId, content);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '메시지 전송에 실패했습니다.';
      throw new HttpException({ error: message }, HttpStatus.BAD_REQUEST);
    }
  }

  // 받은 쪽지: GET /api/messages/received/{userId}
  @Get('received/:userId')
  async received(@Param('userId') userId: string) {
    return this.messagesService.getReceived(+userId);
  }

  // 보낸 쪽지: GET /api/messages/sent/{userId}
  @Get('sent/:userId')
  async sent(@Param('userId') userId: string) {
    return this.messagesService.getSent(+userId);
  }

  // 메시지 삭제: DELETE /api/messages/{id}?userId=X
  @Delete(':id')
  async delete(@Param('id') id: string, @Query('userId') userId: string) {
    try {
      await this.messagesService.delete(+id, +userId);
      return null;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '메시지 삭제에 실패했습니다.';
      throw new HttpException({ error: message }, HttpStatus.BAD_REQUEST);
    }
  }
}