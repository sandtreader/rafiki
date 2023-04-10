// Form to view / edit / create details of an item

import React, { ReactNode, useState } from 'react';

import { Button, TextField, Stack, IconButton, Icon,
         DialogActions, DialogContent, DialogTitle
} from '@mui/material';

/** Initial intent of the form */
export enum DetailFormIntent
{
  View,
  ViewWithEdit,
  Edit,
  Create
};

/** Definition of fields we want to show */
// - note using keyof to ensure that the keys included really are
//   properties of the type
export interface DetailFormFieldDefinition<T> {
  key: keyof T;
  label: string;
  lines?: number;  // Number of lines to show (default 1)
  render?: (field: DetailFormFieldDefinition<T>,
            value: T[keyof T],
            onChange?: (value: string) => void) => ReactNode;
}

/** Detail form props, parameterised by the type we are displaying */
export interface DetailFormProps<T> {
  intent: DetailFormIntent;
  item: T;
  onClose?: (changed: boolean) => void;
  onDelete?: (item: T) => void;
  onSave?: (item: T) => void;
  fields: DetailFormFieldDefinition<T>[];
  getTitle?: (item: T) => string;
};

/** React generic detail form component */
export default function DetailForm<T>(
  { intent, item, onClose, onDelete, onSave, fields, getTitle }:
  DetailFormProps<T>)
{
  const [editable, setEditable] =
    useState(intent === DetailFormIntent.Edit
          || intent === DetailFormIntent.Create);
  const [itemState, setItemState] = useState<T>({... item});

  // Save changes
  const save = async () => {
    // Anything changed?
    let changed = false;
    for(const field of fields)
      if (itemState[field.key] != item[field.key])
      {
        changed = true;
        break;
      }

    if (changed && onSave) onSave(itemState);
    if (onClose) onClose(changed);
  };

  const reset = () => {
    setItemState({... item});
  };

  // Delete the whole item and close
  const deleteItem = async () => {
    if (onDelete) onDelete(item);
    if (onClose) onClose(true);
  };

  // HOF onchange for a particular item key
  const onChangeForKey = (key: keyof T) =>
    (value: string) => {
      if (editable) setItemState((prevState: T) => ({
        ...prevState,
        [key]: value
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
            !editable && intent === DetailFormIntent.ViewWithEdit &&
            <IconButton aria-label="edit" size="large"
                        onClick={ _ => setEditable(true) }>
              <Icon>edit</Icon>
            </IconButton>
          }
          {
            intent !== DetailFormIntent.View && onDelete &&
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
            fields.map( field =>
              field.render
              ?
              field.render(field, itemState[field.key],
                           onChangeForKey(field.key))
              :
              <TextField label={field.label} value={itemState[field.key]}
                         multiline={field.lines != undefined && field.lines > 1}
                         minRows={field.lines}
                         onChange={
                           e => onChangeForKey(field.key)(e.target.value)
                         }/>
            )
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
