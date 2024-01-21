import { IsNumber } from 'class-validator';

export class AddOrderDto {
  @IsNumber(undefined, { each: true })
  products: number[];
}
