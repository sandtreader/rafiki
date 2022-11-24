import React from 'react';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Menu from '../lib/Menu';
import exampleMenu from '../test/ExampleMenuStructure';
import StaticMenuProvider from '../lib/StaticMenuProvider';

afterEach(() => cleanup());

test('it renders the example menu initially folded', () => {
  const provider = new StaticMenuProvider(exampleMenu);
  const structure = provider.getMenu();
  render(<Menu structure={structure} />);

  expect(screen.getByRole('menu')).toBeInTheDocument();
  expect(screen.getAllByRole('menuitem')).toHaveLength(2); // until unfolded

  // Top levels are visible
  expect(screen.getByTestId('menuitem.foo')).toBeVisible();
  expect(screen.getByTestId('menuitem.bar')).toBeVisible();

  // Children and grandchildren aren't
  expect(screen.getByTestId('menuitem.foo.child')).not.toBeVisible();
  expect(
    screen.getByTestId('menuitem.foo.child.grandchild1')
  ).not.toBeVisible();

  // Check text
  expect(screen.getByText('FOO')).toBeVisible();
  expect(screen.getByText('BAR')).toBeVisible();
  expect(screen.getByText('CHILD')).not.toBeVisible();
});

test('it unfolds the example menu', async () => {
  const provider = new StaticMenuProvider(exampleMenu);
  const structure = provider.getMenu();
  render(<Menu structure={structure} />);

  expect(screen.getByRole('menu')).toBeInTheDocument();

  // Click on FOO to unfold
  await userEvent.click(screen.getByText('FOO'));
  await screen.findByText('CHILD'); // Allow animation to complete

  expect(screen.getAllByRole('menuitem')).toHaveLength(3);

  // Top levels and child are visible
  expect(screen.getByTestId('menuitem.foo')).toBeVisible();
  expect(screen.getByTestId('menuitem.bar')).toBeVisible();
  expect(screen.getByTestId('menuitem.foo.child')).toBeVisible();

  // Grandchildren still aren't
  expect(
    screen.getByTestId('menuitem.foo.child.grandchild1')
  ).not.toBeVisible();

  // Check text
  expect(screen.getByText('FOO')).toBeVisible();
  expect(screen.getByText('BAR')).toBeVisible();
  expect(screen.getByText('CHILD')).toBeVisible();

  // Now click on the child too
  await userEvent.click(screen.getByText('CHILD'));
  await screen.findAllByText(/GRANDCHILD/); // Allow animation to complete

  expect(screen.getAllByRole('menuitem')).toHaveLength(5);
  expect(screen.getByTestId('menuitem.foo.child')).toBeVisible();
  expect(screen.getByTestId('menuitem.foo.child.grandchild1')).toBeVisible();
  expect(screen.getByTestId('menuitem.foo.child.grandchild2')).toBeVisible();
  expect(screen.getByText('CHILD')).toBeVisible();
  expect(screen.getByText('GRANDCHILD 1')).toBeVisible();
  expect(screen.getByText('GRANDCHILD 2')).toBeVisible();

  // Click on FOO again to close up
  await userEvent.click(screen.getByText('FOO'));
  await waitFor(() => expect(screen.queryByText('CHILD')).not.toBeVisible());
  expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  expect(screen.getByTestId('menuitem.foo.child')).not.toBeVisible();
  expect(
    screen.getByTestId('menuitem.foo.child.grandchild1')
  ).not.toBeVisible();
  expect(
    screen.getByTestId('menuitem.foo.child.grandchild2')
  ).not.toBeVisible();

  // Click on FOO again to unfold, but grandchildren should not now be visible
  await userEvent.click(screen.getByText('FOO'));
  await screen.findByText('CHILD'); // Allow animation to complete
  expect(screen.getByTestId('menuitem.foo.child')).toBeVisible();
  expect(
    screen.getByTestId('menuitem.foo.child.grandchild1')
  ).not.toBeVisible();
  expect(
    screen.getByTestId('menuitem.foo.child.grandchild2')
  ).not.toBeVisible();
});
