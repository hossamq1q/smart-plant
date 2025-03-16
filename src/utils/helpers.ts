import * as FormData from 'form-data';
import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export async function predict(
  image: Buffer,
  url: string,
  fieldName: string,
  fileName: string,
) {
  try {
    const formData = new FormData();
    formData.append(fieldName, image, { filename: fileName });
    const response = await axios.post(url, formData, {
      headers: formData.getHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new HttpException('AI Server Unavailable', HttpStatus.BAD_GATEWAY);
  }
}

export async function hashPassword(rawPassword: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(rawPassword, salt);
}

export async function compareHash(rawPassword: string, hashPassword: string) {
  return await bcrypt.compare(rawPassword, hashPassword);
}
