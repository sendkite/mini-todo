# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build (type-check is part of the build)
npm run lint      # oxlint (config: .oxlintrc.json)
npm run preview   # serve the production build
```

There is no test runner configured. The `models/` layer has no React imports, so it can be checked in isolation with `node --experimental-strip-types <script>.ts` (use explicit `.ts` import paths in such scripts).

## Stack notes

- React 19 + TypeScript + Vite, with the **React Compiler** enabled via `babel-plugin-react-compiler` (see `vite.config.ts`). Don't add manual `useMemo`/`useCallback` for performance.
- `tsconfig.app.json` sets `erasableSyntaxOnly` and `verbatimModuleSyntax`: no constructor parameter properties, enums or namespaces in classes; use `import type` for type-only imports.

## Architecture

Layered structure following Martin Fowler's "Modularizing React Apps". React is only the view layer; dependencies point one way:

`components → hooks → api → models` (`types.ts` holds backend response shapes and is only used by `api/`).

- `models/` — plain classes with business rules and no UI/React imports. Instances are immutable (`Todo.toggled()` returns a new object). Rules live here, not in components: `List.contains(todo)`, `List.groups(todos)`, `List.openCount(todos)`, `List.canAdd`.
- `api/` — gateways (anti-corruption layer). They convert `Remote*` types (snake_case, e.g. `list_id`) into model instances. Currently backed by hardcoded sample data behind an async function; replace the body with `fetch()` without touching hooks or components.
- `hooks/` — state and orchestration (`useTodos` owns the todo array and `add`/`toggle`/`rename`/`setDueDate`/`remove`; `useLists` owns lists and the active list). All state is in memory, so a refresh resets to the sample data.
- `components/` — presentational; receive models and callbacks via props and never fetch or branch on business rules. `App.tsx` only wires hooks to components.

Domain behaviours worth knowing before editing:
- A todo belongs to one list (`listId`). Sidebar counts are computed from open todos, not stored.
- **Logbook** is a derived view: it shows completed todos from every list, has no count, and `canAdd` is false (the add button is hidden). Completed todos appear *only* there — checking a todo removes it from its list (and Today); unchecking it in Logbook returns it to its original list. Logbook is ordered by `Todo.completedAt` (newest first) and split into per-day sections by `List.groups()`; `toggled()` stamps/clears `completedAt`.
- **Today** also shows open todos from any list whose `dueDate` is today or overdue (`Todo.isOverdue`). Dates are `'YYYY-MM-DD'` local-day strings (`models/date.ts`).

## Styling

Plain global CSS, two files with a one-way dependency:
- `src/index.css` — design tokens on `:root` (colors with a `prefers-color-scheme: dark` override, `--space-*`, `--radius-*`, `--transition`, fonts), base typography, `#root`.
- `src/App.css` — reset, base form-control styles, accessibility rules, then the Things-style two-pane layout (`.sidebar`, `.content`, `.todo-item`, `.toolbar`). Uses CSS nesting. Always use the tokens rather than hardcoded values; app colors come from `--accent` / `--border` etc. so dark mode works automatically.

`App.css` is imported from `App.tsx` and loads after `index.css`, so equal-specificity rules in `App.css` win.
