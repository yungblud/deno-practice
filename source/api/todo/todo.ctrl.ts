import { Context, RouterContext } from "https://deno.land/x/oak/mod.ts"
import { readJsonSync, writeJsonSync } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { Todo } from "../../models/todo.ts"

const bodyParser = {
    contentTypes: {
        text: ["application/json"]
    }
}

export const read = async (ctx: Context) => {
    try {
        const { todos } = readJsonSync(path.resolve("./data.json")) as { todos: Todo[] }
        ctx.response.body = {
            todos
        }
    } catch (e) {
        console.error(e)
        ctx.response.body = {
            status: 500,
            message: e.toString()
        }
    }
}

export const readById = async (ctx: RouterContext) => {
    try {
        const { todos } = readJsonSync(path.resolve("./data.json")) as { todos: Todo[] }
        const { id } = ctx.params
        if (!id) {
            ctx.response.body = {
                status: 400,
                message: "id value was not provided as url path params"
            }
            return
        }
        const filtered = todos.filter((todo: Todo) => +todo.id === +id)
        ctx.response.body = {
            todo: filtered.length === 0 ? null : filtered[0]
        }
    } catch (e) {
        console.error(e)
        ctx.response.body = {
            status: 500,
            message: e.toString()
        }
    }
}

export const create = async (ctx: Context) => {
    const body = await ctx.request.body(bodyParser)
    const { todo } = body.value
    try {
        const { todos } = readJsonSync(path.resolve("./data.json")) as { todos: Todo[] }
        const nextId = todos[todos.length - 1].id + 1
        const newTodo: Todo = {
            id: nextId,
            todo,
            isDone: false
        }
        await writeJsonSync(path.resolve("./data.json"), {
            todos: [
                ...todos,
                newTodo
            ]
        })
        ctx.response.body = {
            ...newTodo
        }
    } catch (e) {
        console.error(e)
        ctx.response.body = {
            status: 500,
            message: e.toString()
        }
    }
}

export const updateIsDoneById = async (ctx: RouterContext) => {
    try {
        const { id } = ctx.params
        console.log(id)
        if (!id) {
            ctx.response.body = {
                status: 400,
                message: "id value was not provided as url path params"
            }
            return
        }
        const body = await ctx.request.body(bodyParser)
        const { isDone } = body.value
        const { todos } = readJsonSync(path.resolve("./data.json")) as { todos: Todo[] }
        const todo = todos.filter((todo: Todo) => todo.id === +id)
        if (todo.length === 0) {
            ctx.response.body = {
                status: 404,
                message: "no todo by provided id was found"
            }
            return
        }
        const updatedTodo: Todo = {
            ...todo[0],
            isDone
        }
        const newTodos = [
            ...todos.filter((todo: Todo) => todo.id !== +id),
            updatedTodo
        ].sort((prevTodo, nextTodo) => {
            return +(+prevTodo.id > +nextTodo.id)
        })
        await writeJsonSync(path.resolve("./data.json"), {
            todos: newTodos
        })
    } catch (e) {
        console.error(e)
        ctx.response.body = {
            status: 500,
            message: e.toString()
        }
    }
}