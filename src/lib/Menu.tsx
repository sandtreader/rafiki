// Rafiki React Menu component
// Copyright (c) Paul Clark 2022

import React, { useState } from 'react';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

import MailIcon from '@mui/icons-material/Mail';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import MenuStructure from './MenuStructure';
import { isNullOrUndefined } from 'util';

interface MenuProps {
  structure: MenuStructure;
}

/** React folding menu component */
const Menu: React.FunctionComponent<MenuProps> = ({ structure }) => {
  const [opened, setOpened] = useState<{ [id: string]: boolean }>();

  // Higher-order function to toggle open state for a given item ID
  const toggleLevelFn = (id: string) => (e: React.MouseEvent) => {
    setOpened((opened) => ({ ...opened, [id]: !opened || !opened[id] }));
  };

  // Recursive list generator
  const generateChildren = (
    structure: MenuStructure,
    depth: number = 0,
    parentId: string = ''
  ) => {
    return (
      <List component="div">
        {structure.children &&
          structure.children.map((item, index) => {
            const childId = `${parentId}${depth ? '.' : ''}${item.id}`;
            const open = opened && opened[childId];
            const hasChildren = !!item.children;

            return (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemButton
                    sx={{ pl: depth * 4 }}
                    title={childId} // todo: temp for testing
                    onClick={hasChildren ? toggleLevelFn(childId) : undefined}
                  >
                    <ListItemIcon>
                      <MailIcon />
                    </ListItemIcon>
                    <ListItemText>{item.name}</ListItemText>
                    {hasChildren &&
                      (open ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                  </ListItemButton>
                </ListItem>
                <Collapse in={open}>
                  {generateChildren(item, depth + 1, childId)}
                </Collapse>
              </React.Fragment>
            );
          })}
      </List>
    );
  };

  return <Drawer open={true}>{generateChildren(structure)}</Drawer>;
};

export default Menu;
