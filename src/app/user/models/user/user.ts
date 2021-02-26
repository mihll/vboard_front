export class User {
  public readonly userId: number;
  public readonly email: string;
  public readonly password: string;
  public readonly profileImgUrl: string;
  public readonly enabled: boolean;
  public readonly signupDate: Date;
  public readonly userType: string;
}

export interface UserSignupRequest {
  email: string;
  password: string;
  userType: string;
}

