import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "#/layouts/AppLayout";
import { LocalizedLink } from "#/libs/i18n";
import { seo } from "#/libs/seo";
import { siteName } from "#/libs/site";

const description = msg({
	id: "A TanStack Start app with server functions, server rendering, and translations ready to grow.",
});

export const Route = createFileRoute("/{-$locale}/")({
	head: ({ match }) => ({
		meta: seo({
			title: siteName,
			description: match.context.i18n._(description),
			path: match.pathname,
		}),
	}),
	component: Home,
});

function Home() {
	const { i18n } = useLingui();

	return (
		<AppLayout>
			<section className="py-12">
				<h1 className="text-5xl font-bold tracking-tight">
					{i18n._("Build your app here")}
				</h1>
				<p className="mt-4 max-w-2xl text-lg text-slate-600">
					{i18n._(description)}
				</p>
				<LocalizedLink
					to="/todos"
					className="mt-8 inline-flex rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700"
				>
					{i18n._("Open the todo example")}
				</LocalizedLink>
			</section>

			<section className="grid gap-4 sm:grid-cols-3">
				<Feature
					title={i18n._("Server functions")}
					body={i18n._("Read and change data on the server, typed end to end.")}
				/>
				<Feature
					title={i18n._("Server rendering")}
					body={i18n._("Every page is rendered on the server, then hydrated.")}
				/>
				<Feature
					title={i18n._("Translations")}
					body={i18n._("English today, more languages when you ask for them.")}
				/>
			</section>
		</AppLayout>
	);
}

function Feature({ title, body }: { title: string; body: string }) {
	return (
		<div className="rounded-xl border border-slate-200 p-5">
			<h2 className="font-semibold">{title}</h2>
			<p className="mt-1 text-sm text-slate-600">{body}</p>
		</div>
	);
}
