---
name: remove-example
description: Remove the template's todo example (the /todos page, its server functions, nav link and home page button) and the demo home page text, so the user's app keeps only its own pages. Use on the first round that builds the user's app, unless they asked for a todo list, or whenever a page, link or text from the template is still in the app.
---

# Remove the example

The template ships a todo example and a demo home page to show the patterns. They are not part of the user's app: remove them as soon as you start building it, in the same round.

## 1. Delete the todo files

```bash
rm "src/routes/{-\$locale}/todos.tsx" src/server/todos.ts
```

Keep `src/server/` for the app's own server functions.

## 2. Remove the links to it

- `src/layouts/AppLayout.tsx`: drop `{ to: "/todos", label: msg({ id: "Todos" }) }` from `navItems`. Add the app's own pages there instead.
- `src/routes/{-$locale}/index.tsx`: drop the "Open the todo example" `LocalizedLink` (and the `LocalizedLink` import if nothing else uses it).

## 3. Replace the demo text

- The home page (`index.tsx`): "Build your app here", the description and the three `Feature` cards describe the template, not the app. Replace them with the user's content, or turn `/` into the app's main screen.
- `siteName` in `src/libs/site.ts`: the app's name.
- `.laziness/template.json` and the README describe the template; leave them, they are not shown in the app.

## 4. Check nothing points at the example

```bash
grep -rni "todo" src --exclude=routeTree.gen.ts --exclude-dir=locales
```

It must print nothing (unless the user's app is about todos). Then `bun run check:fix` and `bun run verify`: `i18n:extract --clean` drops the example's strings from the catalogs, and the route tree is regenerated on its own.

The other guides (`add-page`, `add-server-function`, `i18n-lingui`) still show todo code as examples; their snippets are complete, so follow them without the deleted files.
