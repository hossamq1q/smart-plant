import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constans';
import { IAuthService } from './auth';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signUp.dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) {}

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() loginUserDto: LoginDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  async signUp(@Body() signUpUserDto: SignupDto) {
    return await this.authService.signUp(signUpUserDto);
  }
}
