import React, { useState } from 'react';
import Menu from '../lib/Menu';
import StaticMenuProvider from '../lib/StaticMenuProvider';
import exampleMenu from '../test/ExampleMenuStructure';
import MenuState from '../lib/MenuState';
import Container from '@mui/material/Container';

function App() {
  const provider = new StaticMenuProvider(exampleMenu);
  const structure = provider.getMenu();
  const [state, setState] = useState<MenuState>({});

  return (
    <div className="App">
      <Menu structure={structure} state={state} setState={setState} />
      <Container>
        {state.content}
      </Container>
    </div>
  );
}

export default App;
