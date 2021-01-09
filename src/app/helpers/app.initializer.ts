import { AuthenticationService } from '../services/authentication/authentication.service';

export function appInitializer(authenticationService: AuthenticationService): () => Promise<unknown> {
  return () => new Promise(resolve => {
    // attempt to refresh token on app start up to auto authenticate
    authenticationService.refreshToken()
      .subscribe()
      .add(resolve);
  });
}
