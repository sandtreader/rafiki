import React, { useEffect, useRef, useState } from 'react';
import Menu from '../lib/Menu';
import StaticMenuProvider from '../lib/StaticMenuProvider';
import exampleMenu, { additionalMenu } from '../test/ExampleMenuStructure';
import MenuState from '../lib/MenuState';
import MenuStructure from '../lib/MenuStructure';
import AuthenticationProvider from '../lib/AuthenticationProvider';
import FakeAuthenticationProvider from '../lib/FakeAuthenticationProvider';
import JWTAuthenticationProvider from '../lib/JWTAuthenticationProvider';
import SessionState from '../lib/SessionState';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

function App() {
  // Authentication provider and state
  const [authProvider, setAuthProvider] = useState<AuthenticationProvider>();
  const [session, setSession] = useState<SessionState>();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // Init only - create auth provider
  useEffect(() => {
    console.log("Create auth provider");
//    setAuthProvider(new FakeAuthenticationProvider());
    setAuthProvider(new JWTAuthenticationProvider("http://localhost:7081/login"));
  }, []);

  // Menu structure and state
  const [menu, setMenu] = useState<MenuStructure>();
  const [menuState, setMenuState] = useState<MenuState>({});

  // Init only - load full menu structure
  useEffect(() => {
    console.log("Create menu");
    const menuProvider = new StaticMenuProvider(exampleMenu);
    const menu = menuProvider.getMenu();
    menu.combineWith(additionalMenu);
    setMenu(menu);
  }, []);

  // On session change, refilter capabilities
  useEffect(() => {
    setMenu(m => {
      console.log("Filter menu");
      const newMenu = MenuStructure.fromLiteral(m);
      newMenu.filterWithCapabilities(session?.capabilities || []);
      return newMenu;
    })
  }, [session?.capabilities]);

  // Actions
  const submitLogin = async () => {
    console.log(`Logging in ${userId} with ${password}`);
    setSession(await authProvider?.login(userId, password));
  }

  const logOut = async () => {
    session && await authProvider?.logout(session);
    setSession({ loggedIn: false });
    setPassword('');
  }

  return (
    <div className="App">
      <AppBar position='fixed'
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant='h4'>
            Rafiki Administration Framework Test
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      {
        // Login screen
        !session?.loggedIn &&
        <Container maxWidth='sm' sx={{ marginTop: 5 }}>
          <form onSubmit={(e) => { submitLogin(); e.preventDefault(); }}>
            <Stack spacing={2}>
              <TextField value={userId}
                         onChange={(e) => setUserId(e.target.value)}
                         label="User name" required />
              <TextField value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         id="password" label="Password"
                         type="Password" required />
              <Button type="submit" variant="contained">Log in</Button>
              {session?.error && <Alert severity='error'>{session.error}</Alert>}
            </Stack>
          </form>
        </Container>
      }

      {
        // Menu and content
        session?.loggedIn && menu &&
        <>
          <Stack direction='row'>
            <Drawer variant='permanent' sx={{ width: 280 }}>
              <Toolbar />
              <Menu structure={menu} state={menuState}
                    setState={setMenuState} />
              <Button variant="contained"
                      onClick={(e) => logOut()}>Log out</Button>
            </Drawer>
            <Box>{menuState.content}</Box>
          </Stack>
        </>
      }
    </div >
  );
}

export default App;
