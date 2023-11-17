import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateReviewDTO {
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
