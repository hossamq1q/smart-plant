import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiseaseModule } from './disease/disease.module';
import { PestsModule } from './pests/pests.module';
import entities from './utils/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { VideosModule } from './videos/videos.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'pestsAnnotated'),
      serveRoot: '/pestsAnnotated',
      exclude: ['/api*'],
      serveStaticOptions: {
        index: false,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_DB_HOST,
      port: parseInt(process.env.MYSQL_DB_PORT),
      username: process.env.MYSQL_DB_USERNAME,
      password: process.env.MYSQL_DB_PASSWORD,
      database: process.env.MYSQL_DB_DATABASE,
      entities: entities,
      synchronize: true,
      logging: false,
    }),
    DiseaseModule,
    PestsModule,
    VideosModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
