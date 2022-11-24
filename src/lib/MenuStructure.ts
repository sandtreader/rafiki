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

  /** Children items */
  public readonly children?: Array<MenuStructure>;

  /** Constructor */
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
