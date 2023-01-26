import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import MenuProvider from './MenuProvider';
import MenuState from './MenuState';
import MenuStructure from './MenuStructure';
import AuthenticationProvider from './AuthenticationProvider';
import SessionState from './SessionState';

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

type FrameworkProps = {
  authProvider: AuthenticationProvider;
  menuProvider: MenuProvider;  // !!! List of them, to combine?
};

/** Top-level framework - construct this in your <App/> */
const Framework: React.FunctionComponent<FrameworkProps> = ({
  authProvider,
  menuProvider
}) => {
  // Session state
  const [session, setSession] = useState<SessionState>();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // Menu structure and state
  const [menu, setMenu] = useState<MenuStructure>();
  const [menuState, setMenuState] = useState<MenuState>({});

  // Init only - load full menu structure
  useEffect(() => {
    console.log("Create menu");
    const menu = menuProvider.getMenu();
    setMenu(menu);
  }, [menuProvider]);

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
    <div className="Framework">
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

export default Framework;