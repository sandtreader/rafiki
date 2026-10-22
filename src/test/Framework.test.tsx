import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Framework from '../lib/Framework';
import FakeAuthenticationProvider from '../lib/FakeAuthenticationProvider';
import StaticMenuProvider from '../lib/StaticMenuProvider';
import SessionState from '../lib/SessionState';
import { exampleMenu } from '../test/ExampleMenuStructure';

afterEach(() => cleanup());

const providers = {
  authProvider: new FakeAuthenticationProvider(),
  menuProvider: new StaticMenuProvider(exampleMenu),
};

const logIn = async () => {
  await userEvent.type(screen.getByLabelText(/User name/), 'admin');
  await userEvent.type(screen.getByLabelText(/Password/), 'admin');
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
};

test('it renders headerStatus in the app bar, passing the session', async () => {
  const headerStatus = (session?: SessionState) => (
    <span>{session?.loggedIn ? `Hello ${session.userName}` : 'Nobody'}</span>
  );
  render(
    <Framework {...providers} title="Test App" headerStatus={headerStatus} />,
  );

  // Logged out: rendered with no session
  const banner = screen.getByRole('banner'); // the AppBar header
  expect(banner).toHaveTextContent('Nobody');

  await logIn();
  expect(screen.getByRole('banner')).toHaveTextContent('Hello Joe Admin');
});

test('it renders no extra header content when the prop is absent', () => {
  render(<Framework {...providers} title="Test App" />);
  expect(screen.getByRole('banner')).toHaveTextContent(/^Test App$/);
});

test('it passes a logOut action to headerStatus which logs out', async () => {
  const headerStatus = (session?: SessionState, logOut?: () => void) =>
    session?.loggedIn && (
      <button onClick={() => logOut?.()}>Header log out</button>
    );
  render(
    <Framework {...providers} title="Test App" headerStatus={headerStatus} />,
  );

  await logIn();
  await userEvent.click(screen.getByRole('button', { name: 'Header log out' }));
  expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
});

test('it shows the drawer Log out button by default', async () => {
  render(<Framework {...providers} title="Test App" />);
  await logIn();
  await userEvent.click(screen.getByRole('button', { name: 'Log out' }));
  expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
});

test('it hides the drawer Log out button with hideLogout', async () => {
  render(<Framework {...providers} title="Test App" hideLogout />);
  await logIn();
  expect(
    screen.queryByRole('button', { name: 'Log out' }),
  ).not.toBeInTheDocument();
});
