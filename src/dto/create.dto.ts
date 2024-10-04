import { IsNumber, Min } from 'class-validator';

export class CreateDto {
  @Min(10)
  @IsNumber()
  num: number;
}
