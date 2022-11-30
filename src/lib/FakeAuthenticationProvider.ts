// Rafiki FakeAuthenticationProvider - fake auth
// Copyright (c) Paul Clark 2022

import AuthenticationProvider from './AuthenticationProvider';
import SessionState from './SessionState';

/** Menu provider interface */
export default class FakeAuthenticationProvider implements AuthenticationProvider {
  /** Try to log in
   * @returns Session state if successful, error string if not
   */
  login(userId: string, password: string): SessionState {
    // Optimistic
    const session: SessionState = { loggedIn: true, userId: userId };

    if (userId === "admin" && password == "admin") {
      session.userName = "Joe Admin";
      session.capabilities = ["*"];
    }
    else if (userId === "test" && password == "foo") {
      session.userName = "Test User";
      session.capabilities = ["test.*"];
    }
    else {
      session.loggedIn = false;
      session.error = "Authentication failed";
    }
    return session;
  }

  /** Log out */
  logout(session: SessionState) {
    console.log("Logged out");
    session.loggedIn = false;
  }
}
