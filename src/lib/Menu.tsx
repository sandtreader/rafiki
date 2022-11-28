// Rafiki React Menu component
// Copyright (c) Paul Clark 2022

import React, { useState, Dispatch, SetStateAction } from 'react';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Icon from '@mui/material/Icon';

import MenuStructure from './MenuStructure';
import MenuState from '../lib/MenuState';

type MenuProps = {
  structure: MenuStructure;
  state: MenuState;
  setState: Dispatch<SetStateAction<MenuState>>;
};

/** React folding menu component */
const Menu: React.FunctionComponent<MenuProps> = ({ structure, state, setState }) => {
  const [opened, setOpened] = useState<{ [id: string]: boolean }>();

  // Higher-order function to handle click on a given item ID
  const clickHandlerFn = (fullId: string, item: MenuStructure) => (e: React.MouseEvent) => {
    if (!!item.children) {
      setOpened((opened) => {
        const newOpened = { ...opened };

        // Change the one requested
        newOpened[fullId] = !newOpened[fullId];

        // If it's now closed, close any descendants too
        if (!newOpened[fullId])
          for (let oid in newOpened)
            if (oid.startsWith(fullId)) newOpened[oid] = false;

        return newOpened;
      });
    }

    const content = item.content && (typeof item.content == "function") ? item.content(item) : item.content;
    setState(state => ({ ...state, selectedItemId: fullId, content: content }));
  };

  // Recursive list generator
  const generateChildren = (
    structure: MenuStructure,
    depth: number = 0,
    parentId: string = ''
  ) => {
    return (
      <List disablePadding>
        {structure.children &&
          structure.children.map((item, index) => {
            const childId = `${parentId}${depth ? '.' : ''}${item.id}`;
            const open = opened && opened[childId];
            const hasChildren = !!item.children;
            const current = childId == state.selectedItemId;

            return (
              <React.Fragment key={index}>
                <ListItem
                  disablePadding={depth > 0}
                  role="menuitem"
                  data-testid={`menuitem.${childId}`}
                >
                  <ListItemButton
                    sx={{ pl: depth * 4 }}
                    title={childId} // todo: temp for testing
                    onClick={clickHandlerFn(childId, item)}
                    selected={current}
                  >
                    {item.icon && (
                      <ListItemIcon>
                        <Icon>{item.icon}</Icon>
                      </ListItemIcon>
                    )}
                    <ListItemText>{item.name}</ListItemText>
                    {hasChildren && (
                      <Icon>{open ? 'expand_less' : 'expand_more'}</Icon>
                    )}
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

  return (
    <Drawer variant="permanent" open={true} role="menu" id="menu">
      {generateChildren(structure)}
    </Drawer>
  );
};

export default Menu;
