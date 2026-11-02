---
name: add-page
description: Add a new page/route to this TanStack Start app (under src/routes/{-$locale}/), with an optional loader, translated UI strings and a nav link. Use when asked to create a page, screen, route or section such as /about or /dashboard.
---

# Add a page

Every page lives under `src/routes/{-$locale}/`, so it works at `/about` and, once the app has other languages, at `/vi/about`.

## 1. Create the route file

File path → URL: `src/routes/{-$locale}/about.tsx` → `/about`, `src/routes/{-$locale}/projects/$id.tsx` → `/projects/:id`, `src/routes/{-$locale}/projects/index.tsx` → `/projects`.

```tsx
import { useLingui } from "@lingui/react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "#/layouts/AppLayout";

export const Route = createFileRoute("/{-$locale}/about")({
	component: AboutPage,
});

function AboutPage() {
	const { i18n } = useLingui();
	return (
		<AppLayout>
			<h1 className="text-4xl font-bold">{i18n._("About us")}</h1>
		</AppLayout>
	);
}
```

The string passed to `createFileRoute` must match the file path. The Vite plugin regenerates `src/routeTree.gen.ts` when `bun dev` or `bun run build` runs; never edit that file.

## 2. Data (optional)

Load data in a `loader` through a server function (the `add-server-function` skill). `src/routes/{-$locale}/todos.tsx` is the reference:

```tsx
import { listTodos } from "#/server/todos";

export const Route = createFileRoute("/{-$locale}/todos")({
	loader: () => listTodos(),
	component: TodosPage,
});

function TodosPage() {
	const todos = Route.useLoaderData();
	// ...
}
```

- When the data depends on the language, pass `context.locale` to the server function: `loader: ({ context }) => listThings({ data: { locale: context.locale } })`.
- Throw `notFound()` (from `@tanstack/react-router`) in the server function when an item does not exist; the root `notFoundComponent` then renders with HTTP 404.
- After a change made through a server function, call `router.invalidate()` (`useRouter()`) so the loader reads the data again.

## 3. Head / SEO (optional)

```tsx
head: ({ match }) => ({
	meta: seo({
		title: match.context.i18n._("About us"),
		description: match.context.i18n._("Who we are and what we do."),
		path: match.pathname,
	}),
}),
```

`seo()` from `#/libs/seo` makes the title, description, Open Graph, and Twitter card tags, and leaves out any without a value. A page with its own picture passes `image` (a root-absolute path or a full URL); an article passes `type: "article"` and `publishedTime`. Set the site's name in `src/libs/site.ts`. Never write the `og:*` or `twitter:*` tags by hand.

## 4. Nav link (optional)

Add an entry to `navItems` in `src/layouts/AppLayout.tsx`. Labels are module-level `msg` descriptors, and `LocalizedLink` adds the locale prefix:

```tsx
const navItems = [
	{ to: "/", label: msg({ id: "Home" }) },
	{ to: "/todos", label: msg({ id: "Todos" }) },
	{ to: "/about", label: msg({ id: "About" }) },
] satisfies { to: string; label: MessageDescriptor }[];
```

`to` is typed as plain `string`, so check that the route exists.

## 5. Translate and verify

1. Follow the `i18n-lingui` skill: every visible string goes through `i18n._("...")`. Run `bun run i18n:extract`; when the app has other locales, fill the new keys in each of their catalogs.
2. `bun run verify`
