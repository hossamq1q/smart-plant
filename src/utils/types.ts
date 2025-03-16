import { Pests } from './typeorm';

export type annotatedImage = {
  pestsDetected: Pests[];
  imageUrl: string;
};

export type annotatedVideo = {
  pestsDetected: Pests[];
  videoUrl: string;
};

export type loginPayload = {
  email: string;
  password: string;
};

export type signUpPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
