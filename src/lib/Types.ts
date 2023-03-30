// Rafiki React generic types
// Copyright (c) Paul Clark 2023

/** Ensure that a type has an 'id' field that we can rely on for React keys */
export interface HasUniqueId {
  id: string | number;
}

