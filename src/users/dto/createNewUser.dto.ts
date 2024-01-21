import { User } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateNewUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: User['firstName'];

  @IsString()
  @IsNotEmpty()
  lastName: User['lastName'];

  @IsEmail()
  @IsNotEmpty()
  email: User['email'];

  @IsStrongPassword()
  @IsNotEmpty()
  password: User['password'];
}
