# Server functions

- Data is read and changed only through server functions in `src/server/<feature>.ts` (`createServerFn`), called from a route `loader` or an event handler, then `router.invalidate()`.
- Every input is checked with `.validator(zod)`; GET for reads, POST for changes.
- Secrets come from `process.env` inside server code only. Never in a component, never `VITE_`-prefixed.
- Module-level data is lost on restart: say so to the user when they rely on it, and offer a database.
