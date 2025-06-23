import * as FormData from "form-data";
import axios from "axios";
import { HttpException, HttpStatus } from "@nestjs/common";
import * as bcrypt from "bcrypt";

export async function predict(
  image: Buffer,
  url: string,
  fieldName: string,
  fileName: string
) {
  try {
    const formData = new FormData();
    formData.append(fieldName, image, { filename: fileName });
    const response = await axios.post(url, formData, {
      headers: formData.getHeaders()
    });
    return response.data;
  } catch (error) {
    const detail =
      error?.response?.data?.detail || error.message || "Ai server is unavailable";
    throw new HttpException({ detail }, HttpStatus.BAD_GATEWAY);
  }
}

export async function predictDiseaseForChatbot(
  image: Buffer,
  url: string,
  fieldName: string,
  fileName: string
) {
  try {
    const formData = new FormData();
    formData.append(fieldName, image, { filename: fileName });
    const response = await axios.post(url, formData, {
      headers: formData.getHeaders()
    });
    return response.data.prediction;
  } catch (error) {
    return error?.response?.data?.detail || error.message || "Ai server is unavailable";
  }
}

export async function askChatbot(query: string): Promise<any> {
  try {
    const response = await axios.post('http://127.0.0.1:9090/ask', {
      question: query,
    });
    return response.data;
  } catch (error: any) {
    const detail =
      error?.response?.data?.detail || error.message || 'Chatbot server is unavailable';
    throw new HttpException({ detail }, HttpStatus.BAD_GATEWAY);
  }
}

export async function hashPassword(rawPassword: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(rawPassword, salt);
}

export async function compareHash(rawPassword: string, hashPassword: string) {
  return await bcrypt.compare(rawPassword, hashPassword);
}
