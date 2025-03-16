import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constans';
import { IPestsService } from './pests';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, videoMulterOptions } from '../utils/multerConfigration';

@Controller(Routes.PESTS)
export class PestsController {
  constructor(
    @Inject(Services.PESTS) private readonly pestsService: IPestsService,
  ) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  pestsImage(@UploadedFile() image: Express.Multer.File) {
    return this.pestsService.annotateImage(image);
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('video', videoMulterOptions))
  pestsVideo(@UploadedFile() video: Express.Multer.File) {
    return this.pestsService.annotateVideo(video);
  }
}
