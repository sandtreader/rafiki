// Display/edit of a form array field as a checklist of all the options

import { Table, TableBody, TableRow, TableCell, Checkbox
} from '@mui/material';

import { HasUniqueId } from './Types';
import { BasicFormFieldDefinition } from './BasicForm';

/** ChecklistArrayField props, parameterised by the type we are displaying */
export interface ChecklistArrayFieldProps<T>
{
  field: BasicFormFieldDefinition<T>;
  items: HasUniqueId[];
  editable: boolean;
  deleteItem: (field: BasicFormFieldDefinition<T>, item: HasUniqueId) => void;
  addItem: (field: BasicFormFieldDefinition<T>, item: HasUniqueId) => void;
};

/** React table-based array field display / edit */
export default function ChecklistArrayField<T>(
  { field, items, editable, deleteItem, addItem }: ChecklistArrayFieldProps<T>)
{
  return <Table>
    <TableBody>
      {
        // We show all items
        field.arrayItems?.map(item => {
          const name = field.getItemName?field.getItemName(item)
                      :item.id;
          const checked = items.indexOf(item) !== -1;
          return <TableRow key={item.id}>
            <TableCell sx={{ width: "1em" }} align="right">
              <Checkbox checked={checked}
                        disabled={!editable}
                        onChange={ () => checked?deleteItem(field, item)
                                        :addItem(field, item) } />
            </TableCell>
            <TableCell>{name}</TableCell>
          </TableRow>
        })
      }
    </TableBody>
  </Table>
}
