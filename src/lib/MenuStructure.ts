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

  /** Merge with another menu structure. */
  // Trees are recursively combined by ID, modifying this one
  // Other entries' names & icons are ignored when merging (ours takes priority)
  // New items are just references to the 'other' structure
  combineWith(other: MenuStructure) {
    // Scan all their children to see if we already have it
    if (!other.children) return;
    for (const otherChild of other.children) {
      let merged = false;

      // Force this.children to exist
      if (!this.children) this.children = [];

      // See if we already have it
      for (const ourChild of this.children) {
        if (ourChild.id === otherChild.id) {
          // Recurse to merge
          ourChild.combineWith(otherChild);
          merged = true;
          break;
        }
      }

      // If it's new, just add it
      if (!merged) this.children.push(otherChild);
    }
  }
}
