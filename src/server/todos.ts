import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Todo = {
	id: string;
	title: string;
	done: boolean;
	createdAt: string;
};

// Kept in the server's memory: it resets whenever the server restarts.
// Swap this module's body for a database when the app needs to keep data.
const todos = new Map<string, Todo>();

export const TODO_TITLE_MAX_CHARS = 200;

const sorted = () =>
	[...todos.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

export const listTodos = createServerFn({ method: "GET" }).handler(() =>
	sorted(),
);

export const addTodo = createServerFn({ method: "POST" })
	.validator(
		z.object({ title: z.string().trim().min(1).max(TODO_TITLE_MAX_CHARS) }),
	)
	.handler(({ data }) => {
		const todo: Todo = {
			id: crypto.randomUUID(),
			title: data.title,
			done: false,
			createdAt: new Date().toISOString(),
		};
		todos.set(todo.id, todo);
		return todo;
	});

export const setTodoDone = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.string(), done: z.boolean() }))
	.handler(({ data }) => {
		const todo = todos.get(data.id);
		if (todo) {
			todos.set(todo.id, { ...todo, done: data.done });
		}
	});

export const deleteTodo = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.string() }))
	.handler(({ data }) => {
		todos.delete(data.id);
	});
