import { chatbotParams, chatbotResponse } from '../utils/types';

export interface IChatbotService {
  ask(params: chatbotParams): Promise<chatbotResponse>;
}
