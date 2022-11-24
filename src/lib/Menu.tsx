import React, { useState } from 'react';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import MailIcon from '@mui/icons-material/Mail';

import MenuStructure from './MenuStructure';

interface MenuProps {
  structure: MenuStructure;
}

/** React folding menu component */
const Menu: React.FunctionComponent<MenuProps> = ({ structure }) => {
  const [open, setOpen] = useState(true);

  return (
    <Drawer open={open} onClick={(e) => setOpen((open) => !open)}>
      <List>
        {structure.children &&
          structure.children.map((item, index) => (
            <ListItem key={index}>
              <ListItemButton>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText>{item.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Drawer>
  );
};

export default Menu;
