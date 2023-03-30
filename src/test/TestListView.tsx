import React from 'react';
import FilteredView from '../lib/FilteredView';
import ListView, { ListViewColumnDefinition } from '../lib/ListView';

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
];

const columns: ListViewColumnDefinition<TestData>[] = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'email', label: 'Email' },
];

const TestListView: React.FunctionComponent = () => {
  const handleSelect = (item: TestData) => {
    console.log('Select:', item);
  };

  const handleDelete = (item: TestData) => {
    console.log('Delete:', item);
  };

  return (
    <div>
      <h1>Test Filtered List View</h1>
      <FilteredView<TestData> items={testData} searchColumns={['name', 'age']}>
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
