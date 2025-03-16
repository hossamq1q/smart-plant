import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUsersService } from './users';
import { User } from 'src/utils/typeorm';
import { signUpPayload } from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from '../utils/helpers';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUser(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async createUser(payload: signUpPayload): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: payload.email },
    });
    if (existingUser)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    const hashedPassword = await hashPassword(payload.password);
    const newUser = this.userRepository.create({
      ...payload,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }
}
