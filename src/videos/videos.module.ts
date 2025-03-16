import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { Services } from '../utils/constans';

@Module({
  controllers: [VideosController],
  providers: [{ provide: Services.VIDEOS, useClass: VideosService }],
})
export class VideosModule {}
