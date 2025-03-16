import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { statSync, createReadStream } from 'fs';
import { lookup } from 'mime-types';

@Injectable()
export class VideosService {
  private readonly videoPath: string;

  constructor() {
    this.videoPath = join(process.cwd(), 'pestsAnnotated/annotatedVideos');
  }

  async streamVideo(
    videoName: string,
    range: string | undefined,
    res: Response,
  ) {
    try {
      const videoPath = join(this.videoPath, videoName);
      const stats = statSync(videoPath);
      const fileSize = stats.size;

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader(
        'Access-Control-Expose-Headers',
        'Content-Range, Content-Length',
      );

      if (!range) {
        res.setHeader('Content-Length', fileSize);
        return createReadStream(videoPath).pipe(res);
      }

      const CHUNK_SIZE = 10 ** 6; // 1MB
      const start = Number(range.replace(/\D/g, ''));
      const end = Math.min(start + CHUNK_SIZE, fileSize - 1);

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': end - start + 1,
      });

      const videoStream = createReadStream(videoPath, { start, end });
      videoStream.pipe(res);
    } catch (error) {
      console.error(`Error streaming video: ${error.message}`);
      res.status(404).send('Video not found');
    }
  }
}
