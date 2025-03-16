import { Disease } from '../utils/typeorm';

export interface IDiseaseService {
  getDisease(image: Express.Multer.File): Promise<Disease>;
}
