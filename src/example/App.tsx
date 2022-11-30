import React, { useRef, useState } from 'react';
import Menu from '../lib/Menu';
import StaticMenuProvider from '../lib/StaticMenuProvider';
import exampleMenu, { additionalMenu } from '../test/ExampleMenuStructure';
import MenuState from '../lib/MenuState';
import FakeAuthenticationProvider from '../lib/FakeAuthenticationProvider';
import SessionState from '../lib/SessionState';

import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

function App() {
  // Authentication provider and state
  const authProvider = new FakeAuthenticationProvider;
  const [session, setSession] = useState<SessionState>();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // Menu provider and state
  const menuProvider = new StaticMenuProvider(exampleMenu);
  const menuStructure = menuProvider.getMenu();
  menuStructure.combineWith(additionalMenu);
  const [menuState, setMenuState] = useState<MenuState>({});

  // Actions
  const submitLogin = () => {
    console.log(`Logging in ${userId} with ${password}`);
    setSession(authProvider.login(userId, password));
  }

  const logOut = () => {
    session && authProvider.logout(session);
    setSession({ loggedIn: false });
    setPassword('');
  }

  return (
    <div className="App">
      {
        // Login screen
        !session?.loggedIn &&
        <Container maxWidth='sm'>
          <form onSubmit={(e) => submitLogin()}>
            <Stack spacing={2}>
              <Typography variant='h2'>Rafiki Administration Framework Test</Typography>
              <TextField value={userId} onChange={(e) => setUserId(e.target.value)} label="User name" required />
              <TextField value={password} onChange={(e) => setPassword(e.target.value)}
                id="password" label="Password" type="Password" required />
              <Button type="submit" variant="contained">Log in</Button>
              {session?.error && <Alert severity='error'>{session.error}</Alert>}
            </Stack>
          </form>
        </Container>
      }

      {
        // Menu and content
        session?.loggedIn &&
        <>
          <Drawer variant="permanent" open={true} role="menu" id="menu">
            <Menu structure={menuStructure} state={menuState} setState={setMenuState} />
            <Button variant="contained" onClick={(e) => logOut()}>Log out</Button>
          </Drawer>
          <Container maxWidth='md'>{menuState.content}</Container>
        </>
      }
    </div>
  );
}

export default App;
