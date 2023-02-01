// Rafiki MenuLoader - dynamic loading of menu modules
// Copyright (c) Paul Clark 2023

import MenuStructure from './MenuStructure';
import StaticMenuProvider from './StaticMenuProvider';

/**
 * Menu loader
 */
export default class MenuLoader {
  /** List of menu names to load */
  private readonly menus: Array<string>

  /** Path to module directory */
  private readonly path: string;

  /** Constructor */
  constructor(menus: Array<string>, path: string = ".") {
    this.menus = menus;
    this.path = path;
  }

  /** Load all menus, creating a MenuProvider to serve them */
  async load(): Promise<StaticMenuProvider>
  {
    // Baseline empty structure
    const wholeMenu = new MenuStructure('root', 'root');

    for(const menuName of this.menus)
    {
      console.log(`Loading ${menuName}`);
      try
      {
        const menu = await import(`${this.path}/${menuName}`);

        // Merge this as a child of the root
        const menuChild = MenuStructure.fromLiteral({
          children: [ menu.default ]
        });
        wholeMenu.combineWith(menuChild);
      }
      catch (e)
      {
        console.log(`Unable to load module ${menuName}: ${e}`);
      }
    }

    // Menu structure provider
    return new StaticMenuProvider(wholeMenu);
  }
}
