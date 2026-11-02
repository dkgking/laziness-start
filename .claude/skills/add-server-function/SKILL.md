---
name: add-server-function
description: Add a server function (createServerFn) that reads or changes data on the server, with zod-checked input, called from a route loader or an event handler. Use when a page needs data, a form must save something, or code must run only on the server (secrets, a database, another API).
---

# Add a server function

Server functions run only on the server; the client calls them through an RPC the framework makes. `src/server/todos.ts` is the reference while the example is still in the repo; the snippets below are complete without it.

## 1. Write it in `src/server/<feature>.ts`

```ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Read: GET, called from a loader.
export const listNotes = createServerFn({ method: "GET" }).handler(() =>
	notes.list(),
);

// Change: POST, its input checked with zod before the handler runs.
export const addNote = createServerFn({ method: "POST" })
	.validator(z.object({ text: z.string().trim().min(1).max(500) }))
	.handler(({ data }) => notes.add(data.text));
```

- Every input goes through `.validator(zod)`. Never trust what the browser sends: lengths, ids, enums are all checked there.
- Return only what the page renders (plain JSON values: no class instances, no functions, no secrets).
- Throw `notFound()` from `@tanstack/react-router` for a missing item.
- Secrets come from `process.env` and are read only inside server functions or `src/server/` modules. Never import them into a component, and never prefix them with `VITE_` (that ships them to the browser).
- Data kept in a module-level variable (as the todo example does) is lost when the server restarts and is not shared between server instances. For data that must stay, use a database or an API, read in this module.

## 2. Call it

From a loader (the data is ready when the page renders, on the server and on navigation):

```tsx
export const Route = createFileRoute("/{-$locale}/notes")({
	loader: () => listNotes(),
	component: NotesPage,
});
```

From an event handler, then read the loader again:

```tsx
const router = useRouter();
await addNote({ data: { text } });
await router.invalidate();
```

For a checkbox or toggle that must change at once, show the new state with `useOptimistic` inside `startTransition`, as `TodoRow` in `src/routes/{-$locale}/todos.tsx` does.

## 3. Verify

`bun run verify`, then try the page: the change shows, and survives a reload while the server runs.
