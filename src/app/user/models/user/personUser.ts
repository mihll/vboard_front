import { User } from './user';

export class PersonUser extends User {
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly birthDate: Date;
}

export interface PersonUserSignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
