import {
  Body,
  Controller,
  HttpException,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constans';
import { IChatbotService } from './chatbot';
import { FileInterceptor } from '@nestjs/platform-express';
import { askQuestionDto } from './dtos/askQestion.dto';
import { HttpStatusCode } from 'axios';

@Controller(Routes.CHATBOT)
export class ChatbotController {
  constructor(
    @Inject(Services.CHATBOT) private readonly chatbotService: IChatbotService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async askQuestion(
    @UploadedFile() file: Express.Multer.File,
    @Body() { question: query }: askQuestionDto,
  ) {
    try {
      const params = {image:file , question:query}
      return await this.chatbotService.ask(params)
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatusCode.ExpectationFailed);
    }
  }
}
