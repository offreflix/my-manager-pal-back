import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    try {
      const user = this.prisma.user.create({
        data,
      });

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
