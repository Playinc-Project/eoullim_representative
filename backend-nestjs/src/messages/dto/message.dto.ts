export class MessageDTO {
  id: number;
  senderId: number;
  senderName: string;
  recipientId: number;
  recipientName: string;
  content: string;
  createdAt: Date;
}
