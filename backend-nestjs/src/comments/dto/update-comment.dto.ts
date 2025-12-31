import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCommentDTO {
  @IsString()
  @IsNotEmpty()
  content: string;
}
