// A page which provides a filtered list view, edit and create forms
// all generic

import { useEffect, useCallback, useState, ComponentType } from 'react';
import { HasUniqueId, FormIntent, FormProps } from './Types';
import ListView, { ListViewColumnDefinition } from './ListView';
import FilteredView from './FilteredView';
import BasicForm, { BasicFormFieldDefinition } from './BasicForm';

import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

/** List edit page props, parameterised by the type we are displaying */
export interface ListEditPageProps<T extends HasUniqueId> {
  typeName: string;
  fetchItems: () => Promise<T[]>;
  createItem?: (id: string) => Promise<T>;
  saveItem?: (item: T, oldItem: T) => Promise<void>;
  deleteItem?: (item: T) => Promise<void>;
  columns: ListViewColumnDefinition<T>[];
  searchColumns?: (keyof T)[]; // Properties to search in, or all
  fields?: BasicFormFieldDefinition<T>[];
  getTitle?: (item: T) => string;
  form?: ComponentType<FormProps<T>>; // Optional custom form
}

/** List edit page - a full management page with a filtered list view,
    edit and create forms */
export default function ListEditPage<T extends HasUniqueId>({
  typeName,
  fetchItems,
  createItem,
  saveItem,
  deleteItem,
  columns,
  searchColumns,
  fields,
  getTitle,
  form,
}: ListEditPageProps<T>) {
  const [items, setItems] = useState<Array<T>>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [createId, setCreateId] = useState('');

  // Update items
  const fetch = useCallback(async () => {
    const items = await fetchItems();
    setItems(items);
  }, []);

  // Fetch items at start
  useEffect(() => {
    fetch();
  }, [fetch]);

  // Create a item
  const onCreate = async () => {
    if (!createItem) return;
    const item = await createItem(createId);
    fetch();
    setSelectedItem(item);
    setCreateId('');
  };

  // Save changes
  const onSave = async (item: T, oldItem: T) => {
    if (!saveItem) return;
    await saveItem(item, oldItem);
    fetch();
  };

  // Delete a item
  const onDelete = async (item: T) => {
    if (!deleteItem) return;
    await deleteItem(item);
    fetch();
  };

  // Close the form
  const onClose = (changed: boolean) => {
    setSelectedItem(null);
    setCreating(false);
    if (changed) fetch();
  };

  // Use aliases to avoid JSX/generics car crash
  const ItemForm = form ? form : BasicForm<T>; // Option for custom type
  const ItemFilteredView = FilteredView<T>;
  const ItemListView = ListView<T>;

  return (
    <>
      <ItemFilteredView
        items={items}
        searchColumns={searchColumns}
        onCreate={createItem ? () => setCreating(true) : undefined}
      >
        {(filteredItems: T[]) => (
          <ItemListView
            items={filteredItems}
            onSelect={setSelectedItem}
            onDelete={deleteItem ? onDelete : undefined}
            columns={columns}
          />
        )}
      </ItemFilteredView>

      {
        // View/edit form
        selectedItem && (
          <Dialog
            open={true}
            onClose={() => onClose(false)}
            maxWidth="md"
            fullWidth={true}
          >
            <ItemForm
              intent={
                creating
                  ? FormIntent.Create
                  : saveItem
                  ? FormIntent.ViewWithEdit
                  : FormIntent.View
              }
              item={selectedItem}
              onDelete={deleteItem ? onDelete : undefined}
              onSave={saveItem ? onSave : undefined}
              onClose={onClose}
              fields={fields}
              getTitle={
                getTitle ? getTitle : (item) => `${typeName} ${item.id}`
              }
            />
          </Dialog>
        )
      }

      {
        // Create dialog - needs an ID
        creating && (
          <Dialog
            open={true}
            onClose={(_) => {
              setCreating(false);
              setCreateId('');
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onCreate();
              }}
            >
              <DialogTitle>Create a new {typeName}</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  id="id"
                  label={`${typeName} ID`}
                  fullWidth
                  variant="standard"
                  value={createId}
                  onChange={(e) => setCreateId(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={(_) => {
                    setCreating(false);
                    setCreateId('');
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createId === ''}>
                  Create
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )
      }
    </>
  );
}
