import * as Rafiki from '../rafiki';

describe('Package exports', () => {
  it('exports SessionState as a constructible class', () => {
    const session = new Rafiki.SessionState(true, 'fred');
    expect(session.loggedIn).toBe(true);
    expect(session.userId).toBe('fred');
  });
});
