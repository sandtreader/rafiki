# Rafiki React Administration Framework

A lightweight React framework for creating administration / management portals.

## Features

- **Pluggable authentication** — swap between JWT, fake (dev), or custom providers
- **Pluggable menu generation** — static or dynamically loaded menu structures
- **Capability-based access control** — glob-pattern requirements on menu items
- **Generic CRUD components** — type-safe list, form, and list+edit page components built on Material-UI

## Installation

```bash
npm install @sandtreader/rafiki
```

Peer dependencies: React 18, MUI 5, Emotion.

## Quick start

```tsx
import {
  Framework,
  FakeAuthenticationProvider,
  StaticMenuProvider,
  MenuStructure,
} from '@sandtreader/rafiki';

const authProvider = new FakeAuthenticationProvider();
const rootMenu = new MenuStructure('root', 'root');
const menuProvider = new StaticMenuProvider(rootMenu);

function App() {
  return (
    <Framework
      authProvider={authProvider}
      menuProvider={menuProvider}
      title="My Admin Portal"
    />
  );
}
```

## Core concepts

### Framework

The top-level `Framework` component provides the app shell (AppBar + Drawer + content area) and manages the login/logout flow.

```tsx
<Framework
  authProvider={authProvider}
  menuProvider={menuProvider}
  title="My Portal"
  onSessionChange={(session) => console.log(session)}
/>
```

### Authentication providers

Implement `AuthenticationProvider` for custom auth:

```typescript
interface AuthenticationProvider {
  login(userId: string, password: string): Promise<SessionState>;
  logout(session: SessionState): Promise<void>;
}
```

Built-in providers:
- `JWTAuthenticationProvider(url)` — POST credentials to a URL, expects a JWT response
- `FakeAuthenticationProvider` — dev-only (credentials: admin/admin or test/foo)

### Menu structure

Menus are hierarchical and defined as `MenuStructure` objects. Use `fromLiteral()` for concise definitions:

```typescript
const menu = MenuStructure.fromLiteral({
  id: 'users', name: 'Users', icon: 'people',
  requirements: ['admin.*'],
  content: <UsersPage />,
  children: [
    { id: 'roles', name: 'Roles', icon: 'badge', content: <RolesPage /> },
  ],
});
```

- `icon` — Material Design icon name
- `requirements` — glob patterns matched against the session's capabilities array; item is hidden if the user lacks a matching capability
- `content` — JSX element or factory function `(item: MenuStructure) => JSX.Element`

Menus support dynamic loading (webpack dynamic imports) — see `src/example/App.tsx`.

### ListEditPage

A complete CRUD interface combining list view, search/filter, and form dialogs:

```tsx
<ListEditPage<User>
  typeName="User"
  fetchItems={() => api.getUsers()}
  createItem={(id) => api.createUser(id)}
  cloneItem={(source, newId) => api.cloneUser(source, newId)}
  saveItem={(item, old) => api.saveUser(item)}
  deleteItem={(item) => api.deleteUser(item)}
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
  ]}
  fields={[
    { key: 'id', label: 'ID', validate: (v) => !!v },
    { key: 'name', label: 'Name' },
  ]}
/>
```

### BasicForm

Multi-intent form that renders differently based on `FormIntent` (View, ViewWithEdit, Edit, Create). Supports custom field rendering, validation, and array fields displayed as chips, tables, or checklists (`BasicFormFieldArrayStyle`).

### FormIntent lifecycle

Components use `FormIntent` to drive their behaviour:

| Intent | Behaviour |
|--------|-----------|
| `View` | Read-only display |
| `ViewWithEdit` | Read-only with an edit button |
| `Edit` | Editable fields, save/cancel |
| `Create` | Editable fields for a new item |

### Types

All domain objects must implement `HasUniqueId`:

```typescript
interface HasUniqueId {
  id: string | number;
}
```

## Development

```bash
npm install
npm start            # run the example app
npm test             # run tests (watch mode)
npm run lint         # check formatting
npm run format       # auto-format
npm run build:lib    # build library to dist/
npm run publish:lib  # build + publish to npm
```
