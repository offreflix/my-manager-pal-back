import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export type User = any;

function omitPassword(user: User): Omit<User, 'password'> {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    username: string,
    includePassword: boolean = false,
  ): Promise<User | Omit<User, 'password'> | undefined> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (user && !includePassword) {
      return omitPassword(user);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(data.password, salt);

      const user = this.prisma.user.create({
        data: {
          ...data,
          password: hash,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
