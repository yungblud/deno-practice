import { Context, RouterContext } from "https://deno.land/x/oak/mod.ts"
import { readJsonSync, writeJsonSync } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { Todo } from "../../models/todo.ts"

const bodyParser = {
    contentTypes: {
        text: ["application/json"]
    }
}

export const list = async (ctx: Context) => {
    try {
        const { todos } = readJsonSync(path.resolve("./data.json")) as { todos: Todo[] }
        ctx.response.status = 200
        ctx.response.body = {
            todos
        }
    } catch (e) {
        console.error(e)
        ctx.response.status = 500
        ctx.response.body = {
            status: 500,
            message: e.toString()
        }
    }
}

export const read = async (ctx: RouterContext) => {
    try {
        const { todos } = readJsonSync(path.resolve("./data.json")) as { todos: Todo[] }
        const { id } = ctx.params
        if (!id) {
            ctx.response.status = 400
            ctx.response.body = {
                status: 400,
                message: "id value was not provided as url path params"
            }
            return
        }
        const filtered = todos.filter((todo: Todo) => +todo.id === +id)
        ctx.response.status = 200
        ctx.response.body = {
            todo: filtered.length === 0 ? null : filtered[0]
        }
    } catch (e) {
        console.error(e)
        ctx.response.status = 500
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
        ctx.response.status = 200
        ctx.response.body = {
            ...newTodo
        }
    } catch (e) {
        console.error(e)
        ctx.response.status = 500
        ctx.response.body = {
            status: 500,
            message: e.toString()
        }
    }
}

export const toggleIsDone = async (ctx: RouterContext) => {
    try {
        const { id } = ctx.params
        if (!id) {
            ctx.response.status = 400
            ctx.response.body = {
                status: 400,
                message: "id value was not provided as url path params"
            }
            return
        }
        const { todos } = readJsonSync(path.resolve("./data.json")) as { todos: Todo[] }
        const todo = todos.filter((todo: Todo) => todo.id === +id)
        if (todo.length === 0) {
            ctx.response.status = 404
            ctx.response.body = {
                status: 404,
                message: "no todo by provided id was found"
            }
            return
        }
        const updatedTodo: Todo = {
            ...todo[0],
            isDone: !todo[0].isDone
        }
        const newTodos = [
            ...todos.filter((todo: Todo) => todo.id !== +id),
            updatedTodo
        ].sort((prevTodo, nextTodo) => {
            if (+prevTodo.id < +nextTodo.id) {
                return -1
            }
            if (+prevTodo.id > +nextTodo.id) {
                return 1
            }
            return 0
        })
        await writeJsonSync(path.resolve("./data.json"), {
            todos: newTodos
        })
        ctx.response.status = 200
        ctx.response.body = {
            ...updatedTodo
        }
    } catch (e) {
        console.error(e)
        ctx.response.status = 500
        ctx.response.body = {
            status: 500,
            message: e.toString()
        }
    }
}

export const deleteTodoById = async (ctx: RouterContext) => {
    try {
        const { id } = ctx.params
        if (!id) {
            ctx.response.status = 400
            ctx.response.body = {
                status: 400,
                message: "path param id was not found"
            }
            return
        }
        const { todos } = readJsonSync(path.resolve("./data.json")) as { todos: Todo[] }
        const filteredTodos = todos.filter((todo: Todo) => +todo.id !== +id)
        await writeJsonSync(path.resolve("./data.json"), {
            todos: [
                ...filteredTodos
            ]
        })
        ctx.response.status = 200
        ctx.response.body = {
            todos: [...filteredTodos]
        }
    } catch (e) {
        console.error(e)
        ctx.response.status = 500
        ctx.response.body = {
            status: 500,
            message: e.toString()
        }
    }
}