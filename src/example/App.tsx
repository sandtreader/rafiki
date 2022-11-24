import React from 'react';
import Menu from '../lib/Menu';
import StaticMenuProvider from '../lib/StaticMenuProvider';
import exampleMenu from '../test/ExampleMenuStructure';

function App() {
  const provider = new StaticMenuProvider(exampleMenu);
  const structure = provider.getMenu();
  return (
    <div className="App">
      <Menu structure={structure} />
    </div>
  );
}

export default App;
