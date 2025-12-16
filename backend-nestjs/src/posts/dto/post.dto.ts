export class PostDTO {
  id: number;
  userId: number;
  title: string;
  content: string;
  viewCount: number;
  likeCount: number;
  commentCount: number; // 댓글 수 포함
  createdAt: Date;
  updatedAt: Date;
}

export class PostRequestDTO {
  userId?: number;
  title?: string;
  content?: string;
}
