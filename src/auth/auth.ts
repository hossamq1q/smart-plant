import { loginPayload, signUpPayload } from '../utils/types';
import { User } from "../utils/typeorm";

export interface IAuthService {
  login(payload: loginPayload): Promise<User>;

  signUp(payload: signUpPayload): Promise<User>;
}
