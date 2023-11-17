import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { User } from '#/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(payload: RegisterDTO) {
    try {
      const generateSalt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(payload.password, generateSalt);

      const user = new User();
      user.firstName = payload.firstName;
      user.lastName = payload.lastName;
      user.salt = generateSalt;
      user.username = payload.username;
      user.password = hash;

      const savedUser = await this.userRepository.insert(user);

      const userCreated = await this.userRepository.findOneOrFail({
        where: { id: savedUser.identifiers[0].id },
      });

      const { salt, password, ...result } = userCreated;

      return result;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw err;
      }
    }
  }

  async login(payload: LoginDTO) {
    try {
      const user = await this.userRepository.findOne({
        where: { username: payload.username },
      });

      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Username not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const isMatch = await bcrypt.compare(payload.password, user.password);

      if (!isMatch) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Password not match',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const datas = {
        id: user.id,
        username: user.username,
      };

      return { accessToken: this.jwtService.sign(datas) };
    } catch (err) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credential',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
