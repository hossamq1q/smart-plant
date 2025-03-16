import { Module } from '@nestjs/common';
import { DiseaseController } from './disease.controller';
import { DiseaseService } from './disease.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from '../utils/multerConfigration';
import { Services } from '../utils/constans';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disease } from '../utils/typeorm';

@Module({
  imports: [
    MulterModule.register(multerOptions),
    TypeOrmModule.forFeature([Disease]),
  ],
  controllers: [DiseaseController],
  providers: [{ provide: Services.DISEASE, useClass: DiseaseService }],
})
export class DiseaseModule {}
