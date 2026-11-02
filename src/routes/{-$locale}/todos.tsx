import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { type FormEvent, useOptimistic, useState, useTransition } from "react";
import { AppLayout } from "#/layouts/AppLayout";
import { seo } from "#/libs/seo";
import {
	addTodo,
	deleteTodo,
	listTodos,
	setTodoDone,
	TODO_TITLE_MAX_CHARS,
	type Todo,
} from "#/server/todos";

const pageTitle = msg({ id: "Todos" });

export const Route = createFileRoute("/{-$locale}/todos")({
	loader: () => listTodos(),
	head: ({ match }) => ({
		meta: seo({
			title: match.context.i18n._(pageTitle),
			path: match.pathname,
		}),
	}),
	component: TodosPage,
});

/** Runs a change on the server, then has the loader read the list again. */
function useServerChange() {
	const router = useRouter();
	return async (change: () => Promise<unknown>) => {
		await change();
		await router.invalidate();
	};
}

function TodosPage() {
	const todos = Route.useLoaderData();
	const { i18n } = useLingui();
	const runChange = useServerChange();
	const [title, setTitle] = useState("");
	const [adding, startAdding] = useTransition();

	const submit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const text = title.trim();
		if (!text) return;
		startAdding(async () => {
			await runChange(() => addTodo({ data: { title: text } }));
			setTitle("");
		});
	};

	const left = todos.filter((todo) => !todo.done).length;

	return (
		<AppLayout>
			<h1 className="text-3xl font-bold">{i18n._(pageTitle)}</h1>
			<p className="mt-1 text-slate-600">
				{i18n._(
					"{left} of {count, plural, one {# todo} other {# todos}} left",
					{ left, count: todos.length },
				)}
			</p>

			<form onSubmit={submit} className="mt-6 flex gap-2">
				<label className="sr-only" htmlFor="todo-title">
					{i18n._("New todo")}
				</label>
				<input
					id="todo-title"
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					placeholder={i18n._("What needs doing?")}
					maxLength={TODO_TITLE_MAX_CHARS}
					className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
				/>
				<button
					type="submit"
					disabled={adding || !title.trim()}
					className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-50"
				>
					{i18n._("Add")}
				</button>
			</form>

			{todos.length === 0 ? (
				<p className="mt-8 text-slate-500">{i18n._("Nothing to do yet.")}</p>
			) : (
				<ul className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200">
					{todos.map((todo) => (
						<TodoRow key={todo.id} todo={todo} />
					))}
				</ul>
			)}
		</AppLayout>
	);
}

function TodoRow({ todo }: { todo: Todo }) {
	const { i18n } = useLingui();
	const runChange = useServerChange();
	// Each row waits on its own change, so the other rows stay usable.
	const [pending, startChange] = useTransition();
	// Shows the new state at once, until the server's list comes back.
	const [done, setShownDone] = useOptimistic(todo.done);
	return (
		<li className="flex items-center gap-3 px-4 py-3">
			<input
				type="checkbox"
				checked={done}
				disabled={pending}
				aria-label={i18n._("Done: {title}", { title: todo.title })}
				onChange={(event) => {
					const next = event.target.checked;
					startChange(async () => {
						setShownDone(next);
						await runChange(() =>
							setTodoDone({ data: { id: todo.id, done: next } }),
						);
					});
				}}
				className="size-4"
			/>
			<span className={done ? "flex-1 text-slate-400 line-through" : "flex-1"}>
				{todo.title}
			</span>
			<button
				type="button"
				disabled={pending}
				onClick={() =>
					startChange(() =>
						runChange(() => deleteTodo({ data: { id: todo.id } })),
					)
				}
				className="text-sm text-red-600 hover:underline disabled:opacity-50"
			>
				{i18n._("Delete")}
			</button>
		</li>
	);
}
