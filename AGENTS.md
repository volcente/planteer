# AGENTS.md

Angular 22 standalone app in `src/` (single project, no monorepo). Package manager is **bun** — use `bun`/`bunx`/`bun run`, never `npm`/`yarn`/`pnpm` (lockfile drift).

## Commands

```sh
bun install                                              # setup
bun start                                                # dev server on :4200
bun run check:all                                        # fmt check + lint (the gate)
bun run fix:all                                          # auto-fix fmt + lint
bunx ng build                                            # prod build; also the de facto typecheck
bunx ng test --watch false                               # all tests, one-shot
bunx ng test --include src/app/foo.spec.ts --watch false # single file
bunx ng test --filter "test name" --watch false          # single test (regex on suite/test name)
```

- `ng test` defaults to watch mode; always pass `--watch false` for one-shot runs. Non-matching tests show as "skipped", not errors.
- There is no typecheck script — `ng build` / `ng test` type-check through the Angular compiler. Plain `tsc` is not wired up (`tsconfig.json` is a project-references shell with `files: []`).
- `ng e2e` is not configured (README mentions it anyway); it only prompts to install an e2e framework.

## Formatting & linting

- **oxfmt** + **oxlint**, not Prettier/ESLint. Lint is type-aware (`typeAware: true` via oxlint-tsgolint).
- oxfmt enforces tabs, single quotes, 80 cols, sorted imports, sorted Tailwind classes, sorted package.json. Don't hand-format; run `bun run fix:fmt`.
- `.editorconfig` says space-indent — it is stale; `oxfmt.config.ts` (tabs) is the source of truth and source files use tabs.

## Coding standards

- Angular/TypeScript rules live in `docs/agents/angular.md`, auto-loaded via `opencode.json` `instructions`. Highlights for this v22 repo: never write `standalone: true` or explicit `OnPush` (both defaults), signals + `input()`/`output()`/`model()`, native control flow (`@if`/`@for`), `@Service` decorator, Signal Forms for new forms.

## Stack notes

- Tailwind CSS 4 is CSS-first: no `tailwind.config.js`; config lives in `src/styles.css` (currently just `@import 'tailwindcss'`).
- Angular 22 style: standalone components, signals, no `.component` suffix (`app.ts`/`app.html`/`app.css`, class `App`). Prefer `ng generate` over hand-naming files.
- Prod build budgets fail the build: 1 MB initial, 8 kB per component style (4 kB warns).
- Tests use Vitest globals — `describe`/`it`/`expect` without imports (`tsconfig.spec.json`).
