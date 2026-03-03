# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Rafiki (`@sandtreader/rafiki`) — a lightweight React framework for building admin/management portals. Published as an ES module library via microbundle.

## Commands

- `npm start` — dev server for the example app
- `npm test` — run tests (react-scripts test, watch mode by default; use `-- --watchAll=false` for single run)
- `npm run lint` — check formatting with prettier
- `npm run format` — auto-format with prettier
- `npm run build:lib` — build the library to dist/ (CJS, ESM, UMD via microbundle)
- `npm run watch:lib` — watch mode for library build
- `npm run publish:lib` — build + publish to npm

## Architecture

The library source lives in `src/lib/` and is exported through `src/rafiki.ts`. The example app (`src/example/`, `src/index.tsx`) demonstrates usage but is not part of the published package.

### Core patterns

- **Pluggable providers**: Authentication and menu generation use provider interfaces (`AuthenticationProvider`, `MenuProvider`) with swappable implementations
- **Capability-based access**: Menu items declare `requirements` (glob patterns like `test*`, `bar.admin`); the Framework filters visibility based on `SessionState.capabilities`
- **Generic typed components**: `ListView<T>`, `BasicForm<T>`, `ListEditPage<T>` etc. require `T extends HasUniqueId` (items must have an `id` field)
- **FormIntent lifecycle**: Components use `FormIntent` enum (View, ViewWithEdit, Edit, Create) to control read-only vs editable rendering
- **Session context**: `SessionContext` (React Context) shares auth state, user ID, capabilities, and JWT tokens

### Key components

| Component | Role |
|-----------|------|
| `Framework` | Top-level shell: AppBar + Drawer + login/logout flow |
| `ListEditPage` | Full CRUD page combining ListView + FilteredView + BasicForm in dialogs |
| `BasicForm` | Multi-intent form with field definitions and validation |
| `ListView` / `FilteredView` | Table display with sorting, search, delete/clone actions |
| `Menu` | Recursive hierarchical nav, capability-filtered |

### Auth implementations

- `JWTAuthenticationProvider` — HTTP POST JWT auth
- `FakeAuthenticationProvider` — dev-only (admin/admin or test/foo)

## Code style

- TypeScript strict mode, single quotes (prettier config)
- Material-UI v5 + Emotion for styling
- ES modules throughout
