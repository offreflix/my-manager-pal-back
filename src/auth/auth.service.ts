import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/user.dto';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException("User or password doesn't match");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(data: CreateUserDto) {
    try {
      if (await this.usersService.findOne(data.username)) {
        throw new BadRequestException('Username already exists');
      }

      if (await this.usersService.findOneByEmail(data.email)) {
        throw new BadRequestException('Email already exists');
      }

      return this.usersService.createUser(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
