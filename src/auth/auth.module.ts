import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Services } from '../utils/constans';
import { UsersModule } from "../users/users.module";

@Module({
  imports:[UsersModule],
  controllers: [AuthController],
  providers: [{ provide: Services.AUTH, useClass: AuthService }],
})
export class AuthModule {}
