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

  /** Capabilities required - if multiple, all must be satified (AND) */
  public requirements?: Array<string>;

  /** Whether this item is hidden */
  public hidden: boolean = false;

  /** Constructor */
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  /** Create from object literal without methods */
  static fromLiteral(data: any): MenuStructure {
    const ms = new this(data.id, data.name);
    ms.icon = data.icon;
    // We have to recurse to convert children into real MenuStructure objects too
    if (data.children) {
      ms.children = [];
      for (const dataChild of data.children)
        ms.children.push(this.fromLiteral(dataChild));
    }
    ms.content = data.content;
    ms.requirements = data.requirements;
    return ms;
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

  /** Filter with a set of capability patterns
   * Sets the hidden flag if not wanted
   */
  filterWithCapabilities(capabilities: Array<string>) {
    this.hidden = false;
    // See if we match ourselves
    if (this.requirements) {
      for (const requirement of this.requirements) {
        let found = false;
        for (const capability of capabilities) {
          // We test the requirement against the capability pattern
          const re = new RegExp(capability);
          if (re.test(requirement)) {
            found = true;
            break;
          }
        }

        if (!found) {
          this.hidden = true;
          return; // Lasy AND
        }
      }
    }

    // Filter any children too
    if (this.children)
      this.children.forEach((child) =>
        child.filterWithCapabilities(capabilities)
      );

    return true;
  }
}
