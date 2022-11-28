// Rafiki MenuState - current state of the menu
// Copyright (c) Paul Clark 2022

/** Menu state */
export default interface MenuState {
  /** Current selected item ID */
  selectedItemId?: string;
  
  /** React component to show in content pane */
  content?: JSX.Element;
};

