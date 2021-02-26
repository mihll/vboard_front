import {User, UserSignupRequest} from './user';

export class InstitutionUser extends User {
  public readonly institutionName: string;
  public readonly addressCity: string;
  public readonly addressPostCode: string;
  public readonly addressStreet: string;
}

export interface InstitutionUserSignupRequest extends UserSignupRequest {
  institutionName: string;
}

export interface InstitutionUserUpdateRequest {
  institutionName: string;
  addressCity: string;
  addressPostCode: string;
  addressStreet: string;
  userType: string;
}

