import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class AddProductDto {
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @MaxLength(255, { message: 'Max 400 characters length' })
  name: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Min(1)
  price: number;
}
