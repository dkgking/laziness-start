# laziness-start

A TanStack Start app for [Laziness](https://laziness.ai) Web Studio: server rendering, typed server functions, a todo example, Tailwind CSS, and Lingui translations (English to start, more languages on request).

## Use it

```bash
bun install
bun dev                 # http://localhost:3000
bun run build           # Nitro server in .output/
PORT=3000 bun run start
```

Checks: `bun run typecheck`, `bun run check`, `bun run i18n:check`.

## In Web Studio

Studio clones this repository into a project and previews it with `.laziness/preview.json`; `.laziness/template.json` is its card. Coding agents read `AGENTS.md` (through `CLAUDE.md`), `.claude/rules/`, and the task guides in `.claude/skills/`.

## Deploy

A Node server, Vercel, Netlify, or Cloudflare Workers: see `.claude/skills/deploy/SKILL.md`.

## License

MIT
