import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() payload: RegisterDTO) {
    const data = await this.authService.register(payload);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: data,
    };
  }

  @Post('login')
  async login(@Body() payload: LoginDTO) {
    const data = await this.authService.login(payload);

    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async profile(@Req() req) {
    return req.user;
  }
}
