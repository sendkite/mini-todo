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

Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`; configuration is CSS-first). Components style themselves with utility classes; there is no per-component CSS.

`src/index.css` is the only stylesheet:
- `@theme` holds the design tokens. The default color palette is cleared (`--color-*: initial`), so only app colors exist: `muted` (body text), `ink` (headings), `surface`, `sidebar`, `line` (borders), `accent`, `accent-soft`, `accent-line`, `danger`, `white`. Use them as `text-ink`, `border-line`, `bg-accent-soft`, etc. Also `text-meta` (13px), `rounded-sm` (6px), `md:` = 720px, default transition 200ms ease. Spacing uses Tailwind's default 4px scale.
- Dark mode works by overriding the same `--color-*` variables in a `prefers-color-scheme: dark` block, so **don't use `dark:`** variants.
- `@layer base` holds global rules (body colors, pointer cursor on buttons, `:focus-visible` outline); a global reduced-motion rule follows it.
- Custom pieces: `field` utility (shared text-input style), `bg-check` (checkbox checkmark image), and the `hover-none:` variant (touch devices; Tailwind's `hover:`/`group-hover:` only apply on hover-capable devices).

Conditional classes are built with `[...].filter(Boolean).join(' ')` (no `clsx`). State-dependent styling uses `group`/`peer`/`aria-*` variants where possible (e.g. sidebar `aria-[current=page]:`, checked todo title `peer-checked:line-through`).
