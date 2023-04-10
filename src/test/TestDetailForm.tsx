import React, { useState } from 'react';
import DetailForm, { DetailFormIntent, DetailFormFieldDefinition }
from '../lib/DetailForm';
import { Dialog } from '@mui/material';

interface TestData {
  id: string;
  name: string;
  age: number;
  email: string;
}

const testData: TestData =
  { id: '1', name: 'Alice', age: 30, email: 'alice@example.com' };

const fields: DetailFormFieldDefinition<TestData>[] = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'email', label: 'Email' }
];

export interface TestDetailFormProps {
  dialog?: boolean;
};

const TestDetailForm: React.FunctionComponent<TestDetailFormProps> =
  ({ dialog }) => {
    const [open, setOpen] = useState(true);

    const handleClose = (changed: boolean) => {
      console.log(`Closing: ${changed?"changed":"unchanged"}`);
      setOpen(false);
    };

    const handleDelete = (item: TestData) => {
      console.log('Delete:', item);
    };

    const handleSave = (item: TestData) => {
      console.log('Save:', item);
    };

    const form = () =>
      <DetailForm<TestData>
        intent={DetailFormIntent.ViewWithEdit}
        item={testData}
        onClose={dialog?handleClose:undefined}
        onDelete={handleDelete}
        onSave={handleSave}
        fields={fields}
        getTitle={ item => `Test: ${item.id} ${item.name}` }
        />;

    return (
      <div>
        <h1>Test Detail Form {dialog?"dialog":""}</h1>
        {
          dialog?
          <Dialog open={open} onClose={handleClose}
                  maxWidth="md" fullWidth={true}>
            { form() }
          </Dialog>
          : form()
        }
      </div>
    );
  };

export default TestDetailForm;
