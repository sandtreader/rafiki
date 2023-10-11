// Rafiki SessionState - current state of authentication
// Copyright (c) Paul Clark 2022

/** Menu state */
export default class SessionState {
  /** Logged in? */
  public loggedIn: boolean;

  /** User ID if logged in */
  public userId?: string;

  /** User visible name if logged in */
  public userName?: string;

  /** List of capability patterns */
  public capabilities?: Array<string>;

  /** JWT to quote back in API calls */
  public jwt?: string;

  /** Error if login failed */
  public error?: string;

  /** Constructor */
  public constructor(loggedIn: boolean, userId?: string)
  {
    this.loggedIn = loggedIn;
    this.userId = userId;
  }

  /** Find if the user has a capability pattern matching the given
      requirement */
  public hasCapability(requirement: string): boolean
  {
    for (const capability of this.capabilities || []) {
      // Convert a glob-style * pattern into a regexp, protecting all
      // the special chars
      const res = '^' +
        capability.replace(/([.+?^=!:${}()|[\]/\\])/g, "\\$1")
          .replace(/\*/g, '.*')
        + '$';

      // We test the requirement against the capability pattern
      const re = new RegExp(res);
      if (re.test(requirement)) return true;
    }

    return false;
  }
}
