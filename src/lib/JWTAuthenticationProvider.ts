// Rafiki JWTAuthenticationProvider - HTTP POST auth generating a JWT
// Copyright (c) Paul Clark 2023

import AuthenticationProvider from './AuthenticationProvider';
import SessionState from './SessionState';

/** JWT Authentication Provider */
export default class JWTAuthenticationProvider
  implements AuthenticationProvider
{
  /** Login URL */
  private readonly url: string;

  /** Constructor */
  constructor(url: string) {
    this.url = url;
  }

  /** Try to log in
   * @returns Session state if successful, error string if not
   */
  async login(userId: string, password: string): Promise<SessionState> {
    // Optimistic
    const session: SessionState = { loggedIn: true, userId: userId };

    const data = new URLSearchParams({
      username: userId,
      password: password,
    });

    try {
      const response = await window.fetch(this.url, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.jwt) {
          console.log(`Logged in OK`);
          session.jwt = json.jwt;
          if (Array.isArray(json.caps)) session.capabilities = json.caps;
          return session;
        } else console.error(`Login failed: ${json.error}`);
      } else
        console.error(
          `Login failed: ${response.status} ${response.statusText}`
        );
    } catch (e: any) {
      console.error(`Login request failed: ${e}`);
    }

    session.loggedIn = false;
    session.error = 'Authentication failed';
    return session;
  }

  /** Log out */
  async logout(session: SessionState) {
    console.log('Logged out');
    session.loggedIn = false;
  }
}
