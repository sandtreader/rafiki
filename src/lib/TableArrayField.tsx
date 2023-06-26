// Display/edit of a form array field as a table

import { TextField, Autocomplete, Table, TableBody, TableRow, TableCell,
         Icon, IconButton
} from '@mui/material';

import { HasUniqueId } from './Types';
import { BasicFormFieldDefinition } from './BasicForm';

/** TableArrayField props, parameterised by the type we are displaying */
export interface TableArrayFieldProps<T>
{
  field: BasicFormFieldDefinition<T>;
  items: HasUniqueId[];
  editable: boolean;
  deleteItem: (field: BasicFormFieldDefinition<T>, item: HasUniqueId) => void;
  addItem: (field: BasicFormFieldDefinition<T>, item: HasUniqueId) => void;
};

/** React table-based array field display / edit */
export default function TableArrayField<T>(
  { field, items, editable, deleteItem, addItem }: TableArrayFieldProps<T>)
{
  let allItems: HasUniqueId[] | undefined;
  if (typeof field.arrayItems === "function")
    allItems = field.arrayItems();
  else
    allItems = field.arrayItems;

  // Get the possible items not already used
  const unusedItems = allItems?.filter(
    ai => !items.find(i => ai.id === i.id)) || [];

  return <Table>
    <TableBody>
      {
        // Current items
        items.map(item => {
          const name = field.getItemName?field.getItemName(item)
                      :item.id;
          return <TableRow key={item.id}>
            {
              editable && <TableCell sx={{ width: "1em" }} align="right">
                <IconButton aria-label="remove" size="small"
                            onClick={ () => deleteItem(field, item) }>
                  <Icon>close</Icon>
                </IconButton>
              </TableCell>
            }
            <TableCell>{name}</TableCell>
          </TableRow>
        })
      }
      {
        // Selector to add new ones
        editable && unusedItems.length > 0 &&
        <TableRow key="add">
          <TableCell colSpan={2}>
            <Autocomplete
              blurOnSelect={true}
              getOptionLabel={ item => (field.getItemName
                                     && field.getItemName(item))
                                  || String(item.id) }
              options={unusedItems}
              renderInput={(params) => <TextField {...params} fullWidth
                                                  label="Add" />}
              value={null}
              onChange={ (e, value) => { if (value) addItem(field, value); } }
            />
          </TableCell>
        </TableRow>
      }
    </TableBody>
  </Table>
}
