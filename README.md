# Better matching guided answers

Standalone frontend-only prototype of Stonly's **AI & Automation → Guided answers** "Assign
queries" flow (extracted from the broader `guided-answers-demo` multi-version prototype, keeping
only what shipped as "V3"). Nothing talks to a backend — all data is in-memory/mocked client-side.

## Real components, not replicas

This app vendors the actual Stonly design system and editor components rather than recreating
them:

- `src/ui/` — vendored copy of the Stonly design system (ActionsDialog, ModalWindow, inputs,
  buttons, Notification, Flex, Tooltip, theme tokens...)
- `@stonly/design-system` (real npm package, installed via the Bitbucket git dependency) — used
  directly for a few interactive components (LanguageSelector, the "Generate queries" popover)
- `src/stonly-editor/` — the real editor components/mocked API layer this flow is built on
- `src/editorCommon/` — editor `Tabs`, `useLocalStorageValue`, scrollbar styles
- `src/i18n.resources.json` — the real `AiSources.GuidedAnswers` strings

Same aliases as the monorepo (`@ui/*`, `@editorCommon/*`, `@stonlyCommons/*`), React 16 +
styled-components v6 + the editor's merged theme (legacy colors + design-system tokens).

## What's included

- Answers list: filters, search, "Add new", row click opens Edit.
- Add answer: Step 1 of 2 (label, response type, guide) → Step 2 of 2 ("Assign queries").
- Edit answer: single tabbed modal (Answer | Queries (N) | Settings).
- Assign queries screen: sticky search + language toolbar, AI-generated vs. manually-typed query
  rows (with their own icon and tooltip), an inline "Generate queries from intent" popover next to
  "+ Add query", a "no results" empty state when searching, and a green highlight + auto-scroll
  when a generated batch lands.

## What's intentionally NOT included

Everything backend: real generation, embeddings, matching, persistence (refreshing the page resets
state; the dismissed query tip persists via localStorage).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Deploy to Vercel

```bash
npx vercel --prod
```

Vercel auto-detects Vite (build `npm run build`, output `dist`).
