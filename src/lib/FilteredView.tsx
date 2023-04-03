// Rafiki React Filtered View component
// Copyright (c) Paul Clark 2023

import { useState, ReactNode } from 'react';
import { Box, TextField, IconButton, Alert, Icon } from '@mui/material';
import { HasUniqueId } from './Types';

interface FilteredViewProps<T extends HasUniqueId> {
  items: T[];
  children: (filteredItems: T[]) => ReactNode;  // Display function
  searchColumns?: (keyof T)[];  // Properties to search in, or all
  onCreate?: () => void;        // Optional create function
}

/** Filtered view - offers a search filter box to filter items displayed
   by its child */
export default function FilteredView<T extends HasUniqueId>(
  { items, children, searchColumns, onCreate }: FilteredViewProps<T>)
{
  const [filter, setFilter] = useState('');

  const isNumeric = (value: any) => {
    return !isNaN(value) && value !== null && value !== '';
  };

  const matchesFilter = (value: any, filter: string) => {
    const lcFilter = filter.toLowerCase();
    const lcValue = String(value).toLowerCase();

    if (isNumeric(filter) && isNumeric(value))
      return Number(filter) === Number(value);
    else
      return lcValue.includes(lcFilter);
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

  const filteredItems = items.filter(filterItems);

  return (
    <>
      <Box display="flex" justifyContent="space-between"
           sx={{ margin: '10px 0' }}>
        <Box>
          <TextField
            label="Search"
            variant="outlined"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <IconButton aria-label="clear search" size="large"
                      onClick={() => setFilter('')}>
            <Icon fontSize="inherit">clear</Icon>
          </IconButton>
        </Box>

        <Box>
          { onCreate &&
            <IconButton aria-label="create" size="large"
                        onClick={ onCreate }>
              <Icon fontSize="inherit">add</Icon>
            </IconButton>
          }
        </Box>
      </Box>

      { !!filteredItems.length && children(filteredItems) }
      {
        !filteredItems.length &&
        <Alert severity="warning">Nothing found</Alert>
      }
    </>
  );
}
