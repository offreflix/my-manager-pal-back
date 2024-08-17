import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/user.dto';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

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
    try {
      const user = await this.usersService.findOne(username, true);

      if (!user) {
        throw new UnauthorizedException("User or password doesn't match");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new UnauthorizedException("User or password doesn't match");
      }

      const payload = { sub: user.userId, user: user.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
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

  async getProfile(req: Request) {
    const token = req.cookies['myManagerPal.token'];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const decodedToken = this.jwtService.verify(token);

    console.log(decodedToken);

    try {
      const user = await this.usersService.findOne(decodedToken.user);
      if (!user) {
        throw new UnauthorizedException("User or password doesn't match");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
