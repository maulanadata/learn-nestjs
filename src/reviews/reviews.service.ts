import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reviews } from './entities/reviews.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateReviewDTO } from './dto/create-review.dto';
import { UsersService } from '#/users/users.service';
import { UpdateReviewDTO } from './dto/update-review.dto';
import { HttpStatusCode } from 'axios';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
    private userService: UsersService,
  ) {}

  findAllReviews() {
    return this.reviewsRepository.findAndCount({
      relations: {
        user: true,
      },
    });
  }

  async findReviewById(id: string) {
    try {
      return await this.reviewsRepository.findOneOrFail({ where: { id } });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        return {
          statusCode: HttpStatusCode.NotFound,
          error: 'Data not found',
        };
      } else {
        throw err;
      }
    }
  }

  async createReview(payloads: CreateReviewDTO) {
    try {
      const findUserId = await this.userService.findOne(payloads.userId);
      const reviewEntity = new Reviews();
      reviewEntity.rating = payloads.rating;
      reviewEntity.content = payloads.content;
      reviewEntity.user = findUserId;

      const insertReview = await this.reviewsRepository.insert(reviewEntity);

      return this.reviewsRepository.findOneOrFail({
        where: {
          id: insertReview.identifiers[0].id,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async updateReview(id: string, payloads: UpdateReviewDTO) {
    try {
      await this.findReviewById(id);

      const reviewEntity = new Reviews();
      reviewEntity.rating = payloads.rating;
      reviewEntity.content = payloads.content;

      await this.reviewsRepository.update(id, payloads);

      return await this.reviewsRepository.findOneOrFail({ where: { id } });
    } catch (err) {
      throw err;
    }
  }

  async deleteReview(id: string) {
    try {
      await this.findReviewById(id);
      return await this.reviewsRepository.softDelete(id);
    } catch (err) {
      throw err;
    }
  }
}
