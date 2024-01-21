import { Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../persistence/prisma.service';
import { CreateNewUserDto } from './dto/createNewUser.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[],
  ): Omit<User, Key> {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key as Key)),
    ) as Omit<User, Key>;
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findFirst({ where: { email } });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async createUser(userData: CreateNewUserDto) {
    const user = await this.findByEmail(userData.email);
    if (!!user) {
      throw new HttpException(
        'User with provided email already exists',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await hash(userData.password, 12);

    const addedUser = await this.prismaService.user.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
      },
    });
    const userWithoutPassword = this.exclude(addedUser, ['password']);

    return userWithoutPassword;
  }
}
