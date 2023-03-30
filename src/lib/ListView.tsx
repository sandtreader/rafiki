// Rafiki React List View component
// Copyright (c) Paul Clark 2023

import { HasUniqueId } from './Types';
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow,
         IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

/** Definition of columns we want to show */
// - note using keyof to ensure that the keys included really are
//   properties of the type
export interface ListViewColumnDefinition<T> {
  key: keyof T;
  label: string;
}

/** List view props, parameterised by the type we are displaying */
export interface ListViewProps<T extends HasUniqueId> {
  items: T[];
  onSelect: (item: T) => void;
  onDelete: (item: T) => void;
  columns: ListViewColumnDefinition<T>[];
};

/** React generic list view component */
export default function ListView<T extends HasUniqueId>(
  { items, onSelect, onDelete, columns}: ListViewProps<T>)
{
  return (
    <TableContainer>
      <Table size="small" sx={{ width: 'auto'}}>
        <TableHead>
          <TableRow>
            {
              columns.map((column) => (
                <TableCell key={String(column.key)}>{column.label}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            items.map((item) => {
              return <TableRow key={item.id}
                               onClick={_ => onSelect(item)}>
                {
                  columns.map((column, i) => (
                    <TableCell key={i}>
                      {String(item[column.key])}
                    </TableCell>
                  ))
                }
                <TableCell>
                  <IconButton aria-label="delete" size="large"
                              onClick={e => { e.stopPropagation();
                                onDelete(item); }}>
                    <DeleteIcon/>
                  </IconButton>
                </TableCell>
              </TableRow>
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

