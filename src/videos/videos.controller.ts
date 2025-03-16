import { Controller, Get, Inject, Headers, Param, Res } from '@nestjs/common';
import { IVideosService } from './videos';
import { Routes, Services } from "../utils/constans";
import { Response } from 'express';

@Controller(Routes.VIDEOS)
export class VideosController {
  constructor(
    @Inject(Services.VIDEOS) private readonly videosService: IVideosService,
  ) {}

  @Get(':videoName')
  async streamVideo(
    @Param('videoName') videoName: string,
    @Headers('range') range: string,
    @Res() res: Response,
  ) {
    return this.videosService.streamVideo(videoName, range, res);
  }
}
