import React, { useState } from 'react';
import DetailForm, { DetailFormIntent, DetailFormFieldDefinition }
  from '../lib/DetailForm';

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

const TestDetailForm: React.FunctionComponent = () => {
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

  return (
    <div>
      <h1>Test Detail Form</h1>
      {
        open &&
        <DetailForm<TestData>
          intent={DetailFormIntent.ViewWithEdit}
          item={testData}
          onClose={handleClose}
          onDelete={handleDelete}
          onSave={handleSave}
          fields={fields}
          getTitle={ item => `Test: ${item.id} ${item.name}` }
          />
      }
    </div>
  );
};

export default TestDetailForm;
