// Rafiki SessionState - current state of authentication
// Copyright (c) Paul Clark 2022

/** Menu state */
export default interface SessionState {
  /** Logged in? */
  loggedIn: boolean;

  /** User ID if logged in */
  userId?: string;

  /** User visible name if logged in */
  userName?: string;

  /** List of capability patterns */
  capabilities?: Array<string>;

  /** JWT to quote back in API calls */
  jwt?: string;

  /** Error if login failed */
  error?: string;
}
