// Display/edit of a form array field with chips

import { TextField, Stack, Chip, Autocomplete
} from '@mui/material';

import { HasUniqueId } from './Types';
import { BasicFormFieldDefinition } from './BasicForm';

/** ChipArrayField props, parameterised by the type we are displaying */
export interface ChipArrayFieldProps<T>
{
  field: BasicFormFieldDefinition<T>;
  items: HasUniqueId[];
  allItems: HasUniqueId[];
  editable: boolean;
  deleteItem: (field: BasicFormFieldDefinition<T>, item: HasUniqueId) => void;
  addItem: (field: BasicFormFieldDefinition<T>, item: HasUniqueId) => void;
};

/** React chip-based array field display / edit */
export default function ChipArrayField<T>(
  { field, items, allItems, editable, deleteItem, addItem
  }: ChipArrayFieldProps<T>)
{
  // Get the possible items not already used
  const unusedItems = allItems?.filter(
    ai => !items.find(i => ai.id === i.id)) || [];

  return <Stack direction="column" spacing={2}>
    <Stack direction="row" spacing={0} flexWrap="wrap"
           justifyContent="flex-start" alignItems="center">
      {
        // Current items
        items.map(item => {
          const name = field.getItemName?field.getItemName(item)
                      :item.id;
          return <Chip key={item.id} label={name}
                       variant="outlined"
                       sx={{ marginRight: "8px",
                             marginBottom: "8px" }}
                       onDelete={editable?
                                 () => deleteItem(field, item)
                                      :undefined}
          />
        })
      }
    </Stack>

    {
      // Selector to add new ones
      editable && unusedItems.length > 0 &&
      <Autocomplete
        blurOnSelect={true}
        getOptionLabel={ item => (field.getItemName && field.getItemName(item))
                            || String(item.id) }
        options={unusedItems}
        renderInput={(params) => <TextField {...params} fullWidth
                                            label="Add" />}
        value={null}
        onChange={ (e, value) => { if (value) addItem(field, value); } }
      />
    }
  </Stack>
}

