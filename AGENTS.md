# AGENTS.md

Guide for coding agents working in this repository. Read it, and `.claude/rules/`, before changing code.

## What this is

A server-rendered web app:

- **TanStack Start** (React 19, SSR, file-based routing, server functions) with the **React Compiler**
- **Nitro** builds the server (`.output/`), run with Node
- **Lingui** for every visible string, through `@sourceking/tanstack-lingui` (language in the URL); **English only** until the user asks for more
- **Tailwind CSS v4**, **zod**, **Biome**, **bun**

`src/routes/{-$locale}/todos.tsx` with `src/server/todos.ts` is the example to copy: a loader, a form, and server functions with zod-checked input.

## The example is not the app

The todo page, its nav link, the home page button and the demo home page text only show the patterns. **In the first round that builds the user's app, remove them** with `.claude/skills/remove-example/SKILL.md` (unless the user asked for a todo list), and make `/` the user's own page. Never hand back an app that still has template pages, links or text.

## Working in Web Studio

- The project is in `/workspace`. Change it in place; never start a second project beside it or start the app over.
- Never commit, push, or touch `.git`: Studio commits each round itself.
- `.laziness/preview.json` says how Studio shows the app: when you end it runs `bun run build` and opens the production server (`start`, what the user gets), and while you work it runs the `live` dev server on `$PORT`, which follows your edits as you save them and is paused while you install, build, or check. Keep `bun run dev` and `bun run build` working.
- Studio starts and stops these servers itself. Never start another dev server (`bun dev`, `vite dev`) or the production server (`bun run start`, `node .output/server/index.mjs`, on any port), and never wait for one: each holds hundreds of MB beside it.
- Never open a browser (Playwright, Chromium) to look at the app: Studio opens it when you end, takes its screenshots, and tells you what failed on the page.
- `/workspace/.cache` holds the package managers' caches: never format, lint, search, or delete it.
- The sandbox's memory is small and shared by everything running in it: you, the preview, and the build. Run one heavy command at a time (install, typecheck, build, verify), never in the background or side by side.
- English only, unless the user asks for other languages or a multilingual app: then follow `.claude/skills/add-locale/SKILL.md`.

## Commands

| Task | Command |
|---|---|
| Dev server (port 3000; not in Web Studio) | `bun dev` |
| Type check | `bun run typecheck` |
| Lint + format check | `bun run check` (`bun run check:fix` to fix) |
| Extract UI strings into catalogs | `bun run i18n:extract` |
| Fail if any translation is missing | `bun run i18n:check` |
| Production build | `bun run build` |
| Run the production build (not in Web Studio) | `PORT=3000 bun run start` |

| Every check above, then the build | `bun run verify` |

**Before you say a change is done**, run `bun run verify` once, at the end (not after every file), and fix what it reports.

## Layout

```
src/
  routes/
    __root.tsx            # html shell, head
    {-$locale}/           # every page lives here (optional locale prefix)
      route.tsx           # validates the locale, puts it in context
      index.tsx           # home
      todos.tsx           # example: loader + form + server functions
  server/                 # server functions (createServerFn), one file per feature
  layouts/AppLayout.tsx   # header, nav, language switcher (shown with 2+ locales)
  components/             # NotFound and ErrorPage (the router's defaults), shared UI
  libs/
    locales.ts            # locale list (framework-free)
    i18n.ts               # Lingui + router integration (LocalizedLink, useLocale, …)
    intl.ts               # number and date formatting
    seo.ts, site.ts       # seo() for each page's head; site name and address (VITE_SITE_URL)
  locales/<locale>.json   # Lingui catalogs (en.json is the source)
  server.tsx              # server entry: /en/... → / redirects
  start.ts                # request middleware (CSRF for server functions, locale cookie)
public/                   # static files (favicon.svg)
.laziness/                # Web Studio: preview command and template card
```

## Rules

The must-follow rules are in `.claude/rules/`: `routing.md`, `server-functions.md`, `i18n.md`, `style.md`. In short:

- Pages under `src/routes/{-$locale}/`, linked with `LocalizedLink`.
- Data only through server functions in `src/server/`, input checked with zod; secrets only in server code.
- Every visible string through `i18n._()`; dates and numbers through `#/libs/intl`.
- `src/routeTree.gen.ts` is generated: never edit it.

## Task guides

Step-by-step guides in `.claude/skills/` (also at `.agents/skills/`, the same folder); read the one that matches the task before starting it:

| Task | Guide |
|---|---|
| Remove the todo example and demo text (first round) | `.claude/skills/remove-example/SKILL.md` |
| Add a page / route | `.claude/skills/add-page/SKILL.md` |
| Read or change data on the server | `.claude/skills/add-server-function/SKILL.md` |
| Add or remove a language | `.claude/skills/add-locale/SKILL.md` |
| UI text and translations (house rules) | `.claude/skills/i18n-lingui/SKILL.md` |
| Client-side global state (Zustand) | `.claude/skills/zustand-store/SKILL.md` |
| Deploy (Node, Vercel, Netlify, Cloudflare) | `.claude/skills/deploy/SKILL.md` |
