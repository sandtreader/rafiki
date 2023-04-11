// Form to view / edit / create details of an item

import React, { ReactNode, useState } from 'react';

import { Button, TextField, Stack, IconButton, Icon,
         DialogActions, DialogContent, DialogTitle
} from '@mui/material';

import { FormIntent, FormProps } from './Types';

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
  validate?: (value: string) => boolean;
}

/** Detail form props, parameterised by the type we are displaying */
export interface DetailFormProps<T> extends FormProps<T>
{
  onDelete?: (item: T) => void;
  onSave?: (item: T) => void;
  fields?: DetailFormFieldDefinition<T>[];
  getTitle?: (item: T) => string;
};

/** React generic detail form component */
export default function DetailForm<T>(
  { intent, item, onClose, onDelete, onSave, fields, getTitle }:
  DetailFormProps<T>)
{
  const [editable, setEditable] =
    useState(intent === FormIntent.Edit
          || intent === FormIntent.Create);
  const [itemState, setItemState] = useState<T>({... item});

  // Save changes
  const save = async () => {
    // Anything changed?
    let changed = false;
    for(const field of fields || [])
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

  // HOF onchange for a particular field
  const onChangeForField = (field: DetailFormFieldDefinition<T>) =>
    (value: string) => {
      if (editable && (!field.validate || field.validate(value)))
        setItemState((prevState: T) => ({
          ...prevState,
          [field.key]: value
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
            fields?.map( field =>
              field.render
              ?
              field.render(field, itemState[field.key],
                           onChangeForField(field))
              :
              <TextField label={field.label} value={itemState[field.key]}
                         multiline={field.lines != undefined && field.lines > 1}
                         minRows={field.lines}
                         onChange={
                           e => onChangeForField(field)(e.target.value)
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
