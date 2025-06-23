import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { Services } from '../utils/constans';
import { MulterModule } from "@nestjs/platform-express";
import { multerOptions } from "../utils/multerConfigration";

@Module({
  imports:[MulterModule.register(multerOptions)],
  controllers: [ChatbotController ],
  providers: [{ provide: Services.CHATBOT, useClass: ChatbotService }],
})
export class ChatbotModule {}
