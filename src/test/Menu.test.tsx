import React from 'react';
import { render } from '@testing-library/react';
import Menu from '../lib/Menu';
import exampleMenu from '../test/ExampleMenuStructure';
import StaticMenuProvider from '../lib/StaticMenuProvider';

test('it renders the example menu', () => {
  const provider = new StaticMenuProvider(exampleMenu);
  const structure = provider.getMenu();
  render(<Menu structure={structure} />);
});
