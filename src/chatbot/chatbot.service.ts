import { Injectable } from '@nestjs/common';
import { IChatbotService } from './chatbot';
import { chatbotParams, chatbotResponse } from 'src/utils/types';
import { askChatbot, predictDiseaseForChatbot } from '../utils/helpers';

@Injectable()
export class ChatbotService implements IChatbotService {
  async ask(params: chatbotParams): Promise<chatbotResponse> {
    if (params.image) {
      const response = await predictDiseaseForChatbot(
        params.image.buffer,
        'http://127.0.0.1:8080/predict',
        'image',
        'image.jpg',
      );
      console.log(response)
      return askChatbot(response);
    } else {
      return askChatbot(params.question);
    }
  }
}
