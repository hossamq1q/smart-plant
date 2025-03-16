import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IDiseaseService } from './disease';
import { Disease } from 'src/utils/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { predict } from '../utils/helpers';

@Injectable()
export class DiseaseService implements IDiseaseService {
  constructor(
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
  ) {}

  async getDisease(image: Express.Multer.File): Promise<Disease> {
    if (!image) {
      throw new HttpException('image required', HttpStatus.NOT_FOUND);
    }
    const prediction = await predict(
      image.buffer,
      'http://127.0.0.1:8080/predict',
      'image',
      'image.jpg',
    );
    return await this.diseaseRepository.findOne({
      where: { englishName: prediction['prediction'] },
    });
  }
}
