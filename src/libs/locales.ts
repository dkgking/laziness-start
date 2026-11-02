// Framework-free locale constants. Codes must be two lowercase letters: the
// URL prefix matcher only accepts /[a-z]{2}/. Keep in sync with
// lingui.config.ts (see .claude/skills/add-locale).
export const locales = [
	{ code: "en", name: "English", nativeName: "English" },
] as const;

export type Locale = (typeof locales)[number]["code"];

export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale =>
	locales.some((locale) => locale.code === value);
