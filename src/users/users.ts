import { User } from '../utils/typeorm';
import { signUpPayload } from "../utils/types";

export interface IUsersService {
  createUser(payload:signUpPayload):Promise<User>;
  findUser(email:string):Promise<User>;
}
