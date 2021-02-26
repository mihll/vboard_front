export class PasswordChangeRequest {
  readonly newPassword: string;
  readonly currentPassword?: string;
  readonly token?: string;
}
