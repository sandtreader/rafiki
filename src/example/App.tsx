import React, { useState } from 'react';
import Menu from '../lib/Menu';
import MenuStructure from '../lib/MenuStructure';
import StaticMenuProvider from '../lib/StaticMenuProvider';
import exampleMenu, { additionalMenu } from '../test/ExampleMenuStructure';
import MenuState from '../lib/MenuState';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';

function App() {
  const provider = new StaticMenuProvider(exampleMenu);
  const structure = provider.getMenu();
  structure.combineWith(additionalMenu);
  const [state, setState] = useState<MenuState>({});

  return (
    <div className="App">
      <Drawer variant="permanent" open={true} role="menu" id="menu">
        <Menu structure={structure} state={state} setState={setState} />
      </Drawer>
      <Container>{state.content}</Container>
    </div>
  );
}

export default App;
