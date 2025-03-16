import { Module } from '@nestjs/common';
import { PestsController } from './pests.controller';
import { PestsService } from './pests.service';
import { Services } from '../utils/constans';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pests } from '../utils/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pests]),
  ],
  controllers: [PestsController],
  providers: [{ provide: Services.PESTS, useClass: PestsService }],
})
export class PestsModule {}
