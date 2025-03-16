import { Response } from 'express';

export interface IVideosService {
  streamVideo(videoName: string, range: string, res: Response);
}
