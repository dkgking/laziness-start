# Style

- TypeScript, React 19 with the React Compiler: no `useMemo`/`useCallback`/`memo` in new code, no ref writes or impure reads (`Date.now()`, `Math.random()`) during render.
- Tailwind CSS v4 utility classes; shared styles in `src/styles.css` only when a class list repeats.
- Biome: tabs, double quotes, sorted imports (`bunx biome check --write`). Import app code through `#/` (`#/server/todos`).
- Match the surrounding code; comment only the non-obvious why.
