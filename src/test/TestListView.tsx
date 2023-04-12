import React from 'react';
import FilteredView from '../lib/FilteredView';
import ListView, { ListViewColumnDefinition } from '../lib/ListView';
import { Button } from '@mui/material';

interface TestData {
  id: string;
  name: string;
  age: number;
  email: string;
}

const testData: TestData[] = [
  { id: '1', name: 'Alice', age: 30, email: 'alice@example.com' },
  { id: '2', name: 'Bob', age: 25, email: 'bob@example.com' },
  { id: '3', name: 'Carol', age: 35, email: 'carol@example.com' },
  { id: '4', name: 'Abigail', age: 6, email: 'abby@sortsfirst.net' },
];

const columns: ListViewColumnDefinition<TestData>[] = [
  { key: 'name', label: 'Name', sort: true },
  { key: 'age', label: 'Age',
    render: (item) => item.age > 30?"Over 30":item.age },
  { key: 'email', label: 'Email' },
];

const TestListView: React.FunctionComponent = () => {
  const handleSelect = (item: TestData) => {
    console.log('Select:', item);
  };

  const handleDelete = (item: TestData) => {
    console.log('Delete:', item);
  };

  const handleCreate = () => {
    console.log('Create');
  };

  const extras = [ <Button variant="outlined">Extra</Button> ];

  return (
    <div>
      <h1>Test Filtered List View</h1>
      <FilteredView<TestData>
        items={testData}
        searchColumns={['name', 'age']}
        onCreate={handleCreate}
        headerExtras={extras}
        >
        {(filteredItems: TestData[]) => (
          <ListView<TestData>
            items={filteredItems}
            onSelect={handleSelect}
            onDelete={handleDelete}
            columns={columns}
            />
        )}
      </FilteredView>
    </div>
  );
};

export default TestListView;
