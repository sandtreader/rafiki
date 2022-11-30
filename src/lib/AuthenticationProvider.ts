// Rafiki AuthenticationProvider - interface to log a user in
// Copyright (c) Paul Clark 2022

import SessionState from './SessionState';

/** Menu provider interface */
export default interface AuthenticationProvider {
  /** Try to log in
   * @returns Session state
   */
  login(userId: string, password: string): SessionState;

  /** Log out */
  logout(session: SessionState): void;
}
