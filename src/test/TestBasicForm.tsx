import React, { useState } from 'react';
import BasicForm, {
  BasicFormFieldDefinition,
  BasicFormFieldArrayStyle,
} from '../lib/BasicForm';
import { FormIntent } from '../lib/Types';
import { Dialog, TextField, FormControlLabel, Switch } from '@mui/material';
import { useSessionContext } from '../lib/SessionContext';

type Friend = {
  id: number;
  name: string;
};

interface TestData {
  id: string;
  name: string;
  age: number;
  email: string;
  likesBooks: boolean;
  notes?: string;
  friends?: Friend[];
  bestFriend?: Friend;
}

const whiteRabbit: Friend = { id: 2, name: 'White Rabbit' };
const madHatter: Friend = { id: 3, name: 'Mad Hatter' };
const dormouse: Friend = { id: 4, name: 'Dormouse' };
const redQueen: Friend = { id: 5, name: 'Red Queen' };

const allFriends = [whiteRabbit, madHatter, dormouse, redQueen];

const testData: TestData = {
  id: '1',
  name: 'Alice',
  age: 7,
  email: 'alice@wonderland.com',
  likesBooks: true,
  notes: 'Tendency to fantasy involving white rabbits',
  friends: [whiteRabbit, dormouse],
  bestFriend: whiteRabbit
};

const fields: BasicFormFieldDefinition<TestData>[] = [
  { key: 'name', label: 'Name' },
  {
    key: 'age',
    label: 'Age',
    render: (field, value, item, onChange) => (
      <TextField
        variant="filled"
        label={field.label}
        value={value}
        onChange={(e) => (onChange ? onChange(e.target.value) : false)}
      />
    ),
    validate: (value) => /^([1-9]\d{0,2})?$/.test(String(value)),
  },
  { key: 'email', label: 'Email' },
  { key: 'likesBooks', label: 'Likes books' },
  { key: 'notes', label: 'Notes', lines: 10 },
  {
    key: 'friends',
    label: 'Friends',
    arrayItems: () => Promise.resolve(allFriends),
    arrayStyle: BasicFormFieldArrayStyle.checklist,
    getItemName: (item) => (item as Friend).name,
  },
  {
    key: 'bestFriend',
    label: 'Best friend',
    arrayItems: () => Promise.resolve(allFriends),
    arrayStyle: BasicFormFieldArrayStyle.single,
    getItemName: (item) => (item as Friend).name,
  },
];

export interface TestBasicFormProps {
  dialog?: boolean;
}

const TestBasicForm: React.FunctionComponent<TestBasicFormProps> = ({
  dialog,
}) => {
  const [open, setOpen] = useState(true);
  const session = useSessionContext().session;
  const [editable, setEditable] = useState(true);

  const handleClose = (changed: boolean) => {
    console.log(`Closing: ${changed ? 'changed' : 'unchanged'}`);
    setOpen(false);
  };

  const handleDelete = (item: TestData) => {
    console.log('Delete:', item);
  };

  const handleSave = (item: TestData, oldItem: TestData) => {
    console.log('Save:', item);
    console.log('Old:', oldItem);
  };

  const form = () => (
    <BasicForm<TestData>
      intent={editable?FormIntent.ViewWithEdit:FormIntent.Edit}
      item={testData}
      onClose={dialog ? handleClose : undefined}
      onDelete={editable?handleDelete:undefined}
      onSave={editable?handleSave:undefined}
      fields={fields}
      getTitle={(item) => `Test: ${item.id} ${item.name}`}
    />
  );

  return (
    <div>
      <h1>Test Basic Form {dialog ? 'dialog' : ''}</h1>
      <p>User: {session.userId}</p>
      <FormControlLabel
        control={
          <Switch
            checked={editable}
            onChange={(e) => setEditable(e.target.checked) }
          />
        }
        label="Editable"
        labelPlacement="end"
      />
      {dialog ? (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth={true}
        >
          {form()}
        </Dialog>
      ) : (
        form()
      )}
    </div>
  );
};

export default TestBasicForm;
