import {User, UserSignupRequest} from './user';

export class PersonUser extends User {
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly birthDate: Date;
}

export interface PersonUserSignupRequest extends UserSignupRequest {
  firstName: string;
  lastName: string;
}

export interface PersonUserUpdateRequest {
  firstName: string;
  lastName: string;
  birthDate: Date;
  userType: string;
}
