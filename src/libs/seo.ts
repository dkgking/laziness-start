import { absoluteUrl, siteName } from "./site";

export interface SeoInput {
	readonly title: string;
	readonly description?: string;
	/** Root-absolute ("/uploads/cover.png") or a full URL. */
	readonly image?: string;
	/** The page's own path (`match.pathname`), for og:url. */
	readonly path?: string;
	readonly type?: "website" | "article";
	/** ISO date, for articles. */
	readonly publishedTime?: string;
}

/**
 * A page's `head().meta`: title, description, Open Graph, and Twitter card.
 * Tags without a value are left out; X reads og:* when twitter:* is missing.
 */
export const seo = ({
	title,
	description,
	image,
	path,
	type = "website",
	publishedTime,
}: SeoInput) => {
	const imageUrl = image ? absoluteUrl(image) : undefined;
	const url = path ? absoluteUrl(path) : undefined;
	return [
		{ title },
		{ property: "og:site_name", content: siteName },
		{ property: "og:type", content: type },
		{ property: "og:title", content: title },
		{
			name: "twitter:card",
			content: imageUrl ? "summary_large_image" : "summary",
		},
		...(description
			? [
					{ name: "description", content: description },
					{ property: "og:description", content: description },
				]
			: []),
		...(url ? [{ property: "og:url", content: url }] : []),
		...(imageUrl ? [{ property: "og:image", content: imageUrl }] : []),
		...(publishedTime
			? [{ property: "article:published_time", content: publishedTime }]
			: []),
	];
};
