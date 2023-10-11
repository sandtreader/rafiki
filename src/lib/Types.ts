// Rafiki React generic types
// Copyright (c) Paul Clark 2023

/** Ensure that a type has an 'id' field that we can rely on for React keys */
export interface HasUniqueId {
  id: string | number;
}

/** Initial intent of a form */
export enum FormIntent {
  View,
  ViewWithEdit,
  Edit,
  Create,
}

/** Generic form props, parameterised by the type we are displaying */
export type FormProps<T> = {
  intent: FormIntent;
  item: T;
  onClose?: (changed: boolean) => void;
};
