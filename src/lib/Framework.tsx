import React, { ReactNode, useEffect, useState } from 'react';
import Menu from './Menu';
import MenuProvider from './MenuProvider';
import MenuState from './MenuState';
import MenuStructure from './MenuStructure';
import AuthenticationProvider from './AuthenticationProvider';
import SessionState from './SessionState';
import { SessionContextProvider } from './SessionContext';

import {
  Container,
  Box,
  Drawer,
  TextField,
  Button,
  Stack,
  Alert,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';

type FrameworkProps = {
  authProvider: AuthenticationProvider;
  menuProvider: MenuProvider;
  title: string;
  onSessionChange?: (session: SessionState) => void;
  /** Render status content for the right of the app bar - called with the
      current session, or undefined when not logged in, and a function to
      log out */
  headerStatus?: (session?: SessionState, logOut?: () => void) => ReactNode;
  /** Hide the drawer Log out button - for apps which provide their own way
      to log out, e.g. via headerStatus */
  hideLogout?: boolean;
};

/** Top-level framework - construct this in your <App/> */
const Framework: React.FunctionComponent<FrameworkProps> = ({
  authProvider,
  menuProvider,
  title,
  onSessionChange,
  headerStatus,
  hideLogout,
}) => {
  // Session state
  const [session, setSession] = useState<SessionState>();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // Menu structure and state
  const [menu, setMenu] = useState<MenuStructure>();
  const [menuState, setMenuState] = useState<MenuState>({});

  // Init only - load full menu structure
  useEffect(() => {
    console.log('Create menu');
    const menu = menuProvider.getMenu();
    setMenu(menu);
  }, [menuProvider]);

  // On session change, refilter capabilities
  useEffect(() => {
    setMenu((m) => {
      console.log('Filter menu');
      const newMenu = MenuStructure.fromLiteral(m);
      newMenu.filterWithCapabilities(session?.capabilities || []);
      return newMenu;
    });
  }, [session?.capabilities]);

  // Actions
  const submitLogin = async () => {
    console.log(`Logging in ${userId} with ${password}`);
    const session = await authProvider?.login(userId, password);
    setSession(session);
    if (onSessionChange) onSessionChange(session);
  };

  const logOut = async () => {
    session && (await authProvider?.logout(session));
    setSession(new SessionState(false));
    setPassword('');
    onSessionChange && session && onSessionChange(session);
  };

  return (
    <div className="Framework">
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h4">{title}</Typography>
          {headerStatus && (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Box>{headerStatus(session, logOut)}</Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      {
        // Login screen
        !session?.loggedIn && (
          <Container maxWidth="sm" sx={{ marginTop: 5 }}>
            <form
              onSubmit={(e) => {
                submitLogin();
                e.preventDefault();
              }}
            >
              <Stack spacing={2}>
                <TextField
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  label="User name"
                  required
                />
                <TextField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  label="Password"
                  type="Password"
                  required
                />
                <Button type="submit" variant="contained">
                  Log in
                </Button>
                {session?.error && (
                  <Alert severity="error">{session.error}</Alert>
                )}
              </Stack>
            </form>
          </Container>
        )
      }

      {
        // Menu and content
        session?.loggedIn && menu && (
          <SessionContextProvider session={session}>
            <Stack direction="row">
              <Drawer variant="permanent" sx={{ width: 280 }}>
                <Box
                  sx={{
                    width: 280,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Toolbar />
                  <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <Menu
                      structure={menu}
                      state={menuState}
                      setState={setMenuState}
                    />
                  </Box>
                  {!hideLogout && (
                    <Button
                      variant="contained"
                      sx={{ margin: 2, marginTop: 1, width: 250 }}
                      onClick={(e) => logOut()}
                    >
                      Log out
                    </Button>
                  )}
                </Box>
              </Drawer>
              <Container maxWidth={false}>{menuState.content}</Container>
            </Stack>
          </SessionContextProvider>
        )
      }
    </div>
  );
};

export default Framework;
