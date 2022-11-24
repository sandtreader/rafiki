// Rafiki MenuProvider - interface to construct a menu section
// Copyright (c) Paul Clark 2022

import MenuStructure from './MenuStructure';

/** Menu provider interface */
export default interface MenuProvider {
  /** Get a menu structure */
  getMenu(): MenuStructure;
}
