// The app's name and public address. Set VITE_SITE_URL on the host's build
// (or in .env) once the app has its domain: Open Graph needs full URLs, so
// og:url and a root-absolute og:image are left out until it is set.
export const siteName = "React Start app";

export const siteUrl = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, "");

/** A full URL for a root-absolute path ("/og.png"), or undefined while siteUrl is unset. */
export const absoluteUrl = (path: string) => {
	if (/^https?:\/\//.test(path)) return path;
	return siteUrl ? `${siteUrl}${path}` : undefined;
};
