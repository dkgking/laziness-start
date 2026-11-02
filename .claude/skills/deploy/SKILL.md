---
name: deploy
description: >
  Publish this TanStack Start app (server-rendered, with server functions) to
  a Node server, Vercel, Netlify or Cloudflare Workers: choosing a target, the
  exact config change per platform, environment variables and post-deploy
  checks. Use when asked to deploy, host, publish, go live or move the app to
  another platform.
---

# Deploy

The app renders on the server and has server functions, so it needs a platform that runs server code. It builds with **Nitro** (`nitro/vite` in `vite.config.ts`), which makes a Node server in `.output/` (`bun run build`, then `bun run start`).

| Target | How | Code change |
|---|---|---|
| **Node server** (any VPS, Docker) | Nitro as configured | none: `bun run build && PORT=3000 bun run start` |
| **Vercel** | Nitro, detected by Vercel | none |
| **Netlify** | `@netlify/vite-plugin-tanstack-start` | swap the Vite plugin |
| **Cloudflare Workers** | `@cloudflare/vite-plugin` + wrangler | swap the Vite plugin, add `wrangler.jsonc` |

Source: https://tanstack.com/start/latest/docs/framework/react/guide/hosting

From Web Studio, this app publishes to a zip, GitHub, or Vercel. Studio's Netlify target takes static sites only, so it refuses this app; deploy to Netlify from its GitHub repository instead.

## Node server

Nothing to change. Build, then run `node .output/server/index.mjs` with `PORT` (default 3000). Put it behind a proxy that terminates TLS.

## Vercel

Nothing to change: import the repository in Vercel (or `vercel deploy`). Vercel detects TanStack Start and Nitro and builds `bun run build`.

## Netlify

1. `bun add -d @netlify/vite-plugin-tanstack-start@<exact version>` and `bun remove nitro`.
2. In `vite.config.ts`, replace `nitro()` with `netlify()` (`import netlify from "@netlify/vite-plugin-tanstack-start"`).
3. Remove the `start` script. Deploy with `npx netlify deploy`, or connect the repository: Netlify reads the plugin's settings.

## Cloudflare Workers

1. `bun add -d @cloudflare/vite-plugin@<exact version> wrangler@<exact version>` and `bun remove nitro`.
2. In `vite.config.ts`, replace `nitro()` with `cloudflare({ viteEnvironment: { name: "ssr" } })`, placed before `tanstackStart()`.
3. Add `wrangler.jsonc`:
   ```jsonc
   {
     "name": "my-app",
     "compatibility_date": "<today>",
     "compatibility_flags": ["nodejs_compat"],
     "main": "@tanstack/react-start/server-entry"
   }
   ```
   Since `src/server.tsx` holds the app's own server entry (the `/en/...` redirect), point `main` at `./src/server.tsx` instead.
4. Scripts: `"deploy": "bun run build && wrangler deploy"`; remove `start`. Secrets: `wrangler secret put <NAME>`. No Node-only APIs (fs, child_process) in server code there.

## Always

1. `bun run verify` before deploying.
2. Secrets live in the platform's environment settings, never in the repository.
3. In-memory data (as in the todo example) is lost on every restart and is not shared between instances: use a database before going live.
4. After deploying, check `/` and each page (a form saves and the change shows), a missing path → 404, and `/en/<page>` → 301 `/<page>`.
5. When moving off Nitro, update the Runtime lines of `AGENTS.md` and `README.md` so later work does not follow stale instructions.
