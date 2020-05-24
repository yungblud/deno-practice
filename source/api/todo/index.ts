import { Router, Context } from "https://deno.land/x/oak/mod.ts"
import { create, read, readById, updateIsDoneById } from "./todo.ctrl.ts"
// import { Todo } from "../../models/todo.ts"

const router = new Router()

router.get("/api/todo", read)

router.get("/api/todo/:id", readById)

router.post("/api/todo", create)

router.patch("/api/todo/:id", updateIsDoneById)

router.delete("/api/todo/:id", (ctx) => {
    const { id } = ctx.params
    ctx.response.body = {
        id
    }
})

export default router