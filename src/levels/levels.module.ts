import { Module } from '@nestjs/common';
import { Level } from './entities/level.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Level])],
})
export class LevelsModule {}
