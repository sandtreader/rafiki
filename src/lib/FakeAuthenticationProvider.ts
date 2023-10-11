// Rafiki FakeAuthenticationProvider - fake auth
// Copyright (c) Paul Clark 2022

import AuthenticationProvider from './AuthenticationProvider';
import SessionState from './SessionState';

/** Fake Authentication provider */
export default class FakeAuthenticationProvider
  implements AuthenticationProvider
{
  /** Try to log in
   * @returns Session state if successful, error string if not
   */
  async login(userId: string, password: string): Promise<SessionState> {
    // Optimistic
    const session = new SessionState(true, userId);

    // POST to URL
    if (userId === 'admin' && password === 'admin') {
      session.userName = 'Joe Admin';
      session.capabilities = ['.*'];
    } else if (userId === 'test' && password === 'foo') {
      session.userName = 'Test User';
      session.capabilities = ['^test.*'];
    } else {
      session.loggedIn = false;
      session.error = 'Authentication failed';
    }
    return session;
  }

  /** Log out */
  async logout(session: SessionState) {
    console.log('Logged out');
    session.loggedIn = false;
  }
}
