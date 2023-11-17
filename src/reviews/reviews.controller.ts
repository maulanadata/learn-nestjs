import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { HttpStatusCode } from 'axios';
import { CreateReviewDTO } from './dto/create-review.dto';
import { UpdateReviewDTO } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewService: ReviewsService) {}

  @Get()
  async getAllReviews() {
    const [data, count] = await this.reviewService.findAllReviews();

    return {
      statusCode: HttpStatusCode.Ok,
      messae: 'Success',
      data,
      count,
    };
  }

  @Get(':id')
  async getReviewById(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.reviewService.findReviewById(id);

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'Success',
      data,
    };
  }

  @Post()
  async createReview(@Body() paloads: CreateReviewDTO) {
    const datas = await this.reviewService.createReview(paloads);

    return {
      statusCode: HttpStatusCode.Created,
      message: 'Success',
      data: datas,
    };
  }

  @Put(':id')
  async updateReview(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() paloads: UpdateReviewDTO,
  ) {
    const datas = await this.reviewService.updateReview(id, paloads);

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'Success',
      data: datas,
    };
  }

  @Delete(':id')
  async deleteReview(@Param('id', ParseUUIDPipe) id: string) {
    const datas = await this.reviewService.deleteReview(id);

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'Success',
      data: datas,
    };
  }
}
