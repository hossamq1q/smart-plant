import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Routes, Services } from "../utils/constans";
import { IDiseaseService } from "./disease";

@Controller(Routes.DISEASE)
export class DiseaseController {
  constructor(
    @Inject(Services.DISEASE) private readonly diseaseService: IDiseaseService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async getDisease(@UploadedFile() image: Express.Multer.File) {
    return this.diseaseService.getDisease(image);
  }
}
