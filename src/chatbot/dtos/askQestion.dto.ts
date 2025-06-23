import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class askQuestionDto {
  @IsString()
  @IsOptional()
  question: string;
}