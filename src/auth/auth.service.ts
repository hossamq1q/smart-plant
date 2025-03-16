import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { IAuthService } from './auth';
import { loginPayload, signUpPayload } from 'src/utils/types';
import { Services } from '../utils/constans';
import { IUsersService } from '../users/users';
import { User } from "../utils/typeorm";
import { compareHash } from "../utils/helpers";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS) private readonly usersService: IUsersService,
  ) {}

  async login(payload: loginPayload): Promise<User> {
    const user = await this.usersService.findUser(payload.email)
    if (!user) throw new HttpException('user not found ',HttpStatus.BAD_REQUEST)
    const check =await compareHash(payload.password , user.password);
    if (!check) throw new HttpException('password is not correct',HttpStatus.BAD_REQUEST)
    return user;
  }

  async signUp(payload: signUpPayload): Promise<User> {
    return this.usersService.createUser(payload)
  }
}
