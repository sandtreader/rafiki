// Rafiki MenuStructure - defines structure and routing for a Menu
// Copyright (c) Paul Clark 2022

/**
 * Definition of a recursive menu structure
 */
export default class MenuStructure {
  /** Internal ID */
  public readonly id: string;

  /** User-visible name */
  public readonly name: string;

  /** Icon name (from Material font, snake_case) */
  public icon?: string;

  /** Children items */
  public children?: Array<MenuStructure>;

  /** Static content or factory function generating content */
  public content?: JSX.Element | ((item: MenuStructure) => JSX.Element);

  /** Constructor */
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
