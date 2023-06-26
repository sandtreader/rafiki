// Form to view / edit / create details of an item

import { ReactNode, useState, useEffect } from 'react';

import { Button, TextField, Stack, IconButton, Icon,
         DialogActions, DialogContent, DialogTitle, Typography
} from '@mui/material';

import { FormIntent, FormProps, HasUniqueId } from './Types';
import ChipArrayField from './ChipArrayField';
import TableArrayField from './TableArrayField';
import ChecklistArrayField from './ChecklistArrayField';

export enum BasicFormFieldArrayStyle {
  chips,
  table,
  checklist
};

/** Definition of fields we want to show */
// - note using keyof to ensure that the keys included really are
//   properties of the type
export interface BasicFormFieldDefinition<T> {
  key: keyof T;
  label: string;
  lines?: number;  // Number of lines to show (default 1)

  // Custom render function - overrides usual TextField
  render?: (field: BasicFormFieldDefinition<T>,
            value: T[keyof T],
            onChange?: (value: T[keyof T]) => void) => ReactNode;

  // Validation function - run on value before change accepted
  validate?: (value: T[keyof T]) => boolean;

  // Initial formatter (e.g. pretty-print XML)
  format?: (value: T[keyof T]) => string;

  // List of all possible array item values - presence of this makes this
  // an array field
  arrayItems?: HasUniqueId[];

  // Array display style - default 'chips'
  arrayStyle?: BasicFormFieldArrayStyle;

  // Array item name function - gives the name for a given item if present,
  // otherwise just uses the ID
  getItemName?: (item: HasUniqueId) => string;
}

/** Basic form props, parameterised by the type we are displaying */
export interface BasicFormProps<T> extends FormProps<T>
{
  onDelete?: (item: T) => void;
  onSave?: (item: T) => void;
  fields?: BasicFormFieldDefinition<T>[];
  getTitle?: (item: T) => string;
};

/** React generic detail form component */
export default function BasicForm<T>(
  { intent, item, onClose, onDelete, onSave, fields, getTitle }:
  BasicFormProps<T>)
{
  const [editable, setEditable] =
    useState(intent === FormIntent.Edit
          || intent === FormIntent.Create);
  const [itemState, setItemState] = useState<T>({...item});

  // Pre-format any fields that need it
  useEffect(() => {
    for(const field of fields || [])
    {
      if (field.format)
      {
        const formatted = field.format(item[field.key]);
        setItemState((prevState: T) => ({
          ...prevState,
          [field.key]: formatted
        }));
      }
    }
  }, [fields, item]);

  // Save changes
  const save = async () => {
    // Anything changed?
    let changed = false;
    for(const field of fields || [])
      if (itemState[field.key] !== item[field.key])
      {
        changed = true;
        break;
      }

    if (changed && onSave) onSave(itemState);
    if (onClose) onClose(changed);
  };

  const reset = () => {
    setItemState({...item});
  };

  // Delete the whole item and close
  const deleteItem = async () => {
    if (onDelete) onDelete(item);
    if (onClose) onClose(true);
  };

  // HOF onchange for a particular field
  const onChangeForField = (field: BasicFormFieldDefinition<T>) =>
    (value: T[keyof T]) => {
      if (editable && (!field.validate || field.validate(value)))
        setItemState((prevState: T) => ({
          ...prevState,
          [field.key]: value
        }));
    };

  // Delete an array item in the given value
  const deleteArrayItem =
    (field: BasicFormFieldDefinition<T>, arrayItem: HasUniqueId) => {
      setItemState((prevState: T) => ({
        ...prevState,
        [field.key]: (prevState[field.key] as HasUniqueId[])
          .filter(ai => ai.id !== arrayItem.id)
      }));
    };

  // Add an array item
  const addArrayItem =
    (field: BasicFormFieldDefinition<T>, arrayItem: HasUniqueId) => {
      setItemState((prevState: T) => ({
        ...prevState,
        [field.key]: (prevState[field.key] as HasUniqueId[]).concat([arrayItem])
      }));
    };

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        {
          getTitle &&
          <DialogTitle>{ getTitle(item) }</DialogTitle>
        }
        <Stack direction="row">
          {
            !editable && intent === FormIntent.ViewWithEdit &&
            <IconButton aria-label="edit" size="large"
                        onClick={ _ => setEditable(true) }>
              <Icon>edit</Icon>
            </IconButton>
          }
          {
            intent !== FormIntent.View && onDelete &&
            <IconButton aria-label="delete" size="large"
                        onClick={ deleteItem }>
              <Icon>delete</Icon>
            </IconButton>
          }
        </Stack>
      </Stack>

      <DialogContent>
        <Stack direction="column" spacing={2}>
          {
            fields?.map( field => {
              const value = itemState[field.key];

              // Custom render?
              if (field.render)
                return field.render(field, value, onChangeForField(field))

              // Array?
              if (field.arrayItems)
              {
                const items = (value as HasUniqueId[]);
                switch (field.arrayStyle)
                {
                  case undefined:
                  case BasicFormFieldArrayStyle.chips:
                  return <>
                    <Typography variant="h6">{field.label}</Typography>
                    <ChipArrayField field={field} items={items}
                                    editable={editable}
                                    deleteItem={deleteArrayItem}
                                    addItem={addArrayItem}/>
                  </>;

                  case BasicFormFieldArrayStyle.table:
                  return <>
                    <Typography variant="h6">{field.label}</Typography>
                    <TableArrayField field={field} items={items}
                                     editable={editable}
                                     deleteItem={deleteArrayItem}
                                     addItem={addArrayItem}/>
                  </>

                  case BasicFormFieldArrayStyle.checklist:
                  return <>
                    <Typography variant="h6">{field.label}</Typography>
                    <ChecklistArrayField field={field} items={items}
                                         editable={editable}
                                         deleteItem={deleteArrayItem}
                                         addItem={addArrayItem}/>
                  </>

                }
              }

              // Default to text field
              return <TextField key={String(field.key)}
                                label={field.label} value={value}
                                multiline={field.lines !== undefined &&
                                           field.lines > 1}
                                minRows={field.lines}
                                onChange={ e => onChangeForField(field)
                                (e.target.value as T[keyof T]) }
              />
            })
          }
        </Stack>
      </DialogContent>

      <DialogActions>
        {
          editable && onClose &&
          <Button onClick={ _ => onClose(false) }>Cancel</Button>
        }
        {
          editable && !onClose &&
          <Button onClick={ reset }>Reset</Button>
        }
        {
          editable &&
          <Button onClick={ save }>Save</Button>
        }
        {
          !editable && onClose &&
          <Button onClick={ _ => onClose(false) }>Close</Button>
        }
      </DialogActions>
    </>
  );
};
