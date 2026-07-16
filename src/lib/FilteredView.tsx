// Rafiki React Filtered View component
// Copyright (c) Paul Clark 2023

import { useState, useEffect, useRef, ReactNode } from 'react';
import { Box, TextField, IconButton, Alert, Icon } from '@mui/material';
import { HasUniqueId } from './Types';

interface FilteredViewProps<T extends HasUniqueId> {
  items: T[];
  children: (filteredItems: T[]) => ReactNode; // Display function
  searchColumns?: (keyof T)[]; // Properties to search in, or all
  onCreate?: () => void; // Optional create function
  headerExtras?: Array<ReactNode>; // Optional extra controls for header

  // Server-side mode: called (debounced) when the filter text changes;
  // client-side filtering is skipped - the caller re-fetches and passes
  // the new items in. Not called for the initial (empty) filter on mount.
  onFilterChange?: (filter: string) => void;
  debounceMs?: number; // Debounce for onFilterChange (default 300)
}

/** Filtered view - offers a search filter box to filter items displayed
   by its child */
export default function FilteredView<T extends HasUniqueId>({
  items,
  children,
  searchColumns,
  onCreate,
  headerExtras,
  onFilterChange,
  debounceMs = 300,
}: FilteredViewProps<T>) {
  const [filter, setFilter] = useState('');

  // Server-side mode: debounce filter changes out to the caller, skipping
  // the initial render so mounting never triggers a refetch
  const mounted = useRef(false);
  useEffect(() => {
    if (!onFilterChange) return;
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const timer = setTimeout(() => onFilterChange(filter), debounceMs);
    return () => clearTimeout(timer);
  }, [filter]);

  const isNumeric = (value: any) => {
    return !isNaN(value) && value !== null && value !== '';
  };

  const matchesFilter = (value: any, filter: string) => {
    const lcFilter = filter.toLowerCase();
    const lcValue = String(value).toLowerCase();

    if (isNumeric(filter) && isNumeric(value))
      return Number(filter) === Number(value);
    else return lcValue.includes(lcFilter);
  };

  const filterItems = (item: T): boolean => {
    if (!filter.length) return true;

    if (searchColumns) {
      return searchColumns.some((column) => {
        const value = item[column];
        return matchesFilter(value, filter);
      });
    }

    const values = Object.values(item);
    return values.some((value) => matchesFilter(value, filter));
  };

  const filteredItems = onFilterChange ? items : items.filter(filterItems);

  return (
    <>
      <Box display="flex" sx={{ margin: '10px 0', alignItems: 'center' }}>
        {headerExtras?.map((extra, index) => (
          <Box key={index} sx={{ m: 1 }}>
            {extra}
          </Box>
        ))}
        <Box>
          <TextField
            label="Search"
            variant="outlined"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {/* Only while there's text: its "clear search" aria-label would
              otherwise shadow the search box in label queries for /search/i */}
          {filter.length > 0 && (
            <IconButton
              aria-label="clear search"
              size="large"
              onClick={() => setFilter('')}
            >
              <Icon fontSize="inherit">clear</Icon>
            </IconButton>
          )}
        </Box>

        <Box>
          {onCreate && (
            <IconButton aria-label="create" size="large" onClick={onCreate}>
              <Icon fontSize="inherit">add</Icon>
            </IconButton>
          )}
        </Box>
      </Box>

      {!!filteredItems.length && children(filteredItems)}
      {!filteredItems.length && <Alert severity="warning">Nothing found</Alert>}
    </>
  );
}
