import { User } from './user';

export class InstitutionUser extends User {
  public readonly institutionName: string;
  public readonly addressCity: string;
  public readonly addressPostCode: string;
  public readonly addressStreet: string;
}

export interface InstitutionUserSignupRequest {
  email: string;
  password: string;
  institutionName: string;
}


