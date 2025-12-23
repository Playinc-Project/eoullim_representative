import { IsString, IsNotEmpty, IsNumber, IsOptional, MaxLength, MinLength } from 'class-validator';

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
  @IsNumber({}, { message: '사용자 ID는 숫자여야 합니다.' })
  @IsNotEmpty({ message: '사용자 ID는 필수입니다.' })
  userId: number;

  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제목은 필수입니다.' })
  @MinLength(1, { message: '제목은 최소 1자 이상이어야 합니다.' })
  @MaxLength(255, { message: '제목은 최대 255자까지 가능합니다.' })
  title: string;

  @IsString({ message: '내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '내용은 필수입니다.' })
  @MinLength(1, { message: '내용은 최소 1자 이상이어야 합니다.' })
  content: string;
}
