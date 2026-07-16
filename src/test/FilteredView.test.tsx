import React from 'react';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FilteredView from '../lib/FilteredView';

type Item = { id: string; name: string };
const items: Item[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

const listNames = (shown: Item[]) => (
  <ul>
    {shown.map((i) => (
      <li key={i.id}>{i.name}</li>
    ))}
  </ul>
);

afterEach(() => cleanup());

test('client-side mode filters items live as the filter is typed', async () => {
  render(<FilteredView items={items}>{listNames}</FilteredView>);
  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Bob')).toBeInTheDocument();

  await userEvent.type(screen.getByLabelText('Search'), 'ali');
  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(screen.queryByText('Bob')).not.toBeInTheDocument();
});

test('clear button appears only once there is filter text', async () => {
  render(<FilteredView items={items}>{listNames}</FilteredView>);

  // Absent while empty, so label queries for /search/i hit only the box
  expect(screen.queryByLabelText('clear search')).not.toBeInTheDocument();

  await userEvent.type(screen.getByLabelText('Search'), 'ali');
  await userEvent.click(screen.getByLabelText('clear search'));

  expect(screen.queryByLabelText('clear search')).not.toBeInTheDocument();
  expect(screen.getByText('Bob')).toBeInTheDocument();
});

test('server-side mode passes items through and debounces onFilterChange', async () => {
  const onFilterChange = vi.fn();
  render(
    <FilteredView items={items} onFilterChange={onFilterChange}>
      {listNames}
    </FilteredView>,
  );

  // Never fires just from mounting
  await new Promise((r) => setTimeout(r, 400));
  expect(onFilterChange).not.toHaveBeenCalled();

  await userEvent.type(screen.getByLabelText('Search'), 'ali');

  // No client-side filtering - the caller re-fetches instead
  expect(screen.getByText('Bob')).toBeInTheDocument();

  // The debounced callback arrives with the settled text
  await waitFor(() => expect(onFilterChange).toHaveBeenCalledWith('ali'));
  expect(screen.getByText('Alice')).toBeInTheDocument();
});

test('server-side mode reports a cleared filter', async () => {
  const onFilterChange = vi.fn();
  render(
    <FilteredView items={items} onFilterChange={onFilterChange} debounceMs={50}>
      {listNames}
    </FilteredView>,
  );

  await userEvent.type(screen.getByLabelText('Search'), 'ali');
  await waitFor(() => expect(onFilterChange).toHaveBeenCalledWith('ali'));

  await userEvent.click(screen.getByLabelText('clear search'));
  await waitFor(() => expect(onFilterChange).toHaveBeenCalledWith(''));
});
