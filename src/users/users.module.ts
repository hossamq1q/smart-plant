import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../utils/typeorm';
import { Services } from '../utils/constans';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [{ provide: Services.USERS, useClass: UsersService }],
  exports:[{ provide: Services.USERS, useClass: UsersService }]
})
export class UsersModule {}
