// Rafiki StaticMenuProvider - build a menu from a static object
// Copyright (c) Paul Clark 2022

import MenuStructure from './MenuStructure';
import MenuProvider from './MenuProvider';

/** Menu provider interface */
export default class StaticMenuProvider implements MenuProvider {
  /** Static menu structure */
  public readonly model: MenuStructure;

  /** Constructor
   *
   * @param model - Model object
   */
  constructor(model: MenuStructure) {
    this.model = model;
  }

  /** Get a menu structure */
  getMenu(): MenuStructure {
    return this.model;
  }
}
