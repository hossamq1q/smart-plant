import { annotatedImage, annotatedVideo } from "../utils/types";

export interface IPestsService {
  annotateImage(image:Express.Multer.File): Promise<annotatedImage>;
  annotateVideo(video:Express.Multer.File): Promise<annotatedVideo>;
}