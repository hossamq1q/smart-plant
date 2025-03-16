import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPestsService } from './pests';
import { annotatedImage, annotatedVideo } from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Pests } from '../utils/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as process from 'node:process';
import { predict } from '../utils/helpers';

@Injectable()
export class PestsService implements IPestsService {
  constructor(
    @InjectRepository(Pests)
    private readonly pestsRepository: Repository<Pests>,
  ) {}

  private async getDetailsAboutPests(pestsNames: string[]) {
    return await Promise.all(
      pestsNames.map(async (name: string) => {
        const pest = await this.pestsRepository.findOne({
          where: { englishName: name },
        });
        if (!pest) {
          throw new HttpException(
            `Pest not found: ${name}`,
            HttpStatus.NOT_FOUND,
          );
        }
        return pest;
      }),
    );
  }

  async annotateImage(image: Express.Multer.File): Promise<annotatedImage> {
    if (!image) {
      throw new HttpException('Image required', HttpStatus.BAD_REQUEST);
    }
    try {
      const prediction = await predict(
        image.buffer,
        'http://127.0.0.1:8000/detect/image',
        'image',
        'image.jpg',
      );
      const imageUrl = path.posix.join(
        process.env.BASE_URL.toString(),
        'annotatedImages',
        prediction['imageUrl'],
      );
      const pestsDetected = await this.getDetailsAboutPests(
        prediction['pestsDetected'],
      );
      return {
        imageUrl: imageUrl,
        pestsDetected: pestsDetected,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Annotation failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async annotateVideo(video: Express.Multer.File): Promise<annotatedVideo> {
    if (!video) {
      throw new HttpException('Video required', HttpStatus.BAD_REQUEST);
    }
    try {
      const prediction = await predict(
        video.buffer,
        'http://127.0.0.1:8000/detect/video',
        'video',
        'video.mp4',
      );
      const pestsDetected = await this.getDetailsAboutPests(
        prediction['pestsDetected'],
      );
      return {
        videoUrl: prediction['videoUrl'],
        pestsDetected: pestsDetected,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Annotation failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
