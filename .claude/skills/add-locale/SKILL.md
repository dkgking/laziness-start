---
name: add-locale
description: Add, remove or change a language of this app (e.g. add Vietnamese "vi", drop one, change the default) across the locale list, the Lingui config and the translation catalogs. Use when the user asks for the app in another language, or for a multilingual app.
---

# Add or remove a locale

The app ships in English only. Add a language only when the user asks for it.

Locale codes must be **exactly two lowercase letters** (`vi`, `fr`, `ja`). The URL prefix matcher in `@sourceking/tanstack-lingui` only accepts `/[a-z]{2}/`, so `zh-TW` or `pt-BR` will not route. If two variants of one language are needed, that needs a library change first: stop and say so.

The default locale (`en`) has no URL prefix and its catalog is the Lingui source. Every other locale is served under its prefix (`/vi`, `/vi/todos`).

## Add a locale (example: `vi`)

1. **`src/libs/locales.ts`**: add an entry. `nativeName` is shown in the language switcher.
   ```ts
   { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
   ```
2. **`lingui.config.ts`**: add `"vi"` to `locales`.
3. **Catalog**: run `bun run i18n:extract`. It creates `src/locales/vi.json` with empty values. Translate every entry (see the `i18n-lingui` skill).
4. The language switcher in `src/layouts/AppLayout.tsx` appears by itself once there are two locales. Nothing else to change.

## Remove a locale (example: `vi`)

1. Remove it from `src/libs/locales.ts` and `lingui.config.ts`.
2. Delete `src/locales/vi.json`.
3. `grep -rn '"vi"\|/vi/' src` to catch leftovers.

## Verify

```bash
bun run i18n:check        # every catalog complete
bun run verify
```

Then open `/vi` and `/vi/todos`: the text is translated, `<html lang>` is `vi`, and the language switcher moves between `/todos` and `/vi/todos`. `/en/todos` redirects to `/todos`.

Note: `Intl` formats dates per locale (`formatDate` in `src/libs/intl.ts`). For example, `th` uses the Buddhist calendar year by default. To force Gregorian, pass a locale such as `th-TH-u-ca-gregory`.
