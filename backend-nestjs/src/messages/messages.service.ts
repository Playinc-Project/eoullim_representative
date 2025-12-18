import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { MessageDTO } from './dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 메시지 보내기
  async send(
    senderId: number,
    recipientId: number,
    content: string,
  ): Promise<MessageDTO> {
    if (!content?.trim()) {
      throw new Error('메시지 내용을 입력해주세요.');
    }

    const sender = await this.userRepository.findOneBy({ id: senderId });
    if (!sender) {
      throw new Error('발신자를 찾을 수 없습니다.');
    }

    const recipient = await this.userRepository.findOneBy({ id: recipientId });
    if (!recipient) {
      throw new Error('수신자를 찾을 수 없습니다.');
    }

    const message = this.messageRepository.create({
      senderId,
      recipientId,
      content,
    });

    const saved = await this.messageRepository.save(message);

    return {
      id: saved.id,
      senderId: sender.id,
      senderName: sender.username,
      recipientId: recipient.id,
      recipientName: recipient.username,
      content: saved.content,
      createdAt: saved.createdAt,
    };
  }

  // 받은 쪽지
  async getReceived(userId: number): Promise<MessageDTO[]> {
    const messages = await this.messageRepository.find({
      where: { recipientId: userId },
      order: { createdAt: 'DESC' },
    });

    return Promise.all(messages.map((m) => this.toDTO(m)));
  }

  // 보낸 쪽지
  async getSent(userId: number): Promise<MessageDTO[]> {
    const messages = await this.messageRepository.find({
      where: { senderId: userId },
      order: { createdAt: 'DESC' },
    });

    return Promise.all(messages.map((m) => this.toDTO(m)));
  }

  // 메시지 삭제
  async delete(messageId: number, userId: number): Promise<void> {
    const message = await this.messageRepository.findOneBy({ id: messageId });
    if (!message) {
      throw new Error('메시지를 찾을 수 없습니다.');
    }

    if (message.senderId !== userId && message.recipientId !== userId) {
      throw new Error('삭제 권한이 없습니다.');
    }

    await this.messageRepository.delete(messageId);
  }

  private async toDTO(message: Message): Promise<MessageDTO> {
    const sender = await this.userRepository.findOneBy({
      id: message.senderId,
    });
    const recipient = await this.userRepository.findOneBy({
      id: message.recipientId,
    });

    return {
      id: message.id,
      senderId: message.senderId,
      senderName: sender?.username || '',
      recipientId: message.recipientId,
      recipientName: recipient?.username || '',
      content: message.content,
      createdAt: message.createdAt,
    };
  }
}