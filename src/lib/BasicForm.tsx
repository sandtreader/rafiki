// Form to view / edit / create details of an item

import React, { ReactNode, useState, useEffect } from 'react';

import {
  Button,
  TextField,
  Stack,
  IconButton,
  Icon,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  FormControlLabel,
  FormControl,
  InputLabel,
  Switch,
  Select,
  MenuItem,
} from '@mui/material';

import { FormIntent, FormProps, HasUniqueId } from './Types';
import ChipArrayField from './ChipArrayField';
import TableArrayField from './TableArrayField';
import ChecklistArrayField from './ChecklistArrayField';

export enum BasicFormFieldArrayStyle {
  chips = 0,
  table = 1,
  checklist = 2,
  single = 3,
}

/** Definition of fields we want to show */
// - note using keyof to ensure that the keys included really are
//   properties of the type
export interface BasicFormFieldDefinition<T> {
  key: keyof T;
  label: string;
  lines?: number; // Number of lines to show (default 1)

  // Custom render function - overrides usual TextField
  render?: (
    field: BasicFormFieldDefinition<T>,
    value: T[keyof T],
    item: T,
    onChange?: (value: T[keyof T]) => void // undefined = readonly
  ) => ReactNode;

  // Validation function - run on value before change accepted
  validate?: (value: T[keyof T]) => boolean;

  // Initial formatter (e.g. pretty-print XML)
  format?: (value: T[keyof T]) => string;

  // List of all possible array item values, or a function to derive it
  // presence of this makes this an array field
  arrayItems?: HasUniqueId[] | (() => Promise<HasUniqueId[]>);

  // Array display style - default 'chips'
  arrayStyle?: BasicFormFieldArrayStyle;

  // Array item name function - gives the name for a given item if present,
  // otherwise just uses the ID
  getItemName?: (item: HasUniqueId) => string;

  // Enum type - presence makes this an enum field
  // For a string enum, just pass in the enum type
  enumType?: { [ id: string]: string };
}

/** Basic form props, parameterised by the type we are displaying */
export interface BasicFormProps<T> extends FormProps<T> {
  fields?: BasicFormFieldDefinition<T>[];
  getTitle?: (item: T) => string;
}

// Get a clone of an object, retaining its type
// Note all the setItemStates use this instead of { ... item } otherwise
// we will lose the type when we call back to onSave
const clone = (obj: any) => {
  const clone = Object.create(Object.getPrototypeOf(obj));
  return Object.assign(clone, obj);
};

/** React generic detail form component */
export default function BasicForm<T>({
  intent,
  item,
  onClose,
  onDelete,
  onSave,
  fields,
  getTitle,
}: BasicFormProps<T>) {
  const [editable, setEditable] = useState(
    intent === FormIntent.Edit || intent === FormIntent.Create
  );
  const [itemState, setItemState] = useState<T>(clone(item));
  const [allItemsForField, setAllItemsForField] = useState<{
    [id: string]: HasUniqueId[];
  }>({});

  // Pre-format any fields that need it
  useEffect(() => {
    for (const field of fields || []) {
      if (field.format) {
        const formatted = field.format(item[field.key]);
        setItemState((prevState: T) => {
          const newItem = clone(prevState);
          newItem[field.key] = formatted;
          return newItem;
        });
      }
    }
  }, [fields, item]);

  // Get the allItems list for each field that needs it
  // note this can be async
  useEffect(() => {
    const getAllItems = async () => {
      for (const field of fields || []) {
        if (field.arrayItems) {
          let allItems: HasUniqueId[];
          if (typeof field.arrayItems === 'function')
            allItems = await field.arrayItems();
          else allItems = field.arrayItems;

          setAllItemsForField((prevState) => ({
            ...prevState,
            [field.key]: allItems,
          }));
        }
      }
    };

    getAllItems();
  }, [fields]);

  // Save changes
  const save = async () => {
    // Anything changed?
    let changed = false;
    for (const field of fields || [])
      if (itemState[field.key] !== item[field.key]) {
        changed = true;
        break;
      }

    if (changed && onSave) onSave(itemState, item);
    if (onClose) onClose(changed);
  };

  const reset = () => {
    setItemState(clone(item));
  };

  // Delete the whole item and close
  const deleteItem = async () => {
    if (onDelete) onDelete(item);
    if (onClose) onClose(true);
  };

  // HOF onchange for a particular field
  const onChangeForField =
    (field: BasicFormFieldDefinition<T>) => (value: T[keyof T]) => {
      if (editable && (!field.validate || field.validate(value)))
        setItemState((prevState: T) => {
          const newItem = clone(prevState);
          newItem[field.key] = value;
          return newItem;
        });
    };

  // Delete an array item in the given value
  const deleteArrayItem = (
    field: BasicFormFieldDefinition<T>,
    arrayItem: HasUniqueId
  ) => {
    setItemState((prevState: T) => {
      const newItem = clone(prevState);
      newItem[field.key] = (prevState[field.key] as HasUniqueId[]).filter(
        (ai) => ai.id !== arrayItem.id
      );
      return newItem;
    });
  };

  // Add an array item
  const addArrayItem = (
    field: BasicFormFieldDefinition<T>,
    arrayItem: HasUniqueId
  ) => {
    setItemState((prevState: T) => {
      const newItem = clone(prevState);
      newItem[field.key] = (prevState[field.key] as HasUniqueId[]).concat([
        arrayItem,
      ]);
      return newItem;
    });
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        {getTitle && <DialogTitle>{getTitle(item)}</DialogTitle>}
        <Stack direction="row">
          {!editable && intent === FormIntent.ViewWithEdit && (
            <IconButton
              aria-label="edit"
              size="large"
              onClick={(_) => setEditable(true)}
            >
              <Icon>edit</Icon>
            </IconButton>
          )}
          {intent !== FormIntent.View && onDelete && (
            <IconButton aria-label="delete" size="large" onClick={deleteItem}>
              <Icon>delete</Icon>
            </IconButton>
          )}
        </Stack>
      </Stack>

      <DialogContent>
        <Stack direction="column" spacing={2}>
          {fields?.map((field) => {
            const value = itemState[field.key];

            // Custom render?
            if (field.render)
              return (
                <React.Fragment key={String(field.key)}>
                  {field.render(
                    field,
                    value,
                    itemState,
                    editable ? onChangeForField(field) : undefined
                  )}
                </React.Fragment>
              );

            // Boolean?
            if (typeof value == 'boolean') {
              return (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      disabled={!editable}
                      onChange={(e) =>
                        onChangeForField(field)(e.target.checked as T[keyof T])
                      }
                    />
                  }
                  key={String(field.key)}
                  label={field.label}
                  labelPlacement="end"
                />
              );
            }

            // Single selector?
            if (field.arrayStyle === BasicFormFieldArrayStyle.single) {
              const allItems = allItemsForField[String(field.key)];
              return (
                allItems && (
                  <FormControl>
                    <InputLabel id={`{field.label}-select-label`}>
                      {field.label}
                    </InputLabel>
                    <Select
                      labelId={`${field.label}-select-label`}
                      value={value ? (value as any).id : ''}
                      label={field.label}
                      disabled={!editable}
                      onChange={(e) =>
                        onChangeForField(field)(
                          allItems.find(
                            (i) => i.id === e.target.value
                          ) as T[keyof T]
                        )
                      }
                    >
                      {allItems.map((item) => {
                        const name = field.getItemName
                          ? field.getItemName(item)
                          : item.id;
                        return (
                          <MenuItem key={item.id} value={item.id}>
                            {name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )
              );
            }

            // Array?
            if (field.arrayItems) {
              const items = value as HasUniqueId[];
              const allItems = allItemsForField[String(field.key)];

              switch (field.arrayStyle) {
                case undefined:
                case BasicFormFieldArrayStyle.chips:
                  return (
                    <React.Fragment key={String(field.key)}>
                      <Typography variant="h6">{field.label}</Typography>
                      <ChipArrayField
                        field={field}
                        items={items}
                        allItems={allItems}
                        editable={editable}
                        deleteItem={deleteArrayItem}
                        addItem={addArrayItem}
                      />
                    </React.Fragment>
                  );

                case BasicFormFieldArrayStyle.table:
                  return (
                    <React.Fragment key={String(field.key)}>
                      <Typography variant="h6">{field.label}</Typography>
                      <TableArrayField
                        field={field}
                        items={items}
                        allItems={allItems}
                        editable={editable}
                        deleteItem={deleteArrayItem}
                        addItem={addArrayItem}
                      />
                    </React.Fragment>
                  );

                case BasicFormFieldArrayStyle.checklist:
                  return (
                    <React.Fragment key={String(field.key)}>
                      <Typography variant="h6">{field.label}</Typography>
                      <ChecklistArrayField
                        field={field}
                        items={items}
                        allItems={allItems}
                        editable={editable}
                        deleteItem={deleteArrayItem}
                        addItem={addArrayItem}
                      />
                    </React.Fragment>
                  );
              }
            }

            // Enum?
            if (field.enumType) {
              return (
                <FormControl>
                  <InputLabel id={`{field.label}-select-label`}>
                    {field.label}
                  </InputLabel>
                  <Select
                    labelId={`${field.label}-select-label`}
                    value={value}
                    label={field.label}
                    disabled={!editable}
                    onChange={e =>
                      onChangeForField(field)(e.target.value as T[keyof T])}
                    >
                      {Object.entries(field.enumType).map(([id, name]) =>
                          <MenuItem key={id} value={name}>
                            {name}
                          </MenuItem>
                        )
                      }
                    </Select>
                  </FormControl>
                )

            }
            // Default to text field
            return (
              <TextField
                key={String(field.key)}
                label={field.label}
                value={value}
                multiline={field.lines !== undefined && field.lines > 1}
                minRows={field.lines}
                onChange={(e) =>
                  onChangeForField(field)(e.target.value as T[keyof T])
                }
              />
            );
          })}
        </Stack>
      </DialogContent>

      <DialogActions>
        {editable && onClose && (
          <Button onClick={(_) => onClose(false)}>Cancel</Button>
        )}
        {editable && !onClose && <Button onClick={reset}>Reset</Button>}
        {editable && <Button onClick={save}>Save</Button>}
        {!editable && onClose && (
          <Button onClick={(_) => onClose(false)}>Close</Button>
        )}
      </DialogActions>
    </>
  );
}
