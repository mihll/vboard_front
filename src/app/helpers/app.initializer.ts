import { AuthenticationService } from '../authentication/services/authentication-service/authentication.service';

export function appInitializer(authenticationService: AuthenticationService): () => Promise<unknown> {
  return () => new Promise(resolve => {
    // attempt to refresh token on app start up to auto authenticate
    authenticationService.refreshToken()
      .subscribe()
      .add(resolve);
  });
}
