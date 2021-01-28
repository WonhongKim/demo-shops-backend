import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtService } from 'src/jwt/jwt.service';
import { UpdateAccountInput } from './dtos/update-account.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly configservice: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    name,
    role,
  }: CreateAccountInput): Promise<string | undefined> {
    try {
      const checker = await this.users.findOne({ email });
      if (checker) {
        return 'error';
      }
      await this.users.save(this.users.create({ email, password, name, role }));
    } catch (e) {
      return 'error';
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return {
          result: false,
          error: 'There is no User',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          result: false,
          error: 'Wrong password',
        };
      }
      const token = this.jwtService.sign({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      return {
        result: true,
        token,
      };
    } catch (e) {
      return {
        result: false,
        error: "Can't log user in.",
      };
    }
  }

  async findById(id: number): Promise<User> {
    return await this.users.findOne({ id });
  }

  async updateAcccount(
    userId: number,
    { email, password, name }: UpdateAccountInput,
  ): Promise<User> {
    const user = await this.users.findOne(userId);
    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = password;
    }
    if (name) {
      user.name = name;
    }
    return this.users.save(user);
  }
}
